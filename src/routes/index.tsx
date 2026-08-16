import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Boxes, Factory, Globe2, PencilRuler, ShieldCheck, Tags } from "lucide-react";
import heroImage from "@/assets/industry-construction.jpg";
import factoryImage from "@/assets/factory.jpg";
import fabricsImage from "@/assets/fabrics.jpg";
import { industries } from "@/data/catalog";
import { CategoryCard } from "@/components/site/CategoryCard";
import { ProductCard } from "@/components/site/ProductCard";
import { CatalogMessage, CatalogSkeleton } from "@/components/site/CatalogStates";
import { SectionHeading } from "@/components/site/SectionHeading";
import { useCatalog } from "@/hooks/use-catalog";
import { absoluteUrl, canonicalLinks } from "@/lib/site";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "RION APPARELS — Workwear Manufacturer & Exporter" },
      {
        name: "description",
        content:
          "Professional workwear manufacturing for brands, distributors and businesses worldwide. Custom manufacturing, private label and worldwide export by RION APPARELS.",
      },
      { property: "og:title", content: "RION APPARELS — Workwear Manufacturer & Exporter" },
      {
        property: "og:description",
        content:
          "Workwear, industrial clothing and safety wear manufactured to your specification. OEM/ODM and private label production for international B2B buyers.",
      },
      { property: "og:image", content: absoluteUrl(heroImage) },
      { name: "twitter:image", content: absoluteUrl(heroImage) },
    ],
    links: canonicalLinks("/"),
  }),
  component: Home,
});

const stats = [
  { value: "15+", label: "Workwear Categories" },
  { value: "OEM / ODM", label: "Custom Development" },
  { value: "Private Label", label: "Manufacturing" },
  { value: "Worldwide", label: "Supply & Export" },
];

const advantages = [
  {
    Icon: PencilRuler,
    title: "Custom Manufacturing",
    text: "Products manufactured according to your specifications.",
  },
  {
    Icon: ShieldCheck,
    title: "Quality Materials",
    text: "Durable fabrics and trims selected for demanding working environments.",
  },
  {
    Icon: Tags,
    title: "Private Label",
    text: "Custom labels, embroidery, printing, colors and packaging.",
  },
  {
    Icon: Globe2,
    title: "Worldwide Export",
    text: "Reliable manufacturing support for international B2B customers.",
  },
];

const customTags = [
  "Custom Colors",
  "Embroidery",
  "Screen Printing",
  "Private Labels",
  "Custom Packaging",
  "OEM / ODM",
];

