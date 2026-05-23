import { NextResponse } from "next/server";
import { prisma, prismaTransactionOptions } from "@/lib/prisma";
import { releaseExpiredReservations } from "@/lib/expiry";
import { jsonError } from "@/lib/http";

export async function POST(request: Request) {
  const secret = request.headers.get("authorization")?.replace("Bearer ", "");

  if (process.env.CRON_SECRET && secret !== process.env.CRON_SECRET) {
    return jsonError("Unauthorized.", 401);
  }

  const releasedCount = await prisma.$transaction(
    async (tx) => releaseExpiredReservations(tx),
    prismaTransactionOptions
  );

  return NextResponse.json({ releasedCount });
}
