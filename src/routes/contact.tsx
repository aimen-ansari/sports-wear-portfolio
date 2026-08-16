import { createFileRoute } from "@tanstack/react-router";
import { Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { CONTACT, hasWhatsApp, whatsappLink } from "@/data/catalog";
import { InquiryForm } from "@/components/site/InquiryForm";
import { canonicalLinks } from "@/lib/site";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Request a Quote | Contact RION APPARELS Workwear Manufacturing" },
      {
        name: "description",
        content:
          "Contact RION APPARELS for workwear manufacturing quotations. Send your product category, quantities and customization requirements to our export team.",
      },
      { property: "og:title", content: "Request a Quote | Contact RION APPARELS" },
      {
        property: "og:description",
        content:
          "Submit a B2B manufacturing inquiry — product category, estimated quantity, branding requirements and reference files.",
      },
    ],
    links: canonicalLinks("/contact"),
  }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <>
      <section className="border-b border-border bg-surface py-14 lg:py-20">
        <div className="container-page">
          <p className="eyebrow">Contact</p>
          <h1 className="mt-3 max-w-3xl text-3xl leading-[1.1] md:text-[2.75rem]">
            Request a Quote
          </h1>
          <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
            Send your requirement and our export team will respond within one business day with
            specifications, minimum order quantities and indicative pricing.
          </p>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="container-page grid gap-12 lg:grid-cols-[1fr_1.5fr] lg:gap-16">
          <div className="space-y-8">
            <InfoRow
              Icon={Mail}
              label="Email"
              value={CONTACT.email}
              href={`mailto:${CONTACT.email}`}
            />
            {CONTACT.phone && (
              <InfoRow
                Icon={Phone}
                label="Phone"
                value={CONTACT.phone}
                href={`tel:${CONTACT.phone.replace(/\s/g, "")}`}
              />
            )}
            {hasWhatsApp && (
              <InfoRow
                Icon={MessageCircle}
                label="WhatsApp"
                value={CONTACT.phone || "Chat on WhatsApp"}
                href={whatsappLink()}
              />
            )}
            <InfoRow Icon={MapPin} label="Business Address" value={CONTACT.address} />
            <InfoRow Icon={Clock} label="Business Hours" value={CONTACT.hours} />

            <div className="border-t border-border pt-8">
              <p className="eyebrow">What to include</p>
              <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
                {[
                  "Product category and reference style or SKU",
                  "Estimated quantity per colour and size assortment",
                  "Fabric preference or target price level",
                  "Branding requirements: labels, embroidery, printing",
                  "Destination country and required delivery window",
                ].map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="mt-2 h-1 w-1 shrink-0 bg-accent" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <InquiryForm
            title="Business Inquiry Form"
            description="All fields marked in the form help us reply with an accurate quotation the first time."
          />
        </div>
      </section>
    </>
  );
}

function InfoRow({
  Icon,
  label,
  value,
  href,
}: {
  Icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  label: string;
  value: string;
  href?: string;
}) {
  return (
    <div className="flex gap-4">
      <Icon className="mt-0.5 h-5 w-5 shrink-0 text-accent" strokeWidth={1.5} />
      <div className="min-w-0">
        <p className="eyebrow">{label}</p>
        {href ? (
          <a
            href={href}
            target={href.startsWith("http") ? "_blank" : undefined}
            rel="noreferrer"
            className="mt-1 block text-sm transition-colors hover:text-accent"
          >
            {value}
          </a>
        ) : (
          <p className="mt-1 text-sm leading-relaxed">{value}</p>
        )}
      </div>
    </div>
  );
}
