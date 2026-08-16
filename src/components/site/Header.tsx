import { Link, useNavigate } from "@tanstack/react-router";
import { Menu, Search, UserCog, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";

const navItems = [
  { label: "Home", to: "/" },
  { label: "About Us", to: "/about" },
  { label: "Products", to: "/products" },
  { label: "Custom Manufacturing", to: "/custom-manufacturing" },
  { label: "Quality", to: "/quality" },
  { label: "Contact", to: "/contact" },
] as const;

export function Header() {
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const { isAdmin } = useAuth();

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (open) menuButtonRef.current?.focus();
      setOpen(false);
      setSearchOpen(false);
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [open]);

  useEffect(() => {
    if (searchOpen) searchInputRef.current?.focus();
  }, [searchOpen]);

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchOpen(false);
    setOpen(false);
    navigate({
      to: "/products",
      search: {
        q: query.trim() || undefined,
        category: undefined,
        color: undefined,
        material: undefined,
      },
    });
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
      <div className="container-page grid h-[72px] grid-cols-[minmax(0,1fr)_auto] items-center gap-4 lg:flex lg:justify-between">
        <Link
          to="/"
          aria-label="RION APPARELS home"
          className="block h-11 w-40 shrink-0 overflow-hidden sm:w-44"
          onClick={() => setOpen(false)}
        >
          <img
            src="/logo.png"
            alt="RION APPARELS"
            width={624}
            height={390}
            className="h-full w-full object-cover"
          />
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: item.to === "/" }}
              className="relative py-1 text-[13px] font-medium text-muted-foreground transition-colors hover:text-foreground data-[status=active]:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 lg:gap-3">
          <button
            type="button"
            aria-label="Search products"
            aria-expanded={searchOpen}
            aria-controls="site-search"
            onClick={() => setSearchOpen((v) => !v)}
            className="grid h-10 w-10 shrink-0 place-items-center border border-transparent text-foreground transition-colors hover:border-border hover:bg-surface"
          >
            <Search className="h-[18px] w-[18px]" />
          </button>
          <Link to="/contact" className="btn-base btn-primary hidden sm:inline-flex">
            Request a Quote
          </Link>
          <Link
            to={isAdmin ? "/admin/dashboard" : "/admin/login"}
            className="btn-base btn-outline hidden px-3 lg:inline-flex"
          >
            <UserCog className="h-4 w-4" /> {isAdmin ? "Dashboard" : "Admin"}
          </Link>
          <button
            ref={menuButtonRef}
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-navigation"
            onClick={() => setOpen((v) => !v)}
            className="grid h-10 w-10 shrink-0 place-items-center border border-border text-foreground lg:hidden"
          >
            {open ? <X className="h-[18px] w-[18px]" /> : <Menu className="h-[18px] w-[18px]" />}
          </button>
        </div>
      </div>

      {searchOpen && (
        <div id="site-search" className="border-t border-border bg-surface">
          <form onSubmit={submitSearch} className="container-page flex items-center gap-3 py-4">
            <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
            <label htmlFor="header-product-search" className="sr-only">
              Search products, categories or SKU
            </label>
            <input
              ref={searchInputRef}
              id="header-product-search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products, categories or SKU…"
              className="field-base min-w-0 border-0 bg-transparent shadow-none focus-visible:ring-2 focus-visible:ring-primary"
            />
            <button type="submit" className="btn-base btn-outline shrink-0">
              Search
            </button>
          </form>
        </div>
      )}

      {open && (
        <div
          id="mobile-navigation"
          data-lenis-prevent
          className="max-h-[calc(100vh-72px)] overflow-y-auto border-t border-border bg-background lg:hidden"
        >
          <nav className="container-page flex flex-col py-2" aria-label="Mobile navigation">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className="border-b border-border py-3.5 text-sm font-medium text-foreground last:border-0"
              >
                {item.label}
              </Link>
            ))}
            <Link
              to="/contact"
              onClick={() => setOpen(false)}
              className="btn-base btn-primary my-4 sm:hidden"
            >
              Request a Quote
            </Link>
            <Link
              to={isAdmin ? "/admin/dashboard" : "/admin/login"}
              onClick={() => setOpen(false)}
              className="btn-base btn-outline my-2"
            >
              <UserCog className="h-4 w-4" /> {isAdmin ? "Dashboard" : "Admin"}
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
