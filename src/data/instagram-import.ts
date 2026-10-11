/**
 * Catalog data extracted from the @rion_apparel Instagram profile
 * (https://www.instagram.com/rion_apparel/).
 *
 * The matching photography lives in `public/instagram/<postCode>.jpg`, so the
 * admin import screen can read it from the same origin and upload it to
 * Supabase Storage without any third-party hotlinking.
 *
 * Instagram only exposes the first page of posts to logged-out visitors, so
 * this manifest covers the 12 most recent posts. Edit the entries below (or add
 * new ones with a matching image file) to refine the imported catalog.
 */

export type InstagramImportCategory = {
  name: string;
  slug: string;
  description: string;
  displayOrder: number;
};

export type InstagramImportProduct = {
  /** Instagram post shortcode, also used as the image file name. */
  code: string;
  name: string;
  sku: string;
  slug: string;
  categorySlug: string;
  shortDescription: string;
  description: string;
  material: string;
  sizes: string[];
  colors: string[];
  features: string[];
  customization: string[];
  isFeatured: boolean;
};

export const INSTAGRAM_IMPORT_SOURCE = "https://www.instagram.com/rion_apparel/";

export const instagramImagePath = (code: string) => `/instagram/${code}.jpg`;

export const instagramImportCategories: InstagramImportCategory[] = [
  {
    name: "Workwear",
    slug: "workwear",
    description: "Everyday workwear and uniform programmes made to buyer specification.",
    displayOrder: 90,
  },
  {
    name: "Tactical Trousers",
    slug: "tactical-trousers",
    description:
      "Heavy-duty tactical pants with reinforced knees, knee-pad pockets and multi-pocket storage.",
    displayOrder: 100,
  },
  {
    name: "Tactical Shorts",
    slug: "tactical-shorts",
    description: "Durable tactical shorts for warm-weather site and field work.",
    displayOrder: 110,
  },
  {
    name: "Polo Shirts",
    slug: "polo-shirts",
    description: "Breathable custom polo shirts for corporate and field teams.",
    displayOrder: 120,
  },
  {
    name: "Bags & Packaging",
    slug: "bags-packaging",
    description: "Custom-printed tote bags and branded packaging produced in bulk.",
    displayOrder: 130,
  },
];

