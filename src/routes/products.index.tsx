import { createFileRoute, Link } from "@tanstack/react-router";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { useId, useState } from "react";
import { CatalogMessage, CatalogSkeleton } from "@/components/site/CatalogStates";
import { ProductCard } from "@/components/site/ProductCard";
import { useCatalog } from "@/hooks/use-catalog";
import { canonicalLinks } from "@/lib/site";

export type ProductSearch = {
  q?: string | undefined;
  category?: string | undefined;
  color?: string | undefined;
  material?: string | undefined;
};

const readSearch = (value: unknown, max = 80) =>
  typeof value === "string" ? value.slice(0, max) : undefined;

export const Route = createFileRoute("/products/")({
  validateSearch: (search: Record<string, unknown>): ProductSearch => ({
    q: readSearch(search["q"]),
    category: readSearch(search["category"]),
    color: readSearch(search["color"]),
    material: readSearch(search["material"]),
  }),
  head: () => ({
    meta: [
      { title: "Workwear Product Catalog | RION SPORTS" },
      {
        name: "description",
        content: "Browse active RION SPORTS workwear and safety wear programmes for B2B buyers.",
      },
    ],
    links: canonicalLinks("/products"),
  }),
  component: ProductsPage,
});

function ProductsPage() {
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  const filtersId = useId();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const { categories, products, loading, error } = useCatalog();
  const colors = Array.from(
    new Set(products.flatMap((product) => product.available_colors)),
  ).sort();
  const materials = Array.from(
    new Set(products.map((product) => product.material).filter(Boolean)),
  ).sort();
  const query = search.q?.trim().toLowerCase() ?? "";
  const filtered = products.filter((product) => {
    const categoryMatch = !search.category || product.categories?.slug === search.category;
    const colorMatch = !search.color || product.available_colors.includes(search.color);
    const materialMatch = !search.material || product.material === search.material;
    const queryMatch =
      !query ||
      [product.name, product.sku, product.short_description, product.categories?.name ?? ""]
        .join(" ")
        .toLowerCase()
        .includes(query);
    return categoryMatch && colorMatch && materialMatch && queryMatch;
  });
  const update = (changes: Partial<ProductSearch>, replace = false) =>
    navigate({ search: (current: ProductSearch) => ({ ...current, ...changes }), replace });
  const reset = () =>
    navigate({
      search: {
        q: undefined,
        category: undefined,
        color: undefined,
        material: undefined,
      },
    });

  return (
    <>
      <section className="border-b border-border bg-surface py-14 lg:py-20">
        <div className="container-page">
          <p className="eyebrow">Catalog</p>
          <h1 className="mt-3 max-w-2xl text-3xl leading-[1.1] md:text-[2.75rem]">
            Workwear, Safety Wear &amp; Industrial Clothing
          </h1>
          <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
            Fabrics, colours, sizing and branding are developed to your specification. Request a
            quotation for MOQs and lead times.
          </p>
        </div>
      </section>
      <section className="py-12 lg:py-16">
        <div className="container-page grid gap-10 lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-14">
          <div>
            <div className="flex items-center justify-between gap-4 lg:hidden">
              <button
                type="button"
                onClick={() => setFiltersOpen((value) => !value)}
                aria-expanded={filtersOpen}
                aria-controls={filtersId}
                className="btn-base btn-outline"
              >
                <SlidersHorizontal className="h-3.5 w-3.5" /> Filters
              </button>
              <span className="text-sm text-muted-foreground" aria-live="polite">
                {filtered.length} products
              </span>
            </div>
            <aside
              id={filtersId}
              aria-label="Product filters"
              className={`${filtersOpen ? "mt-6 block" : "hidden"} lg:mt-0 lg:block`}
            >
              <div className="relative">
                <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <label htmlFor={`${filtersId}-search`} className="sr-only">
                  Search products or SKU
                </label>
                <input
                  id={`${filtersId}-search`}
                  type="search"
                  value={search.q ?? ""}
                  onChange={(event) => update({ q: event.target.value || undefined }, true)}
                  placeholder="Search products or SKU"
                  className="field-base pl-9"
                  maxLength={80}
                />
              </div>
              <FilterSelect
                label="Category"
                value={search.category ?? ""}
                onChange={(value) => update({ category: value || undefined })}
                options={categories.map((category) => ({
                  value: category.slug,
                  label: category.name,
                }))}
              />
              <FilterSelect
                label="Color"
                value={search.color ?? ""}
                onChange={(value) => update({ color: value || undefined })}
                options={colors.map((value) => ({ value, label: value }))}
              />
              <FilterSelect
                label="Material"
                value={search.material ?? ""}
                onChange={(value) => update({ material: value || undefined })}
                options={materials.map((value) => ({ value, label: value }))}
              />
              <button type="button" onClick={reset} className="btn-base btn-outline mt-8 w-full">
                <X className="h-3.5 w-3.5" /> Clear Filters
              </button>
            </aside>
          </div>
          <div>
            <div className="mb-8 hidden items-center justify-between border-b border-border pb-4 lg:flex">
              <p className="text-sm text-muted-foreground">
                Showing <span className="text-foreground">{filtered.length}</span> of{" "}
                {products.length} styles
              </p>
              <Link to="/contact" className="btn-base btn-outline py-2.5">
                Request Catalog
              </Link>
            </div>
            {loading ? (
              <CatalogSkeleton count={6} />
            ) : error ? (
              <CatalogMessage type="error" message={error} />
            ) : filtered.length ? (
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {filtered.map((product) => (
                  <ProductCard key={product.id} product={product} showQuickView />
                ))}
              </div>
            ) : (
              <div className="card-surface p-12 text-center">
                <h2 className="text-lg">No products match these filters</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Adjust your filters or send us your specification.
                </p>
                <div className="mt-6 flex flex-wrap justify-center gap-3">
                  <button type="button" onClick={reset} className="btn-base btn-outline">
                    Clear Filters
                  </button>
                  <Link to="/contact" className="btn-base btn-primary">
                    Send a Requirement
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}) {
  const id = useId();
  return (
    <div className="mt-8 border-t border-border pt-6">
      <label htmlFor={id} className="eyebrow block">
        {label}
      </label>
      <select
        id={id}
        className="field-base mt-3"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        <option value="">All {label === "Category" ? "Categories" : label + "s"}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
