import workJacket from "@/assets/product-work-jacket.jpg";
import cargoTrouser from "@/assets/product-cargo-trouser.jpg";
import coverall from "@/assets/product-coverall.jpg";
import hivisJacket from "@/assets/product-hivis-jacket.jpg";
import bibOverall from "@/assets/product-bib-overall.jpg";
import safetyVest from "@/assets/product-safety-vest.jpg";
import softshell from "@/assets/product-softshell.jpg";
import workShirt from "@/assets/product-work-shirt.jpg";
import factory from "@/assets/factory.jpg";
import fabrics from "@/assets/fabrics.jpg";
import construction from "@/assets/industry-construction.jpg";
import logistics from "@/assets/industry-logistics.jpg";
import automotive from "@/assets/industry-automotive.jpg";
import quality from "@/assets/quality-inspection.jpg";

export const WHATSAPP_NUMBER = (import.meta.env["VITE_WHATSAPP_NUMBER"] ?? "").replace(/\D/g, "");
export const WHATSAPP_MESSAGE =
  "Hello RION SPORTS, I would like to inquire about your workwear products and manufacturing services.";
export const CONTACT = {
  email: import.meta.env["VITE_CONTACT_EMAIL"] ?? "sales@rionsports.com",
  phone: import.meta.env["VITE_CONTACT_PHONE"] ?? "",
  address: import.meta.env["VITE_CONTACT_ADDRESS"] ?? "Sialkot, Punjab, Pakistan",
  hours: import.meta.env["VITE_CONTACT_HOURS"] ?? "Monday - Saturday, 09:00 - 18:00 (GMT+5)",
};
export const SOCIAL_LINKS = {
  facebook: import.meta.env["VITE_FACEBOOK_URL"] ?? "",
  instagram: import.meta.env["VITE_INSTAGRAM_URL"] ?? "",
  linkedin: import.meta.env["VITE_LINKEDIN_URL"] ?? "",
};
export const hasWhatsApp = WHATSAPP_NUMBER.length >= 8;

export const whatsappLink = (message: string = WHATSAPP_MESSAGE) =>
  hasWhatsApp ? `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}` : "";

export type Category = {
  slug: string;
  name: string;
  image: string;
  blurb: string;
};

export const categories: Category[] = [
  {
    slug: "work-jackets",
    name: "Work Jackets",
    image: workJacket,
    blurb: "Two-tone, lined and multi-pocket jackets for daily industrial use.",
  },
  {
    slug: "work-trousers",
    name: "Work Trousers",
    image: cargoTrouser,
    blurb: "Cargo, knee-pad and stretch trousers built for movement.",
  },
  {
    slug: "coveralls",
    name: "Coveralls",
    image: coverall,
    blurb: "Single-piece protection for maintenance and heavy industry.",
  },
  {
    slug: "bib-overalls",
    name: "Bib Overalls",
    image: bibOverall,
    blurb: "Adjustable bib and brace overalls with tool-ready pockets.",
  },
  {
    slug: "safety-vests",
    name: "Safety Vests",
    image: safetyVest,
    blurb: "Reflective vests for site access, logistics and traffic work.",
  },
  {
    slug: "hi-visibility",
    name: "Hi-Visibility Workwear",
    image: hivisJacket,
    blurb: "Fluorescent fabrics with certified reflective tape placement.",
  },
  {
    slug: "softshell-jackets",
    name: "Softshell Jackets",
    image: softshell,
    blurb: "Wind-resistant, breathable outer layers for outdoor teams.",
  },
  {
    slug: "work-shirts",
    name: "Work Shirts",
    image: workShirt,
    blurb: "Poly-cotton shirts for technical, service and corporate teams.",
  },
];

export type Product = {
  sku: string;
  name: string;
  category: string;
  categorySlug: string;
  type: string;
  image: string;
  gallery: string[];
  colors: { name: string; hex: string }[];
  sizes: string[];
  material: string;
  materials: string[];
  shortDescription: string;
  description: string;
  features: string[];
  specifications: { label: string; value: string }[];
  customization: string[];
  packaging: string;
  sizeInfo: string;
};

const commonSizes = ["S", "M", "L", "XL", "2XL", "3XL", "4XL"];

