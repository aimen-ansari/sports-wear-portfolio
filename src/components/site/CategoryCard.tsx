import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import type { Category } from "@/data/catalog";

export function CategoryCard({ category }: { category: Category }) {
  return (
    <Link
      to="/products"
      search={{
        category: category.slug,
        q: undefined,
        type: undefined,
        color: undefined,
        material: undefined,
      }}
      className="group block overflow-hidden border border-border bg-card transition-shadow duration-300 hover:shadow-[var(--shadow-card)]"
    >
      <div className="overflow-hidden bg-surface">
        <img
          src={category.image}
          alt={`${category.name} manufactured by RION SPORTS`}
          width={1000}
          height={1250}
          loading="lazy"
          className="aspect-[4/3] w-full object-cover transition-transform duration-700 group-hover:scale-[1.05]"
        />
      </div>
      <div className="flex items-start justify-between gap-3 p-5">
        <div className="min-w-0">
          <h3 className="truncate text-[15px] font-semibold">{category.name}</h3>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{category.blurb}</p>
        </div>
        <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-muted-foreground transition-all duration-300 group-hover:translate-x-1 group-hover:text-accent" />
      </div>
    </Link>
  );
}
