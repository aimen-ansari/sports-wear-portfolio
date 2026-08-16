import { createFileRoute, Link } from "@tanstack/react-router";
import { FolderTree, MessageSquare, Package, Sparkles, ToggleRight } from "lucide-react";
import { useEffect, useState } from "react";
import { AdminPageHeader } from "@/components/admin/AdminLayout";
import { LoadingRows } from "@/components/admin/AdminUi";
import type { InquiryRow } from "@/lib/database.types";
import { getSupabase } from "@/lib/supabase";

export const Route = createFileRoute("/admin/dashboard")({
  head: () => ({
    meta: [{ title: "Admin Overview | RION APPARELS" }, { name: "robots", content: "noindex" }],
  }),
  component: Dashboard,
});

type Metrics = {
  totalProducts: number;
  activeProducts: number;
  featuredProducts: number;
  categories: number;
  newInquiries: number;
  recent: InquiryRow[];
};

function Dashboard() {
  const [metrics, setMetrics] = useState<Metrics>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    const supabase = getSupabase();
    const load = async () => {
      const [total, active, featured, categories, inquiries, recent] = await Promise.all([
        supabase.from("products").select("id", { count: "exact", head: true }),
        supabase
          .from("products")
          .select("id,categories!inner(id)", { count: "exact", head: true })
          .eq("is_active", true)
          .eq("categories.is_active", true),
        supabase
          .from("products")
          .select("id,categories!inner(id)", { count: "exact", head: true })
          .eq("is_active", true)
          .eq("is_featured", true)
          .eq("categories.is_active", true),
        supabase.from("categories").select("id", { count: "exact", head: true }),
        supabase.from("inquiries").select("id", { count: "exact", head: true }).eq("status", "new"),
        supabase.from("inquiries").select("*").order("created_at", { ascending: false }).limit(6),
      ]);
      const firstError = [
        total.error,
        active.error,
        featured.error,
        categories.error,
        inquiries.error,
        recent.error,
      ].find(Boolean);
      if (firstError) throw firstError;
      setError("");
      setMetrics({
        totalProducts: total.count ?? 0,
        activeProducts: active.count ?? 0,
        featuredProducts: featured.count ?? 0,
        categories: categories.count ?? 0,
        newInquiries: inquiries.count ?? 0,
        recent: recent.data ?? [],
      });
      setLoading(false);
    };
    const refresh = () =>
      load().catch((caught: unknown) => {
        console.error(caught);
        setLoading(false);
        setError("Dashboard metrics could not be loaded.");
      });
    void refresh();
    const channel = supabase
      .channel("admin-dashboard-inquiries")
      .on("postgres_changes", { event: "*", schema: "public", table: "inquiries" }, () => {
        void refresh();
      })
      .subscribe();
    return () => {
      void supabase.removeChannel(channel);
    };
  }, []);

  const cards = metrics
    ? [
        { label: "Total products", value: metrics.totalProducts, Icon: Package },
        { label: "Active products", value: metrics.activeProducts, Icon: ToggleRight },
        { label: "Featured products", value: metrics.featuredProducts, Icon: Sparkles },
        { label: "Total categories", value: metrics.categories, Icon: FolderTree },
        { label: "New inquiries", value: metrics.newInquiries, Icon: MessageSquare },
      ]
    : [];

  return (
    <>
      <AdminPageHeader
        eyebrow="Overview"
        title="Dashboard"
        action={
          <Link to="/" className="btn-base btn-outline" target="_blank">
            View Website
          </Link>
        }
      />
      {error && (
        <p
          className="border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive"
          role="alert"
        >
          {error}
        </p>
      )}
      {loading ? (
        <LoadingRows />
      ) : metrics ? (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
            {cards.map(({ label, value, Icon }) => (
              <div key={label} className="card-surface p-5">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                    {label}
                  </p>
                  <Icon className="h-5 w-5 text-accent" />
                </div>
                <p className="mt-5 font-display text-3xl font-bold">{value}</p>
              </div>
            ))}
          </div>
          <section className="mt-8 card-surface">
            <div className="flex items-center justify-between border-b border-border p-5">
              <div>
                <p className="eyebrow">Latest activity</p>
                <h2 className="mt-1 text-lg">Recent Inquiries</h2>
              </div>
              <Link to="/admin/inquiries" className="text-sm font-medium hover:text-accent">
                View all
              </Link>
            </div>
            {metrics.recent.length ? (
              <div className="divide-y divide-border">
                {metrics.recent.map((inquiry) => (
                  <Link
                    key={inquiry.id}
                    to="/admin/inquiries"
                    className="grid gap-2 p-5 transition-colors hover:bg-surface sm:grid-cols-[1fr_1fr_auto] sm:items-center"
                  >
                    <div>
                      <p className="text-sm font-medium">{inquiry.full_name}</p>
                      <p className="mt-1 text-xs text-muted-foreground">{inquiry.company_name}</p>
                    </div>
                    <p className="text-sm text-muted-foreground">{inquiry.email}</p>
                    <span
                      className={`w-fit px-2 py-1 text-[10px] font-bold uppercase ${inquiry.status === "new" ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground"}`}
                    >
                      {inquiry.status}
                    </span>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="p-8 text-center text-sm text-muted-foreground">
                No inquiries received yet.
              </p>
            )}
          </section>
        </>
      ) : null}
    </>
  );
}