export const products: Product[] = [
  {
    sku: "RS-WJ-1001",
    name: "Two Tone Work Jacket",
    category: "Work Jackets",
    categorySlug: "work-jackets",
    type: "Jacket",
    image: workJacket,
    gallery: [workJacket, factory, fabrics],
    colors: [
      { name: "Navy / Grey", hex: "#1f2a44" },
      { name: "Charcoal / Black", hex: "#333333" },
      { name: "Royal / Navy", hex: "#25459b" },
    ],
    sizes: commonSizes,
    material: "65% Polyester / 35% Cotton Twill, 245 gsm",
    materials: ["Poly-cotton twill 245 gsm", "Canvas 300 gsm", "Ripstop 210 gsm"],
    shortDescription:
      "A contrast-panel industrial jacket engineered for daily wear, with reinforced stress points and generous tool storage.",
    description:
      "The Two Tone Work Jacket is a core programme item for distributors building a complete workwear range. The contrast panelling allows two-colour brand matching without additional tooling, while triple-stitched seams and bar-tacked stress points keep the garment serviceable through repeated industrial laundering. Pattern grading is available in EU, UK and US size systems.",
    features: [
      "Triple-stitched main seams and bar-tacked stress points",
      "Two chest pockets with flaps, two lower cargo pockets",
      "Reinforced elbow panels",
      "YKK or equivalent branded zipper options",
      "Adjustable cuffs and hem drawcord",
    ],
    specifications: [
      { label: "Product code", value: "RS-WJ-1001" },
      { label: "Fabric weight", value: "245 gsm" },
      { label: "Construction", value: "Triple-stitched, bar-tacked" },
      { label: "Wash", value: "Industrial laundering up to 60°C" },
      { label: "Minimum order", value: "150 pieces per colour" },
      { label: "Lead time", value: "35 – 45 days after sample approval" },
    ],
    customization: [
      "Custom colour combinations and fabric weights",
      "Embroidered or printed brand logos",
      "Woven labels, hangtags and size tabs",
      "Reflective tape placement on request",
    ],
    packaging:
      "Individual polybag with size sticker, 20 pieces per export carton, master carton labelling to buyer specification.",
    sizeInfo:
      "Standard EU sizing S–4XL. Full measurement charts and graded specification sheets are supplied with each sample set.",
  },
  {
    sku: "RS-WT-2004",
    name: "Heavy Duty Cargo Trouser",
    category: "Work Trousers",
    categorySlug: "work-trousers",
    type: "Trouser",
    image: cargoTrouser,
    gallery: [cargoTrouser, fabrics, factory],
    colors: [
      { name: "Charcoal", hex: "#3a3a3a" },
      { name: "Navy", hex: "#1f2a44" },
      { name: "Black", hex: "#141414" },
      { name: "Sand", hex: "#c2b49a" },
    ],
    sizes: ["44", "46", "48", "50", "52", "54", "56", "58"],
    material: "100% Cotton Canvas, 300 gsm",
    materials: ["Cotton canvas 300 gsm", "Poly-cotton twill 260 gsm", "Cordura-reinforced panels"],
    shortDescription:
      "A robust cargo trouser with knee-pad pockets and reinforced panels for construction and heavy industry.",
    description:
      "Built for demanding site conditions, this trouser combines a heavyweight canvas body with reinforced knee and hem panels. Internal knee-pad pockets are height-adjustable, and the multi-pocket layout is designed around tool access. Waistband and rise can be re-graded to regional fit preferences.",
    features: [
      "Height-adjustable internal knee-pad pockets",
      "Reinforced knee and hem panels",
      "Two cargo pockets, rule pocket and hammer loop",
      "Metal zip with hook-and-bar closure",
      "Gusseted crotch for freedom of movement",
    ],
    specifications: [
      { label: "Product code", value: "RS-WT-2004" },
      { label: "Fabric weight", value: "300 gsm" },
      { label: "Pockets", value: "8 including rule pocket" },
      { label: "Minimum order", value: "200 pieces per colour" },
      { label: "Lead time", value: "35 – 45 days after sample approval" },
    ],
    customization: [
      "Cordura or ripstop reinforcement panels",
      "Reflective piping and hi-vis contrast panels",
      "Custom waistband labels and branded rivets",
      "Regional pattern grading (EU / UK / US)",
    ],
    packaging:
      "Individual polybag, 20 pieces per carton, size-assorted or solid-size packing available.",
    sizeInfo: "EU waist sizes 44–58 with regular and long leg options.",
  },
  {
    sku: "RS-CV-3010",
    name: "Industrial Coverall",
    category: "Coveralls",
    categorySlug: "coveralls",
    type: "Coverall",
    image: coverall,
    gallery: [coverall, factory, quality],
    colors: [
      { name: "Navy", hex: "#1f2a44" },
      { name: "Royal Blue", hex: "#25459b" },
      { name: "Grey", hex: "#6b6b6b" },
    ],
    sizes: commonSizes,
    material: "65% Polyester / 35% Cotton, 230 gsm",
    materials: ["Poly-cotton 230 gsm", "100% cotton 260 gsm", "Flame-retardant treated cotton"],
    shortDescription:
      "A full-body coverall for maintenance, engineering and industrial environments, with concealed front closure.",
    description:
      "A single-piece coverall that keeps clothing protected in workshop, plant and maintenance environments. The concealed stud placket protects surfaces from metal contact, and the action back provides full shoulder mobility. Available in standard poly-cotton or flame-retardant treated fabric.",
    features: [
      "Concealed stud front placket",
      "Action back with elasticated waist",
      "Multiple chest, thigh and rule pockets",
      "Elasticated or studded cuffs",
      "Optional flame-retardant fabric",
    ],
    specifications: [
      { label: "Product code", value: "RS-CV-3010" },
      { label: "Fabric weight", value: "230 gsm" },
      { label: "Closure", value: "Concealed stud placket" },
      { label: "Minimum order", value: "150 pieces per colour" },
      { label: "Lead time", value: "40 – 50 days after sample approval" },
    ],
    customization: [
      "Flame-retardant or anti-static fabric options",
      "Reflective tape configurations",
      "Chest and back logo embroidery or printing",
      "Custom colourways and trim colours",
    ],
    packaging: "Individual polybag with hangtag, 12 pieces per export carton.",
    sizeInfo: "EU sizing S–4XL, with tall grading available on request.",
  },
  {
    sku: "RS-HV-4021",
    name: "Hi-Vis Safety Jacket",
    category: "Hi-Visibility Workwear",
    categorySlug: "hi-visibility",
    type: "Jacket",
    image: hivisJacket,
    gallery: [hivisJacket, construction, fabrics],
    colors: [
      { name: "Hi-Vis Yellow / Navy", hex: "#d7e800" },
      { name: "Hi-Vis Orange / Navy", hex: "#f26b1d" },
    ],
    sizes: commonSizes,
    material: "100% Polyester Oxford with PU coating, 300D",
    materials: [
      "Polyester oxford 300D",
      "Fluorescent knit polyester",
      "Waterproof PU-coated shell",
    ],
    shortDescription:
      "A high-visibility outer jacket with reflective tape configuration suitable for road, rail and site work.",
    description:
      "This hi-vis jacket pairs a fluorescent body with contrast lower panels to reduce visible soiling. Reflective tape placement follows standard high-visibility configurations and can be adjusted to the certification your market requires. A quilted or fleece lining can be specified for cold-climate programmes.",
    features: [
      "Fluorescent shell with contrast lower body",
      "Segmented or continuous reflective tape options",
      "Waterproof PU coating and taped seams",
      "Concealed hood in collar",
      "Zip-off sleeve option for two-in-one use",
    ],
    specifications: [
      { label: "Product code", value: "RS-HV-4021" },
      { label: "Shell", value: "300D polyester oxford, PU coated" },
      { label: "Reflective tape", value: "50 mm heat-transfer or sewn" },
      { label: "Minimum order", value: "150 pieces per colour" },
      { label: "Lead time", value: "40 – 50 days after sample approval" },
    ],
    customization: [
      "Reflective tape layout to buyer certification requirements",
      "Quilted, fleece or mesh lining",
      "Logo printing on reflective-compatible panels",
      "Custom hood and collar construction",
    ],
    packaging: "Individual polybag, 10 pieces per export carton.",
    sizeInfo: "EU sizing S–4XL. Reflective placement is graded per size.",
  },
  {
    sku: "RS-BO-5008",
    name: "Work Bib Overall",
    category: "Bib Overalls",
    categorySlug: "bib-overalls",
    type: "Bib & Brace",
    image: bibOverall,
    gallery: [bibOverall, factory, fabrics],
    colors: [
      { name: "Navy", hex: "#1f2a44" },
      { name: "Black", hex: "#141414" },
      { name: "Charcoal", hex: "#3a3a3a" },
    ],
    sizes: commonSizes,
    material: "65% Polyester / 35% Cotton Twill, 260 gsm",
    materials: ["Poly-cotton twill 260 gsm", "Cotton canvas 300 gsm"],
    shortDescription:
      "Bib and brace overall with adjustable elastic braces, chest tool pocket and knee-pad provision.",
    description:
      "A practical bib overall for painters, carpenters and workshop teams. Elasticated braces with quick-release buckles allow fast adjustment over layered clothing, while the reinforced knee area accepts standard knee pads. Side openings simplify on-site changing.",
    features: [
      "Elasticated braces with quick-release buckles",
      "Multi-compartment chest pocket",
      "Knee-pad pockets with reinforced facing",
      "Side leg openings with stud closure",
      "Rule pocket and hammer loop",
    ],
    specifications: [
      { label: "Product code", value: "RS-BO-5008" },
      { label: "Fabric weight", value: "260 gsm" },
      { label: "Minimum order", value: "150 pieces per colour" },
      { label: "Lead time", value: "35 – 45 days after sample approval" },
    ],
    customization: [
      "Contrast bib panels and trim colours",
      "Embroidered chest branding",
      "Custom buckle and hardware finishes",
      "Additional pocket configurations",
    ],
    packaging: "Individual polybag, 15 pieces per export carton.",
    sizeInfo: "EU sizing S–4XL with adjustable brace length.",
  },
  {
    sku: "RS-SV-6002",
    name: "Reflective Safety Vest",
    category: "Safety Vests",
    categorySlug: "safety-vests",
    type: "Vest",
    image: safetyVest,
    gallery: [safetyVest, logistics, fabrics],
    colors: [
      { name: "Hi-Vis Orange", hex: "#f26b1d" },
      { name: "Hi-Vis Yellow", hex: "#d7e800" },
    ],
    sizes: ["M", "L", "XL", "2XL", "3XL"],
    material: "100% Polyester Knit or Tricot, 120 gsm",
    materials: ["Polyester knit 120 gsm", "Polyester tricot 140 gsm", "Breathable mesh"],
    shortDescription:
      "Lightweight reflective vest for site access, logistics and traffic environments, ideal for high-volume branded orders.",
    description:
      "A high-volume programme item and the most common entry point for branded workwear orders. The vest is produced in fluorescent knit, tricot or breathable mesh, with reflective tape applied in horizontal and vertical configurations. Large logo areas make it well suited to promotional and corporate branding.",
    features: [
      "Fluorescent polyester body",
      "Horizontal and vertical reflective tape",
      "Zip, hook-and-loop or stud closure",
      "Optional ID pocket and pen loops",
      "Large front and back print areas",
    ],
    specifications: [
      { label: "Product code", value: "RS-SV-6002" },
      { label: "Fabric weight", value: "120 gsm" },
      { label: "Minimum order", value: "500 pieces per colour" },
      { label: "Lead time", value: "25 – 35 days after sample approval" },
    ],
    customization: [
      "Screen printing and heat-transfer branding",
      "Custom tape configurations",
      "Pocket and closure variations",
      "Individual polybag branding",
    ],
    packaging: "Individual polybag, 100 pieces per export carton.",
    sizeInfo: "One-size and graded M–3XL options available.",
  },
  {
    sku: "RS-SS-7015",
    name: "Softshell Work Jacket",
    category: "Softshell Jackets",
    categorySlug: "softshell-jackets",
    type: "Jacket",
    image: softshell,
    gallery: [softshell, construction, factory],
    colors: [
      { name: "Black", hex: "#141414" },
      { name: "Navy", hex: "#1f2a44" },
      { name: "Grey", hex: "#6b6b6b" },
    ],
    sizes: commonSizes,
    material: "3-Layer Bonded Softshell, 320 gsm",
    materials: ["3-layer bonded softshell 320 gsm", "Windproof membrane laminate"],
    shortDescription:
      "Wind-resistant bonded softshell with fleece backing — a premium layer for corporate and outdoor workwear ranges.",
    description:
      "A refined outer layer for technical service teams and corporate workwear programmes. The three-layer bonded fabric is wind resistant, water repellent and fleece backed for warmth without bulk. Clean panel lines provide ideal placement areas for embroidered brand marks.",
    features: [
      "3-layer bonded softshell with fleece backing",
      "Wind resistant and water repellent finish",
      "Reverse-coil zips with rubberised pullers",
      "Articulated sleeves and adjustable hem",
      "Clean panels for embroidery placement",
    ],
    specifications: [
      { label: "Product code", value: "RS-SS-7015" },
      { label: "Fabric weight", value: "320 gsm" },
      { label: "Minimum order", value: "150 pieces per colour" },
      { label: "Lead time", value: "40 – 50 days after sample approval" },
    ],
    customization: [
      "Custom colourways and contrast zips",
      "Chest and sleeve embroidery",
      "Hood or stand-collar construction",
      "Detachable brand badges",
    ],
    packaging: "Individual polybag with hangtag, 20 pieces per export carton.",
    sizeInfo: "EU sizing S–4XL, men's and women's fit blocks available.",
  },
  {
    sku: "RS-WS-8003",
    name: "Professional Work Shirt",
    category: "Work Shirts",
    categorySlug: "work-shirts",
    type: "Shirt",
    image: workShirt,
    gallery: [workShirt, factory, automotive],
    colors: [
      { name: "Grey", hex: "#6b6b6b" },
      { name: "Navy", hex: "#1f2a44" },
      { name: "White", hex: "#f2f2f2" },
      { name: "Light Blue", hex: "#a9c3d9" },
    ],
    sizes: commonSizes,
    material: "65% Polyester / 35% Cotton Poplin, 130 gsm",
    materials: ["Poly-cotton poplin 130 gsm", "Cotton twill 160 gsm", "Stretch poplin"],
    shortDescription:
      "A durable long-sleeve work shirt for technical, service and corporate uniform programmes.",
    description:
      "A uniform shirt designed to hold its appearance through frequent laundering. Fused collar and cuffs keep the garment presentable in customer-facing roles, while a chest tool pocket and roll-up sleeve tabs keep it practical on site. Ideal for automotive, service and facility management uniforms.",
    features: [
      "Fused collar and cuffs",
      "Chest pocket with pen division",
      "Roll-up sleeve tabs",
      "Reinforced side seams",
      "Easy-care, low-shrinkage finish",
    ],
    specifications: [
      { label: "Product code", value: "RS-WS-8003" },
      { label: "Fabric weight", value: "130 gsm" },
      { label: "Minimum order", value: "300 pieces per colour" },
      { label: "Lead time", value: "30 – 40 days after sample approval" },
    ],
    customization: [
      "Custom colours and fabric blends",
      "Embroidered logos and name badges",
      "Woven labels and branded buttons",
      "Men's and women's fit blocks",
    ],
    packaging: "Folded with collar support in individual polybag, 30 pieces per carton.",
    sizeInfo: "EU sizing S–4XL, collar sizes 37–46 available.",
  },
];

export const getProduct = (sku: string) =>
  products.find((p) => p.sku.toLowerCase() === sku.toLowerCase());

export const materialOptions = Array.from(
  new Set(products.flatMap((p) => p.materials.map((m) => m.split(" ").slice(0, 2).join(" ")))),
).sort();

export const colorOptions = Array.from(
  new Set(products.flatMap((p) => p.colors.map((c) => c.name))),
).sort();

export const typeOptions = Array.from(new Set(products.map((p) => p.type))).sort();

export const industries = [
  { name: "Construction", image: construction },
  { name: "Automotive", image: automotive },
  { name: "Logistics", image: logistics },
  { name: "Engineering", image: factory },
  { name: "Warehousing", image: logistics },
  { name: "Industrial", image: quality },
  { name: "Outdoor Work", image: construction },
  { name: "Corporate Workwear", image: workShirt },
];
