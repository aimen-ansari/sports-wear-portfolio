import { describe, expect, it } from "vitest";
import { products } from "@/data/catalog";
import { filterProducts } from "./product-filters";

describe("filterProducts", () => {
  it("returns all products without filters", () => {
    expect(filterProducts(products, {})).toHaveLength(products.length);
  });

  it("filters by category and color", () => {
    const result = filterProducts(products, {
      category: "hi-visibility",
      color: "Hi-Vis Yellow / Navy",
    });
    expect(result.length).toBeGreaterThan(0);
    expect(result.every((product) => product.categorySlug === "hi-visibility")).toBe(true);
  });

  it("searches product names and SKU values case-insensitively", () => {
    expect(filterProducts(products, { q: "rs-wj-1001" }).map((product) => product.sku)).toEqual([
      "RS-WJ-1001",
    ]);
  });
});
