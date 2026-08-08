import { createFileRoute } from "@tanstack/react-router";
import factoryImage from "@/assets/factory.jpg";
import fabricsImage from "@/assets/fabrics.jpg";
import { InquiryForm } from "@/components/site/InquiryForm";
import { SectionHeading } from "@/components/site/SectionHeading";
import { canonicalLinks } from "@/lib/site";

export const Route = createFileRoute("/custom-manufacturing")({
  head: () => ({
    meta: [
      { title: "Custom Workwear Manufacturing — OEM, ODM & Private Label | RION SPORTS" },
      {
        name: "description",
        content:
          "OEM and ODM workwear manufacturing, private label production, custom fabrics, colours, embroidery, printing, labels and export packaging by RION SPORTS.",
      },
      {
        property: "og:title",
        content: "Custom Workwear Manufacturing — OEM, ODM & Private Label | RION SPORTS",
      },
      {
        property: "og:description",
        content:
          "From requirement sheet to bulk dispatch: our seven-step workwear manufacturing process for international B2B buyers.",
      },
    ],
    links: canonicalLinks("/custom-manufacturing"),
  }),
  component: CustomManufacturingPage,
});

const steps = [
  {
    title: "Share Your Requirements",
    text: "Send a tech pack, sample garment or written brief. We confirm feasibility, fabric options and indicative MOQs.",
  },
  {
    title: "Material & Design Selection",
    text: "We propose fabrics, trims and colourways with swatches, and finalise the pattern and construction plan.",
  },
  {
    title: "Sampling",
    text: "A pre-production sample is developed in your specification with a full measurement sheet.",
  },
  {
    title: "Approval",
    text: "You approve fit, fabric, branding and packaging in writing. Comments are recorded in the technical file.",
  },
  {
    title: "Bulk Production",
    text: "Cutting, sewing and finishing run against the approved file with in-line quality checks at each stage.",
  },
  {
    title: "Quality Inspection",
    text: "Measurements, stitching, trims and branding are inspected before packing, with a pre-shipment report.",
  },
  {
    title: "Packaging & Dispatch",
    text: "Garments are packed to your carton specification, documented and released to your nominated forwarder.",
  },
];

const services = [
  {
    title: "OEM Manufacturing",
    text: "We manufacture to your existing patterns, tech packs and quality standards without design intervention.",
  },
  {
    title: "ODM Manufacturing",
    text: "Our team develops the design, pattern and specification around your market brief and price target.",
  },
  {
    title: "Private Label",
    text: "Woven labels, printed care labels, hangtags, size tabs and branded polybags under your own brand.",
  },
  {
    title: "Custom Fabrics",
    text: "Poly-cotton, canvas, ripstop, oxford, softshell, flame-retardant and anti-static options by weight.",
  },
  {
    title: "Custom Colors",
    text: "Lab-dip matching to Pantone or physical swatches, including two-tone and contrast trim combinations.",
  },
  {
    title: "Embroidery",
    text: "Flat, 3D and appliqué embroidery with digitised files approved before bulk application.",
  },
  {
    title: "Printing",
    text: "Screen printing, heat transfer and reflective transfer suitable for industrial laundering.",
  },
  {
    title: "Labels & Tags",
    text: "Main labels, size labels, care instructions, barcode tickets and country-of-origin marking.",
  },
  {
    title: "Custom Packaging",
    text: "Individual polybags, printed inserts, folded or hanging presentation and buyer carton marking.",
  },
];

function CustomManufacturingPage() {
  return (
    <>
      <section className="relative border-b border-border">
        <img
          src={factoryImage}
          alt="Workwear manufacturing line at RION SPORTS"
          width={1408}
          height={1056}
          className="h-[42vh] min-h-[320px] w-full object-cover"
        />
        <div className="absolute inset-0 bg-[oklch(0.19_0.03_258/0.72)]" />
        <div className="absolute inset-0 flex items-center">
          <div className="container-page text-primary-foreground">
            <p className="eyebrow text-primary-foreground/70">Custom Manufacturing</p>
            <h1 className="mt-3 max-w-3xl text-3xl leading-[1.1] md:text-[2.75rem]">
              Your Specification, Manufactured End to End
            </h1>
            <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-primary-foreground/75">
              A structured seven-step process that takes your workwear programme from first brief to
              inspected, documented dispatch.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="container-page">
          <SectionHeading eyebrow="Process" title="How a Programme Runs" />
          <ol className="mt-12 grid gap-px border border-border bg-border md:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, i) => (
              <li key={step.title} className="group bg-card p-7 transition-colors hover:bg-surface">
                <span className="font-display text-sm font-bold text-accent">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-4 text-base font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="border-y border-border bg-surface py-16 lg:py-24">
        <div className="container-page">
          <SectionHeading
            eyebrow="Capabilities"
            title="Manufacturing & Customization Services"
            description="Combine any of the following into a single programme — most buyers start with private label branding on an existing style and expand into full custom development."
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s) => (
              <div key={s.title} className="card-surface p-7 hover:shadow-[var(--shadow-card)]">
                <h3 className="text-base font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="container-page grid gap-12 lg:grid-cols-[1fr_1.25fr] lg:gap-16">
          <div>
            <p className="eyebrow">Start Your Project</p>
            <h2 className="mt-3 text-3xl leading-[1.1]">Tell Us What You Need to Build</h2>
            <p className="mt-5 text-[15px] leading-relaxed text-muted-foreground">
              Share your target market, quantities and branding requirements. We reply with fabric
              recommendations, minimum order quantities, sampling timelines and indicative pricing.
            </p>
            <img
              src={fabricsImage}
              alt="Workwear fabric options available for custom manufacturing"
              width={1400}
              height={1050}
              loading="lazy"
              className="mt-10 hidden w-full border border-border object-cover lg:block"
            />
          </div>
          <InquiryForm
            title="Start Your Project"
            description="Attach a tech pack or reference image if available — it shortens the development cycle considerably."
          />
        </div>
      </section>
    </>
  );
}
