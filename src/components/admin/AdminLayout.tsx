import { Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { FolderTree, LayoutDashboard, LogOut, Menu, MessageSquare, Package, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { getSupabase } from "@/lib/supabase";

const links = [
  { label: "Overview", to: "/admin/dashboard", Icon: LayoutDashboard },
  { label: "Products", to: "/admin/products", Icon: Package },
  { label: "Categories", to: "/admin/categories", Icon: FolderTree },
  { label: "Inquiries", to: "/admin/inquiries", Icon: MessageSquare },
] as const;

export function AdminRouteLayout() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const navigate = useNavigate();
  const { user, isAdmin, loading, refresh } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [newCount, setNewCount] = useState(0);
  const isLogin = pathname === "/admin/login";

  useEffect(() => {
    if (isLogin || loading) return;
    if (!user || !isAdmin) {
      navigate({
        to: "/admin/login",
        search: { reason: user ? "unauthorized" : undefined },
        replace: true,
      });
    } else if (pathname === "/admin") {
      navigate({ to: "/admin/dashboard", replace: true });
    }
  }, [isAdmin, isLogin, loading, navigate, pathname, user]);

  useEffect(() => {
    if (!isAdmin) return;
    const supabase = getSupabase();
    const load = async () => {
      const { count } = await supabase
        .from("inquiries")
        .select("id", { count: "exact", head: true })
        .eq("status", "new");
      setNewCount(count ?? 0);
    };
    void load();
    const channel = supabase
      .channel("admin-inquiry-count")
      .on("postgres_changes", { event: "*", schema: "public", table: "inquiries" }, load)
      .subscribe();
    return () => {
      void supabase.removeChannel(channel);
    };
  }, [isAdmin]);

  if (isLogin) return <Outlet />;
  if (loading || !user || !isAdmin) {
    return (
      <div className="grid min-h-screen place-items-center bg-surface">
        <div
          className="h-8 w-8 animate-spin rounded-full border-2 border-border border-t-accent"
          aria-label="Checking admin access"
        />
      </div>
    );
  }

  const logout = async () => {
    await getSupabase().auth.signOut();
    await refresh();
    navigate({ to: "/admin/login", search: {}, replace: true });
  };

  return (
    <div className="min-h-screen bg-surface lg:grid lg:grid-cols-[250px_minmax(0,1fr)]">
      <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-border bg-primary px-5 text-primary-foreground lg:hidden">
        <img src="/logo.png" alt="RION APPARELS" className="h-10 w-36 object-cover" />
        <button
          type="button"
          onClick={() => setMenuOpen((value) => !value)}
          aria-label={menuOpen ? "Close admin menu" : "Open admin menu"}
          aria-expanded={menuOpen}
          className="grid h-10 w-10 place-items-center border border-white/25"
        >
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </header>
      <aside
        className={`${menuOpen ? "fixed inset-x-0 top-16 z-30 block" : "hidden"} border-r border-white/10 bg-primary text-primary-foreground lg:sticky lg:top-0 lg:block lg:h-screen`}
      >
        <div className="hidden h-20 items-center border-b border-white/10 px-6 lg:flex">
          <img src="/logo.png" alt="RION APPARELS" className="h-12 w-40 object-cover" />
        </div>
        <div className="flex h-[calc(100%-5rem)] flex-col p-4">
          <p className="px-3 py-3 text-[10px] font-semibold tracking-[0.18em] text-white/45 uppercase">
            Administration
          </p>
          <nav className="space-y-1" aria-label="Admin navigation">
            {links.map(({ label, to, Icon }) => (
              <Link
                key={to}
                to={to}
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-3 text-sm text-white/70 transition-colors hover:bg-white/10 hover:text-white data-[status=active]:bg-white/10 data-[status=active]:text-white"
              >
                <Icon className="h-4 w-4" />
                {label}
                {label === "Inquiries" && newCount > 0 && (
                  <span className="ml-auto min-w-6 bg-accent px-1.5 py-0.5 text-center text-[11px] font-bold text-accent-foreground">
                    {newCount}
                  </span>
                )}
              </Link>
            ))}
          </nav>
          <button
            type="button"
            onClick={logout}
            className="mt-auto flex items-center gap-3 border-t border-white/10 px-3 py-4 text-sm text-white/70 hover:text-white"
          >
            <LogOut className="h-4 w-4" /> Logout
          </button>
        </div>
      </aside>
      <main className="min-w-0 p-5 sm:p-8 lg:p-10">
        <Outlet />
      </main>
    </div>
  );
}

export function AdminPageHeader({
  eyebrow,
  title,
  action,
}: {
  eyebrow: string;
  title: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4 border-b border-border pb-6">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="mt-2 text-2xl sm:text-3xl">{title}</h1>
      </div>
      {action}
    </div>
  );
}
