import { describe, expect, it } from "vitest";
import { addSecurityHeaders } from "./server";

describe("addSecurityHeaders", () => {
  it("preserves the response and adds browser security headers", async () => {
    const response = addSecurityHeaders(
      new Response("ok", { status: 201, headers: { "x-existing": "yes" } }),
      new Request("https://example.com/contact"),
    );

    expect(response.status).toBe(201);
    expect(await response.text()).toBe("ok");
    expect(response.headers.get("x-existing")).toBe("yes");
    expect(response.headers.get("x-content-type-options")).toBe("nosniff");
    expect(response.headers.get("x-frame-options")).toBe("DENY");
    expect(response.headers.get("strict-transport-security")).toContain("max-age");
  });

  it("does not send HSTS over plain HTTP", () => {
    const response = addSecurityHeaders(new Response("ok"), new Request("http://localhost:3000"));
    expect(response.headers.has("strict-transport-security")).toBe(false);
  });
});
