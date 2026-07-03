// POST /api/newsletter
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const email = String(body.email ?? "").trim().toLowerCase();

  if (!email) {
    return NextResponse.json(
      { error: "Email is required." },
      { status: 400 },
    );
  }
  if (!/^\S+@\S+\.\S+$/.test(email)) {
    return NextResponse.json(
      { error: "Enter a valid email address." },
      { status: 400 },
    );
  }

  const existing = await db.newsletterSubscriber.findUnique({
    where: { email },
  });
  if (existing) {
    return NextResponse.json({ ok: true, alreadySubscribed: true });
  }

  await db.newsletterSubscriber.create({ data: { email } });
  return NextResponse.json({ ok: true });
}
