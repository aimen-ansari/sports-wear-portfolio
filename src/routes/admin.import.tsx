import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, Download, ExternalLink, Info, RefreshCw } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { AdminPageHeader } from "@/components/admin/AdminLayout";
import { LoadingRows, Toast, type Notice } from "@/components/admin/AdminUi";
import {
  INSTAGRAM_IMPORT_SOURCE,
  instagramImagePath,
  instagramImportCategories,
  instagramImportProducts,
  type InstagramImportProduct,
} from "@/data/instagram-import";
import { getStoragePath, getSupabase } from "@/lib/supabase";

export const Route = createFileRoute("/admin/import")({
  head: () => ({
    meta: [
      { title: "Import Catalog | RION APPARELS Admin" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ImportAdmin,
});

type ImportSummary = {
  categoriesCreated: number;
  productsCreated: number;
  productsSkipped: number;
  imagesUploaded: number;
  warnings: string[];
};

const titleFromSlug = (slug: string) =>
  slug
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

function ImportAdmin() {
  const [selected, setSelected] = useState<Set<string>>(
    () => new Set(instagramImportProducts.map((product) => product.code)),
  );
  const [existingCategorySlugs, setExistingCategorySlugs] = useState<Set<string>>(new Set());
  const [existingProductKeys, setExistingProductKeys] = useState<Set<string>>(new Set());
  const [loadingExisting, setLoadingExisting] = useState(true);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<Notice>(null);
  const [summary, setSummary] = useState<ImportSummary>();

  const loadExisting = async () => {
    setLoadingExisting(true);
    const supabase = getSupabase();
    const [categoryResult, productResult] = await Promise.all([
      supabase.from("categories").select("slug"),
      supabase.from("products").select("slug,sku"),
    ]);
    setExistingCategorySlugs(new Set((categoryResult.data ?? []).map((row) => row.slug)));
    const keys = new Set<string>();
    for (const row of productResult.data ?? []) {
      keys.add(`slug:${row.slug}`);
      keys.add(`sku:${row.sku}`);
    }
    setExistingProductKeys(keys);
    setLoadingExisting(false);
  };
  useEffect(() => {
    void loadExisting();
  }, []);

  const groups = useMemo(() => {
    const order = instagramImportCategories.map((category) => category.slug);
    const rank = (slug: string) => {
      const index = order.indexOf(slug);
      return index === -1 ? order.length + 1 : index;
    };
    const map = new Map<string, InstagramImportProduct[]>();
    for (const product of instagramImportProducts) {
      const list = map.get(product.categorySlug) ?? [];
      list.push(product);
      map.set(product.categorySlug, list);
    }
    return [...map.entries()].sort((left, right) => rank(left[0]) - rank(right[0]));
  }, []);

  const isImported = (product: InstagramImportProduct) =>
    existingProductKeys.has(`slug:${product.slug}`) ||
    existingProductKeys.has(`sku:${product.sku}`);

  const importableCount = instagramImportProducts.filter((product) => !isImported(product)).length;
  const selectedCount = instagramImportProducts.filter((product) =>
    selected.has(product.code),
  ).length;
  const allSelected = selected.size === instagramImportProducts.length;

  const toggle = (code: string) =>
    setSelected((current) => {
      const next = new Set(current);
      if (next.has(code)) next.delete(code);
      else next.add(code);
      return next;
    });
  const toggleAll = () =>
    setSelected(allSelected ? new Set() : new Set(instagramImportProducts.map((p) => p.code)));

  const run = async () => {
    if (busy) return;
    const chosen = instagramImportProducts.filter((product) => selected.has(product.code));
    if (!chosen.length) {
      setNotice({ type: "error", message: "Select at least one product to import." });
      return;
    }
    setBusy(true);
    setNotice(null);
    setSummary(undefined);
    const supabase = getSupabase();
    const warnings: string[] = [];
    let categoriesCreated = 0;
    let productsCreated = 0;
    let productsSkipped = 0;
    let imagesUploaded = 0;
    try {
      const { data: existingCategories, error: categoryError } = await supabase
        .from("categories")
        .select("*");
      if (categoryError) throw categoryError;
      const categoryBySlug = new Map((existingCategories ?? []).map((row) => [row.slug, row]));

      for (const slug of new Set(chosen.map((product) => product.categorySlug))) {
        if (categoryBySlug.has(slug)) continue;
        const meta = instagramImportCategories.find((category) => category.slug === slug);
        const { data, error } = await supabase
          .from("categories")
          .insert({
            id: crypto.randomUUID(),
            name: meta?.name ?? titleFromSlug(slug),
            slug,
            description: meta?.description ?? "",
            image_url: null,
            display_order: meta?.displayOrder ?? 999,
            is_active: true,
          })
          .select("*")
          .single();
        if (error) {
          warnings.push(`Category "${titleFromSlug(slug)}" could not be created: ${error.message}`);
          continue;
        }
        categoryBySlug.set(slug, data);
        categoriesCreated += 1;
      }

      const { data: existingProducts, error: productError } = await supabase
        .from("products")
        .select("slug,sku");
      if (productError) throw productError;
      const slugs = new Set((existingProducts ?? []).map((row) => row.slug));
      const skus = new Set((existingProducts ?? []).map((row) => row.sku));

      for (const product of chosen) {
        const category = categoryBySlug.get(product.categorySlug);
        if (!category) {
          warnings.push(`Skipped "${product.name}": its category could not be resolved.`);
          continue;
        }
        if (slugs.has(product.slug) || skus.has(product.sku)) {
          productsSkipped += 1;
          continue;
        }
        const id = crypto.randomUUID();
        const imageUrls: string[] = [];
        try {
          const response = await fetch(instagramImagePath(product.code));
          if (!response.ok) throw new Error(`image request failed (${response.status})`);
          const blob = await response.blob();
          const path = `${id}/${crypto.randomUUID()}.jpg`;
          const { error: uploadError } = await supabase.storage
            .from("product-images")
            .upload(path, blob, { contentType: blob.type || "image/jpeg" });
          if (uploadError) throw uploadError;
          imageUrls.push(supabase.storage.from("product-images").getPublicUrl(path).data.publicUrl);
          imagesUploaded += 1;
        } catch (caught) {
          warnings.push(
            `"${product.name}" was imported without its image (${
              caught instanceof Error ? caught.message : "unknown error"
            }).`,
          );
        }
        const { error: insertError } = await supabase.from("products").insert({
          id,
          category_id: category.id,
          name: product.name,
          slug: product.slug,
          sku: product.sku,
          short_description: product.shortDescription,
          description: product.description,
          material: product.material,
          available_sizes: product.sizes,
          available_colors: product.colors,
          features: product.features,
          customization_options: product.customization,
          image_urls: imageUrls,
          is_featured: product.isFeatured,
          is_active: true,
        });
        if (insertError) {
          if (imageUrls[0]) {
            const path = getStoragePath(imageUrls[0], "product-images");
            if (path) await supabase.storage.from("product-images").remove([path]);
          }
          warnings.push(`"${product.name}" could not be created: ${insertError.message}`);
          continue;
        }
        slugs.add(product.slug);
        skus.add(product.sku);
        productsCreated += 1;
      }

      setSummary({
        categoriesCreated,
        productsCreated,
        productsSkipped,
        imagesUploaded,
        warnings,
      });
      setNotice(
        warnings.length
          ? {
              type: "error",
              message: `Imported ${productsCreated} product${
                productsCreated === 1 ? "" : "s"
              } with ${warnings.length} warning${warnings.length === 1 ? "" : "s"}.`,
            }
          : {
              type: "success",
              message: `Imported ${productsCreated} product${
                productsCreated === 1 ? "" : "s"
              } into the catalog.`,
            },
      );
      await loadExisting();
    } catch (caught) {
      setNotice({
        type: "error",
        message: caught instanceof Error ? caught.message : "The import could not be completed.",
      });
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <AdminPageHeader
        eyebrow="Catalog"
        title="Import from Instagram"
        action={
          <button
            type="button"
            onClick={run}
            disabled={busy || selectedCount === 0}
            className="btn-base btn-accent"
          >
            {busy ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <Download className="h-4 w-4" />
            )}
            {busy
              ? "Importing..."
              : `Import ${selectedCount} product${selectedCount === 1 ? "" : "s"}`}
          </button>
        }
      />
      <div className="mb-6 flex flex-wrap items-start gap-3 border border-border bg-card p-4 text-sm text-muted-foreground">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
        <p className="max-w-3xl">
          This imports the {instagramImportProducts.length} catalog posts captured from{" "}
          <a
            href={INSTAGRAM_IMPORT_SOURCE}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-foreground underline"
          >
            @rion_apparel on Instagram <ExternalLink className="h-3 w-3" />
          </a>
          . New categories are created automatically, matching categories and products are reused or
          skipped, and each image is uploaded to Supabase Storage. You can edit any imported product
          afterwards under{" "}
          <Link to="/admin/products" className="text-foreground underline">
            Products
          </Link>
          .
        </p>
      </div>
      {loadingExisting ? (
        <LoadingRows />
      ) : (
        <>
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
            <p className="text-sm text-muted-foreground">
              <span className="text-foreground">{importableCount}</span> of{" "}
              {instagramImportProducts.length} products are not in the catalog yet.
            </p>
            <button type="button" onClick={toggleAll} className="btn-base btn-outline py-2">
              {allSelected ? "Deselect all" : "Select all"}
            </button>
          </div>
          <div className="space-y-8">
            {groups.map(([slug, products]) => (
              <section key={slug}>
                <div className="mb-3 flex items-center gap-3">
                  <h2 className="text-lg">{titleFromSlug(slug)}</h2>
                  <span
                    className={`px-2 py-1 text-xs font-medium ${
                      existingCategorySlugs.has(slug)
                        ? "bg-muted text-muted-foreground"
                        : "bg-accent/15 text-accent"
                    }`}
                  >
                    {existingCategorySlugs.has(slug) ? "Existing category" : "New category"}
                  </span>
                </div>
                <div className="divide-y divide-border border border-border bg-card">
                  {products.map((product) => {
                    const imported = isImported(product);
                    return (
                      <label
                        key={product.code}
                        className="flex cursor-pointer items-center gap-4 p-4"
                      >
                        <input
                          type="checkbox"
                          checked={selected.has(product.code)}
                          onChange={() => toggle(product.code)}
                          className="h-4 w-4 accent-[var(--color-accent)]"
                        />
                        <img
                          src={instagramImagePath(product.code)}
                          alt=""
                          className="h-16 w-14 shrink-0 border border-border object-cover"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-medium">{product.name}</p>
                          <p className="mt-1 font-mono text-xs text-muted-foreground">
                            {product.sku} · /{product.slug}
                          </p>
                        </div>
                        {imported && (
                          <span className="flex shrink-0 items-center gap-1.5 text-xs font-medium text-muted-foreground">
                            <CheckCircle2 className="h-4 w-4 text-accent" /> In catalog
                          </span>
                        )}
                      </label>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>
        </>
      )}
      {summary && (
        <div className="mt-8 border border-border bg-card p-5 text-sm">
          <h2 className="text-base">Import summary</h2>
          <ul className="mt-3 space-y-1 text-muted-foreground">
            <li>{summary.categoriesCreated} categories created</li>
            <li>{summary.productsCreated} products created</li>
            <li>{summary.productsSkipped} products skipped (already present)</li>
            <li>{summary.imagesUploaded} images uploaded</li>
          </ul>
          {summary.warnings.length > 0 && (
            <ul className="mt-4 space-y-2 border border-destructive/30 bg-destructive/5 p-3 text-destructive">
              {summary.warnings.map((warning) => (
                <li key={warning}>{warning}</li>
              ))}
            </ul>
          )}
        </div>
      )}
      <Toast notice={notice} onClose={() => setNotice(null)} />
    </>
  );
}
