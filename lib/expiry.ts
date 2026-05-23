import { Prisma, ReservationStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";

type Tx = Prisma.TransactionClient;

export async function releaseExpiredReservations(db: Tx = prisma) {
  const expired = await db.reservation.findMany({
    where: {
      status: ReservationStatus.PENDING,
      expiresAt: { lte: new Date() }
    },
    select: {
      id: true,
      productId: true,
      warehouseId: true,
      quantity: true
    }
  });

  let releasedCount = 0;

  for (const reservation of expired) {
    const released = await db.reservation.updateMany({
      where: {
        id: reservation.id,
        status: ReservationStatus.PENDING
      },
      data: {
        status: ReservationStatus.RELEASED,
        releasedAt: new Date()
      }
    });

    if (released.count !== 1) {
      continue;
    }

    releasedCount += 1;

    await db.inventory.update({
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
  }

  return releasedCount;
}
