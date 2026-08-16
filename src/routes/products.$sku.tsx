import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, ImageIcon, MessageCircle } from "lucide-react";
import { useState } from "react";
import { InquiryForm } from "@/components/site/InquiryForm";
import { ProductCard } from "@/components/site/ProductCard";
import { hasWhatsApp, whatsappLink } from "@/data/catalog";
import { getActiveProduct, getActiveProducts } from "@/lib/catalog-api";
import { absoluteUrl, canonicalLinks } from "@/lib/site";

export const Route = createFileRoute("/products/$sku")({
  loader: async ({ params }) => {
    const product = await getActiveProduct(params.sku);
    if (!product) throw notFound();
    const products = await getActiveProducts();
    return {
      product,
      related: products
        .filter((candidate) => candidate.id !== product.id)
        .sort(
          (left, right) =>
            Number(right.category_id === product.category_id) -
            Number(left.category_id === product.category_id),
        )
        .slice(0, 4),
    };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [{ title: "Product unavailable | RION APPARELS" }] };
    const { product } = loaderData;
    const title = `${product.name} (${product.sku}) | RION APPARELS`;
    const image = product.image_urls[0];
    return {
      meta: [
        { title },
        { name: "description", content: product.short_description },
        { property: "og:title", content: title },
        { property: "og:description", content: product.short_description },
        ...(image ? [{ property: "og:image", content: absoluteUrl(image) }] : []),
      ],
      links: canonicalLinks(`/products/${product.sku}`),
    };
  },
  component: ProductDetail,
});

