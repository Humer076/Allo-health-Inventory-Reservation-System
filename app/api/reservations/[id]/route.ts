import { NextResponse } from "next/server";
import { getReservation, serializeReservation } from "@/lib/reservations";
import { jsonError } from "@/lib/http";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  const reservation = await getReservation(id);

  if (!reservation) {
    return jsonError("Reservation not found.", 404);
  }

  return NextResponse.json({ reservation: serializeReservation(reservation) });
}
