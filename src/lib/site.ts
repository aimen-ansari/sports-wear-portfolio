const siteUrl = (import.meta.env["VITE_SITE_URL"] ?? "").replace(/\/$/, "");

export function absoluteUrl(path: string): string {
  if (!siteUrl) return path;
  return new URL(path, `${siteUrl}/`).toString();
}

export function canonicalLinks(path: string) {
  return siteUrl ? [{ rel: "canonical", href: absoluteUrl(path) }] : [];
}
