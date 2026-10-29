import type { Metadata } from "next";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ShopCatalog } from "@/components/shop/catalog";
import {
  CATEGORIES,
  type CategoryKey,
  type RoastProfile,
} from "@/data/products";
import { fetchProducts } from "@/sanity/lib/fetchers";

export const metadata: Metadata = {
  title: "Каталог — BATCH Coffee",
  description: "Уся наша свіжообсмажена кава — еспресо, фільтр, капсули.",
};

// ISR fallback — webhook handles instant updates; this is the safety net.
export const revalidate = 60;

/** Whitelist of valid category slugs — used to reject unknown `?category=`
 *  values (e.g. "grinders" from the homepage tiles that don't have a real
 *  category yet). Keeps the deep-link defensive. */
const VALID_CATEGORIES = new Set<CategoryKey>(CATEGORIES.map((c) => c.key));

function parseCategoryParam(raw: string | string[] | undefined): CategoryKey[] {
  if (!raw) return [];
  const values = Array.isArray(raw) ? raw : raw.split(",");
  return values.filter((v): v is CategoryKey =>
    VALID_CATEGORIES.has(v as CategoryKey),
  );
}

interface PageProps {
  searchParams: Promise<{
    category?: string | string[];
    roast?: string | string[];
  }>;
}

export default async function ShopPage({ searchParams }: PageProps) {
  const { category, roast } = await searchParams;
  const products = await fetchProducts();
  const initialCategories = parseCategoryParam(category);

  // Roast profiles are free text on products — accept only `?roast=` values
  // that actually exist in the catalog. Drives the "Кава в зернах" nav
  // submenu (Еспресо / Фільтр).
  const validRoasts = new Set<RoastProfile>(
    products.flatMap((p) => p.roasts ?? []),
  );
  const rawRoasts = roast
    ? Array.isArray(roast)
      ? roast
      : roast.split(",")
    : [];
  const initialRoasts = rawRoasts
    .map((r) => r.trim())
    .filter((r): r is RoastProfile => validRoasts.has(r as RoastProfile));

  // Key the catalog by the URL filter state. Next App Router does a soft
  // re-render on /shop → /shop?category=drip (or ?roast=Еспресо): ShopCatalog
  // gets new props, but its `useState` lazy init only runs on mount, so
  // without a key the seeded filters would never refresh. The key forces a
  // clean remount that picks up the new URL state.
  const catalogKey =
    [
      initialCategories.slice().sort().join(","),
      initialRoasts.slice().sort().join(","),
    ]
      .filter(Boolean)
      .join("|") || "all";

  return (
    <>
      <Header />
      <main className="flex-1">
        <ShopCatalog
          key={catalogKey}
          products={products}
          initialCategories={initialCategories}
          initialRoasts={initialRoasts}
        />
      </main>
      <Footer />
    </>
  );
}