export const instagramImportProducts: InstagramImportProduct[] = [
  {
    code: "DLVQrwbtfK1",
    name: "General Purpose Workwear",
    sku: "RS-IG-9001",
    slug: "general-purpose-workwear",
    categorySlug: "workwear",
    shortDescription: "A versatile workwear programme available in men's and women's fits.",
    description:
      "Workwear for all kinds of work, manufactured for bulk supply. Available in both men's and women's sizes with your choice of fabric, colour and branding.",
    material: "To buyer specification",
    sizes: ["S", "M", "L", "XL", "2XL", "3XL", "4XL"],
    colors: ["To specification"],
    features: [
      "Men's and women's fits",
      "Bulk production",
      "Built for everyday site and workshop use",
    ],
    customization: ["Custom colours", "Logo embroidery or printing", "Private labels"],
    isFeatured: true,
  },
  {
    code: "DM-bx6yNY-U",
    name: "Working Tactical Pant",
    sku: "RS-TP-9002",
    slug: "working-tactical-pant",
    categorySlug: "tactical-trousers",
    shortDescription: "All-size tactical pant at an affordable trade price.",
    description:
      "Working tactical pant available in all sizes at an affordable wholesale price. Built for staff and worker uniforms with bulk order support.",
    material: "Heavy-duty poly-cotton, to specification",
    sizes: ["28", "30", "32", "34", "36", "38", "40", "42"],
    colors: ["Black", "Khaki", "Navy", "Grey"],
    features: ["Available in all sizes", "Affordable bulk pricing", "Durable construction"],
    customization: ["Custom colours", "Logo embroidery or printing", "Private labels"],
    isFeatured: true,
  },
  {
    code: "DM-bP3yNK3m",
    name: "Working Tactical Short",
    sku: "RS-TS-9003",
    slug: "working-tactical-short",
    categorySlug: "tactical-shorts",
    shortDescription: "All-size tactical short for warm-weather workwear.",
    description:
      "Working tactical short available in all sizes at an affordable wholesale price, with bulk production for staff and worker programmes.",
    material: "Heavy-duty poly-cotton, to specification",
    sizes: ["28", "30", "32", "34", "36", "38", "40", "42"],
    colors: ["Black", "Khaki", "Navy", "Grey"],
    features: ["Available in all sizes", "Affordable bulk pricing", "Reinforced stitching"],
    customization: ["Custom colours", "Logo embroidery or printing", "Private labels"],
    isFeatured: false,
  },
  {
    code: "Dd_9a7iuBd-",
    name: "Workteam Tactical Pant",
    sku: "RS-TP-9004",
    slug: "workteam-tactical-pant",
    categorySlug: "tactical-trousers",
    shortDescription: "300 GSM tactical work pant with knee reinforcement and knee-pad pockets.",
    description:
      "Workteam tactical pants built from 300 GSM heavy-duty fabric with knee reinforcements and a Velcro knee-pad pocket. Multiple bellows pockets with Velcro closures keep tools secure and within reach in the most demanding environments.",
    material: "300 GSM heavy-duty fabric",
    sizes: ["30", "32", "34", "36", "38", "40", "42"],
    colors: ["Black", "Khaki", "Navy", "Grey"],
    features: [
      "Reinforced knees",
      "Knee-pad pocket with Velcro closure",
      "Multiple bellows pockets with Velcro closures",
      "300 GSM heavy-duty fabric",
      "Multi-pocket versatility",
    ],
    customization: ["Custom colours", "Logo embroidery or printing", "Private labels", "OEM"],
    isFeatured: true,
  },
  {
    code: "Ddpx1HhqRrH",
    name: "Custom Work Tactical Pant",
    sku: "RS-TP-9005",
    slug: "custom-work-tactical-pant",
    categorySlug: "tactical-trousers",
    shortDescription: "Bulk tactical pant with custom logo, sizes, embroidery and printing.",
    description:
      "Work tactical pants supplied in bulk with full customisation: custom logo, custom sizes, embroidery, printing, OEM, woven labels and private labels.",
    material: "Heavy-duty poly-cotton, to specification",
    sizes: ["30", "32", "34", "36", "38", "40", "42"],
    colors: ["Black", "Khaki", "Navy", "Grey"],
    features: ["Bulk order ready", "Custom sizes", "Built for demanding work environments"],
    customization: [
      "Custom logo",
      "Custom sizes",
      "Embroidery",
      "Printing",
      "OEM",
      "Woven labels",
      "Private labels",
    ],
    isFeatured: true,
  },
  {
    code: "DdWp3SHgIdo",
    name: "Custom Packaging & Tote Bags",
    sku: "RS-BG-9006",
    slug: "custom-packaging-tote-bags",
    categorySlug: "bags-packaging",
    shortDescription: "Custom-printed tote bags and packaging produced in bulk.",
    description:
      "Custom packaging and tote bags available in bulk with a custom logo, design and colour, plus printing and OEM / private label options.",
    material: "To buyer specification",
    sizes: ["Custom"],
    colors: ["Custom"],
    features: ["Available in bulk", "Custom design and colour", "Printing included"],
    customization: [
      "Custom logo",
      "Custom design",
      "Custom colour",
      "Printing",
      "OEM and private labels",
    ],
    isFeatured: false,
  },
  {
    code: "DdCN1tpDo7v",
    name: "Custom Workwear Polo Shirt",
    sku: "RS-PS-9007",
    slug: "custom-workwear-polo-shirt",
    categorySlug: "polo-shirts",
    shortDescription: "Breathable, comfortable custom polo shirts for teams.",
    description:
      "Custom-made workwear polo shirts that are breathable and comfortable, produced to your specification with your branding.",
    material: "Breathable knit, to specification",
    sizes: ["S", "M", "L", "XL", "2XL", "3XL", "4XL"],
    colors: ["To specification"],
    features: ["Breathable", "Comfortable", "Custom made"],
    customization: ["Custom colours", "Logo embroidery or printing", "Private labels"],
    isFeatured: true,
  },
  {
    code: "Dc8xgsAjc4J",
    name: "8-Pocket Tactical Pant",
    sku: "RS-TP-9008",
    slug: "8-pocket-tactical-pant",
    categorySlug: "tactical-trousers",
    shortDescription: "Eight-pocket tactical pant made from breathable, durable strong fabric.",
    description:
      "Working tactical pants with 8 pockets for large storage. Breathable, comfortable and durable, made from strong fabric for everyday industrial use.",
    material: "Strong durable fabric, to specification",
    sizes: ["30", "32", "34", "36", "38", "40", "42"],
    colors: ["Black", "Khaki", "Navy", "Grey"],
    features: [
      "8 pockets for large storage",
      "Breathable",
      "Comfortable",
      "Durable",
      "Strong fabric",
    ],
    customization: ["Custom colours", "Logo embroidery or printing", "Private labels"],
    isFeatured: true,
  },
  {
    code: "DczzaqZCnSS",
    name: "Custom Workwear Set",
    sku: "RS-IG-9009",
    slug: "custom-workwear-set",
    categorySlug: "workwear",
    shortDescription: "Custom workwear manufactured to your specification.",
    description:
      "Custom workwear manufactured to your specification with your choice of fabric, colour, sizing and branding. Bulk orders supported.",
    material: "To buyer specification",
    sizes: ["S", "M", "L", "XL", "2XL", "3XL", "4XL"],
    colors: ["To specification"],
    features: ["Made to specification", "Bulk production", "Branding available"],
    customization: ["Custom colours", "Logo embroidery or printing", "Private labels"],
    isFeatured: false,
  },
  {
    code: "Dcw91CMBIcu",
    name: "Custom Logo Tactical Pant",
    sku: "RS-TP-9010",
    slug: "custom-logo-tactical-pant",
    categorySlug: "tactical-trousers",
    shortDescription: "Bulk tactical pant ready to ship with your own logo and design.",
    description:
      "Work tactical pants customised with your own logo and design. Bulk order ready to ship and available in all sizes.",
    material: "Heavy-duty poly-cotton, to specification",
    sizes: ["30", "32", "34", "36", "38", "40", "42"],
    colors: ["Black", "Khaki", "Navy", "Grey"],
    features: ["Bulk order ready to ship", "Available in all sizes", "Custom logo and design"],
    customization: ["Custom logo", "Custom design", "Embroidery", "Printing"],
    isFeatured: false,
  },
  {
    code: "DcqdFefuHcJ",
    name: "Plain Black Tactical Pant",
    sku: "RS-TP-9011",
    slug: "plain-black-tactical-pant",
    categorySlug: "tactical-trousers",
    shortDescription: "Plain black tactical pant, bulk order ready to ship.",
    description:
      "Plain black working tactical pant supplied in bulk and ready to ship, available in all sizes.",
    material: "Heavy-duty poly-cotton, to specification",
    sizes: ["30", "32", "34", "36", "38", "40", "42"],
    colors: ["Black"],
    features: ["Bulk order ready to ship", "Available in all sizes", "Plain finish"],
    customization: ["Custom colours", "Logo embroidery or printing", "Private labels"],
    isFeatured: false,
  },
  {
    code: "Dcl4ZtVtFuK",
    name: "Custom Made Work Pants",
    sku: "RS-WP-9012",
    slug: "custom-made-work-pants",
    categorySlug: "work-trousers",
    shortDescription: "Custom-made work pants available in bulk and all sizes.",
    description:
      "Custom made workwear pants available in bulk with all sizes. Manufactured to your specification for staff and worker uniforms.",
    material: "To buyer specification",
    sizes: ["28", "30", "32", "34", "36", "38", "40", "42"],
    colors: ["Black", "Khaki", "Navy", "Grey"],
    features: ["Available in bulk", "All sizes", "Made to specification"],
    customization: ["Custom colours", "Logo embroidery or printing", "Private labels"],
    isFeatured: false,
  },
];
