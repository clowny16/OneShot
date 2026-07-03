// Server-side DTO mapping for Prisma Product rows.
import type { Product } from "@prisma/client";
import type { ProductDTO } from "@/lib/types";

export function toProductDTO(p: Product): ProductDTO {
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    tagline: p.tagline,
    title: p.title,
    price: p.price / 100,
    compareAt: p.compareAt ? p.compareAt / 100 : null,
    category: p.category,
    colorName: p.colorName,
    colorHex: p.colorHex,
    imageKey: p.imageKey,
    badge: p.badge,
    bullets: p.bullets.split("\n").filter(Boolean),
    description: p.description,
    features: p.features.split("\n").filter(Boolean),
    specs: p.specs
      .split("\n")
      .filter(Boolean)
      .map((line) => {
        const [label, ...rest] = line.split(":");
        return { label: label.trim(), value: rest.join(":").trim() };
      }),
    rating: p.rating,
    reviewCount: p.reviewCount,
    inStock: p.inStock,
  };
}
