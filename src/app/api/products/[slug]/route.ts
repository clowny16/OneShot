// GET /api/products/[slug]  -> single product + related (same category, excluding self)
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { toProductDTO } from "@/lib/dto";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const product = await db.product.findUnique({ where: { slug } });
  if (!product) {
    return NextResponse.json(
      { error: "Product not found" },
      { status: 404 },
    );
  }

  const related = await db.product.findMany({
    where: {
      category: product.category,
      slug: { not: product.slug },
    },
    take: 4,
    orderBy: { price: "asc" },
  });

  return NextResponse.json({
    product: toProductDTO(product),
    related: related.map(toProductDTO),
  });
}
