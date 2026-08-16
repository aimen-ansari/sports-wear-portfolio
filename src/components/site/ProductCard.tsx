import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { ImageIcon } from "lucide-react";
import type { ProductWithCategory } from "@/lib/database.types";

export function ProductCard({
  product,
  showQuickView = false,
}: {
  product: ProductWithCategory;
  showQuickView?: boolean;
}) {
  return (
    <article className="card-surface group flex flex-col hover:-translate-y-0.5 hover:shadow-[var(--shadow-card)]">
      <Link
        to="/products/$sku"
        params={{ sku: product.sku }}
        className="relative block overflow-hidden bg-surface"
      >
        {product.image_urls[0] ? (
          <img
            src={product.image_urls[0]}
            alt={`${product.name} — ${product.categories?.name ?? "workwear"} by RION APPARELS`}
            width={1000}
            height={1250}
            loading="lazy"
            className="aspect-4/5 w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
          />
        ) : (
          <span className="flex aspect-4/5 w-full items-center justify-center bg-surface text-muted-foreground">
            <ImageIcon className="h-8 w-8" aria-hidden="true" />
            <span className="sr-only">No product image available</span>
          </span>
        )}
      </Link>
      <div className="flex flex-1 flex-col p-5">
        <p className="eyebrow">{product.categories?.name ?? "Workwear"}</p>
        <h3 className="mt-2 text-base leading-snug font-semibold">
          <Link to="/products/$sku" params={{ sku: product.sku }} className="hover:text-accent">
            {product.name}
          </Link>
        </h3>
        <p className="mt-1 font-mono text-xs text-muted-foreground">{product.sku}</p>

        <div className="mt-4 flex items-center gap-2">
          <span className="text-xs text-muted-foreground">
            {product.available_colors.length} colour
            {product.available_colors.length === 1 ? "" : "s"}
          </span>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-2 pt-1">
          <Link
            to="/products/$sku"
            params={{ sku: product.sku }}
            className="btn-base btn-outline flex-1 py-2.5"
          >
            {showQuickView ? "View Details" : "View Product"}
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
          {showQuickView && (
            <Link
              to="/products/$sku"
              params={{ sku: product.sku }}
              hash="specifications"
              className="btn-base btn-outline py-2.5"
            >
              Specifications
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}
