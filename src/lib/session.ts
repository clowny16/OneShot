// Session ID helpers — cookie-based, anonymous session for cart persistence.
import { cookies } from "next/headers";
import { randomUUID } from "crypto";

export const SESSION_COOKIE = "oneshot_session";

export async function getOrCreateSessionId(): Promise<string> {
  const store = await cookies();
  let sid = store.get(SESSION_COOKIE)?.value;
  if (!sid) {
    sid = randomUUID();
    store.set(SESSION_COOKIE, sid, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });
  }
  return sid;
}

export async function getSessionId(): Promise<string | null> {
  const store = await cookies();
  return store.get(SESSION_COOKIE)?.value ?? null;
}
