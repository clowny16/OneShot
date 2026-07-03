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
  productType?: string; // e.g. "Earbuds", "Headphones", "Speakers", "Gaming Audio", "Wired Earphones", "Audio Accessories"
  usage?: string;   // e.g. "Music", "Calls", "Sport", "Focus", "Party"
  budget?: string;  // e.g. "under-1500", "1500-2500", "above-2500"
  priority?: string;// e.g. "Bass", "Clarity", "Battery", "Comfort", "ANC", "Volume"
  feature?: string; // legacy field, no longer asked in quiz
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
      productType: p.productType,
      category: p.category,
      tagline: p.tagline,
      bullets: p.bullets.split("\n").filter(Boolean),
      features: p.features.split("\n").filter(Boolean),
    }),
  );

  const catalogText = products
    .map(
      (p) =>
        `- ${p.name} (slug: ${p.slug}) | ₹${p.price} | Type: ${p.productType} | ${p.tagline} | features: ${p.features.join(", ")} | highlights: ${p.bullets.join("; ")}`,
    )
    .join("\n");

  const userBrief = `My answers:
- Product type wanted: ${a.productType ?? "No preference"}
- Main use: ${a.usage ?? "Not specified"}
- Budget: ${a.budget ?? "No preference"}
- Top priority: ${a.priority ?? "Not specified"}`;

  const systemPrompt = `You are OneShot's product-matching engine. Based on the user's quiz answers, pick the single best product from the catalog below, plus one alternative. Respond ONLY with valid JSON (no markdown, no prose) in exactly this shape:

{
  "primary": { "slug": "<slug>", "reason": "<one short sentence why it fits>" },
  "alternative": { "slug": "<slug>", "reason": "<one short sentence>" },
  "summary": "<one warm sentence summarising the recommendation>"
}

Catalog:
${catalogText}

Rules:
- Both slugs MUST come from the catalog above. Never invent slugs.
- FIRST filter by productType. If the user picked "Earbuds", only consider products with Type: Earbuds. If "Headphones", consider both Wired Headphones and Wireless Headphones. If "Speakers", consider Portable Speakers and Premium Speakers. If "Gaming Audio", only Gaming Audio. If "Wired Earphones", only Wired Earphones. If "Audio Accessories", only Audio Accessories.
- Then match budget bands: "under-1500" means price < 1500; "1500-2500" means 1500-2500; "above-2500" means > 2500. "No preference" = any.
- Then match usage: Music→bass/clarity models; Calls→EchoBuds or ClearSound H2; Sport→PulsePods/WavePods; Focus→ZenBuds/ProBeat; Party→PartyBlast/MegaBoom.
- Then match priority to the product's features (ANC, Waterproof, Long battery, bass, volume, etc.).
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
    productType: string;
    category: string;
    features: string[];
  }[],
) {
  // First filter by productType (map quiz answer to actual productTypes)
  const typeMatch = (p: { productType: string }) => {
    if (!a.productType || a.productType === "No preference") return true;
    if (a.productType === "Headphones")
      return (
        p.productType === "Wired Headphones" ||
        p.productType === "Wireless Headphones"
      );
    if (a.productType === "Speakers")
      return (
        p.productType === "Portable Speakers" ||
        p.productType === "Premium Speakers"
      );
    return p.productType === a.productType;
  };

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

  const score = (p: { productType: string; features: string[]; slug: string }) => {
    let s = 0;
    const featText = p.features.join(" ").toLowerCase();
    if (a.usage === "Calls" && (p.slug === "echobuds" || p.slug === "clearsound-h2"))
      s += 5;
    if (
      a.usage === "Sport" &&
      (p.slug === "pulsepods" || p.slug === "wavepods" || p.slug === "flexwire")
    )
      s += 5;
    if (
      a.usage === "Focus" &&
      (p.slug === "zenbuds" || p.slug === "probeat" || p.slug === "neosound-h4")
    )
      s += 5;
    if (
      a.usage === "Music" &&
      (p.slug === "sonicbuds" || p.slug === "maxtune" || p.slug === "beatpro-h3")
    )
      s += 5;
    if (
      a.usage === "Party" &&
      (p.slug === "partyblast-s3" || p.slug === "megaboom-s4" || p.slug === "basstube-bt1")
    )
      s += 5;
    if (a.priority === "ANC" && featText.includes("anc")) s += 5;
    if (a.priority === "Bass" && featText.includes("bass")) s += 3;
    if (a.priority === "Volume" && p.productType.includes("Speaker")) s += 5;
    if (a.priority === "Battery" && featText.includes("battery")) s += 3;
    return s;
  };

  const eligible = products.filter(typeMatch).filter(inBudget);
  const ranked = [...eligible].sort((x, y) => score(y) - score(x));
  const primary = ranked[0] ?? products[0];
  const alt = ranked[1] ?? products[1] ?? products[0];

  return {
    primary: { slug: primary.slug, reason: "Best match for your needs and budget." },
    alternative: { slug: alt.slug, reason: "A close alternative worth considering." },
  };
}
