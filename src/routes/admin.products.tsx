import { createFileRoute } from "@tanstack/react-router";
import { Edit3, ImagePlus, Plus, Search, Star, Trash2, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { AdminPageHeader } from "@/components/admin/AdminLayout";
import {
  AdminEmpty,
  ConfirmDialog,
  LoadingRows,
  Toast,
  type Notice,
} from "@/components/admin/AdminUi";
import type { CategoryRow, ProductWithCategory } from "@/lib/database.types";
import { getStoragePath, getSupabase } from "@/lib/supabase";

export const Route = createFileRoute("/admin/products")({
  head: () => ({
    meta: [{ title: "Products | RION SPORTS Admin" }, { name: "robots", content: "noindex" }],
  }),
  component: ProductsAdmin,
});

type Draft = {
  name: string;
  sku: string;
  slug: string;
  category_id: string;
  short_description: string;
  description: string;
  material: string;
  sizes: string;
  colors: string;
  features: string;
  customization: string;
  image_urls: string[];
  is_featured: boolean;
  is_active: boolean;
};
const blankDraft = (categoryId = ""): Draft => ({
  name: "",
  sku: "",
  slug: "",
  category_id: categoryId,
  short_description: "",
  description: "",
  material: "",
  sizes: "",
  colors: "",
  features: "",
  customization: "",
  image_urls: [],
  is_featured: false,
  is_active: true,
});
const splitList = (value: string) =>
  value
    .split(/[,\n]/)
    .map((item) => item.trim())
    .filter(Boolean);
const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

function ProductsAdmin() {
  const [products, setProducts] = useState<ProductWithCategory[]>([]);
  const [categories, setCategories] = useState<CategoryRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [page, setPage] = useState(1);
  const [editing, setEditing] = useState<ProductWithCategory | null | undefined>(undefined);
  const [deleting, setDeleting] = useState<ProductWithCategory>();
  const [notice, setNotice] = useState<Notice>(null);

  const load = async () => {
    setLoading(true);
    const supabase = getSupabase();
    const [productResult, categoryResult] = await Promise.all([
      supabase
        .from("products")
        .select("*, categories(id,name,slug,is_active)")
        .order("created_at", { ascending: false }),
      supabase.from("categories").select("*").order("display_order").order("name"),
    ]);
    setLoading(false);
    if (productResult.error || categoryResult.error) {
      setNotice({
        type: "error",
        message:
          productResult.error?.message ??
          categoryResult.error?.message ??
          "Products could not be loaded.",
      });
      return;
    }
    setProducts(productResult.data as unknown as ProductWithCategory[]);
    setCategories(categoryResult.data ?? []);
  };
  useEffect(() => {
    void load();
  }, []);
  const filtered = useMemo(
    () =>
      products.filter(
        (product) =>
          (!categoryFilter || product.category_id === categoryFilter) &&
          (!query || `${product.name} ${product.sku}`.toLowerCase().includes(query.toLowerCase())),
      ),
    [categoryFilter, products, query],
  );
  const pageCount = Math.max(1, Math.ceil(filtered.length / 10));
  const visible = filtered.slice((page - 1) * 10, page * 10);
  useEffect(() => {
    setPage(1);
  }, [categoryFilter, query]);
  useEffect(() => {
    setPage((current) => Math.min(current, pageCount));
  }, [pageCount]);

  const toggle = async (product: ProductWithCategory, field: "is_active" | "is_featured") => {
    const update =
      field === "is_active"
        ? { is_active: !product.is_active }
        : { is_featured: !product.is_featured };
    const { error } = await getSupabase().from("products").update(update).eq("id", product.id);
    if (error) setNotice({ type: "error", message: error.message });
    else {
      setProducts((items) =>
        items.map((item) => (item.id === product.id ? { ...item, [field]: !item[field] } : item)),
      );
      setNotice({ type: "success", message: "Product updated." });
    }
  };
  const remove = async () => {
    if (!deleting) return;
    const product = deleting;
    setDeleting(undefined);
    const supabase = getSupabase();
    const { error } = await supabase.from("products").delete().eq("id", product.id);
    if (error) {
      setNotice({ type: "error", message: error.message });
      return;
    }
    const paths = product.image_urls
      .map((url) => getStoragePath(url, "product-images"))
      .filter((path): path is string => Boolean(path));
    const storageResult = paths.length
      ? await supabase.storage.from("product-images").remove(paths)
      : undefined;
    setProducts((items) => items.filter((item) => item.id !== product.id));
    setNotice({
      type: storageResult?.error ? "error" : "success",
      message: storageResult?.error
        ? `Product deleted, but image cleanup failed: ${storageResult.error.message}`
        : "Product and its images were deleted.",
    });
  };

  return (
    <>
      <AdminPageHeader
        eyebrow="Catalog"
        title="Products"
        action={
          <button
            type="button"
            onClick={() => setEditing(null)}
            disabled={!categories.length}
            className="btn-base btn-accent"
          >
            <Plus className="h-4 w-4" /> Add Product
          </button>
        }
      />
      <div className="mb-6 grid gap-3 sm:grid-cols-2">
        <label className="relative">
          <span className="sr-only">Search products</span>
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="field-base pl-10"
            placeholder="Search by product name or SKU"
          />
        </label>
        <label>
          <span className="sr-only">Filter by category</span>
          <select
            value={categoryFilter}
            onChange={(event) => setCategoryFilter(event.target.value)}
            className="field-base"
          >
            <option value="">All categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </label>
      </div>
      {loading ? (
        <LoadingRows />
      ) : !categories.length ? (
        <AdminEmpty
          title="Create a category first"
          message="Products must be assigned to a category."
        />
      ) : !visible.length ? (
        <AdminEmpty
          title="No products found"
          message={
            query || categoryFilter
              ? "Change the search or category filter."
              : "Add your first RION SPORTS product."
          }
          action={
            !query && !categoryFilter ? (
              <button
                type="button"
                onClick={() => setEditing(null)}
                className="btn-base btn-accent"
              >
                Add Product
              </button>
            ) : undefined
          }
        />
      ) : (
        <div className="overflow-x-auto border border-border bg-card">
          <table className="w-full min-w-[850px] text-left text-sm">
            <thead className="border-b border-border bg-surface text-xs uppercase text-muted-foreground">
              <tr>
                <th className="p-4">Product</th>
                <th className="p-4">Category</th>
                <th className="p-4">Active</th>
                <th className="p-4">Featured</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {visible.map((product) => (
                <tr key={product.id}>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      {product.image_urls[0] ? (
                        <img
                          src={product.image_urls[0]}
                          alt=""
                          className="h-12 w-10 object-cover"
                        />
                      ) : (
                        <div className="h-12 w-10 bg-muted" />
                      )}
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="mt-1 font-mono text-xs text-muted-foreground">
                          {product.sku}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-muted-foreground">{product.categories?.name}</td>
                  <td className="p-4">
                    <button
                      type="button"
                      onClick={() => toggle(product, "is_active")}
                      aria-label={`Mark ${product.name} ${product.is_active ? "inactive" : "active"}`}
                      className={`px-2 py-1 text-xs font-medium ${product.is_active ? "bg-green-100 text-green-800" : "bg-muted text-muted-foreground"}`}
                    >
                      {product.is_active ? "Active" : "Inactive"}
                    </button>
                  </td>
                  <td className="p-4">
                    <button
                      type="button"
                      onClick={() => toggle(product, "is_featured")}
                      aria-label={`Mark ${product.name} ${product.is_featured ? "not featured" : "featured"}`}
                    >
                      <Star
                        className={`h-5 w-5 ${product.is_featured ? "fill-accent text-accent" : "text-muted-foreground"}`}
                      />
                    </button>
                  </td>
                  <td className="p-4">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setEditing(product)}
                        className="grid h-9 w-9 place-items-center border border-border"
                        aria-label={`Edit ${product.name}`}
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleting(product)}
                        className="grid h-9 w-9 place-items-center border border-border text-destructive"
                        aria-label={`Delete ${product.name}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {pageCount > 1 && (
        <div className="mt-5 flex items-center justify-between text-sm">
          <button
            type="button"
            disabled={page === 1}
            onClick={() => setPage((value) => value - 1)}
            className="btn-base btn-outline"
          >
            Previous
          </button>
          <span>
            Page {page} of {pageCount}
          </span>
          <button
            type="button"
            disabled={page === pageCount}
            onClick={() => setPage((value) => value + 1)}
            className="btn-base btn-outline"
          >
            Next
          </button>
        </div>
      )}
      {editing !== undefined && (
        <ProductForm
          product={editing}
          categories={categories}
          onClose={() => setEditing(undefined)}
          onSaved={(warning) => {
            setEditing(undefined);
            setNotice(
              warning
                ? { type: "error", message: warning }
                : {
                    type: "success",
                    message: editing ? "Product updated." : "Product created.",
                  },
            );
            void load();
          }}
          setNotice={setNotice}
        />
      )}
      <ConfirmDialog
        open={Boolean(deleting)}
        title="Delete product?"
        message={`This permanently deletes ${deleting?.name ?? "this product"} and all of its stored images.`}
        onCancel={() => setDeleting(undefined)}
        onConfirm={remove}
      />
      <Toast notice={notice} onClose={() => setNotice(null)} />
    </>
  );
}

function ProductForm({
  product,
  categories,
  onClose,
  onSaved,
  setNotice,
}: {
  product: ProductWithCategory | null;
  categories: CategoryRow[];
  onClose: () => void;
  onSaved: (warning?: string) => void;
  setNotice: (notice: Notice) => void;
}) {
  const [draft, setDraft] = useState<Draft>(
    product
      ? {
          name: product.name,
          sku: product.sku,
          slug: product.slug,
          category_id: product.category_id,
          short_description: product.short_description,
          description: product.description,
          material: product.material,
          sizes: product.available_sizes.join(", "),
          colors: product.available_colors.join(", "),
          features: product.features.join("\n"),
          customization: product.customization_options.join("\n"),
          image_urls: product.image_urls,
          is_featured: product.is_featured,
          is_active: product.is_active,
        }
      : blankDraft(categories[0]?.id),
  );
  const [files, setFiles] = useState<File[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const set = (key: keyof Draft, value: string | boolean | string[]) =>
    setDraft((current) => ({ ...current, [key]: value }));
  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    if (!draft.name.trim() || !draft.sku.trim() || !draft.slug.trim() || !draft.category_id) {
      setError("Product name, SKU, slug and category are required.");
      return;
    }
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(draft.slug)) {
      setError("Slug may contain lowercase letters, numbers and hyphens only.");
      return;
    }
    if (files.some((file) => !file.type.startsWith("image/") || file.size > 10 * 1024 * 1024)) {
      setError("Each image must be JPG, PNG, WebP or AVIF and no larger than 10 MB.");
      return;
    }
    setBusy(true);
    const supabase = getSupabase();
    const id = product?.id ?? crypto.randomUUID();
    const uploadedPaths: string[] = [];
    const uploadedUrls: string[] = [];
    try {
      for (const file of files) {
        const extension = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
        const path = `${id}/${crypto.randomUUID()}.${extension}`;
        const { error: uploadError } = await supabase.storage
          .from("product-images")
          .upload(path, file, { contentType: file.type });
        if (uploadError) throw uploadError;
        uploadedPaths.push(path);
        uploadedUrls.push(
          supabase.storage.from("product-images").getPublicUrl(path).data.publicUrl,
        );
      }
      const payload = {
        category_id: draft.category_id,
        name: draft.name.trim(),
        slug: draft.slug,
        sku: draft.sku.trim(),
        short_description: draft.short_description.trim(),
        description: draft.description.trim(),
        material: draft.material.trim(),
        available_sizes: splitList(draft.sizes),
        available_colors: splitList(draft.colors),
        features: splitList(draft.features),
        customization_options: splitList(draft.customization),
        image_urls: [...draft.image_urls, ...uploadedUrls],
        is_featured: draft.is_featured,
        is_active: draft.is_active,
      };
      const result = product
        ? await supabase.from("products").update(payload).eq("id", id)
        : await supabase.from("products").insert({ id, ...payload });
      if (result.error) throw result.error;
      let cleanupWarning: string | undefined;
      if (product) {
        const removed = product.image_urls
          .filter((url) => !draft.image_urls.includes(url))
          .map((url) => getStoragePath(url, "product-images"))
          .filter((path): path is string => Boolean(path));
        if (removed.length) {
          const cleanup = await supabase.storage.from("product-images").remove(removed);
          if (cleanup.error)
            cleanupWarning = `Product saved, but removed-image cleanup failed: ${cleanup.error.message}`;
        }
      }
      onSaved(cleanupWarning);
    } catch (caught) {
      if (uploadedPaths.length) await supabase.storage.from("product-images").remove(uploadedPaths);
      const message = caught instanceof Error ? caught.message : "Product could not be saved.";
      setError(message);
      setNotice({ type: "error", message });
    } finally {
      setBusy(false);
    }
  };
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/55 p-4" role="presentation">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="product-form-title"
        className="mx-auto my-4 max-w-4xl border border-border bg-card shadow-lift"
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-card p-5">
          <h2 id="product-form-title" className="text-xl">
            {product ? "Edit Product" : "Add Product"}
          </h2>
          <button type="button" onClick={onClose} disabled={busy} aria-label="Close product form">
            <X className="h-5 w-5" />
          </button>
        </div>
        <form onSubmit={save} className="p-5 sm:p-7">
          <div className="grid gap-5 sm:grid-cols-2">
            <Input
              label="Product name"
              value={draft.name}
              onChange={(value) => {
                set("name", value);
                if (!product && !draft.slug) set("slug", slugify(value));
              }}
              required
            />
            <Input label="SKU" value={draft.sku} onChange={(value) => set("sku", value)} required />
            <Input
              label="Slug"
              value={draft.slug}
              onChange={(value) => set("slug", slugify(value))}
              required
            />
            <label>
              <span className="eyebrow">Category *</span>
              <select
                value={draft.category_id}
                onChange={(event) => set("category_id", event.target.value)}
                className="field-base mt-2"
                required
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                    {category.is_active ? "" : " (inactive)"}
                  </option>
                ))}
              </select>
            </label>
            <TextArea
              label="Short description"
              value={draft.short_description}
              onChange={(value) => set("short_description", value)}
              rows={3}
            />
            <Input
              label="Material"
              value={draft.material}
              onChange={(value) => set("material", value)}
            />
            <div className="sm:col-span-2">
              <TextArea
                label="Full description"
                value={draft.description}
                onChange={(value) => set("description", value)}
                rows={5}
              />
            </div>
            <TextArea
              label="Available sizes"
              hint="Comma separated"
              value={draft.sizes}
              onChange={(value) => set("sizes", value)}
              rows={3}
            />
            <TextArea
              label="Available colors"
              hint="Comma separated"
              value={draft.colors}
              onChange={(value) => set("colors", value)}
              rows={3}
            />
            <TextArea
              label="Features"
              hint="One per line"
              value={draft.features}
              onChange={(value) => set("features", value)}
              rows={5}
            />
            <TextArea
              label="Customization options"
              hint="One per line"
              value={draft.customization}
              onChange={(value) => set("customization", value)}
              rows={5}
            />
          </div>
          <div className="mt-6">
            <p className="eyebrow">Product images</p>
            <div className="mt-3 flex flex-wrap gap-3">
              {draft.image_urls.map((url) => (
                <div key={url} className="relative">
                  <img
                    src={url}
                    alt="Product preview"
                    className="h-28 w-24 border border-border object-cover"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      set(
                        "image_urls",
                        draft.image_urls.filter((image) => image !== url),
                      )
                    }
                    className="absolute top-1 right-1 grid h-7 w-7 place-items-center bg-card"
                    aria-label="Remove existing image"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
              {files.map((file, index) => (
                <div key={`${file.name}-${index}`} className="relative">
                  <LocalImage file={file} />
                  <button
                    type="button"
                    onClick={() =>
                      setFiles((items) => items.filter((_, itemIndex) => itemIndex !== index))
                    }
                    className="absolute top-1 right-1 grid h-7 w-7 place-items-center bg-card"
                    aria-label="Remove new image"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
              <label className="flex h-28 w-24 cursor-pointer flex-col items-center justify-center border border-dashed border-border-strong text-center text-xs text-muted-foreground">
                <ImagePlus className="mb-2 h-5 w-5" />
                Add images
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/avif"
                  multiple
                  className="sr-only"
                  onChange={(event) =>
                    setFiles((items) => [...items, ...Array.from(event.target.files ?? [])])
                  }
                />
              </label>
            </div>
          </div>
          <div className="mt-6 flex flex-wrap gap-6">
            <Toggle
              label="Active product"
              checked={draft.is_active}
              onChange={(value) => set("is_active", value)}
            />
            <Toggle
              label="Featured product"
              checked={draft.is_featured}
              onChange={(value) => set("is_featured", value)}
            />
          </div>
          {error && (
            <p
              className="mt-5 border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive"
              role="alert"
            >
              {error}
            </p>
          )}
          <div className="mt-8 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={busy}
              className="btn-base btn-outline"
            >
              Cancel
            </button>
            <button type="submit" disabled={busy} className="btn-base btn-accent">
              {busy ? "Saving..." : product ? "Update Product" : "Create Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Input({
  label,
  value,
  onChange,
  required = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
}) {
  return (
    <label>
      <span className="eyebrow">
        {label}
        {required ? " *" : ""}
      </span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="field-base mt-2"
        required={required}
      />
    </label>
  );
}
function TextArea({
  label,
  hint,
  value,
  onChange,
  rows,
}: {
  label: string;
  hint?: string;
  value: string;
  onChange: (value: string) => void;
  rows: number;
}) {
  return (
    <label>
      <span className="eyebrow">{label}</span>
      {hint && <span className="ml-2 text-xs text-muted-foreground">{hint}</span>}
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={rows}
        className="field-base mt-2 resize-y"
      />
    </label>
  );
}
function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <label className="inline-flex cursor-pointer items-center gap-3 text-sm">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="h-4 w-4 accent-[var(--color-accent)]"
      />
      {label}
    </label>
  );
}

function LocalImage({ file }: { file: File }) {
  const url = useMemo(() => URL.createObjectURL(file), [file]);
  useEffect(() => () => URL.revokeObjectURL(url), [url]);
  return (
    <img
      src={url}
      alt="New product preview"
      className="h-28 w-24 border border-accent object-cover"
    />
  );
}
