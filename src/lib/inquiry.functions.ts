import { createServerFn } from "@tanstack/react-start";
import {
  hasValidInquiryFileSignature,
  parseInquiryValues,
  validateInquiry,
  validateInquiryFile,
  type InquiryErrors,
} from "./inquiry";

type InquiryResult =
  { ok: true; reference: string } | { ok: false; message: string; fieldErrors?: InquiryErrors };

export const submitInquiry = createServerFn({ method: "POST" })
  .validator((formData: FormData) => {
    if (!(formData instanceof FormData)) throw new Error("Expected multipart form data.");
    return formData;
  })
  .handler(async ({ data }): Promise<InquiryResult> => {
    const values = parseInquiryValues(data.get("fields"));
    if (!values) return { ok: false, message: "The inquiry data could not be read." };

    // Silently acknowledge bot submissions without forwarding them downstream.
    if (values.website) return { ok: true, reference: crypto.randomUUID() };

    const fieldErrors = validateInquiry(values);
    if (Object.keys(fieldErrors).length > 0) {
      return { ok: false, message: "Please correct the highlighted fields.", fieldErrors };
    }

    const attachmentEntry = data.get("attachment");
    const attachment =
      attachmentEntry instanceof File && attachmentEntry.size > 0 ? attachmentEntry : undefined;
    const fileError = validateInquiryFile(attachment);
    if (fileError) return { ok: false, message: fileError };
    if (attachment && !(await hasValidInquiryFileSignature(attachment))) {
      return { ok: false, message: "The attachment content does not match its file type." };
    }

    const webhookUrl = process.env["INQUIRY_WEBHOOK_URL"];
    if (!webhookUrl) {
      return {
        ok: false,
        message: "Online inquiries are temporarily unavailable. Please email sales@rionsports.com.",
      };
    }

    const reference = crypto.randomUUID();
    const payload = new FormData();
    for (const [key, value] of Object.entries(values)) {
      if (key !== "website") payload.set(key, value);
    }
    payload.set("reference", reference);
    payload.set("submittedAt", new Date().toISOString());
    if (attachment) payload.set("attachment", attachment, attachment.name);

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15_000);
    try {
      const token = process.env["INQUIRY_WEBHOOK_TOKEN"];
      const response = await fetch(webhookUrl, {
        method: "POST",
        ...(token ? { headers: { Authorization: `Bearer ${token}` } } : {}),
        body: payload,
        signal: controller.signal,
      });
      if (!response.ok) {
        console.error(`Inquiry webhook returned HTTP ${response.status}.`);
        return {
          ok: false,
          message: "We could not send your inquiry. Please try again or contact us by email.",
        };
      }
      return { ok: true, reference };
    } catch {
      console.error("Inquiry webhook request failed.");
      return {
        ok: false,
        message: "We could not send your inquiry. Please try again or contact us by email.",
      };
    } finally {
      clearTimeout(timeout);
    }
  });
