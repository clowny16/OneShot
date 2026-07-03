// Photorealistic images generated via z-ai image CLI.
// All images are local static assets served from /generated/.

export const HERO_SLIDES = [
  {
    src: "/generated/hero-1.png",
    eyebrow: "Series 01 · Engineered for Everyday Sound",
    title: "Sound.\nSimplified.",
    body: "Wireless earbuds built for music, calls, sport, and focus. Bluetooth 5.3, all-day comfort, and tuned drivers — without the premium markup.",
    primaryCta: { label: "Shop Collection", view: "collection" as const },
    secondaryCta: { label: "Explore Flagship", slug: "probeat" },
  },
  {
    src: "/generated/hero-2.png",
    eyebrow: "Move with the music",
    title: "Built for\nmovement.",
    body: "Sweat-resistant, secure-fit earbuds that stay locked in through every run, rep, and commute. Stable Bluetooth that never drops when you move.",
    primaryCta: { label: "Shop Sports", view: "collection" as const, productType: "Earbuds", category: "Sports" },
    secondaryCta: { label: "View All", view: "collection" as const },
  },
  {
    src: "/generated/hero-3.png",
    eyebrow: "Quiet, when you need it",
    title: "Focus.\nUninterrupted.",
    body: "Active Noise Cancellation and passive isolation block out the world. Tuned drivers deliver clean sound for the workday, the study session, the quiet hour.",
    primaryCta: { label: "Shop ANC", view: "collection" as const, productType: "Earbuds", category: "Premium" },
    secondaryCta: { label: "Learn More", view: "about" as const },
  },
];

export const IMAGES = {
  philosophy: "/generated/philosophy.png",
  bentoAcoustic: "/generated/bento-acoustic.png",
  bentoMaterials: "/generated/bento-materials.png",
  bentoApp: "/generated/bento-app.png",
  about: "/generated/about.png",
  collectionBanner: "/generated/collection-banner.png",
  products: {
    "airbuds": "/generated/airbuds.png",
    "neopods": "/generated/neopods.png",
    "sonicbuds": "/generated/sonicbuds.png",
    "pulsepods": "/generated/pulsepods.png",
    "echobuds": "/generated/echobuds.png",
    "wavepods": "/generated/wavepods.png",
    "zenbuds": "/generated/zenbuds.png",
    "maxtune": "/generated/maxtune.png",
    "aeropods": "/generated/aeropods.png",
    "probeat": "/generated/probeat.png",
    // IMG-3: 21 new product images (wired earphones, headphones, speakers, gaming, accessories)
    "wirebeat-100": "/generated/wirebeat-100.png",
    "wirebeat-pro": "/generated/wirebeat-pro.png",
    "flexwire": "/generated/flexwire.png",
    "studiobass-h1": "/generated/studiobass-h1.png",
    "clearsound-h2": "/generated/clearsound-h2.png",
    "beatpro-h3": "/generated/beatpro-h3.png",
    "airbass-x1": "/generated/airbass-x1.png",
    "neosound-h4": "/generated/neosound-h4.png",
    "maxwave-h5": "/generated/maxwave-h5.png",
    "boommini-s1": "/generated/boommini-s1.png",
    "boombox-s2": "/generated/boombox-s2.png",
    "partyblast-s3": "/generated/partyblast-s3.png",
    "megaboom-s4": "/generated/megaboom-s4.png",
    "pulsetower-t1": "/generated/pulsetower-t1.png",
    "echocube-t2": "/generated/echocube-t2.png",
    "sonicbar-sb1": "/generated/sonicbar-sb1.png",
    "gamepulse-g1": "/generated/gamepulse-g1.png",
    "gamex-pro-g2": "/generated/gamex-pro-g2.png",
    "audiolink-a1": "/generated/audiolink-a1.png",
    "sounddock-d1": "/generated/sounddock-d1.png",
    "basstube-bt1": "/generated/basstube-bt1.png",
  }
} as const;

export type ImageKey = keyof typeof IMAGES.products;
