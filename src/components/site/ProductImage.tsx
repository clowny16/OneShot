"use client";
// ProductImage — renders an earbuds product image by its image key.
// Uses a soft neutral background and subtle inner shadow for an editorial feel.
import { IMAGES } from "@/lib/images";
import { cn } from "@/lib/utils";

export function ProductImage({
  imageKey,
  alt,
  className,
  imgClassName,
}: {
  imageKey: keyof typeof IMAGES.products;
  alt: string;
  className?: string;
  imgClassName?: string;
}) {
  const src = IMAGES.products[imageKey];
  return (
    <div
      className={cn(
        "relative overflow-hidden bg-surface-container-low",
        className,
      )}
    >
      <img
        src={src}
        alt={alt}
        loading="lazy"
        className={cn(
          "h-full w-full object-cover transition-transform duration-700 group-hover:scale-105",
          imgClassName,
        )}
      />
    </div>
  );
}
