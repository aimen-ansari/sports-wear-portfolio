import type { Product } from "@/data/catalog";

export type ProductFilters = {
  q?: string | undefined;
  category?: string | undefined;
  type?: string | undefined;
  color?: string | undefined;
  material?: string | undefined;
};

export function filterProducts(products: Product[], filters: ProductFilters): Product[] {
  const term = filters.q?.trim().toLowerCase() ?? "";
  return products.filter((product) => {
    if (filters.category && product.categorySlug !== filters.category) return false;
    if (filters.type && product.type !== filters.type) return false;
    if (filters.color && !product.colors.some((color) => color.name === filters.color))
      return false;
    if (
      filters.material &&
      !product.materials.some((material) =>
        material.toLowerCase().includes(filters.material!.toLowerCase()),
      )
    ) {
      return false;
    }
    if (!term) return true;
    return [
      product.name,
      product.sku,
      product.category,
      product.type,
      product.material,
      product.shortDescription,
    ]
      .join(" ")
      .toLowerCase()
      .includes(term);
  });
}
