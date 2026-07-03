// GET /api/products
// Optional query params: ?category=Everyday&search=bass
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { toProductDTO } from "@/lib/dto";

export async function GET(req: NextRequest) {
  const url = req.nextUrl;
  const category = url.searchParams.get("category");
  const search = url.searchParams.get("search")?.trim();

  const where: Record<string, unknown> = {};
  if (category && category !== "All") where.category = category;
  if (search) where.name = { contains: search };

  const products = await db.product.findMany({
    where,
    orderBy: { price: "asc" },
  });

  return NextResponse.json({ products: products.map(toProductDTO) });
}
