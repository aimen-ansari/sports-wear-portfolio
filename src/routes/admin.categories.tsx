import { createFileRoute } from "@tanstack/react-router";
import { Edit3, ImagePlus, Plus, Search, Trash2, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { AdminPageHeader } from "@/components/admin/AdminLayout";
import {
  AdminEmpty,
  ConfirmDialog,
  LoadingRows,
  Toast,
  type Notice,
} from "@/components/admin/AdminUi";
import type { CategoryRow } from "@/lib/database.types";
import { getStoragePath, getSupabase } from "@/lib/supabase";

export const Route = createFileRoute("/admin/categories")({
  head: () => ({
    meta: [{ title: "Categories | RION APPARELS Admin" }, { name: "robots", content: "noindex" }],
  }),
  component: CategoriesAdmin,
});
const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

function CategoriesAdmin() {
  const [categories, setCategories] = useState<CategoryRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState<CategoryRow | null | undefined>(undefined);
  const [deleting, setDeleting] = useState<CategoryRow>();
  const [busyDelete, setBusyDelete] = useState(false);
  const [notice, setNotice] = useState<Notice>(null);
  const load = async () => {
    setLoading(true);
    const { data, error } = await getSupabase()
      .from("categories")
      .select("*")
      .order("display_order")
      .order("name");
    setLoading(false);
    if (error) setNotice({ type: "error", message: error.message });
    else setCategories(data ?? []);
  };
  useEffect(() => {
    void load();
  }, []);
  const remove = async () => {
    if (!deleting) return;
    setBusyDelete(true);
    const category = deleting;
    const supabase = getSupabase();
    const { count, error: countError } = await supabase
      .from("products")
      .select("id", { count: "exact", head: true })
      .eq("category_id", category.id);
    if (countError || (count ?? 0) > 0) {
      setBusyDelete(false);
      setDeleting(undefined);
      setNotice({
        type: "error",
        message:
          countError?.message ??
          `Reassign or delete the ${count} product${count === 1 ? "" : "s"} in this category first.`,
      });
      return;
    }
    const { error } = await supabase.from("categories").delete().eq("id", category.id);
    setBusyDelete(false);
    setDeleting(undefined);
    if (error) {
      setNotice({ type: "error", message: error.message });
      return;
    }
    const path = category.image_url
      ? getStoragePath(category.image_url, "category-images")
      : undefined;
    const storageResult = path
      ? await supabase.storage.from("category-images").remove([path])
      : undefined;
    setCategories((items) => items.filter((item) => item.id !== category.id));
    setNotice({
      type: storageResult?.error ? "error" : "success",
      message: storageResult?.error
        ? `Category deleted, but image cleanup failed: ${storageResult.error.message}`
        : "Category deleted.",
    });
  };
  const toggle = async (category: CategoryRow) => {
    const { error } = await getSupabase()
      .from("categories")
      .update({ is_active: !category.is_active })
      .eq("id", category.id);
    if (error) setNotice({ type: "error", message: error.message });
    else
      setCategories((items) =>
        items.map((item) =>
          item.id === category.id ? { ...item, is_active: !item.is_active } : item,
        ),
      );
  };
  const filtered = categories.filter((category) =>
    category.name.toLowerCase().includes(query.toLowerCase()),
  );
  return (
    <>
      <AdminPageHeader
        eyebrow="Catalog"
        title="Categories"
        action={
          <button type="button" onClick={() => setEditing(null)} className="btn-base btn-accent">
            <Plus className="h-4 w-4" /> Add Category
          </button>
        }
      />
      <label className="relative mb-6 block max-w-md">
        <span className="sr-only">Search categories</span>
        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          className="field-base pl-10"
          placeholder="Search categories"
        />
      </label>
      {loading ? (
        <LoadingRows />
      ) : !filtered.length ? (
        <AdminEmpty
          title="No categories found"
          message={query ? "Change your search." : "Create the first product category."}
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((category) => (
            <article key={category.id} className="card-surface overflow-hidden">
              <div className="flex gap-4 p-5">
                {category.image_url ? (
                  <img src={category.image_url} alt="" className="h-20 w-24 object-cover" />
                ) : (
                  <div className="grid h-20 w-24 place-items-center bg-muted">
                    <ImagePlus className="h-5 w-5 text-muted-foreground" />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate font-display font-semibold">{category.name}</p>
                  <p className="mt-1 font-mono text-xs text-muted-foreground">{category.slug}</p>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Order: {category.display_order}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 border-t border-border p-4">
                <button
                  type="button"
                  onClick={() => toggle(category)}
                  className={`mr-auto px-2 py-1 text-xs font-medium ${category.is_active ? "bg-green-100 text-green-800" : "bg-muted text-muted-foreground"}`}
                >
                  {category.is_active ? "Active" : "Inactive"}
                </button>
                <button
                  type="button"
                  onClick={() => setEditing(category)}
                  className="grid h-9 w-9 place-items-center border border-border"
                  aria-label={`Edit ${category.name}`}
                >
                  <Edit3 className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setDeleting(category)}
                  className="grid h-9 w-9 place-items-center border border-border text-destructive"
                  aria-label={`Delete ${category.name}`}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
      {editing !== undefined && (
        <CategoryForm
          category={editing}
          onClose={() => setEditing(undefined)}
          onSaved={(warning) => {
            setEditing(undefined);
            setNotice(
              warning
                ? { type: "error", message: warning }
                : {
                    type: "success",
                    message: editing ? "Category updated." : "Category created.",
                  },
            );
            void load();
          }}
        />
      )}
      <ConfirmDialog
        open={Boolean(deleting)}
        title="Delete category?"
        message={`This deletes ${deleting?.name ?? "this category"}. Categories containing products cannot be deleted.`}
        busy={busyDelete}
        onCancel={() => setDeleting(undefined)}
        onConfirm={remove}
      />
      <Toast notice={notice} onClose={() => setNotice(null)} />
    </>
  );
}

function CategoryForm({
  category,
  onClose,
  onSaved,
}: {
  category: CategoryRow | null;
  onClose: () => void;
  onSaved: (warning?: string) => void;
}) {
  const [name, setName] = useState(category?.name ?? "");
  const [slug, setSlug] = useState(category?.slug ?? "");
  const [description, setDescription] = useState(category?.description ?? "");
  const [displayOrder, setDisplayOrder] = useState(category?.display_order ?? 0);
  const [active, setActive] = useState(category?.is_active ?? true);
  const [imageUrl, setImageUrl] = useState(category?.image_url ?? "");
  const [file, setFile] = useState<File>();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    if (!name.trim() || !slug) {
      setError("Name and slug are required.");
      return;
    }
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
      setError("Use lowercase letters, numbers and hyphens in the slug.");
      return;
    }
    if (file && (!file.type.startsWith("image/") || file.size > 10 * 1024 * 1024)) {
      setError("Use a JPG, PNG, WebP or AVIF image up to 10 MB.");
      return;
    }
    setBusy(true);
    const supabase = getSupabase();
    const id = category?.id ?? crypto.randomUUID();
    let uploadedPath: string | undefined;
    let nextImage = imageUrl;
    try {
      if (file) {
        const extension = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
        uploadedPath = `${id}/${crypto.randomUUID()}.${extension}`;
        const { error: uploadError } = await supabase.storage
          .from("category-images")
          .upload(uploadedPath, file, { contentType: file.type });
        if (uploadError) throw uploadError;
        nextImage = supabase.storage.from("category-images").getPublicUrl(uploadedPath)
          .data.publicUrl;
      }
      const payload = {
        name: name.trim(),
        slug,
        description: description.trim(),
        image_url: nextImage || null,
        display_order: displayOrder,
        is_active: active,
      };
      const result = category
        ? await supabase.from("categories").update(payload).eq("id", id)
        : await supabase.from("categories").insert({ id, ...payload });
      if (result.error) throw result.error;
      let cleanupWarning: string | undefined;
      if (category?.image_url && category.image_url !== nextImage) {
        const oldPath = getStoragePath(category.image_url, "category-images");
        if (oldPath) {
          const cleanup = await supabase.storage.from("category-images").remove([oldPath]);
          if (cleanup.error)
            cleanupWarning = `Category saved, but old-image cleanup failed: ${cleanup.error.message}`;
        }
      }
      onSaved(cleanupWarning);
    } catch (caught) {
      if (uploadedPath) await supabase.storage.from("category-images").remove([uploadedPath]);
      setError(caught instanceof Error ? caught.message : "Category could not be saved.");
    } finally {
      setBusy(false);
    }
  };
  const filePreview = useMemo(() => (file ? URL.createObjectURL(file) : ""), [file]);
  useEffect(
    () => () => {
      if (filePreview) URL.revokeObjectURL(filePreview);
    },
    [filePreview],
  );
  const preview = filePreview || imageUrl;
  return (
    <div className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-black/55 p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="category-form-title"
        className="w-full max-w-2xl border border-border bg-card shadow-lift"
      >
        <div className="flex items-center justify-between border-b border-border p-5">
          <h2 id="category-form-title" className="text-xl">
            {category ? "Edit Category" : "Add Category"}
          </h2>
          <button type="button" onClick={onClose} disabled={busy} aria-label="Close category form">
            <X className="h-5 w-5" />
          </button>
        </div>
        <form onSubmit={save} className="space-y-5 p-6">
          <div className="grid gap-5 sm:grid-cols-2">
            <label>
              <span className="eyebrow">Name *</span>
              <input
                value={name}
                onChange={(event) => {
                  setName(event.target.value);
                  if (!category && !slug) setSlug(slugify(event.target.value));
                }}
                className="field-base mt-2"
                required
              />
            </label>
            <label>
              <span className="eyebrow">Slug *</span>
              <input
                value={slug}
                onChange={(event) => setSlug(slugify(event.target.value))}
                className="field-base mt-2"
                required
              />
            </label>
          </div>
          <label className="block">
            <span className="eyebrow">Description</span>
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              rows={4}
              className="field-base mt-2 resize-y"
            />
          </label>
          <label className="block max-w-xs">
            <span className="eyebrow">Display order</span>
            <input
              type="number"
              value={displayOrder}
              onChange={(event) => setDisplayOrder(Number(event.target.value))}
              className="field-base mt-2"
            />
          </label>
          <div>
            <p className="eyebrow">Category image</p>
            <div className="mt-3 flex items-center gap-4">
              {preview ? (
                <div className="relative">
                  <img
                    src={preview}
                    alt="Category preview"
                    className="h-28 w-36 border border-border object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setFile(undefined);
                      setImageUrl("");
                    }}
                    className="absolute top-1 right-1 grid h-7 w-7 place-items-center bg-card"
                    aria-label="Remove category image"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <label className="flex h-28 w-36 cursor-pointer flex-col items-center justify-center border border-dashed border-border-strong text-xs text-muted-foreground">
                  <ImagePlus className="mb-2 h-5 w-5" />
                  Upload image
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/avif"
                    className="sr-only"
                    onChange={(event) => setFile(event.target.files?.[0])}
                  />
                </label>
              )}
            </div>
          </div>
          <label className="inline-flex items-center gap-3 text-sm">
            <input
              type="checkbox"
              checked={active}
              onChange={(event) => setActive(event.target.checked)}
              className="h-4 w-4 accent-[var(--color-accent)]"
            />
            Active category
          </label>
          {error && (
            <p
              className="border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive"
              role="alert"
            >
              {error}
            </p>
          )}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={busy}
              className="btn-base btn-outline"
            >
              Cancel
            </button>
            <button type="submit" disabled={busy} className="btn-base btn-accent">
              {busy ? "Saving..." : category ? "Update Category" : "Create Category"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
