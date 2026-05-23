import { NextResponse } from "next/server";

export function jsonError(error: string, status: number, extra?: Record<string, unknown>) {
  return NextResponse.json({ error, ...extra }, { status });
}
