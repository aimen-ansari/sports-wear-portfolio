import workShirt from "@/assets/product-work-shirt.jpg";
import factory from "@/assets/factory.jpg";
import construction from "@/assets/industry-construction.jpg";
import logistics from "@/assets/industry-logistics.jpg";
import automotive from "@/assets/industry-automotive.jpg";
import quality from "@/assets/quality-inspection.jpg";

export const WHATSAPP_NUMBER = (import.meta.env["VITE_WHATSAPP_NUMBER"] ?? "923338600603").replace(
  /\D/g,
  "",
);
export const WHATSAPP_MESSAGE =
  "Hello RION APPARELS, I would like to inquire about your workwear products and manufacturing services.";
export const CONTACT = {
  email: import.meta.env["VITE_CONTACT_EMAIL"] ?? "sales@rionapparels.com",
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