function ProductDetail() {
  const { product, related } = Route.useLoaderData();
  const [active, setActive] = useState(0);
  const activeImage = product.image_urls[active] ?? product.image_urls[0];
  const categoryName = product.categories?.name ?? "Workwear";

  return (
    <>
      <div className="border-b border-border">
        <div className="container-page flex items-center gap-2 py-5 text-xs text-muted-foreground">
          <Link to="/products" className="inline-flex items-center gap-1.5 hover:text-foreground">
            <ArrowLeft className="h-3.5 w-3.5" /> Catalog
          </Link>
          <span>/</span>
          <span>{categoryName}</span>
          <span>/</span>
          <span className="text-foreground">{product.name}</span>
        </div>
      </div>
      <section className="py-12 lg:py-20">
        <div className="container-page grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <div className="overflow-hidden border border-border bg-surface">
              {activeImage ? (
                <img
                  src={activeImage}
                  alt={`${product.name} — ${categoryName}`}
                  width={1000}
                  height={1250}
                  className="aspect-4/5 w-full object-cover"
                />
              ) : (
                <div className="flex aspect-4/5 items-center justify-center text-muted-foreground">
                  <ImageIcon className="h-10 w-10" />
                  <span className="sr-only">No product image available</span>
                </div>
              )}
            </div>
            {product.image_urls.length > 1 && (
              <div className="mt-4 flex gap-3 overflow-x-auto">
                {product.image_urls.map((image, index) => (
                  <button
                    key={image}
                    type="button"
                    onClick={() => setActive(index)}
                    aria-label={`View image ${index + 1}`}
                    aria-pressed={active === index}
                    className={`w-20 shrink-0 overflow-hidden border ${active === index ? "border-accent" : "border-border"}`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} view ${index + 1}`}
                      className="aspect-4/5 w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
          <div>
            <p className="eyebrow">{categoryName}</p>
            <h1 className="mt-3 text-3xl leading-[1.1] md:text-[2.5rem]">{product.name}</h1>
            <p className="mt-3 font-mono text-sm text-muted-foreground">
              Product code: {product.sku}
            </p>
            <p className="mt-6 text-[15px] leading-relaxed text-muted-foreground">
              {product.short_description}
            </p>
            <dl className="mt-8 space-y-6 border-t border-border pt-8">
              <ProductList label="Available Colors" values={product.available_colors} />
              <ProductList label="Available Sizes" values={product.available_sizes} />
              {product.material && (
                <div>
                  <dt className="eyebrow">Material / Fabric</dt>
                  <dd className="mt-2 text-sm">{product.material}</dd>
                </div>
              )}
              <ProductList label="Key Features" values={product.features.slice(0, 4)} bullets />
            </dl>
            <div className="mt-10 flex flex-wrap gap-3">
              <a href="#inquiry" className="btn-base btn-accent">
                Request Quote
              </a>
              {hasWhatsApp && (
                <a
                  href={whatsappLink(
                    `Hello RION APPARELS, I would like to ask about ${product.name} (${product.sku}).`,
                  )}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-base btn-outline"
                >
                  <MessageCircle className="h-4 w-4" /> Ask About This Product
                </a>
              )}
            </div>
          </div>
        </div>
      </section>
      <section className="border-t border-border bg-surface py-16 lg:py-24">
        <div className="container-page grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="space-y-12">
            <Block title="Product Description">
              <p className="text-sm leading-relaxed text-muted-foreground">{product.description}</p>
            </Block>
            <Block title="Features" id="specifications">
              <DetailList values={product.features} />
            </Block>
          </div>
          <div className="space-y-12">
            <Block title="Customization Options">
              <DetailList values={product.customization_options} />
            </Block>
            <Block title="Material">
              <p className="text-sm leading-relaxed text-muted-foreground">
                {product.material || "Available to buyer specification."}
              </p>
            </Block>
          </div>
        </div>
      </section>
      <section id="inquiry" className="py-16 lg:py-24">
        <div className="container-page grid gap-12 lg:grid-cols-[1fr_1.3fr] lg:gap-16">
          <div>
            <p className="eyebrow">Inquiry</p>
            <h2 className="mt-3 text-3xl leading-[1.1]">Request a Quotation</h2>
            <p className="mt-5 text-[15px] leading-relaxed text-muted-foreground">
              Send your target quantity, colours and branding requirements. Our export team will
              reply with specification confirmation and indicative pricing.
            </p>
          </div>
          <InquiryForm
            product={product}
            title="Product Inquiry"
            description="This inquiry is automatically linked to the product you are viewing."
          />
        </div>
      </section>
      {related.length > 0 && (
        <section className="border-t border-border bg-surface py-16 lg:py-24">
          <div className="container-page">
            <h2 className="text-2xl">Related Products</h2>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((item) => (
                <ProductCard key={item.id} product={item} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}

function ProductList({
  label,
  values,
  bullets = false,
}: {
  label: string;
  values: string[];
  bullets?: boolean;
}) {
  if (!values.length) return null;
  return (
    <div>
      <dt className="eyebrow">{label}</dt>
      <dd className={`mt-3 ${bullets ? "space-y-2" : "flex flex-wrap gap-2"}`}>
        {values.map((value) =>
          bullets ? (
            <span key={value} className="flex gap-3 text-sm text-muted-foreground">
              <span className="mt-2 h-1 w-1 shrink-0 bg-accent" />
              {value}
            </span>
          ) : (
            <span
              key={value}
              className="border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground"
            >
              {value}
            </span>
          ),
        )}
      </dd>
    </div>
  );
}

function DetailList({ values }: { values: string[] }) {
  return values.length ? (
    <ul className="space-y-2.5 text-sm text-muted-foreground">
      {values.map((value) => (
        <li key={value} className="flex gap-3">
          <span className="mt-2 h-1 w-1 shrink-0 bg-accent" />
          {value}
        </li>
      ))}
    </ul>
  ) : (
    <p className="text-sm text-muted-foreground">Available to buyer specification.</p>
  );
}

function Block({ title, id, children }: { title: string; id?: string; children: React.ReactNode }) {
  return (
    <div id={id} className="scroll-mt-28">
      <h2 className="rule-accent text-xl">{title}</h2>
      <div className="mt-1">{children}</div>
    </div>
  );
}
