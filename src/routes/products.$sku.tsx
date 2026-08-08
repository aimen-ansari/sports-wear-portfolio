import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, MessageCircle } from "lucide-react";
import { getProduct, hasWhatsApp, products, whatsappLink, type Product } from "@/data/catalog";
import { InquiryForm } from "@/components/site/InquiryForm";
import { ProductCard } from "@/components/site/ProductCard";
import { absoluteUrl, canonicalLinks } from "@/lib/site";

export const Route = createFileRoute("/products/$sku")({
  loader: ({ params }) => {
    const product = getProduct(params.sku);
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [
          { title: "Product unavailable | RION SPORTS" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const { product } = loaderData;
    const title = `${product.name} (${product.sku}) | RION SPORTS`;
    return {
      meta: [
        { title },
        { name: "description", content: product.shortDescription },
        { property: "og:title", content: title },
        { property: "og:description", content: product.shortDescription },
        { property: "og:image", content: absoluteUrl(product.image) },
        { name: "twitter:image", content: absoluteUrl(product.image) },
      ],
      links: canonicalLinks(`/products/${product.sku}`),
    };
  },
  component: ProductDetail,
});

function ProductDetail() {
  const { product } = Route.useLoaderData() as { product: Product };
  const [active, setActive] = useState(0);
  const related = products
    .filter((candidate) => candidate.sku !== product.sku)
    .sort((left, right) => {
      const leftScore =
        Number(left.categorySlug === product.categorySlug) + Number(left.type === product.type);
      const rightScore =
        Number(right.categorySlug === product.categorySlug) + Number(right.type === product.type);
      return rightScore - leftScore;
    })
    .slice(0, 4);

  return (
    <>
      <div className="border-b border-border">
        <div className="container-page flex items-center gap-2 py-5 text-xs text-muted-foreground">
          <Link to="/products" className="inline-flex items-center gap-1.5 hover:text-foreground">
            <ArrowLeft className="h-3.5 w-3.5" /> Catalog
          </Link>
          <span>/</span>
          <span>{product.category}</span>
          <span>/</span>
          <span className="text-foreground">{product.name}</span>
        </div>
      </div>

      <section className="py-12 lg:py-20">
        <div className="container-page grid gap-12 lg:grid-cols-2 lg:gap-16">
          {/* GALLERY */}
          <div>
            <div className="overflow-hidden border border-border bg-surface">
              <img
                src={product.gallery[active] ?? product.image}
                alt={`${product.name} — ${product.category}`}
                width={1000}
                height={1250}
                className="aspect-4/5 w-full object-cover"
              />
            </div>
            <div className="mt-4 flex gap-3">
              {product.gallery.map((img, i) => (
                <button
                  key={img + i}
                  type="button"
                  onClick={() => setActive(i)}
                  aria-label={`View image ${i + 1}`}
                  aria-pressed={active === i}
                  className={`w-20 shrink-0 overflow-hidden border transition-colors ${
                    active === i ? "border-accent" : "border-border hover:border-border-strong"
                  }`}
                >
                  <img
                    src={img}
                    alt={`${product.name} view ${i + 1}`}
                    loading="lazy"
                    className="aspect-4/5 w-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* SUMMARY */}
          <div>
            <p className="eyebrow">{product.category}</p>
            <h1 className="mt-3 text-3xl leading-[1.1] md:text-[2.5rem]">{product.name}</h1>
            <p className="mt-3 font-mono text-sm text-muted-foreground">
              Product code: {product.sku}
            </p>
            <p className="mt-6 text-[15px] leading-relaxed text-muted-foreground">
              {product.shortDescription}
            </p>

            <dl className="mt-8 space-y-6 border-t border-border pt-8">
              <div>
                <dt className="eyebrow">Available Colors</dt>
                <dd className="mt-3 flex flex-wrap gap-3">
                  {product.colors.map((c) => (
                    <span key={c.name} className="inline-flex items-center gap-2 text-sm">
                      <span
                        className="h-4 w-4 rounded-full border border-border-strong"
                        style={{ backgroundColor: c.hex }}
                      />
                      {c.name}
                    </span>
                  ))}
                </dd>
              </div>
              <div>
                <dt className="eyebrow">Available Sizes</dt>
                <dd className="mt-3 flex flex-wrap gap-2">
                  {product.sizes.map((s) => (
                    <span
                      key={s}
                      className="border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground"
                    >
                      {s}
                    </span>
                  ))}
                </dd>
              </div>
              <div>
                <dt className="eyebrow">Material / Fabric</dt>
                <dd className="mt-2 text-sm">{product.material}</dd>
              </div>
              <div>
                <dt className="eyebrow">Key Features</dt>
                <dd className="mt-3">
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    {product.features.slice(0, 4).map((f) => (
                      <li key={f} className="flex gap-3">
                        <span className="mt-2 h-1 w-1 shrink-0 bg-accent" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </dd>
              </div>
            </dl>

            <div className="mt-10 flex flex-wrap gap-3">
              <a href="#inquiry" className="btn-base btn-accent">
                Request Quote
              </a>
              {hasWhatsApp && (
                <a
                  href={whatsappLink(
                    `Hello RION SPORTS, I would like to ask about ${product.name} (${product.sku}).`,
                  )}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-base btn-outline"
                >
                  <MessageCircle className="h-4 w-4" />
                  Ask About This Product
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* DETAIL BLOCKS */}
      <section className="border-t border-border bg-surface py-16 lg:py-24">
        <div className="container-page grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="space-y-12">
            <Block title="Product Description">
              <p className="text-sm leading-relaxed text-muted-foreground">{product.description}</p>
            </Block>
            <Block title="Specifications" id="specifications">
              <dl className="divide-y divide-border border-y border-border">
                {product.specifications.map((s) => (
                  <div key={s.label} className="grid grid-cols-2 gap-4 py-3 text-sm">
                    <dt className="text-muted-foreground">{s.label}</dt>
                    <dd>{s.value}</dd>
                  </div>
                ))}
              </dl>
            </Block>
            <Block title="Features">
              <ul className="space-y-2.5 text-sm text-muted-foreground">
                {product.features.map((f) => (
                  <li key={f} className="flex gap-3">
                    <span className="mt-2 h-1 w-1 shrink-0 bg-accent" />
                    {f}
                  </li>
                ))}
              </ul>
            </Block>
          </div>
          <div className="space-y-12">
            <Block title="Customization Options">
              <ul className="space-y-2.5 text-sm text-muted-foreground">
                {product.customization.map((c) => (
                  <li key={c} className="flex gap-3">
                    <span className="mt-2 h-1 w-1 shrink-0 bg-accent" />
                    {c}
                  </li>
                ))}
              </ul>
            </Block>
            <Block title="Available Materials">
              <ul className="flex flex-wrap gap-2">
                {product.materials.map((m) => (
                  <li
                    key={m}
                    className="border border-border bg-card px-3 py-2 text-xs text-muted-foreground"
                  >
                    {m}
                  </li>
                ))}
              </ul>
            </Block>
            <Block title="Size Information">
              <p className="text-sm leading-relaxed text-muted-foreground">{product.sizeInfo}</p>
            </Block>
            <Block title="Packaging">
              <p className="text-sm leading-relaxed text-muted-foreground">{product.packaging}</p>
            </Block>
          </div>
        </div>
      </section>

      {/* INQUIRY */}
      <section id="inquiry" className="py-16 lg:py-24">
        <div className="container-page grid gap-12 lg:grid-cols-[1fr_1.3fr] lg:gap-16">
          <div>
            <p className="eyebrow">Inquiry</p>
            <h2 className="mt-3 text-3xl leading-[1.1]">Request a Quotation</h2>
            <p className="mt-5 text-[15px] leading-relaxed text-muted-foreground">
              Send us your target quantity, colours and branding requirements. Our export team
              responds with specification confirmation, minimum order quantities and indicative
              pricing.
            </p>
          </div>
          <InquiryForm
            productReference={`${product.name} — ${product.sku}`}
            title="Product Inquiry"
            description="This inquiry is automatically linked to the product you are viewing."
          />
        </div>
      </section>

      {/* RELATED */}
      <section className="border-t border-border bg-surface py-16 lg:py-24">
        <div className="container-page">
          <h2 className="text-2xl">Related Products</h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.sku} product={p} />
            ))}
          </div>
        </div>
      </section>
    </>
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
