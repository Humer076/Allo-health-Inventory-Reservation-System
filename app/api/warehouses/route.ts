import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { jsonError } from "@/lib/http";

export async function GET() {
  try {
    const warehouses = await prisma.warehouse.findMany({
      orderBy: { code: "asc" }
    });

    return NextResponse.json({ warehouses });
  } catch {
    return jsonError("Unable to list warehouses.", 500);
  }
}
