import { createFileRoute, Link } from "@tanstack/react-router";
import { useId, useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { categories, colorOptions, materialOptions, products, typeOptions } from "@/data/catalog";
import { ProductCard } from "@/components/site/ProductCard";
import { filterProducts, type ProductFilters } from "@/lib/product-filters";
import { canonicalLinks } from "@/lib/site";

export type ProductSearch = ProductFilters;

const validCategories = new Set(categories.map((category) => category.slug));
const validTypes = new Set(typeOptions);
const validColors = new Set(colorOptions);
const validMaterials = new Set(materialOptions);

function readOption(value: unknown, options: Set<string>): string | undefined {
  return typeof value === "string" && options.has(value) ? value : undefined;
}

export const Route = createFileRoute("/products/")({
  validateSearch: (search: Record<string, unknown>): ProductSearch => ({
    q: typeof search["q"] === "string" ? search["q"].slice(0, 80) : undefined,
    category: readOption(search["category"], validCategories),
    type: readOption(search["type"], validTypes),
    color: readOption(search["color"], validColors),
    material: readOption(search["material"], validMaterials),
  }),
  head: () => ({
    meta: [
      { title: "Workwear Product Catalog | RION SPORTS" },
      {
        name: "description",
        content:
          "Browse the RION SPORTS workwear catalog: work jackets, trousers, coveralls, bib overalls, hi-visibility wear, safety vests, softshells and work shirts for B2B buyers.",
      },
      { property: "og:title", content: "Workwear Product Catalog | RION SPORTS" },
      {
        property: "og:description",
        content:
          "Explore our full workwear and safety wear range. Request quotations for custom manufacturing, OEM/ODM and private label production.",
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
  const filtered = filterProducts(products, search);

  const update = (changes: Partial<ProductSearch>, replace = false) =>
    navigate({ search: (current: ProductSearch) => ({ ...current, ...changes }), replace });

  const reset = () => {
    navigate({
      search: {
        q: undefined,
        category: undefined,
        type: undefined,
        color: undefined,
        material: undefined,
      },
    });
  };

  return (
    <>
      <section className="border-b border-border bg-surface py-14 lg:py-20">
        <div className="container-page">
          <p className="eyebrow">Catalog</p>
          <h1 className="mt-3 max-w-2xl text-3xl leading-[1.1] md:text-[2.75rem]">
            Workwear, Safety Wear &amp; Industrial Clothing
          </h1>
          <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
            Every style below is a manufacturing programme. Fabrics, colours, sizing and branding
            are developed to your specification — request a quotation for MOQs and lead times.
          </p>
        </div>
      </section>

      <section className="py-12 lg:py-16">
        <div className="container-page grid gap-10 lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-14">
          {/* FILTERS */}
          <div>
            <div className="flex items-center justify-between gap-4 lg:hidden">
              <button
                type="button"
                onClick={() => setFiltersOpen((v) => !v)}
                aria-expanded={filtersOpen}
                aria-controls={filtersId}
                className="btn-base btn-outline"
              >
                <SlidersHorizontal className="h-3.5 w-3.5" />
                Filters
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

              <FilterGroup
                label="Category"
                value={search.category ?? "all"}
                onChange={(category) =>
                  update({ category: category === "all" ? undefined : category })
                }
                options={[
                  { value: "all", label: "All Categories" },
                  ...categories.map((c) => ({ value: c.slug, label: c.name })),
                ]}
              />
              <FilterGroup
                label="Workwear Type"
                value={search.type ?? "all"}
                onChange={(type) => update({ type: type === "all" ? undefined : type })}
                options={[
                  { value: "all", label: "All Types" },
                  ...typeOptions.map((t) => ({ value: t, label: t })),
                ]}
              />
              <FilterGroup
                label="Color"
                value={search.color ?? "all"}
                onChange={(color) => update({ color: color === "all" ? undefined : color })}
                options={[
                  { value: "all", label: "All Colors" },
                  ...colorOptions.map((c) => ({ value: c, label: c })),
                ]}
              />
              <FilterGroup
                label="Material"
                value={search.material ?? "all"}
                onChange={(material) =>
                  update({ material: material === "all" ? undefined : material })
                }
                options={[
                  { value: "all", label: "All Materials" },
                  ...materialOptions.map((m) => ({ value: m, label: m })),
                ]}
              />

              <button type="button" onClick={reset} className="btn-base btn-outline mt-8 w-full">
                <X className="h-3.5 w-3.5" />
                Clear Filters
              </button>
            </aside>
          </div>

          {/* GRID */}
          <div>
            <div className="mb-8 hidden items-center justify-between border-b border-border pb-4 lg:flex">
              <p className="text-sm text-muted-foreground" aria-live="polite">
                Showing <span className="text-foreground">{filtered.length}</span> of{" "}
                {products.length} styles
              </p>
              <Link to="/contact" className="btn-base btn-outline py-2.5">
                Request Catalog
              </Link>
            </div>

            {filtered.length === 0 ? (
              <div className="card-surface p-12 text-center">
                <h2 className="text-lg">No products match these filters</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Adjust your filters, or send us your specification and we will confirm whether we
                  can develop it.
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
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {filtered.map((p) => (
                  <ProductCard key={p.sku} product={p} showQuickView />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

function FilterGroup({
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
  const labelId = useId();
  return (
    <div className="mt-8 border-t border-border pt-6" role="group" aria-labelledby={labelId}>
      <p id={labelId} className="eyebrow">
        {label}
      </p>
      <div className="mt-3 flex flex-col items-start gap-1.5">
        {options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            aria-pressed={value === opt.value}
            className={`text-left text-sm transition-colors ${
              value === opt.value
                ? "font-medium text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {value === opt.value && <span className="mr-2 text-accent">—</span>}
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