function Home() {
  const { categories, products, loading, error } = useCatalog(true);
  return (
    <>
      {/* HERO */}
      <section className="relative">
        <img
          src={heroImage}
          alt="Industrial workers wearing navy workwear on a construction site"
          width={1920}
          height={1088}
          fetchPriority="high"
          className="h-[78vh] min-h-[520px] w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[oklch(0.19_0.03_258/0.88)] via-[oklch(0.19_0.03_258/0.6)] to-transparent" />
        <div className="absolute inset-0 flex items-center">
          <div className="container-page">
            <div className="max-w-xl animate-rise text-primary-foreground">
              <p className="eyebrow text-primary-foreground/70">
                Workwear Manufacturing &amp; Export
              </p>
              <h1 className="mt-5 text-4xl leading-[1.05] sm:text-5xl lg:text-6xl">
                Workwear Built for Real Work.
              </h1>
              <p className="mt-5 max-w-lg text-[15px] leading-relaxed text-primary-foreground/80 sm:text-base">
                Professional workwear manufacturing for brands, distributors and businesses
                worldwide.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link to="/products" className="btn-base btn-accent">
                  Explore Collection
                </Link>
                <Link to="/contact" className="btn-base btn-onDark">
                  Request a Quote
                </Link>
              </div>
              <p className="mt-8 text-[11px] font-semibold tracking-[0.16em] uppercase text-primary-foreground/60">
                Custom Manufacturing • Private Label • Worldwide Export
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="py-20 lg:py-28">
        <div className="container-page">
          <SectionHeading
            eyebrow="Product Range"
            title="Explore Our Workwear"
            description="Eight core programme categories, each available in custom fabrics, colourways and branding configurations."
            action={
              <Link to="/products" className="btn-base btn-outline">
                View Full Catalog
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            }
          />
          <div className="mt-12">
            {loading ? (
              <CatalogSkeleton />
            ) : error ? (
              <CatalogMessage type="error" message={error} />
            ) : categories.length ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {categories.map((c) => (
                  <CategoryCard key={c.id} category={c} />
                ))}
              </div>
            ) : (
              <CatalogMessage type="empty" message="Product categories are being prepared." />
            )}
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="border-y border-border bg-surface py-20 lg:py-28">
        <div className="container-page">
          <SectionHeading
            eyebrow="Featured Products"
            title="Programme-Ready Workwear Styles"
            description="Established styles that buyers use as a starting point for their own collections. Specifications, fabrics and branding are adapted to each order."
          />
          <div className="mt-12">
            {loading ? (
              <CatalogSkeleton />
            ) : error ? (
              <CatalogMessage type="error" message={error} />
            ) : products.length ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {products.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            ) : (
              <CatalogMessage type="empty" message="Featured products will appear here soon." />
            )}
          </div>
        </div>
      </section>

      {/* MANUFACTURING */}
      <section className="py-20 lg:py-28">
        <div className="container-page grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <img
            src={factoryImage}
            alt="RION APPARELS workwear production floor with industrial sewing lines"
            width={1408}
            height={1056}
            loading="lazy"
            className="w-full border border-border object-cover"
          />
          <div>
            <p className="eyebrow">Manufacturing</p>
            <h2 className="mt-3 text-3xl leading-[1.1] md:text-[2.6rem]">
              From Our Factory to Your Brand.
            </h2>
            <p className="mt-5 text-[15px] leading-relaxed text-muted-foreground">
              RION APPARELS provides complete workwear manufacturing solutions — material sourcing,
              pattern development, sampling, bulk production, customization, branding and export
              packaging. Every programme is managed by a dedicated merchandising contact, from the
              first technical discussion through to dispatch documentation.
            </p>
            <dl className="mt-10 grid grid-cols-2 gap-x-6 gap-y-8 border-t border-border pt-8">
              {stats.map((s) => (
                <div key={s.label}>
                  <dt className="font-display text-xl font-bold">{s.value}</dt>
                  <dd className="mt-1 text-[13px] text-muted-foreground">{s.label}</dd>
                </div>
              ))}
            </dl>
            <Link to="/custom-manufacturing" className="btn-base btn-primary mt-10">
              Discover Our Capabilities
            </Link>
          </div>
        </div>
      </section>

      {/* WHY */}
      <section className="border-y border-border bg-surface py-20 lg:py-28">
        <div className="container-page">
          <SectionHeading
            eyebrow="Why RION APPARELS"
            title="A Manufacturing Partner, Not a Reseller"
            align="center"
          />
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {advantages.map(({ Icon, title, text }) => (
              <div key={title} className="card-surface p-7 hover:shadow-[var(--shadow-card)]">
                <Icon className="h-6 w-6 text-accent" strokeWidth={1.5} />
                <h3 className="mt-5 text-base font-semibold">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CUSTOM WORKWEAR */}
      <section className="py-20 lg:py-28">
        <div className="container-page grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <p className="eyebrow">Custom Development</p>
            <h2 className="mt-3 text-3xl leading-[1.1] md:text-[2.6rem]">
              Your Design. Our Manufacturing.
            </h2>
            <p className="mt-5 text-[15px] leading-relaxed text-muted-foreground">
              Develop your own workwear collection with custom fabrics, colors, sizing, branding and
              packaging.
            </p>
            <ul className="mt-8 flex flex-wrap gap-2">
              {customTags.map((tag) => (
                <li
                  key={tag}
                  className="border border-border bg-card px-3.5 py-2 text-xs font-medium text-muted-foreground transition-colors hover:border-accent hover:text-foreground"
                >
                  {tag}
                </li>
              ))}
            </ul>
            <Link to="/custom-manufacturing" className="btn-base btn-accent mt-10">
              Start Your Project
            </Link>
          </div>
          <img
            src={fabricsImage}
            alt="Rolls of industrial workwear fabric in navy, grey and hi-visibility yellow"
            width={1400}
            height={1050}
            loading="lazy"
            className="w-full border border-border object-cover"
          />
        </div>
      </section>

      {/* INDUSTRIES */}
      <section className="border-t border-border bg-surface py-20 lg:py-28">
        <div className="container-page">
          <SectionHeading
            eyebrow="Applications"
            title="Industries We Serve"
            description="Our garments are specified by distributors and end users across industrial, technical and service sectors."
          />
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {industries.map((industry) => (
              <div
                key={industry.name}
                className="group relative overflow-hidden border border-border"
              >
                <img
                  src={industry.image}
                  alt={`${industry.name} workwear supplied by RION APPARELS`}
                  width={1200}
                  height={900}
                  loading="lazy"
                  className="aspect-4/3 w-full object-cover transition-transform duration-700 group-hover:scale-[1.06]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[oklch(0.19_0.03_258/0.85)] to-transparent" />
                <h3 className="absolute bottom-4 left-5 text-sm font-semibold text-primary-foreground">
                  {industry.name}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary py-20 text-primary-foreground lg:py-28">
        <div className="container-page grid items-center gap-10 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <Factory className="h-7 w-7 text-accent" strokeWidth={1.5} />
            <h2 className="mt-6 text-3xl leading-[1.1] md:text-[2.6rem]">
              Looking for a Reliable Workwear Manufacturing Partner?
            </h2>
            <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-primary-foreground/70">
              Tell us what you need and our team will help you develop your next workwear
              collection.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 lg:justify-end">
            <Link to="/contact" className="btn-base btn-accent">
              Request a Quote
            </Link>
            <Link to="/contact" className="btn-base btn-onDark">
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      <section className="border-t border-border py-14">
        <div className="container-page flex flex-wrap items-center gap-x-10 gap-y-4 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-2">
            <Boxes className="h-4 w-4 text-accent" /> Low to medium MOQs per colour
          </span>
          <span className="inline-flex items-center gap-2">
            <Globe2 className="h-4 w-4 text-accent" /> Export documentation handled in-house
          </span>
          <span className="inline-flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-accent" /> Pre-shipment inspection on every order
          </span>
        </div>
      </section>
    </>
  );
}
