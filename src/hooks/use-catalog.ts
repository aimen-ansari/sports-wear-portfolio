import { useEffect, useState } from "react";
import { getActiveCategories, getActiveProducts } from "@/lib/catalog-api";
import type { CategoryRow, ProductWithCategory } from "@/lib/database.types";

type CatalogState = {
  categories: CategoryRow[];
  products: ProductWithCategory[];
  loading: boolean;
  error: string;
};

export function useCatalog(featuredOnly = false): CatalogState {
  const [state, setState] = useState<CatalogState>({
    categories: [],
    products: [],
    loading: true,
    error: "",
  });

  useEffect(() => {
    let active = true;
    Promise.all([getActiveCategories(), getActiveProducts(featuredOnly)])
      .then(([categories, products]) => {
        if (active) setState({ categories, products, loading: false, error: "" });
      })
      .catch((error: unknown) => {
        console.error(error);
        if (active) {
          setState({
            categories: [],
            products: [],
            loading: false,
            error: "The catalog is temporarily unavailable. Please try again later.",
          });
        }
      });
    return () => {
      active = false;
    };
  }, [featuredOnly]);

  return state;
}

export function useCategories(): Omit<CatalogState, "products"> {
  const [state, setState] = useState<Omit<CatalogState, "products">>({
    categories: [],
    loading: true,
    error: "",
  });
  useEffect(() => {
    let active = true;
    getActiveCategories()
      .then((categories) => {
        if (active) setState({ categories, loading: false, error: "" });
      })
      .catch((error: unknown) => {
        console.error(error);
        if (active) setState({ categories: [], loading: false, error: "Categories unavailable." });
      });
    return () => {
      active = false;
    };
  }, []);
  return state;
}
