import type { CategoryRow, ProductWithCategory } from "./database.types";
import { getSupabase } from "./supabase";

export async function getActiveCategories(): Promise<CategoryRow[]> {
  const { data, error } = await getSupabase()
    .from("categories")
    .select("*")
    .eq("is_active", true)
    .order("display_order")
    .order("name");
  if (error) throw error;
  return data;
}

export async function getActiveProducts(featuredOnly = false): Promise<ProductWithCategory[]> {
  let query = getSupabase()
    .from("products")
    .select("*, categories(id,name,slug,is_active)")
    .eq("is_active", true)
    .order("created_at", { ascending: false });
  if (featuredOnly) query = query.eq("is_featured", true);
  const { data, error } = await query;
  if (error) throw error;
  return (data as unknown as ProductWithCategory[]).filter(
    (product) => product.categories?.is_active,
  );
}

export async function getActiveProduct(sku: string): Promise<ProductWithCategory | undefined> {
  const { data, error } = await getSupabase()
    .from("products")
    .select("*, categories(id,name,slug,is_active)")
    .eq("sku", sku)
    .eq("is_active", true)
    .maybeSingle();
  if (error) throw error;
  const product = data as ProductWithCategory | null;
  return product?.categories?.is_active ? product : undefined;
}
