// OneShot seed — populate 10 earbuds products.
// Run with: bun run db:push && bun run prisma db seed (or `bun run seed`).
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type SeedProduct = {
  slug: string;
  name: string;
  tagline: string;
  title: string;
  price: number; // rupees
  compareAt?: number;
  category: string;
  colorName: string;
  colorHex: string;
  imageKey: string;
  badge?: string;
  bullets: string[];
  description: string;
  features: string[];
  specs: [string, string][];
  rating: number;
  reviewCount: number;
  inStock: boolean;
};

const products: SeedProduct[] = [
  {
    slug: "airbuds",
    name: "OneShot AirBuds",
    tagline: "Lightweight everyday wireless earbuds",
    title:
      "OneShot AirBuds True Wireless Earbuds, Lightweight Design, Bluetooth 5.3, Stereo Sound, All-Day Comfort",
    price: 999,
    compareAt: 1499,
    category: "Everyday",
    colorName: "Cloud White",
    colorHex: "#f3f3f3",
    imageKey: "airbuds",
    badge: "BEST VALUE",
    bullets: [
      "Lightweight ergonomic design for all-day comfort",
      "Stable Bluetooth 5.3 connectivity with quick pairing",
      "Balanced stereo sound for music and calls",
      "Pocket-friendly charging case for easy portability",
      "Ideal for daily casual listening",
    ],
    description:
      "AirBuds are built for everyday listening. A lightweight shell, quick Bluetooth 5.3 pairing, and balanced stereo sound make them the easy choice for commutes, walks, and casual sessions.",
    features: [
      "Bluetooth 5.3",
      "Up to 24h total battery",
      "Touch controls",
      "IPX4 splash resistance",
    ],
    specs: [
      ["Driver", "10mm dynamic"],
      ["Battery (buds)", "5h playback"],
      ["Battery (case)", "24h total"],
      ["Charging", "USB-C"],
      ["Weight", "4.2g per bud"],
      ["Connectivity", "Bluetooth 5.3"],
    ],
    rating: 4.4,
    reviewCount: 1284,
    inStock: true,
  },
  {
    slug: "neopods",
    name: "OneShot NeoPods",
    tagline: "Compact, fast-pairing earbuds for daily use",
    title:
      "OneShot NeoPods Wireless Earbuds, Fast Pairing Bluetooth 5.3, HD Sound, Compact Design for Everyday Use",
    price: 1299,
    compareAt: 1899,
    category: "Everyday",
    colorName: "Midnight Black",
    colorHex: "#1a1a1a",
    imageKey: "neopods",
    bullets: [
      "Fast auto-pairing for instant connection",
      "Clear HD stereo audio output",
      "Compact and stylish pocket-fit design",
      "Smooth touch controls for music & calls",
      "Long battery backup for daily usage",
    ],
    description:
      "NeoPods keep things simple and quick. Open the case and they pair instantly. Touch controls, HD stereo sound, and a compact case that fits any pocket.",
    features: [
      "Bluetooth 5.3",
      "Instant auto-pair",
      "HD stereo sound",
      "Touch controls",
    ],
    specs: [
      ["Driver", "11mm dynamic"],
      ["Battery (buds)", "6h playback"],
      ["Battery (case)", "28h total"],
      ["Charging", "USB-C"],
      ["Weight", "4.0g per bud"],
      ["Connectivity", "Bluetooth 5.3"],
    ],
    rating: 4.5,
    reviewCount: 932,
    inStock: true,
  },
  {
    slug: "sonicbuds",
    name: "OneShot SonicBuds",
    tagline: "Bass-boosted earbuds for music lovers",
    title:
      "OneShot SonicBuds Bass Boost Wireless Earbuds, Deep Bass Sound, Bluetooth 5.3, Music Lovers Edition",
    price: 1499,
    compareAt: 2199,
    category: "Bass",
    colorName: "Graphite Black",
    colorHex: "#2a2a2a",
    imageKey: "sonicbuds",
    badge: "BASS EDITION",
    bullets: [
      "Powerful bass-enhanced audio drivers",
      "Immersive sound for music streaming",
      "Low-latency Bluetooth connection",
      "Comfortable in-ear fit for long listening",
      "Perfect for bass-heavy genres",
    ],
    description:
      "SonicBuds are tuned for listeners who love low end. Bass-enhanced drivers and a low-latency Bluetooth link deliver immersive sound for EDM, hip-hop, and bass-driven genres.",
    features: [
      "Bass-boost drivers",
      "Low-latency mode",
      "Bluetooth 5.3",
      "Dual-mic calls",
    ],
    specs: [
      ["Driver", "13mm bass-tuned"],
      ["Battery (buds)", "6h playback"],
      ["Battery (case)", "30h total"],
      ["Charging", "USB-C"],
      ["Weight", "4.5g per bud"],
      ["Latency", "Low-latency mode"],
    ],
    rating: 4.5,
    reviewCount: 718,
    inStock: true,
  },
  {
    slug: "pulsepods",
    name: "OneShot PulsePods",
    tagline: "Sport earbuds with secure fit and sweat resistance",
    title:
      "OneShot PulsePods Sports Wireless Earbuds, Sweat Resistant, Secure Fit, Ideal for Gym & Running",
    price: 1699,
    compareAt: 2499,
    category: "Sports",
    colorName: "Volt Green",
    colorHex: "#3a8a4a",
    imageKey: "pulsepods",
    badge: "SPORTS",
    bullets: [
      "Sweat and splash resistant design",
      "Secure fit for sports and workouts",
      "Stable Bluetooth connectivity during movement",
      "Lightweight build for active lifestyle",
      "Long battery life for training sessions",
    ],
    description:
      "PulsePods stay put. A secure-fit design and sweat resistance keep them locked in through runs, gym sets, and HIIT sessions, with a stable wireless link that does not drop when you move.",
    features: [
      "IPX5 sweat resistance",
      "Secure-fit ear hooks",
      "Bluetooth 5.3",
      "Voice assistant",
    ],
    specs: [
      ["Driver", "11mm dynamic"],
      ["Battery (buds)", "7h playback"],
      ["Battery (case)", "32h total"],
      ["Charging", "USB-C"],
      ["Weight", "4.8g per bud"],
      ["Water resistance", "IPX5"],
    ],
    rating: 4.4,
    reviewCount: 556,
    inStock: true,
  },
  {
    slug: "echobuds",
    name: "OneShot EchoBuds",
    tagline: "Calling earbuds with noise reduction",
    title:
      "OneShot EchoBuds Calling Earbuds with Noise Reduction, HD Voice, Wireless Bluetooth 5.3, Clear Calls",
    price: 1799,
    compareAt: 2599,
    category: "Calling",
    colorName: "Studio Silver",
    colorHex: "#c8c8c8",
    imageKey: "echobuds",
    badge: "FOR CALLS",
    bullets: [
      "Noise reduction for clearer voice calls",
      "HD microphone for meetings & communication",
      "Stable wireless performance",
      "Comfortable all-day wear design",
      "Ideal for office & work-from-home users",
    ],
    description:
      "EchoBuds are made for talk. ENC microphones isolate your voice from background noise so calls and meetings come through clearly, whether you are in an office or working from home.",
    features: [
      "ENC noise reduction",
      "Dual HD mics",
      "Bluetooth 5.3",
      "All-day comfort",
    ],
    specs: [
      ["Driver", "11mm dynamic"],
      ["Battery (buds)", "7h playback"],
      ["Battery (case)", "32h total"],
      ["Charging", "USB-C"],
      ["Weight", "4.3g per bud"],
      ["Mic", "Dual-mic ENC"],
    ],
    rating: 4.6,
    reviewCount: 642,
    inStock: true,
  },
  {
    slug: "wavepods",
    name: "OneShot WavePods",
    tagline: "Water-resistant travel-ready earbuds",
    title:
      "OneShot WavePods Waterproof Wireless Earbuds, IPX Water Resistant, Travel Ready Bluetooth Earbuds",
    price: 1899,
    compareAt: 2799,
    category: "Sports",
    colorName: "Coastal Blue",
    colorHex: "#3a6a9a",
    imageKey: "wavepods",
    bullets: [
      "Water-resistant build for outdoor use",
      "Stable connection for travel & commute",
      "Balanced sound quality for all genres",
      "Lightweight and durable design",
      "Long-lasting battery performance",
    ],
    description:
      "WavePods are built for movement and weather. A water-resistant shell, stable wireless connection, and balanced tuning make them a reliable travel and outdoor companion.",
    features: [
      "IPX6 water resistance",
      "Bluetooth 5.3",
      "Balanced tuning",
      "Travel-ready case",
    ],
    specs: [
      ["Driver", "12mm dynamic"],
      ["Battery (buds)", "8h playback"],
      ["Battery (case)", "36h total"],
      ["Charging", "USB-C"],
      ["Weight", "4.6g per bud"],
      ["Water resistance", "IPX6"],
    ],
    rating: 4.5,
    reviewCount: 421,
    inStock: true,
  },
  {
    slug: "zenbuds",
    name: "OneShot ZenBuds",
    tagline: "Noise-isolating earbuds for focus and calm",
    title:
      "OneShot ZenBuds Noise Isolating Wireless Earbuds, Relaxing Sound Profile, Focus & Meditation Earbuds",
    price: 2199,
    compareAt: 2999,
    category: "Focus",
    colorName: "Sandstone Beige",
    colorHex: "#c8b89a",
    imageKey: "zenbuds",
    bullets: [
      "Passive noise isolation for focus",
      "Soft, balanced sound tuning",
      "Comfortable fit for long sessions",
      "Ideal for meditation & study",
      "Smooth touch controls",
    ],
    description:
      "ZenBuds are tuned for calm. Passive noise isolation and a soft, balanced sound profile help you focus, study, or unwind without distractions.",
    features: [
      "Passive noise isolation",
      "Soft sound tuning",
      "Bluetooth 5.3",
      "Long-session comfort",
    ],
    specs: [
      ["Driver", "10mm balanced"],
      ["Battery (buds)", "7h playback"],
      ["Battery (case)", "32h total"],
      ["Charging", "USB-C"],
      ["Weight", "4.1g per bud"],
      ["Isolation", "Passive -24dB"],
    ],
    rating: 4.5,
    reviewCount: 318,
    inStock: true,
  },
  {
    slug: "maxtune",
    name: "OneShot MaxTune",
    tagline: "Premium earbuds with high bass drivers",
    title:
      "OneShot MaxTune Premium Wireless Earbuds, High Bass Drivers, HD Sound Quality, Bluetooth 5.3",
    price: 2499,
    compareAt: 3499,
    category: "Premium",
    colorName: "Titanium Grey",
    colorHex: "#8a8a8a",
    imageKey: "maxtune",
    badge: "PREMIUM",
    bullets: [
      "High-performance audio drivers",
      "Rich bass with clear treble balance",
      "Lag-free Bluetooth connectivity",
      "Premium build quality",
      "Ideal for audiophiles",
    ],
    description:
      "MaxTune is built for listeners who want more. High-performance drivers deliver rich bass with clean treble, while a premium shell and lag-free wireless link round out the experience.",
    features: [
      "High-performance drivers",
      "Lag-free Bluetooth 5.3",
      "Premium build",
      "Dual-mic calls",
    ],
    specs: [
      ["Driver", "14mm hi-perf"],
      ["Battery (buds)", "8h playback"],
      ["Battery (case)", "36h total"],
      ["Charging", "USB-C + Qi"],
      ["Weight", "4.7g per bud"],
      ["Codec", "AAC + SBC"],
    ],
    rating: 4.7,
    reviewCount: 287,
    inStock: true,
  },
  {
    slug: "aeropods",
    name: "OneShot AeroPods",
    tagline: "Ultra-light earbuds with a premium finish",
    title:
      "OneShot AeroPods Stylish Wireless Earbuds, Ultra Light Design, Premium Finish, Bluetooth 5.3 Earbuds",
    price: 2699,
    compareAt: 3699,
    category: "Premium",
    colorName: "Rose Gold",
    colorHex: "#c89a8a",
    imageKey: "aeropods",
    badge: "NEW RELEASE",
    bullets: [
      "Sleek and modern aesthetic design",
      "Ultra-lightweight for comfort",
      "Smooth touch controls",
      "Stable connection for daily use",
      "Premium carry case included",
    ],
    description:
      "AeroPods pair an ultra-light build with a premium finish. A sleek shell, smooth touch controls, and a stable wireless link make them a refined everyday companion.",
    features: [
      "Ultra-light 3.8g build",
      "Bluetooth 5.3",
      "Premium carry case",
      "Touch controls",
    ],
    specs: [
      ["Driver", "11mm dynamic"],
      ["Battery (buds)", "7h playback"],
      ["Battery (case)", "32h total"],
      ["Charging", "USB-C + Qi"],
      ["Weight", "3.8g per bud"],
      ["Codec", "AAC + SBC"],
    ],
    rating: 4.6,
    reviewCount: 196,
    inStock: true,
  },
  {
    slug: "probeat",
    name: "OneShot ProBeat Buds",
    tagline: "ANC earbuds with deep bass and premium sound",
    title:
      "OneShot ProBeat Buds ANC Wireless Earbuds, Active Noise Cancellation, Deep Bass, Premium Sound Experience",
    price: 3299,
    compareAt: 4499,
    category: "Premium",
    colorName: "Obsidian Black",
    colorHex: "#0e0e0e",
    imageKey: "probeat",
    badge: "FLAGSHIP",
    bullets: [
      "Active Noise Cancellation (ANC) support",
      "Deep bass with immersive audio output",
      "Premium wireless performance",
      "Comfortable long-wear design",
      "Best for music & travel experience",
    ],
    description:
      "ProBeat Buds is our flagship. Active Noise Cancellation, deep bass, and premium wireless performance deliver an immersive experience for music, travel, and long listening sessions.",
    features: [
      "Active Noise Cancellation",
      "Transparency mode",
      "Bluetooth 5.3",
      "Qi wireless charging",
    ],
    specs: [
      ["Driver", "14mm hi-perf"],
      ["Battery (buds)", "8h (ANC on)"],
      ["Battery (case)", "36h total"],
      ["Charging", "USB-C + Qi"],
      ["Weight", "4.9g per bud"],
      ["ANC depth", "Up to -32dB"],
    ],
    rating: 4.8,
    reviewCount: 174,
    inStock: true,
  },
];

