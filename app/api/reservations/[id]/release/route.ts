import { NextResponse } from "next/server";
import {
  releaseReservation,
  reservationErrorResponse,
  serializeReservation
} from "@/lib/reservations";
import { jsonError } from "@/lib/http";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(_request: Request, context: RouteContext) {
  const { id } = await context.params;

  try {
    const reservation = await releaseReservation(id);
    return NextResponse.json({ reservation: serializeReservation(reservation) });
  } catch (error) {
    const response = reservationErrorResponse(error);
    return jsonError(response.error, response.status);
  }
}
