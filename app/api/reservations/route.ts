import { NextResponse } from "next/server";
import {
  createReservation,
  listRecentReservations,
  reservationErrorResponse,
  serializeReservation
} from "@/lib/reservations";
import { createReservationSchema } from "@/lib/validation";
import { jsonError } from "@/lib/http";

export async function GET() {
  try {
    const { reservations, activeReservations } = await listRecentReservations();

    return NextResponse.json({
      reservations: reservations.map(serializeReservation),
      activeReservations
    });
  } catch {
    return jsonError("Unable to list reservations.", 500);
  }
}

export async function POST(request: Request) {
  const parsed = createReservationSchema.safeParse(await request.json());

  if (!parsed.success) {
    return jsonError("Invalid reservation request.", 400, { issues: parsed.error.flatten() });
  }

  try {
    const reservation = await createReservation(parsed.data);
    return NextResponse.json({ reservation: serializeReservation(reservation) }, { status: 201 });
  } catch (error) {
    const response = reservationErrorResponse(error);
    return jsonError(response.error, response.status);
  }
}
