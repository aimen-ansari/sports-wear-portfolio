import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Factory,
  FileCheck2,
  Globe2,
  Handshake,
  Layers3,
  RefreshCw,
  ShieldCheck,
  Tags,
  Truck,
} from "lucide-react";
import factoryImage from "@/assets/factory.jpg";
import fabricsImage from "@/assets/fabrics.jpg";
import qualityImage from "@/assets/quality-inspection.jpg";
import { SectionHeading } from "@/components/site/SectionHeading";
import { canonicalLinks } from "@/lib/site";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About RION APPARELS | Workwear Manufacturer & Exporter" },
      {
        name: "description",
        content:
          "Meet RION APPARELS, a specialist B2B workwear manufacturer supporting brands, distributors and uniform programmes with OEM, ODM, private label and worldwide export.",
      },
      { property: "og:title", content: "About RION APPARELS | Workwear Manufacturer & Exporter" },
      {
        property: "og:description",
        content:
          "A specification-led workwear manufacturing partner for repeatable quality, private label production and international supply.",
      },
    ],
    links: canonicalLinks("/about"),
  }),
  component: AboutPage,
});

const proofPoints = [
  { value: "OEM / ODM", label: "Development models" },
  { value: "Private Label", label: "Brand-ready production" },
  { value: "Documented QC", label: "From fabric to packing" },
  { value: "Worldwide", label: "Export support" },
];

const values = [
  {
    Icon: FileCheck2,
    title: "Specification Discipline",
    text: "Fabric, trims, measurements, construction and branding are documented and approved before production starts.",
  },
  {
    Icon: ShieldCheck,
    title: "Durability First",
    text: "Materials and construction methods are selected for service life, industrial laundering and real working conditions.",
  },
  {
    Icon: Handshake,
    title: "Transparent Communication",
    text: "Buyers receive clear MOQs, realistic lead times and proactive updates from sampling through dispatch.",
  },
  {
    Icon: RefreshCw,
    title: "Repeatable Production",
    text: "Approved specifications are retained to support consistent replenishment and long-term product programmes.",
  },
];

const buyerTypes = [
  {
    Icon: Tags,
    title: "Workwear Brands",
    text: "Build a differentiated range with custom patterns, fabrics, colourways, labels and retail-ready packaging.",
    note: "OEM · ODM · Private label",
  },
  {
    Icon: Layers3,
    title: "Distributors & Importers",
    text: "Develop dependable core styles that can be reordered across seasons with controlled specifications.",
    note: "Repeat programmes · Assortments",
  },
  {
    Icon: Factory,
    title: "Corporate Uniform Programmes",
    text: "Equip industrial, construction, logistics and service teams with role-specific branded workwear.",
    note: "Teamwear · Custom branding",
  },
];

const evidence = [
  {
    src: factoryImage,
    alt: "RION APPARELS workwear production floor",
    label: "Production",
    caption: "Structured cutting, sewing and finishing workflows.",
  },
  {
    src: fabricsImage,
    alt: "Industrial workwear fabrics prepared for selection",
    label: "Materials",
    caption: "Fabric and trim options selected against the approved brief.",
  },
  {
    src: qualityImage,
    alt: "Measurement inspection of a finished workwear garment",
    label: "Quality Control",
    caption: "Measurements and construction checked against the technical file.",
  },
];

