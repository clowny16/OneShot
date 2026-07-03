"use client";
// WishlistButton — heart toggle that saves a product slug to the wishlist.
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export function WishlistButton({
  slug,
  className,
  size = 20,
}: {
  slug: string;
  className?: string;
  size?: number;
}) {
  const wishlisted = useStore((s) => s.wishlist.includes(slug));
  const toggle = useStore((s) => s.toggleWishlist);

  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
        toggle(slug);
      }}
      aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
      aria-pressed={wishlisted}
      className={cn(
        "flex items-center justify-center transition-all active:scale-90",
        className,
      )}
    >
      <span
        className={cn(
          "material-symbols-outlined",
          wishlisted && "filled",
        )}
        style={{
          fontSize: size,
          fontVariationSettings: wishlisted
            ? "'FILL' 1, 'wght' 500"
            : "'FILL' 0, 'wght' 300",
          color: wishlisted ? "#ba1a1a" : "currentColor",
        }}
      >
        {wishlisted ? "favorite" : "favorite_border"}
      </span>
    </button>
  );
}
