import { describe, expect, it } from "vitest";
import {
  EMPTY_INQUIRY,
  hasValidInquiryFileSignature,
  MAX_INQUIRY_FILE_SIZE,
  parseInquiryValues,
  validateInquiry,
  validateInquiryFile,
} from "./inquiry";

const validInquiry = {
  ...EMPTY_INQUIRY,
  name: "Alex Buyer",
  company: "Example Imports",
  email: "alex@example.com",
  message: "Please quote 1,000 jackets.",
};

describe("inquiry validation", () => {
  it("accepts a complete inquiry", () => {
    expect(validateInquiry(validInquiry)).toEqual({});
  });

  it("returns errors for missing required fields", () => {
    expect(validateInquiry(EMPTY_INQUIRY)).toMatchObject({
      name: expect.any(String),
      company: expect.any(String),
      email: expect.any(String),
      message: expect.any(String),
    });
  });

  it("rejects unsafe attachment extensions and oversized files", () => {
    expect(validateInquiryFile(new File(["data"], "payload.exe"))).toContain("PDF");
    const oversized = new File([new Uint8Array(MAX_INQUIRY_FILE_SIZE + 1)], "design.pdf");
    expect(validateInquiryFile(oversized)).toContain("10 MB");
  });

  it("checks attachment content signatures", async () => {
    const pdf = new File(["%PDF-1.7"], "design.pdf");
    const disguised = new File(["not a pdf"], "design.pdf");
    await expect(hasValidInquiryFileSignature(pdf)).resolves.toBe(true);
    await expect(hasValidInquiryFileSignature(disguised)).resolves.toBe(false);
  });

  it("normalizes serialized values and rejects invalid JSON", () => {
    expect(parseInquiryValues(JSON.stringify(validInquiry))).toMatchObject(validInquiry);
    expect(parseInquiryValues("not-json")).toBeUndefined();
  });
});
