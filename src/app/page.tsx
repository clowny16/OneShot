// OneShot — single-page storefront.
// Server component: fetches all products from the DB and passes them to the
// client AppShell, which handles view routing (Home, Collection, Product,
// Cart, Checkout, About, Contact, FAQ, Shipping, Returns) on the / route.
import { db } from "@/lib/db";
import { toProductDTO } from "@/lib/dto";
import { AppShell } from "@/components/site/AppShell";

export const dynamic = "force-dynamic";

export default async function Page() {
  const products = await db.product.findMany({
    orderBy: { price: "asc" },
  });

  const productDTOs = products.map(toProductDTO);

  return <AppShell products={productDTOs} />;
}
