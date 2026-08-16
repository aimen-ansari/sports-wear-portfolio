import { createFileRoute, Link } from "@tanstack/react-router";
import qualityImage from "@/assets/quality-inspection.jpg";
import factoryImage from "@/assets/factory.jpg";
import { SectionHeading } from "@/components/site/SectionHeading";
import { canonicalLinks } from "@/lib/site";

export const Route = createFileRoute("/quality")({
  head: () => ({
    meta: [
      { title: "Quality Control in Workwear Production | RION APPARELS" },
      {
        name: "description",
        content:
          "How RION APPARELS controls workwear quality: material inspection, production monitoring, stitching and measurement checks, final QC and packaging inspection.",
      },
      { property: "og:title", content: "Quality Control in Workwear Production | RION APPARELS" },
      {
        property: "og:description",
        content:
          "Documented inspection at every production stage, from incoming fabric to sealed export cartons.",
      },
    ],
    links: canonicalLinks("/quality"),
  }),
  component: QualityPage,
});

const checks = [
  {
    title: "Material Inspection",
    text: "Incoming fabric and trims are checked for weight, shade, shrinkage and visible defects against the approved swatch before cutting is released.",
  },
  {
    title: "Production Monitoring",
    text: "Line supervisors verify the first pieces of every operation and monitor output through the run so deviations are caught early, not at the end.",
  },
  {
    title: "Stitching & Construction Checks",
    text: "Seam type, stitch density, bar-tacking and reinforcement points are checked against the technical file for every style.",
  },
  {
    title: "Measurement Inspection",
    text: "Garments are measured per size against the approved specification sheet, with tolerances recorded on the inspection report.",
  },
  {
    title: "Final Quality Control",
    text: "Finished garments are inspected for appearance, trims, branding placement, thread ends and functionality of zips and closures.",
  },
  {
    title: "Packaging Inspection",
    text: "Polybag labelling, folding, size assortment and carton marking are verified against buyer packing instructions before sealing.",
  },
];

function QualityPage() {
  return (
    <>
      <section className="border-b border-border bg-surface py-14 lg:py-20">
        <div className="container-page">
          <p className="eyebrow">Quality</p>
          <h1 className="mt-3 max-w-3xl text-3xl leading-[1.1] md:text-[2.75rem]">
            Quality Is a Process, Not a Final Check
          </h1>
          <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
            Consistency across repeat orders is the reason buyers stay with a manufacturer. Our
            inspection stages are documented, so every shipment can be traced back to the approved
            specification.
          </p>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="container-page grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <img
            src={qualityImage}
            alt="Quality inspector measuring a finished workwear garment"
            width={1400}
            height={1050}
            loading="lazy"
            className="w-full border border-border object-cover"
          />
          <div>
            <h2 className="rule-accent text-2xl">Documented at Every Stage</h2>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Each order carries a technical file containing the approved sample comments,
              measurement chart, fabric details, trim card and branding placements. Inspectors work
              from that file rather than from memory, and the completed reports are shared with the
              buyer before dispatch. Where a third-party inspection is required, we coordinate
              access and provide the same documentation to the appointed agency.
            </p>
            <Link to="/contact" className="btn-base btn-primary mt-8">
              Request Our QC Procedure
            </Link>
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-surface py-16 lg:py-24">
        <div className="container-page">
          <SectionHeading eyebrow="Inspection Stages" title="Six Control Points" align="center" />
          <div className="mt-14 grid gap-px border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
            {checks.map((c, i) => (
              <div key={c.title} className="bg-card p-7">
                <span className="font-display text-sm font-bold text-accent">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-4 text-base font-semibold">{c.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{c.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="container-page grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <h2 className="rule-accent text-2xl">Built for Industrial Laundering</h2>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Workwear fails at the seams, trims and reflective tape long before the fabric wears
              out. We specify bar-tacked stress points, industrial-grade thread, tested zips and
              wash-durable branding so garments survive repeated high-temperature laundering in
              rental and in-house wash cycles.
            </p>
          </div>
          <img
            src={factoryImage}
            alt="Workwear stitching line at the RION APPARELS factory"
            width={1408}
            height={1056}
            loading="lazy"
            className="w-full border border-border object-cover"
          />
        </div>
      </section>
    </>
  );
}
