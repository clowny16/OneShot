// POST /api/finder
// Smart product finder: takes the user's quiz answers and returns an LLM-generated
// recommendation (primary pick + one alternative) with a short rationale.
// Body: { answers: { usage, budget, priority, feature } }
// Returns: { primary: {slug, reason}, alternative: {slug, reason}, summary }
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import ZAI from "z-ai-web-dev-sdk";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Answers = {
  usage?: string;   // e.g. "Music", "Calls", "Sport", "Focus", "Mixed"
  budget?: string;  // e.g. "under-1500", "1500-2500", "above-2500"
  priority?: string;// e.g. "Bass", "Clarity", "Battery", "Comfort", "ANC"
  feature?: string; // e.g. "ANC", "Waterproof", "Long battery", "Lightweight"
};

export async function POST(req: NextRequest) {
  const body = (await req.json()) as { answers: Answers };
  const a = body.answers ?? {};

  // Load catalog (full details so the model can match features)
  const products = (await db.product.findMany({ orderBy: { price: "asc" } })).map(
    (p) => ({
      slug: p.slug,
      name: p.name,
      price: p.price / 100,
      category: p.category,
      tagline: p.tagline,
      bullets: p.bullets.split("\n").filter(Boolean),
      features: p.features.split("\n").filter(Boolean),
    }),
  );

  const catalogText = products
    .map(
      (p) =>
        `- ${p.name} (slug: ${p.slug}) | ₹${p.price} | ${p.category} | ${p.tagline} | features: ${p.features.join(", ")} | highlights: ${p.bullets.join("; ")}`,
    )
    .join("\n");

  const userBrief = `My answers:
- Main use: ${a.usage ?? "Not specified"}
- Budget: ${a.budget ?? "No preference"}
- Top priority: ${a.priority ?? "Not specified"}
- Must-have feature: ${a.feature ?? "None"}`;

  const systemPrompt = `You are OneShot's product-matching engine. Based on the user's quiz answers, pick the single best earbuds model from the catalog below, plus one alternative. Respond ONLY with valid JSON (no markdown, no prose) in exactly this shape:

{
  "primary": { "slug": "<slug>", "reason": "<one short sentence why it fits>" },
  "alternative": { "slug": "<slug>", "reason": "<one short sentence>" },
  "summary": "<one warm sentence summarising the recommendation>"
}

Catalog:
${catalogText}

Rules:
- Both slugs MUST come from the catalog above. Never invent slugs.
- Match budget bands: "under-1500" means price < 1500; "1500-2500" means 1500-2500; "above-2500" means > 2500. "No preference" = any.
- Match usage: Music→bass/clarity models; Calls→EchoBuds; Sport→PulsePods/WavePods; Focus→ZenBuds/ProBeat; Mixed→everyday.
- Match priority/feature to the product's features array (ANC, Waterproof, etc.).
- Keep reasons under 12 words. Summary under 20 words.`;

  try {
    const zai = await ZAI.create();
    const completion = await zai.chat.completions.create({
      messages: [
        { role: "assistant", content: systemPrompt },
        { role: "user", content: userBrief },
      ],
      thinking: { type: "disabled" },
    });
    const raw = completion.choices[0]?.message?.content ?? "";
    // Extract the JSON object (tolerate stray text around it)
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("No JSON in response");
    }
    const parsed = JSON.parse(jsonMatch[0]);

    // Validate slugs exist
    const validSlugs = new Set(products.map((p) => p.slug));
    if (!parsed.primary?.slug || !validSlugs.has(parsed.primary.slug)) {
      throw new Error("Invalid primary slug");
    }

    return NextResponse.json({
      primary: {
        slug: parsed.primary.slug,
        reason: String(parsed.primary.reason ?? ""),
      },
      alternative: parsed.alternative?.slug
        ? {
            slug: parsed.alternative.slug,
            reason: String(parsed.alternative.reason ?? ""),
          }
        : null,
      summary: String(parsed.summary ?? ""),
    });
  } catch {
    // Deterministic fallback so the quiz always returns something useful
    const fallback = deterministicMatch(a, products);
    return NextResponse.json({
      primary: fallback.primary,
      alternative: fallback.alternative,
      summary:
        "Based on your answers, here's our pick — tuned for your everyday routine.",
    });
  }
}

function deterministicMatch(
  a: Answers,
  products: {
    slug: string;
    name: string;
    price: number;
    category: string;
    features: string[];
  }[],
) {
  const inBudget = (p: { price: number }) => {
    switch (a.budget) {
      case "under-1500":
        return p.price < 1500;
      case "1500-2500":
        return p.price >= 1500 && p.price <= 2500;
      case "above-2500":
        return p.price > 2500;
      default:
        return true;
    }
  };

  const score = (p: { category: string; features: string[]; slug: string }) => {
    let s = 0;
    if (a.usage === "Calls" && p.slug === "echobuds") s += 5;
    if (a.usage === "Sport" && (p.slug === "pulsepods" || p.slug === "wavepods"))
      s += 5;
    if (a.usage === "Focus" && (p.slug === "zenbuds" || p.slug === "probeat"))
      s += 5;
    if (a.usage === "Music" && (p.slug === "sonicbuds" || p.slug === "maxtune"))
      s += 5;
    if (a.priority === "ANC" && p.features.join(" ").toLowerCase().includes("anc"))
      s += 5;
    if (a.priority === "Bass" && p.slug === "sonicbuds") s += 3;
    if (a.feature === "Waterproof" && p.slug === "wavepods") s += 5;
    if (a.feature === "ANC" && p.slug === "probeat") s += 5;
    return s;
  };

  const eligible = products.filter(inBudget);
  const ranked = [...eligible].sort((x, y) => score(y) - score(x));
  const primary = ranked[0] ?? products[0];
  const alt = ranked[1] ?? products[1] ?? products[0];

  return {
    primary: { slug: primary.slug, reason: "Best match for your needs and budget." },
    alternative: { slug: alt.slug, reason: "A close alternative worth considering." },
  };
}
