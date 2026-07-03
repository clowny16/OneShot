// GET /api/cart            -> current cart for session
// POST /api/cart           -> { action: "add"|"update"|"remove"|"clear", productId, colorHex, quantity? }
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getOrCreateSessionId } from "@/lib/session";
import type { CartDTO, CartLineDTO } from "@/lib/types";

async function buildCartDTO(sessionId: string): Promise<CartDTO> {
  const items = await db.cartItem.findMany({
    where: { sessionId },
    include: { product: true },
    orderBy: { createdAt: "asc" },
  });

  const lines: CartLineDTO[] = items.map((ci) => ({
    id: ci.id,
    productId: ci.productId,
    slug: ci.product.slug,
    name: ci.product.name,
    price: ci.product.price / 100,
    colorHex: ci.colorHex,
    colorName: ci.product.colorName,
    imageKey: ci.product.imageKey,
    quantity: ci.quantity,
    lineTotal: (ci.product.price * ci.quantity) / 100,
  }));

  const itemCount = lines.reduce((sum, l) => sum + l.quantity, 0);
  const subtotal = lines.reduce((sum, l) => sum + l.lineTotal, 0);

  return { sessionId, items: lines, itemCount, subtotal };
}

export async function GET() {
  const sessionId = await getOrCreateSessionId();
  const cart = await buildCartDTO(sessionId);
  return NextResponse.json(cart);
}

type CartActionBody =
  | { action: "add"; productId: string; colorHex: string; quantity?: number }
  | {
      action: "update";
      itemId: string;
      quantity: number;
    }
  | { action: "remove"; itemId: string }
  | { action: "clear" };

export async function POST(req: NextRequest) {
  const sessionId = await getOrCreateSessionId();
  const body = (await req.json()) as CartActionBody;

  if (body.action === "add") {
    const product = await db.product.findUnique({
      where: { id: body.productId },
    });
    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 },
      );
    }
    const qty = Math.max(1, Math.min(10, body.quantity ?? 1));
    const existing = await db.cartItem.findUnique({
      where: {
        sessionId_productId_colorHex: {
          sessionId,
          productId: body.productId,
          colorHex: body.colorHex,
        },
      },
    });
    if (existing) {
      await db.cartItem.update({
        where: { id: existing.id },
        data: { quantity: Math.min(10, existing.quantity + qty) },
      });
    } else {
      await db.cartItem.create({
        data: {
          sessionId,
          productId: body.productId,
          colorHex: body.colorHex,
          quantity: qty,
        },
      });
    }
  } else if (body.action === "update") {
    const qty = Math.max(1, Math.min(10, body.quantity));
    await db.cartItem.updateMany({
      where: { id: body.itemId, sessionId },
      data: { quantity: qty },
    });
  } else if (body.action === "remove") {
    await db.cartItem.deleteMany({
      where: { id: body.itemId, sessionId },
    });
  } else if (body.action === "clear") {
    await db.cartItem.deleteMany({ where: { sessionId } });
  } else {
    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  }

  const cart = await buildCartDTO(sessionId);
  return NextResponse.json(cart);
}
