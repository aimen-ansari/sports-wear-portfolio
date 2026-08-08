import { createFileRoute } from "@tanstack/react-router";
import { CONTACT } from "@/data/catalog";
import { canonicalLinks } from "@/lib/site";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy | RION SPORTS" },
      {
        name: "description",
        content:
          "How RION SPORTS collects, uses and protects the business information submitted through our workwear manufacturing inquiry forms.",
      },
      { property: "og:title", content: "Privacy Policy | RION SPORTS" },
      {
        property: "og:description",
        content: "Our approach to handling business inquiry data and reference files.",
      },
    ],
    links: canonicalLinks("/privacy"),
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <section className="py-16 lg:py-24">
      <div className="container-page max-w-3xl">
        <p className="eyebrow">Legal</p>
        <h1 className="mt-3 text-3xl leading-[1.1] md:text-[2.5rem]">Privacy Policy</h1>
        <div className="mt-10 space-y-8 text-sm leading-relaxed text-muted-foreground">
          <p>Last updated: August 8, 2026</p>
          <div>
            <h2 className="text-lg text-foreground">Information we collect</h2>
            <p className="mt-3">
              When you submit a manufacturing inquiry we collect the details you provide: name,
              company, email, phone or WhatsApp number, country, product interest, quantities,
              customization requirements and any reference files you attach.
            </p>
          </div>
          <div>
            <h2 className="text-lg text-foreground">How we use it</h2>
            <p className="mt-3">
              Your information is used solely to respond to your inquiry, prepare quotations,
              develop samples and manage production and shipping of orders you place with us. We do
              not sell or rent business contact data.
            </p>
          </div>
          <div>
            <h2 className="text-lg text-foreground">Service providers</h2>
            <p className="mt-3">
              We may use contracted email, inquiry delivery, file storage and security providers to
              process your request on our behalf. Providers are limited to the information needed to
              operate their service and support this website.
            </p>
          </div>
          <div>
            <h2 className="text-lg text-foreground">Design confidentiality</h2>
            <p className="mt-3">
              Tech packs, artwork and product designs shared with us are treated as confidential and
              used only to quote and produce your order. A formal non-disclosure agreement can be
              signed on request before any development work begins.
            </p>
          </div>
          <div>
            <h2 className="text-lg text-foreground">Retention and access</h2>
            <p className="mt-3">
              Inquiry records are retained for as long as needed to support your programme and meet
              export documentation obligations. To request access to or deletion of your data,
              contact us at {CONTACT.email}.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
