// POST /api/auth/signup
// Creates a new user account with email + password.
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { hashPassword } from "@/lib/password";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const name = String(body.name ?? "").trim();
  const email = String(body.email ?? "").trim().toLowerCase();
  const password = String(body.password ?? "");

  if (!email || !password) {
    return NextResponse.json(
      { error: "Email and password are required." },
      { status: 400 },
    );
  }
  if (!/^\S+@\S+\.\S+$/.test(email)) {
    return NextResponse.json(
      { error: "Enter a valid email address." },
      { status: 400 },
    );
  }
  if (password.length < 6) {
    return NextResponse.json(
      { error: "Password must be at least 6 characters." },
      { status: 400 },
    );
  }

  const existing = await db.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json(
      { error: "An account with this email already exists." },
      { status: 409 },
    );
  }

  const hashed = hashPassword(password);
  const user = await db.user.create({
    data: {
      email,
      name: name || email.split("@")[0],
      password: hashed,
    },
  });

  return NextResponse.json({
    ok: true,
    user: { id: user.id, email: user.email, name: user.name },
  });
}