function toPaise(rupees: number) {
  return rupees * 100;
}

async function main() {
  console.log("Seeding OneShot catalog...");

  for (const p of products) {
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: {
        name: p.name,
        tagline: p.tagline,
        title: p.title,
        price: toPaise(p.price),
        compareAt: p.compareAt ? toPaise(p.compareAt) : null,
        category: p.category,
        colorName: p.colorName,
        colorHex: p.colorHex,
        imageKey: p.imageKey,
        badge: p.badge ?? null,
        bullets: p.bullets.join("\n"),
        description: p.description,
        features: p.features.join("\n"),
        specs: p.specs.map(([k, v]) => `${k}: ${v}`).join("\n"),
        rating: p.rating,
        reviewCount: p.reviewCount,
        inStock: p.inStock,
      },
      create: {
        slug: p.slug,
        name: p.name,
        tagline: p.tagline,
        title: p.title,
        price: toPaise(p.price),
        compareAt: p.compareAt ? toPaise(p.compareAt) : null,
        category: p.category,
        colorName: p.colorName,
        colorHex: p.colorHex,
        imageKey: p.imageKey,
        badge: p.badge ?? null,
        bullets: p.bullets.join("\n"),
        description: p.description,
        features: p.features.join("\n"),
        specs: p.specs.map(([k, v]) => `${k}: ${v}`).join("\n"),
        rating: p.rating,
        reviewCount: p.reviewCount,
        inStock: p.inStock,
      },
    });
    console.log(`  ✓ ${p.slug} — ₹${p.price}`);
  }

  console.log(`Seeded ${products.length} products.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
