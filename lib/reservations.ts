import { Prisma, ReservationStatus } from "@prisma/client";
import { prisma, prismaTransactionOptions } from "@/lib/prisma";
import { releaseExpiredReservations } from "@/lib/expiry";

const RESERVATION_TTL_MINUTES = 10;

export class ReservationError extends Error {
  constructor(
    message: string,
    public status: number
  ) {
    super(message);
  }
}

export async function createReservation(input: {
  productId: string;
  warehouseId: string;
  quantity: number;
}) {
  return prisma.$transaction(async (tx) => {
    await releaseExpiredReservations(tx);

    // Atomic stock claim: Postgres evaluates the availability predicate while updating
    // the inventory row, so concurrent requests cannot both reserve the same unit.
    const updated = await tx.$executeRaw`
      UPDATE "Inventory"
      SET "reservedStock" = "reservedStock" + ${input.quantity},
          "updatedAt" = NOW()
      WHERE "productId" = ${input.productId}
        AND "warehouseId" = ${input.warehouseId}
        AND "totalStock" - "reservedStock" >= ${input.quantity}
    `;

    if (updated !== 1) {
      throw new ReservationError("Not enough stock available.", 409);
    }

    return tx.reservation.create({
      data: {
        productId: input.productId,
        warehouseId: input.warehouseId,
        quantity: input.quantity,
        expiresAt: new Date(Date.now() + RESERVATION_TTL_MINUTES * 60 * 1000)
      },
      include: {
        product: true,
        warehouse: true
      }
    });
  }, prismaTransactionOptions);
}

export async function listRecentReservations() {
  await prisma.$transaction(async (tx) => {
    await releaseExpiredReservations(tx);
  }, prismaTransactionOptions);

  const [reservations, activeReservations] = await Promise.all([
    prisma.reservation.findMany({
      orderBy: { createdAt: "desc" },
      take: 6,
      include: {
        product: true,
        warehouse: true
      }
    }),
    prisma.reservation.count({
      where: {
        status: ReservationStatus.PENDING
      }
    })
  ]);

  return {
    reservations,
    activeReservations
  };
}

export async function getReservation(id: string) {
  await prisma.$transaction(async (tx) => {
    await releaseExpiredReservations(tx);
  }, prismaTransactionOptions);

  return prisma.reservation.findUnique({
    where: { id },
    include: {
      product: true,
      warehouse: true
    }
  });
}

export async function confirmReservation(id: string) {
  return prisma.$transaction(async (tx) => {
    const reservation = await tx.reservation.findUnique({
      where: { id },
      include: { product: true, warehouse: true }
    });

    if (!reservation) {
      throw new ReservationError("Reservation not found.", 404);
    }

    if (reservation.status === ReservationStatus.CONFIRMED) {
      return reservation;
    }

    if (reservation.status === ReservationStatus.RELEASED) {
      throw new ReservationError("Reservation has already been released.", 409);
    }

    if (reservation.expiresAt <= new Date()) {
      const released = await releaseSingleReservation(tx, reservation.id);
      throw new ReservationErrorWithReservation("Reservation has expired.", 410, released);
    }

    const confirmed = await tx.reservation.updateMany({
      where: {
        id,
        status: ReservationStatus.PENDING
      },
      data: {
        status: ReservationStatus.CONFIRMED,
        confirmedAt: new Date()
      }
    });

    if (confirmed.count !== 1) {
      const current = await tx.reservation.findUniqueOrThrow({
        where: { id },
        include: { product: true, warehouse: true }
      });

      if (current.status === ReservationStatus.CONFIRMED) {
        return current;
      }

      throw new ReservationError("Reservation is no longer pending.", 409);
    }

    return tx.reservation.findUniqueOrThrow({
      where: { id },
      include: { product: true, warehouse: true }
    });
  }, prismaTransactionOptions);
}

export async function releaseReservation(id: string) {
  return prisma.$transaction(async (tx) => {
    const reservation = await tx.reservation.findUnique({
      where: { id },
      include: { product: true, warehouse: true }
    });

    if (!reservation) {
      throw new ReservationError("Reservation not found.", 404);
    }

    if (reservation.status === ReservationStatus.RELEASED) {
      return reservation;
    }

    if (reservation.status === ReservationStatus.CONFIRMED) {
      throw new ReservationError("Confirmed reservations cannot be released.", 409);
    }

    return releaseSingleReservation(tx, reservation.id);
  }, prismaTransactionOptions);
}

class ReservationErrorWithReservation extends ReservationError {
  constructor(
    message: string,
    status: number,
    public reservation: Prisma.ReservationGetPayload<{ include: { product: true; warehouse: true } }>
  ) {
    super(message, status);
  }
}

async function releaseSingleReservation(tx: Prisma.TransactionClient, id: string) {
  const reservation = await tx.reservation.findUniqueOrThrow({
    where: { id },
    include: { product: true, warehouse: true }
  });

  const released = await tx.reservation.updateMany({
    where: {
      id,
      status: ReservationStatus.PENDING
    },
    data: {
      status: ReservationStatus.RELEASED,
      releasedAt: new Date()
    }
  });

  if (released.count !== 1) {
    return tx.reservation.findUniqueOrThrow({
      where: { id },
      include: { product: true, warehouse: true }
    });
  }

  await tx.inventory.update({
    where: {
      productId_warehouseId: {
        productId: reservation.productId,
        warehouseId: reservation.warehouseId
      }
    },
    data: {
      reservedStock: { decrement: reservation.quantity }
    }
  });

  return reservation;
}

export function serializeReservation(
  reservation: Prisma.ReservationGetPayload<{ include: { product: true; warehouse: true } }>
) {
  return {
    id: reservation.id,
    quantity: reservation.quantity,
    status: reservation.status,
    expiresAt: reservation.expiresAt.toISOString(),
    createdAt: reservation.createdAt.toISOString(),
    product: {
      id: reservation.product.id,
      sku: reservation.product.sku,
      name: reservation.product.name
    },
    warehouse: {
      id: reservation.warehouse.id,
      code: reservation.warehouse.code,
      name: reservation.warehouse.name
    }
  };
}

export function reservationErrorResponse(error: unknown) {
  if (error instanceof ReservationErrorWithReservation) {
    return {
      error: error.message,
      status: error.status,
      reservation: serializeReservation(error.reservation)
    };
  }

  if (error instanceof ReservationError) {
    return {
      error: error.message,
      status: error.status
    };
  }

  return {
    error: "Unexpected reservation error.",
    status: 500
  };
}
