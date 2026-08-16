import { Link } from "@tanstack/react-router";
import { Facebook, Instagram, Linkedin, MessageCircle } from "lucide-react";
import { CONTACT, hasWhatsApp, SOCIAL_LINKS, whatsappLink } from "@/data/catalog";
import { useCategories } from "@/hooks/use-catalog";

const columns = [
  {
    title: "Company",
    links: [
      { label: "About", to: "/about" as const },
      { label: "Products", to: "/products" as const },
      { label: "Quality", to: "/quality" as const },
      { label: "Contact", to: "/contact" as const },
    ],
  },
  {
    title: "Manufacturing",
    links: [
      { label: "Custom Manufacturing", to: "/custom-manufacturing" as const },
      { label: "OEM / ODM", to: "/custom-manufacturing" as const },
      { label: "Private Label", to: "/custom-manufacturing" as const },
      { label: "Quality Control", to: "/quality" as const },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Request Quote", to: "/contact" as const },
      { label: "Contact", to: "/contact" as const },
      { label: "Privacy Policy", to: "/privacy" as const },
      { label: "Terms", to: "/terms" as const },
    ],
  },
];

export function Footer() {
  const { categories } = useCategories();
  return (
    <footer className="border-t border-border bg-primary text-primary-foreground">
      <div className="container-page grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-6">
        <div className="lg:col-span-2">
          <Link
            to="/"
            aria-label="RION APPARELS home"
            className="block h-14 w-52 overflow-hidden bg-white"
          >
            <img
              src="/logo.png"
              alt="RION APPARELS"
              width={624}
              height={390}
              loading="lazy"
              className="h-full w-full object-cover"
            />
          </Link>
          <p className="mt-3 max-w-xs text-sm text-primary-foreground/70">
            Professional Workwear Manufacturing &amp; Export.
          </p>
          <div className="mt-6 space-y-1 text-sm text-primary-foreground/70">
            <p>
              <a href={`mailto:${CONTACT.email}`} className="hover:text-primary-foreground">
                {CONTACT.email}
              </a>
            </p>
            {CONTACT.phone && <p>{CONTACT.phone}</p>}
            <p>{CONTACT.address}</p>
          </div>
          <div className="mt-6 flex gap-2">
            {[
              { Icon: Facebook, label: "Facebook", href: SOCIAL_LINKS.facebook },
              { Icon: Instagram, label: "Instagram", href: SOCIAL_LINKS.instagram },
              { Icon: Linkedin, label: "LinkedIn", href: SOCIAL_LINKS.linkedin },
              { Icon: MessageCircle, label: "WhatsApp", href: hasWhatsApp ? whatsappLink() : "" },
            ]
              .filter(({ href }) => href)
              .map(({ Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="grid h-10 w-10 place-items-center border border-primary-foreground/25 transition-colors hover:border-accent hover:bg-accent hover:text-accent-foreground"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
          </div>
        </div>

        <div>
          <p className="font-display text-[11px] font-semibold tracking-[0.18em] uppercase">
            Products
          </p>
          <ul className="mt-4 space-y-2.5">
            {categories.slice(0, 4).map((category) => (
              <li key={category.id}>
                <Link
                  to="/products"
                  search={{
                    category: category.slug,
                    q: undefined,
                    color: undefined,
                    material: undefined,
                  }}
                  className="text-sm text-primary-foreground/70 transition-colors hover:text-primary-foreground"
                >
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {columns.map((col) => (
          <div key={col.title}>
            <p className="font-display text-[11px] font-semibold tracking-[0.18em] uppercase">
              {col.title}
            </p>
            <ul className="mt-4 space-y-2.5">
              {col.links.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-sm text-primary-foreground/70 transition-colors hover:text-primary-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-primary-foreground/15">
        <div className="container-page flex flex-col gap-2 py-5 text-xs text-primary-foreground/55 lg:flex-row lg:items-center lg:justify-between">
          <p>© {new Date().getFullYear()} RION APPARELS. All rights reserved.</p>
          <p>Workwear · Industrial Clothing · Safety Wear · Custom Uniforms</p>
          <p className="text-primary-foreground">
            Developed by{" "}
            <a
              href="https://aimenansari.site/"
              target="_blank"
              rel="noreferrer"
              className="font-semibold text-green-500 transition-colors hover:text-green-400"
            >
              Aimen
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