function AboutPage() {
  return (
    <>
      <section className="border-b border-border bg-surface py-14 lg:py-20">
        <div className="container-page">
          <p className="eyebrow">About Us</p>
          <h1 className="mt-3 max-w-3xl text-3xl leading-[1.1] md:text-[2.75rem]">
            A Workwear Manufacturer Built Around Technical Requirements
          </h1>
          <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
            RION APPARELS manufactures and exports workwear, industrial clothing, safety wear and
            custom work uniforms for international B2B buyers, from established distributors to
            brands launching their first collection.
          </p>
        </div>
      </section>

      <section className="border-b border-border bg-card">
        <dl className="container-page grid grid-cols-2 lg:grid-cols-4">
          {proofPoints.map((point) => (
            <div
              key={point.value}
              className="border-b border-border px-4 py-7 first:pl-0 even:border-l even:pl-6 lg:border-b-0 lg:border-l lg:px-8 lg:first:border-l-0 lg:first:pl-0"
            >
              <dt className="font-display text-base font-bold text-foreground sm:text-lg">
                {point.value}
              </dt>
              <dd className="mt-1 text-xs text-muted-foreground">{point.label}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="py-16 lg:py-24">
        <div className="container-page grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20">
          <div className="relative">
            <img
              src={factoryImage}
              alt="RION APPARELS workwear manufacturing facility"
              width={1408}
              height={1056}
              loading="lazy"
              className="aspect-4/3 w-full border border-border object-cover"
            />
            <div className="absolute right-0 bottom-0 max-w-[82%] border-t border-l border-border bg-background p-5 sm:p-7">
              <p className="eyebrow">Manufacturing principle</p>
              <p className="mt-2 text-sm font-medium leading-relaxed">
                The approved specification, not assumption, directs every production decision.
              </p>
            </div>
          </div>

          <div>
            <p className="eyebrow">Company Profile</p>
            <h2 className="mt-3 text-3xl leading-[1.1] md:text-[2.6rem]">
              Specialist Workwear Manufacturing, Not General Garment Production.
            </h2>
            <p className="mt-6 text-[15px] leading-relaxed text-muted-foreground">
              RION APPARELS focuses on workwear and protective clothing: jackets, trousers,
              coveralls, bib overalls, hi-visibility garments, safety vests, softshells and work
              shirts. Every style is produced to buyer requirements rather than supplied as generic
              stock.
            </p>
            <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
              Our role extends beyond stitching. We help translate a market brief or technical pack
              into a production-ready garment, coordinate materials and branding, manage sampling,
              control bulk production and prepare each order for international dispatch.
            </p>

            <div className="mt-9 grid gap-5 border-t border-border pt-8 sm:grid-cols-2">
              <div>
                <FileCheck2 className="h-5 w-5 text-accent" />
                <h3 className="mt-3 text-sm font-semibold">Controlled Development</h3>
                <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                  Patterns, measurements, fabrics and branding are approved before bulk cutting.
                </p>
              </div>
              <div>
                <Truck className="h-5 w-5 text-accent" />
                <h3 className="mt-3 text-sm font-semibold">Export-Ready Delivery</h3>
                <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                  Packing, carton marking and documentation follow buyer instructions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-primary py-16 text-primary-foreground lg:py-24">
        <div className="container-page grid gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div>
            <p className="eyebrow text-primary-foreground/55">Our Direction</p>
            <h2 className="mt-3 text-3xl leading-[1.1]">
              A Manufacturing Partner Built for Reorders.
            </h2>
            <p className="mt-5 text-sm leading-relaxed text-primary-foreground/70">
              Our mission is to give workwear buyers dependable construction, honest specifications
              and consistent execution from one production run to the next. We measure the strength
              of a programme by its ability to be repeated, improved and scaled.
            </p>
          </div>

          <div className="grid gap-px border border-primary-foreground/15 bg-primary-foreground/15 sm:grid-cols-2">
            {[
              {
                Icon: FileCheck2,
                title: "Documented",
                text: "Approved samples and technical details remain the production reference.",
              },
              {
                Icon: ShieldCheck,
                title: "Inspected",
                text: "Materials, construction, measurements and packing are checked in stages.",
              },
              {
                Icon: Globe2,
                title: "Export Supported",
                text: "One English-speaking contact coordinates development through dispatch.",
              },
              {
                Icon: RefreshCw,
                title: "Repeatable",
                text: "Controlled specifications make replenishment more predictable.",
              },
            ].map(({ Icon, title, text }) => (
              <div key={title} className="bg-primary p-7">
                <Icon className="h-5 w-5 text-accent" />
                <h3 className="mt-4 text-base font-semibold">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-primary-foreground/65">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="container-page">
          <SectionHeading
            eyebrow="Who We Support"
            title="Manufacturing Around Your Business Model"
            description="Different buyers need different levels of development, branding and programme control. We structure the manufacturing route around what you already have and what still needs to be built."
          />
          <div className="mt-12 grid gap-px border border-border bg-border lg:grid-cols-3">
            {buyerTypes.map(({ Icon, title, text, note }) => (
              <article key={title} className="group bg-card p-8 transition-colors hover:bg-surface">
                <div className="flex h-11 w-11 items-center justify-center border border-border bg-surface text-primary transition-colors group-hover:border-accent group-hover:text-accent">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-6 text-lg">{title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{text}</p>
                <p className="mt-6 border-t border-border pt-4 font-display text-[10px] font-semibold tracking-[0.14em] uppercase text-muted-foreground">
                  {note}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-surface py-16 lg:py-24">
        <div className="container-page">
          <SectionHeading
            eyebrow="Our Values"
            title="How We Protect Every Programme"
            align="center"
          />
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map(({ Icon, title, text }, index) => (
              <article key={title} className="card-surface relative overflow-hidden p-7">
                <span className="absolute top-5 right-5 font-display text-3xl font-bold text-border">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <Icon className="h-5 w-5 text-accent" />
                <h3 className="mt-8 text-base font-semibold">{title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="container-page">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <p className="eyebrow">Inside the Programme</p>
              <h2 className="mt-3 text-3xl leading-[1.1]">Materials, Production and Control.</h2>
            </div>
            <Link to="/quality" className="btn-base btn-outline self-start md:self-auto">
              See Our Quality Process
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {evidence.map((item) => (
              <figure
                key={item.label}
                className="group overflow-hidden border border-border bg-card"
              >
                <div className="overflow-hidden bg-surface">
                  <img
                    src={item.src}
                    alt={item.alt}
                    width={1408}
                    height={1056}
                    loading="lazy"
                    className="aspect-4/3 w-full object-cover transition-transform duration-700 group-hover:scale-[1.025]"
                  />
                </div>
                <figcaption className="p-5">
                  <p className="eyebrow">{item.label}</p>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {item.caption}
                  </p>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-surface py-16 lg:py-24">
        <div className="container-page">
          <div className="grid items-center gap-10 bg-primary px-7 py-12 text-primary-foreground sm:px-10 lg:grid-cols-[1fr_auto] lg:px-14 lg:py-14">
            <div className="max-w-2xl">
              <p className="eyebrow text-primary-foreground/55">Start a Conversation</p>
              <h2 className="mt-3 text-3xl leading-[1.1]">
                Looking for a Workwear Manufacturing Partner?
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-primary-foreground/70">
                Share your target market, product type, quantity and branding requirements. We will
                outline the appropriate development route, indicative MOQ and next steps.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 lg:justify-end">
              <Link to="/contact" className="btn-base btn-accent">
                Request a Quote
              </Link>
              <Link to="/products" className="btn-base btn-onDark">
                Explore Products
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
