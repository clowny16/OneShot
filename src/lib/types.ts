// Shared type for a product as exposed to the frontend.
export type ProductDTO = {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  title: string;
  price: number; // rupees
  compareAt: number | null;
  productType: string;
  category: string;
  colorName: string;
  colorHex: string;
  imageKey: string;
  badge: string | null;
  bullets: string[];
  description: string;
  features: string[];
  specs: { label: string; value: string }[];
  rating: number;
  reviewCount: number;
  inStock: boolean;
};

export type CartLineDTO = {
  id: string;
  productId: string;
  slug: string;
  name: string;
  price: number; // rupees
  colorHex: string;
  colorName: string;
  imageKey: string;
  quantity: number;
  lineTotal: number; // rupees
};

export type CartDTO = {
  sessionId: string;
  items: CartLineDTO[];
  itemCount: number;
  subtotal: number; // rupees
};

export type ViewName =
  | "home"
  | "collection"
  | "product"
  | "cart"
  | "checkout"
  | "about"
  | "contact"
  | "faq"
  | "shipping"
  | "returns";

export function formatINR(paise: number): string {
  const rupees = paise / 100;
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(rupees);
}

export function formatINRFromRupees(rupees: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(rupees);
}
