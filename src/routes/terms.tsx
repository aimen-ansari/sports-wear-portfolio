import { createFileRoute } from "@tanstack/react-router";
import { CONTACT } from "@/data/catalog";
import { canonicalLinks } from "@/lib/site";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Business | RION SPORTS" },
      {
        name: "description",
        content:
          "RION SPORTS terms of business covering quotations, samples, minimum order quantities, production tolerances, payment and shipping.",
      },
      { property: "og:title", content: "Terms of Business | RION SPORTS" },
      {
        property: "og:description",
        content: "Quotation validity, sampling, tolerances, payment terms and delivery conditions.",
      },
    ],
    links: canonicalLinks("/terms"),
  }),
  component: TermsPage,
});

const sections = [
  {
    title: "Quotations",
    body: "Quotations are indicative until fabric, trims and specifications are confirmed in writing, and remain valid for 30 days subject to raw material availability and currency movement.",
  },
  {
    title: "Samples",
    body: "Pre-production samples are chargeable and courier costs are borne by the buyer. Sample charges may be credited against a confirmed bulk order.",
  },
  {
    title: "Minimum order quantities",
    body: "MOQs apply per style and per colour and are stated in each quotation. Lower quantities may be accepted at an adjusted unit price.",
  },
  {
    title: "Production tolerances",
    body: "Standard industry tolerances apply to measurements, shade matching and quantity shipped. Tolerances are documented in the approved technical file for each order.",
  },
  {
    title: "Payment terms",
    body: "Standard terms are an advance deposit against order confirmation with the balance due before dispatch or against documents. Letter of credit terms are available for established programmes.",
  },
  {
    title: "Shipping and title",
    body: "Goods are supplied on the Incoterms stated in the order confirmation. Risk passes in accordance with those terms, and title passes on receipt of full payment.",
  },
  {
    title: "Claims",
    body: "Quality claims must be raised within 15 days of receipt with supporting photographs and inspection details so that they can be verified against the pre-shipment report.",
  },
];

function TermsPage() {
  return (
    <section className="py-16 lg:py-24">
      <div className="container-page max-w-3xl">
        <p className="eyebrow">Legal</p>
        <h1 className="mt-3 text-3xl leading-[1.1] md:text-[2.5rem]">Terms of Business</h1>
        <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
          These terms apply to all quotations and orders unless replaced by a signed supply
          agreement. For clarification, contact {CONTACT.email}.
        </p>
        <dl className="mt-10 divide-y divide-border border-y border-border">
          {sections.map((s) => (
            <div key={s.title} className="py-6">
              <dt className="text-base font-semibold">{s.title}</dt>
              <dd className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.body}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
