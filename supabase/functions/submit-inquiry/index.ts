import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function json(body: unknown, status: number, headers: Record<string, string>): Response {
  return Response.json(body, { status, headers });
}

function text(form: FormData, key: string, max: number): string {
  const value = form.get(key);
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function safeFileName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .slice(-120);
}

async function hasValidSignature(file: File): Promise<boolean> {
  const bytes = new Uint8Array(await file.slice(0, 5).arrayBuffer());
  const prefix = String.fromCharCode(...bytes);
  const extension = file.name.toLowerCase().split(".").pop();
  if (extension === "pdf") return file.type === "application/pdf" && prefix === "%PDF-";
  if (extension === "jpg" || extension === "jpeg") {
    return (
      file.type === "image/jpeg" && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff
    );
  }
  if (extension === "png") {
    return (
      file.type === "image/png" &&
      bytes[0] === 0x89 &&
      bytes[1] === 0x50 &&
      bytes[2] === 0x4e &&
      bytes[3] === 0x47
    );
  }
  if (extension === "ai") {
    return (
      (file.type === "application/pdf" && prefix === "%PDF-") ||
      (file.type === "application/postscript" && prefix.startsWith("%!PS"))
    );
  }
  return false;
}

async function sha256(value: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

Deno.serve(async (request) => {
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  const resendKey = Deno.env.get("RESEND_API_KEY") ?? Deno.env.get("RESEND-API-KEY");
  const toEmail = Deno.env.get("INQUIRY_TO_EMAIL");
  const fromEmail = Deno.env.get("INQUIRY_FROM_EMAIL");
  const siteUrlValue = Deno.env.get("SITE_URL")?.replace(/\/$/, "");

  if (request.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  if (request.method !== "POST") return json({ error: "Method not allowed." }, 405, corsHeaders);
  if (!supabaseUrl || !serviceRoleKey) {
    console.error("Missing required Supabase Edge Function secrets.");
    return json({ error: "Inquiry service is not configured." }, 503, corsHeaders);
  }
  const contentLength = Number(request.headers.get("content-length") ?? "0");
  if (contentLength > 11 * 1024 * 1024) {
    return json({ error: "The request is too large." }, 413, corsHeaders);
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return json({ error: "Invalid form data." }, 400, corsHeaders);
  }
  if (text(form, "website", 200)) {
    return json({ ok: true, reference: crypto.randomUUID() }, 200, corsHeaders);
  }

  const fullName = text(form, "full_name", 100);
  const companyName = text(form, "company_name", 120);
  const email = text(form, "email", 255).toLowerCase();
  const message = text(form, "message", 2000);
  const inquiryId = text(form, "submission_token", 36);
  if (
    !fullName ||
    !companyName ||
    !message ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) ||
    !UUID_PATTERN.test(inquiryId)
  ) {
    return json({ error: "Please complete all required fields." }, 422, corsHeaders);
  }

  const attachmentEntry = form.get("attachment");
  const attachment =
    attachmentEntry instanceof File && attachmentEntry.size > 0 ? attachmentEntry : undefined;
  if (
    attachment &&
    (attachment.size > 10 * 1024 * 1024 || !(await hasValidSignature(attachment)))
  ) {
    return json(
      { error: "The reference file type, content, or size is not allowed." },
      422,
      corsHeaders,
    );
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const clientIp =
    request.headers.get("cf-connecting-ip") ??
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown";
  const [ipKey, emailKey] = await Promise.all([sha256(`ip|${clientIp}`), sha256(`email|${email}`)]);
  const [ipLimit, emailLimit] = await Promise.all([
    supabase.rpc("consume_inquiry_rate_limit", { p_key: ipKey }),
    supabase.rpc("consume_inquiry_rate_limit", { p_key: emailKey }),
  ]);
  if (ipLimit.error || emailLimit.error || !ipLimit.data || !emailLimit.data) {
    return json(
      { error: "Too many inquiries were submitted. Please try again later." },
      429,
      corsHeaders,
    );
  }

  const { data: existing, error: existingError } = await supabase
    .from("inquiries")
    .select("*")
    .eq("id", inquiryId)
    .maybeSingle();
  if (existingError) return json({ error: "The inquiry could not be checked." }, 500, corsHeaders);

  let record = existing;
  if (!record) {
    const productId = text(form, "product_id", 36);
    let product: {
      id: string;
      name: string;
      sku: string;
      categories: { name: string; is_active: boolean } | null;
    } | null = null;
    if (productId) {
      if (!UUID_PATTERN.test(productId))
        return json({ error: "Invalid product reference." }, 422, corsHeaders);
      const { data, error } = await supabase
        .from("products")
        .select("id,name,sku,categories(name,is_active)")
        .eq("id", productId)
        .eq("is_active", true)
        .maybeSingle();
      if (error || !data || !data.categories?.is_active) {
        return json({ error: "The referenced product is unavailable." }, 422, corsHeaders);
      }
      product = data;
    }

    let attachmentPath: string | null = null;
    if (attachment) {
      attachmentPath = `${inquiryId}/${crypto.randomUUID()}-${safeFileName(attachment.name)}`;
      const { error } = await supabase.storage
        .from("inquiry-attachments")
        .upload(attachmentPath, attachment, { contentType: attachment.type, upsert: false });
      if (error) {
        console.error(error);
        return json({ error: "The reference file could not be uploaded." }, 500, corsHeaders);
      }
    }

    record = {
      id: inquiryId,
      full_name: fullName,
      company_name: companyName,
      email,
      phone: text(form, "phone", 40) || null,
      country: text(form, "country", 80) || null,
      product_id: product?.id ?? null,
      product_name: product?.name ?? null,
      product_sku: product?.sku ?? null,
      product_page_url:
        product && siteUrlValue
          ? `${siteUrlValue}/products/${encodeURIComponent(product.sku)}`
          : null,
      product_category: product?.categories?.name ?? (text(form, "product_category", 120) || null),
      estimated_quantity: text(form, "estimated_quantity", 80) || null,
      customization_requirements: text(form, "customization_requirements", 500) || null,
      message,
      reference_file_url: attachmentPath,
      notification_status: "pending",
      notification_error: null,
    };
    const { error: insertError } = await supabase.from("inquiries").insert(record);
    if (insertError) {
      if (attachmentPath)
        await supabase.storage.from("inquiry-attachments").remove([attachmentPath]);
      console.error(insertError);
      return json({ error: "The inquiry could not be saved." }, 500, corsHeaders);
    }
  }

  const submittedAt = new Date(record.created_at ?? Date.now()).toLocaleString("en-GB", {
    timeZone: "UTC",
    timeZoneName: "short",
  });
  const rows = [
    ["Customer", record.full_name],
    ["Company", record.company_name],
    ["Email", record.email],
    ["Phone", record.phone ?? "Not provided"],
    ["Country", record.country ?? "Not provided"],
    [
      "Product / category",
      record.product_name
        ? `${record.product_name} (${record.product_sku ?? "No SKU"})`
        : (record.product_category ?? "Not specified"),
    ],
    ["Estimated quantity", record.estimated_quantity ?? "Not provided"],
    ["Customization", record.customization_requirements ?? "Not provided"],
    ["Message", record.message],
    ["Submitted", submittedAt],
  ];
  const body = rows
    .map(
      ([label, value]) =>
        `<tr><th align="left" style="padding:8px;border-bottom:1px solid #ddd">${escapeHtml(label!)}</th><td style="padding:8px;border-bottom:1px solid #ddd">${escapeHtml(value!)}</td></tr>`,
    )
    .join("");
  const missingEmailSecrets = [
    !resendKey && "RESEND_API_KEY",
    !toEmail && "INQUIRY_TO_EMAIL",
    !fromEmail && "INQUIRY_FROM_EMAIL",
  ].filter(Boolean);
  let emailError = missingEmailSecrets.length
    ? `Missing Edge Function secrets: ${missingEmailSecrets.join(", ")}`
    : "";
  if (!emailError) {
    try {
      const adminLink = siteUrlValue
        ? `<p><a href="${escapeHtml(`${siteUrlValue}/admin/inquiries`)}">Open admin dashboard</a></p>`
        : "";
      const notifications = [
        {
          name: "admin notification",
          message: {
            from: fromEmail,
            to: [toEmail],
            reply_to: record.email,
            subject: "New Website Inquiry – RION APPARELS",
            html: `<h1>New website inquiry</h1><table style="border-collapse:collapse">${body}</table>${adminLink}`,
          },
        },
        {
          name: "customer confirmation",
          message: {
            from: fromEmail,
            to: [record.email],
            reply_to: toEmail,
            subject: "We received your inquiry | RION APPARELS",
            html: `<p>Hello ${escapeHtml(record.full_name)},</p><p>RION APPARELS received your inquiry. Our export team will review your requirements and respond within one business day.</p><p>Reference: <strong>${inquiryId}</strong></p><p>RION APPARELS</p>`,
          },
        },
      ];
      const responses = await Promise.all(
        notifications.map((notification) =>
          fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${resendKey}`,
              "Content-Type": "application/json",
              "Idempotency-Key": `inquiry-${inquiryId}-${notification.name.replace(" ", "-")}`,
            },
            body: JSON.stringify(notification.message),
            signal: AbortSignal.timeout(12_000),
          }),
        ),
      );
      const failures = await Promise.all(
        responses.map(async (response, index) =>
          response.ok
            ? ""
            : `${notifications[index]!.name} failed with HTTP ${response.status}: ${(await response.text()).slice(0, 500)}`,
        ),
      );
      emailError = failures.filter(Boolean).join("; ");
    } catch (error) {
      emailError = error instanceof Error ? error.message : "Email provider request failed.";
    }
  }

  if (emailError) {
    console.error(emailError);
    const { error: statusError } = await supabase
      .from("inquiries")
      .update({ notification_status: "failed", notification_error: emailError })
      .eq("id", inquiryId);
    if (statusError) console.error("Could not record notification failure:", statusError.message);
    return json(
      {
        ok: true,
        reference: inquiryId,
        warning: "The inquiry was saved, but notification delivery failed.",
      },
      200,
      corsHeaders,
    );
  }

  const { error: statusError } = await supabase
    .from("inquiries")
    .update({ notification_status: "sent", notification_error: null })
    .eq("id", inquiryId);
  if (statusError) console.error("Could not record notification success:", statusError.message);
  return json({ ok: true, reference: inquiryId }, 200, corsHeaders);
});
