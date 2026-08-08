export const MAX_INQUIRY_FILE_SIZE = 10 * 1024 * 1024;

export type InquiryValues = {
  name: string;
  company: string;
  email: string;
  phone: string;
  country: string;
  category: string;
  quantity: string;
  customization: string;
  message: string;
  productReference: string;
  website: string;
};

export type InquiryField = keyof Pick<InquiryValues, "name" | "company" | "email" | "message">;
export type InquiryErrors = Partial<Record<InquiryField, string>>;

export const EMPTY_INQUIRY: InquiryValues = {
  name: "",
  company: "",
  email: "",
  phone: "",
  country: "",
  category: "",
  quantity: "",
  customization: "",
  message: "",
  productReference: "",
  website: "",
};

export function validateInquiry(values: InquiryValues): InquiryErrors {
  const errors: InquiryErrors = {};
  if (!values.name.trim()) errors.name = "Please enter your full name.";
  if (!values.company.trim()) errors.company = "Please enter your company name.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(values.email.trim())) {
    errors.email = "Please enter a valid business email address.";
  }
  if (!values.message.trim()) errors.message = "Please describe your requirement.";
  return errors;
}

export function validateInquiryFile(file: File | undefined): string | undefined {
  if (!file) return undefined;
  if (file.size > MAX_INQUIRY_FILE_SIZE) return "The attachment must be 10 MB or smaller.";

  const extension = file.name.toLowerCase().split(".").pop();
  if (!extension || !["pdf", "jpg", "jpeg", "png", "ai"].includes(extension)) {
    return "Use a PDF, JPG, PNG or AI file.";
  }
  return undefined;
}

export async function hasValidInquiryFileSignature(file: File): Promise<boolean> {
  const bytes = new Uint8Array(await file.slice(0, 5).arrayBuffer());
  const extension = file.name.toLowerCase().split(".").pop();
  if (extension === "pdf") return String.fromCharCode(...bytes) === "%PDF-";
  if (extension === "jpg" || extension === "jpeg") {
    return bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  }
  if (extension === "png") {
    return bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47;
  }
  if (extension === "ai") {
    const prefix = String.fromCharCode(...bytes);
    return prefix === "%PDF-" || prefix.startsWith("%!PS");
  }
  return false;
}

export function parseInquiryValues(value: FormDataEntryValue | null): InquiryValues | undefined {
  if (typeof value !== "string") return undefined;
  try {
    const parsed = JSON.parse(value) as Record<string, unknown>;
    const normalized = { ...EMPTY_INQUIRY };
    for (const key of Object.keys(normalized) as (keyof InquiryValues)[]) {
      const maxLength = key === "message" ? 1000 : key === "email" ? 255 : 200;
      normalized[key] = typeof parsed[key] === "string" ? parsed[key].slice(0, maxLength) : "";
    }
    return normalized;
  } catch {
    return undefined;
  }
}
