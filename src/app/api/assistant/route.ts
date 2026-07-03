// POST /api/assistant
// Multi-turn shopping assistant powered by LLM.
// Body: { sessionId, message }
// Returns: { reply, productRefs: [{slug,name,price}] }
//
// The LLM is given the full OneShot catalog as context and instructed to answer
// concisely, recommend from the catalog only, and emit a JSON block referencing
// product slugs when relevant so the UI can render tappable product chips.
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import ZAI from "z-ai-web-dev-sdk";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// In-memory conversation store (per session). Fine for demo scale.
const conversations = new Map<
  string,
  { role: "user" | "assistant"; content: string }[]
>();

const MAX_TURNS = 12;

export async function POST(req: NextRequest) {
  const body = await req.json();
  const sessionId = String(body.sessionId ?? "").trim();
  const message = String(body.message ?? "").trim();

  if (!sessionId || !message) {
    return NextResponse.json(
      { error: "sessionId and message are required." },
      { status: 400 },
    );
  }

  // Load catalog (lightweight summary for the prompt)
  const products = (await db.product.findMany({ orderBy: { price: "asc" } })).map(
    (p) => ({
      slug: p.slug,
      name: p.name,
      price: p.price / 100,
      category: p.category,
      tagline: p.tagline,
      colorName: p.colorName,
      bullets: p.bullets.split("\n").filter(Boolean).slice(0, 3),
    }),
  );

  const catalogText = products
    .map(
      (p) =>
        `- ${p.name} (slug: ${p.slug}) | ₹${p.price} | ${p.category} | ${p.tagline} | ${p.bullets.join("; ")}`,
    )
    .join("\n");

  const systemPrompt = `You are "OneShot Assistant", the friendly shopping assistant for OneShot, an Indian wireless earbuds brand. You help visitors choose the right earbuds, compare models, explain features, and answer questions about shipping, returns, and warranty.

Here is the complete OneShot catalog (prices in INR rupees):
${catalogText}

Rules:
- Be concise and warm. Answer in 2-4 short sentences. Use simple, professional language.
- Only recommend products that exist in the catalog above. Never invent products or specs.
- When you recommend or compare products, end your reply with a JSON block on its own line in EXACTLY this format, listing the slugs you referenced (max 3):
  [PRODUCTS:slug1,slug2]
  If no specific product is referenced, omit the JSON block entirely.
- For shipping/returns/warranty questions, give the real policy: free shipping over ₹999 (₹49 below), 3-5 day delivery, 7-day returns, 1-year warranty.
- If the user asks something unrelated to OneShot or earbuds, gently steer back to helping them find earbuds.
- Do not mention that you are an AI or that you have a catalog. Speak as the brand.`;

  // Build message history
  let history = conversations.get(sessionId) ?? [];
  history = [...history, { role: "user", content: message }];
  if (history.length > MAX_TURNS) {
    history = history.slice(-MAX_TURNS);
  }

  const messages: { role: "assistant" | "user"; content: string }[] = [
    { role: "assistant", content: systemPrompt },
    ...history,
  ];

  try {
    const zai = await ZAI.create();
    const completion = await zai.chat.completions.create({
      messages,
      thinking: { type: "disabled" },
    });
    const raw = completion.choices[0]?.message?.content ?? "";

    // Extract product refs and strip the JSON block from the visible reply.
    // Allow optional whitespace around commas (LLM sometimes emits "a, b").
    const refMatch = raw.match(/\[PRODUCTS:([a-z0-9,\s-]+)\]/i);
    let reply = raw;
    let productRefs: { slug: string; name: string; price: number }[] = [];
    if (refMatch) {
      reply = raw.replace(refMatch[0], "").trim();
      const slugs = refMatch[1]
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
        .slice(0, 3);
      const refMap = new Map(products.map((p) => [p.slug, p]));
      productRefs = slugs
        .map((slug) => refMap.get(slug))
        .filter(Boolean)
        .map((p) => ({ slug: p!.slug, name: p!.name, price: p!.price }));
    }

    // Save history (assistant reply without the JSON block)
    history = [...history, { role: "assistant", content: reply }];
    conversations.set(sessionId, history.slice(-MAX_TURNS));

    return NextResponse.json({ reply, productRefs });
  } catch (err) {
    return NextResponse.json(
      {
        reply:
          "I'm having trouble connecting right now. Please try again in a moment, or browse the collection while I get back online.",
        productRefs: [],
      },
      { status: 200 },
    );
  }
}
