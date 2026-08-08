import { useServerFn } from "@tanstack/react-start";
import { CheckCircle2, Upload } from "lucide-react";
import { cloneElement, useId, useRef, useState } from "react";
import { categories } from "@/data/catalog";
import { submitInquiry } from "@/lib/inquiry.functions";
import {
  EMPTY_INQUIRY,
  validateInquiry,
  validateInquiryFile,
  type InquiryErrors,
  type InquiryValues,
} from "@/lib/inquiry";

type Props = {
  title?: string;
  description?: string;
  productReference?: string;
  compact?: boolean;
};

export function InquiryForm({ title, description, productReference, compact = false }: Props) {
  const idPrefix = useId();
  const formRef = useRef<HTMLFormElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const sendInquiry = useServerFn(submitInquiry);
  const initialValues = (): InquiryValues => ({
    ...EMPTY_INQUIRY,
    category: productReference ? "" : categories[0]!.name,
    productReference: productReference ?? "",
  });
  const [values, setValues] = useState<InquiryValues>(initialValues);
  const [attachment, setAttachment] = useState<File>();
  const [errors, setErrors] = useState<InquiryErrors>({});
  const [fileError, setFileError] = useState("");
  const [status, setStatus] = useState<
    | { state: "idle" }
    | { state: "pending" }
    | { state: "error"; message: string }
    | {
        state: "success";
        reference: string;
      }
  >({ state: "idle" });

  const set =
    (key: keyof InquiryValues) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const maxLength = key === "message" ? 1000 : key === "email" ? 255 : 200;
      setValues((current) => ({ ...current, [key]: event.target.value.slice(0, maxLength) }));
      if (key in errors) setErrors((current) => ({ ...current, [key]: undefined }));
    };

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validateInquiry(values);
    const nextFileError = validateInquiryFile(attachment) ?? "";
    setErrors(nextErrors);
    setFileError(nextFileError);
    if (Object.keys(nextErrors).length > 0 || nextFileError) {
      requestAnimationFrame(() => {
        formRef.current?.querySelector<HTMLElement>("[aria-invalid='true']")?.focus();
      });
      return;
    }

    setStatus({ state: "pending" });
    const formData = new FormData();
    formData.set("fields", JSON.stringify(values));
    if (attachment) formData.set("attachment", attachment, attachment.name);

    try {
      const result = await sendInquiry({ data: formData });
      if (!result.ok) {
        if (result.fieldErrors) setErrors(result.fieldErrors);
        setStatus({ state: "error", message: result.message });
        return;
      }
      setStatus({ state: "success", reference: result.reference });
    } catch {
      setStatus({
        state: "error",
        message: "We could not send your inquiry. Please try again or contact us by email.",
      });
    }
  };

  const reset = () => {
    setValues(initialValues());
    setAttachment(undefined);
    setErrors({});
    setFileError("");
    setStatus({ state: "idle" });
    if (fileRef.current) fileRef.current.value = "";
  };

  const fieldId = (name: string) => `${idPrefix}-${name}`;

  if (status.state === "success") {
    return (
      <div className="card-surface flex flex-col items-start gap-4 p-8" role="status">
        <CheckCircle2 className="h-8 w-8 text-accent" />
        <h3 className="text-xl">Inquiry received</h3>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Thank you, {values.name.trim().split(/\s+/)[0]}. Our export team will review your
          requirement
          {productReference ? ` for ${productReference}` : ""} and reply to {values.email} within
          one business day.
        </p>
        <p className="font-mono text-xs text-muted-foreground">Reference: {status.reference}</p>
        <button type="button" className="btn-base btn-outline" onClick={reset}>
          Send another inquiry
        </button>
      </div>
    );
  }

  return (
    <form ref={formRef} onSubmit={submit} className="card-surface p-6 md:p-8" noValidate>
      {(title || description) && (
        <div className="mb-7">
          {title && <h3 className="text-xl">{title}</h3>}
          {description && (
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p>
          )}
        </div>
      )}

      {productReference && (
        <div className="mb-6 border border-border bg-surface px-4 py-3">
          <p className="eyebrow">Inquiry reference</p>
          <p className="mt-1 text-sm font-medium">{productReference}</p>
        </div>
      )}

      <div className="absolute -left-[10000px]" aria-hidden="true">
        <label htmlFor={fieldId("website")}>Website</label>
        <input
          id={fieldId("website")}
          name="website"
          value={values.website}
          onChange={set("website")}
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div className={`grid gap-5 ${compact ? "" : "sm:grid-cols-2"}`}>
        <Field id={fieldId("name")} label="Full Name" error={errors.name} required>
          <input
            id={fieldId("name")}
            name="name"
            className="field-base"
            value={values.name}
            onChange={set("name")}
            maxLength={100}
            autoComplete="name"
            required
          />
        </Field>
        <Field id={fieldId("company")} label="Company Name" error={errors.company} required>
          <input
            id={fieldId("company")}
            name="company"
            className="field-base"
            value={values.company}
            onChange={set("company")}
            maxLength={120}
            autoComplete="organization"
            required
          />
        </Field>
        <Field id={fieldId("email")} label="Email" error={errors.email} required>
          <input
            id={fieldId("email")}
            name="email"
            type="email"
            className="field-base"
            value={values.email}
            onChange={set("email")}
            maxLength={255}
            autoComplete="email"
            required
          />
        </Field>
        <Field id={fieldId("phone")} label="Phone / WhatsApp">
          <input
            id={fieldId("phone")}
            name="phone"
            type="tel"
            className="field-base"
            value={values.phone}
            onChange={set("phone")}
            maxLength={40}
            autoComplete="tel"
          />
        </Field>
        <Field id={fieldId("country")} label="Country">
          <input
            id={fieldId("country")}
            name="country"
            className="field-base"
            value={values.country}
            onChange={set("country")}
            maxLength={60}
            autoComplete="country-name"
          />
        </Field>
        <Field id={fieldId("category")} label="Product Category">
          <select
            id={fieldId("category")}
            name="category"
            className="field-base"
            value={values.category}
            onChange={set("category")}
          >
            {productReference && <option value="">Referenced product</option>}
            {categories.map((category) => (
              <option key={category.slug} value={category.name}>
                {category.name}
              </option>
            ))}
            <option value="Custom Development">Custom Development</option>
          </select>
        </Field>
        <Field id={fieldId("quantity")} label="Estimated Quantity">
          <input
            id={fieldId("quantity")}
            name="quantity"
            className="field-base"
            placeholder="e.g. 1,000 pieces"
            value={values.quantity}
            onChange={set("quantity")}
            maxLength={60}
          />
        </Field>
        <Field id={fieldId("customization")} label="Customization Requirements">
          <input
            id={fieldId("customization")}
            name="customization"
            className="field-base"
            placeholder="Colours, branding, labels..."
            value={values.customization}
            onChange={set("customization")}
            maxLength={200}
          />
        </Field>
      </div>

      <div className="mt-5">
        <Field id={fieldId("message")} label="Message" error={errors.message} required>
          <textarea
            id={fieldId("message")}
            name="message"
            rows={5}
            className="field-base resize-y"
            value={values.message}
            onChange={set("message")}
            maxLength={1000}
            placeholder="Tell us about your programme, target market and specifications."
            required
          />
        </Field>
      </div>

      <div className="mt-5">
        <label className="eyebrow block" htmlFor={fieldId("attachment")}>
          Reference / Design File
        </label>
        <label
          className="mt-2 flex cursor-pointer items-center gap-3 border border-dashed border-input bg-surface px-4 py-3.5 text-sm text-muted-foreground transition-colors hover:border-primary focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20"
          htmlFor={fieldId("attachment")}
        >
          <Upload className="h-4 w-4 shrink-0" />
          <span className="truncate">
            {attachment?.name ?? "Upload a PDF, JPG, PNG or AI file (maximum 10 MB)"}
          </span>
          <input
            ref={fileRef}
            id={fieldId("attachment")}
            name="attachment"
            type="file"
            className="sr-only"
            accept=".pdf,.jpg,.jpeg,.png,.ai"
            aria-invalid={Boolean(fileError)}
            aria-describedby={fileError ? `${fieldId("attachment")}-error` : undefined}
            onChange={(event) => {
              const file = event.target.files?.[0];
              setAttachment(file);
              setFileError(validateInquiryFile(file) ?? "");
            }}
          />
        </label>
        {fileError && (
          <p id={`${fieldId("attachment")}-error`} className="mt-1.5 text-xs text-destructive">
            {fileError}
          </p>
        )}
      </div>

      {status.state === "error" && (
        <p
          className="mt-5 border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive"
          role="alert"
        >
          {status.message}
        </p>
      )}

      <button
        type="submit"
        className="btn-base btn-accent mt-7 w-full sm:w-auto"
        disabled={status.state === "pending"}
      >
        {status.state === "pending" ? "Sending..." : "Submit Inquiry"}
      </button>
      <p className="mt-4 text-xs text-muted-foreground">
        Your details are used only to respond to this manufacturing inquiry. Required fields are
        marked with an asterisk.
      </p>
    </form>
  );
}

function Field({
  id,
  label,
  error,
  required = false,
  children,
}: {
  id: string;
  label: string;
  error?: string | undefined;
  required?: boolean;
  children: React.ReactElement<{ "aria-describedby"?: string; "aria-invalid"?: boolean }>;
}) {
  const errorId = `${id}-error`;
  const control = cloneElement(
    children,
    error ? { "aria-describedby": errorId, "aria-invalid": true } : { "aria-invalid": false },
  );

  return (
    <div className="min-w-0">
      <label className="eyebrow block" htmlFor={id}>
        {label}
        {required && <span aria-hidden="true"> *</span>}
      </label>
      <div className="mt-2">{control}</div>
      {error && (
        <p id={errorId} className="mt-1.5 text-xs text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}
