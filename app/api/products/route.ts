import { NextResponse } from "next/server";
import { listProductsWithAvailability } from "@/lib/products";
import { jsonError } from "@/lib/http";

export async function GET() {
  try {
    const products = await listProductsWithAvailability();
    return NextResponse.json({ products });
  } catch {
    return jsonError("Unable to list products.", 500);
  }
}
