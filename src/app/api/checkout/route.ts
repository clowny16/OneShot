// POST /api/checkout
// Body: { email, firstName, lastName, phone, address, city, state, pincode }
// Reads session cart, creates an Order, clears the cart, returns the order id.
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getOrCreateSessionId } from "@/lib/session";

const FREE_SHIPPING_THRESHOLD = 99900; // ₹999 in paise
const FLAT_SHIPPING = 4900; // ₹49

function genOrderId() {
  const n = Math.floor(100000 + Math.random() * 900000);
  return `ON-${n}`;
}

export async function POST(req: NextRequest) {
  const sessionId = await getOrCreateSessionId();
  const body = await req.json();

  const email = String(body.email ?? "").trim();
  const firstName = String(body.firstName ?? "").trim();
  const lastName = String(body.lastName ?? "").trim();
  const phone = String(body.phone ?? "").trim();
  const address = String(body.address ?? "").trim();
  const city = String(body.city ?? "").trim();
  const state = String(body.state ?? "").trim();
  const pincode = String(body.pincode ?? "").trim();

  if (
    !email ||
    !firstName ||
    !lastName ||
    !phone ||
    !address ||
    !city ||
    !state ||
    !pincode
  ) {
    return NextResponse.json(
      { error: "All fields are required." },
      { status: 400 },
    );
  }
  if (!/^\S+@\S+\.\S+$/.test(email)) {
    return NextResponse.json(
      { error: "Enter a valid email address." },
      { status: 400 },
    );
  }
  if (!/^\d{10}$/.test(phone.replace(/\D/g, "").slice(-10))) {
    return NextResponse.json(
      { error: "Enter a valid 10-digit phone number." },
      { status: 400 },
    );
  }
  if (!/^\d{6}$/.test(pincode)) {
    return NextResponse.json(
      { error: "Enter a valid 6-digit pincode." },
      { status: 400 },
    );
  }

  const items = await db.cartItem.findMany({
    where: { sessionId },
    include: { product: true },
  });

  if (items.length === 0) {
    return NextResponse.json(
      { error: "Your cart is empty." },
      { status: 400 },
    );
  }

  const subtotalPaise = items.reduce(
    (sum, ci) => sum + ci.product.price * ci.quantity,
    0,
  );
  const shippingPaise =
    subtotalPaise >= FREE_SHIPPING_THRESHOLD ? 0 : FLAT_SHIPPING;
  const totalPaise = subtotalPaise + shippingPaise;

  const itemsJson = JSON.stringify(
    items.map((ci) => ({
      name: ci.product.name,
      slug: ci.product.slug,
      price: ci.product.price,
      quantity: ci.quantity,
      colorHex: ci.colorHex,
      colorName: ci.product.colorName,
    })),
  );

  const order = await db.order.create({
    data: {
      orderId: genOrderId(),
      sessionId,
      email,
      firstName,
      lastName,
      phone,
      address,
      city,
      state,
      pincode,
      subtotal: subtotalPaise,
      shipping: shippingPaise,
      total: totalPaise,
      status: "CONFIRMED",
      itemsJson,
    },
  });

  // Clear cart
  await db.cartItem.deleteMany({ where: { sessionId } });

  return NextResponse.json({
    orderId: order.orderId,
    dbId: order.id,
    total: totalPaise / 100,
    shipping: shippingPaise / 100,
    subtotal: subtotalPaise / 100,
    email,
    name: `${firstName} ${lastName}`,
  });
}
