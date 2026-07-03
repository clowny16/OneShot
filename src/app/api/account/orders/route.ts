// GET /api/account/orders?email=...
// Returns orders for the given email (must match the authenticated user).
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const email = session.user.email;
  const orders = await db.order.findMany({
    where: { email },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  return NextResponse.json({
    orders: orders.map((o) => ({
      orderId: o.orderId,
      email: o.email,
      firstName: o.firstName,
      total: o.total / 100,
      shipping: o.shipping / 100,
      subtotal: o.subtotal / 100,
      status: o.status,
      items: JSON.parse(o.itemsJson) as Array<{
        name: string;
        slug: string;
        price: number;
        quantity: number;
        colorHex: string;
        colorName: string;
      }>,
      createdAt: o.createdAt.toISOString(),
    })),
  });
}
