"use client";
// AppShell — client root that wires the Zustand view store to the views.
// Receives server-fetched products and inits the store, then renders the
// active view inside a sticky-footer layout.
import { useEffect } from "react";
import { useStore } from "@/lib/store";
import type { ProductDTO } from "@/lib/types";
import { TopNavBar } from "@/components/site/TopNavBar";
import { Footer } from "@/components/site/Footer";
import { HomeView } from "@/components/views/HomeView";
import { CollectionView } from "@/components/views/CollectionView";
import { ProductView } from "@/components/views/ProductView";
import { CartView } from "@/components/views/CartView";
import { CheckoutView } from "@/components/views/CheckoutView";
import { AboutView } from "@/components/views/AboutView";
import { ContactView } from "@/components/views/ContactView";
import { FAQView } from "@/components/views/FAQView";
import { ShippingView } from "@/components/views/ShippingView";
import { ReturnsView } from "@/components/views/ReturnsView";

export function AppShell({ products }: { products: ProductDTO[] }) {
  const view = useStore((s) => s.view);
  const productSlug = useStore((s) => s.productSlug);
  const initProducts = useStore((s) => s.initProducts);
  const loadCart = useStore((s) => s.loadCart);

  useEffect(() => {
    initProducts(products);
  }, [products, initProducts]);

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  // Scroll to top whenever the view changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [view, productSlug]);

  return (
    <div className="flex min-h-screen flex-col bg-canvas-white">
      <TopNavBar />
      <main className="flex-1">{renderView(view, productSlug)}</main>
      <Footer />
    </div>
  );
}

function renderView(view: string, productSlug: string | null) {
  switch (view) {
    case "home":
      return <HomeView />;
    case "collection":
      return <CollectionView />;
    case "product":
      return productSlug ? <ProductView slug={productSlug} /> : <HomeView />;
    case "cart":
      return <CartView />;
    case "checkout":
      return <CheckoutView />;
    case "about":
      return <AboutView />;
    case "contact":
      return <ContactView />;
    case "faq":
      return <FAQView />;
    case "shipping":
      return <ShippingView />;
    case "returns":
      return <ReturnsView />;
    default:
      return <HomeView />;
  }
}
