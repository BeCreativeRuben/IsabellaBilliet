/** Contact JSON is name (200) + email (320) + message (5000), with room for multibyte characters. */
export const MAX_CONTACT_BODY_BYTES = 32 * 1024;

const CONTROL_CHARS = /[\u0000-\u001F\u007F]/;
const EMAIL_RE = /^[^\s@,<>()"\\;:]+@[^\s@,<>()"\\;:]+\.[^\s@,<>()"\\;:]+$/;

export type ContactFields = {
  name: string;
  email: string;
  message: string;
};

export type ContactFieldResult =
  | { ok: true; fields: ContactFields }
  | { ok: false; error: string };

function headerHostnames(value: string | null): string[] {
  if (!value) return [];
  return value
    .split(",")
    .map((part) => part.trim().split(":")[0]?.toLowerCase() ?? "")
    .filter((hostname) => hostname.length > 0);
}

export function isNonProductionVercel(vercelEnv: string | undefined): boolean {
  return Boolean(vercelEnv) && vercelEnv !== "production";
}

/**
 * Index only when every observed host is the production host.
 * A non-production Vercel deploy stays noindex even if a client spoofs
 * x-forwarded-host. Disagreeing or missing hosts fail closed.
 */
export function shouldNoIndex(input: {
  vercelEnv: string | undefined;
  forwardedHost: string | null;
  host: string | null;
  productionHost: string;
}): boolean {
  if (isNonProductionVercel(input.vercelEnv)) return true;

  const names = [
    ...headerHostnames(input.forwardedHost),
    ...headerHostnames(input.host),
  ];
  if (names.length === 0) return true;
  return names.some((hostname) => hostname !== input.productionHost);
}

function isLoopbackHost(hostname: string): boolean {
  return hostname === "localhost" || hostname === "127.0.0.1" || hostname === "[::1]" || hostname === "::1";
}

export function isAllowedContactRequest(headers: {
  origin: string | null;
  host: string | null;
  contentType: string | null;
  secFetchSite: string | null;
}): boolean {
  if (headers.secFetchSite === "cross-site") return false;

  const contentType = headers.contentType?.split(";")[0]?.trim().toLowerCase() ?? "";
  if (contentType !== "application/json") return false;

  if (!headers.origin || !headers.host) return false;

  let originUrl: URL;
  try {
    originUrl = new URL(headers.origin);
  } catch {
    return false;
  }

  if (originUrl.protocol !== "https:" && originUrl.protocol !== "http:") return false;
  if (originUrl.protocol === "http:" && !isLoopbackHost(originUrl.hostname)) return false;
  if (originUrl.host.toLowerCase() !== headers.host.toLowerCase()) return false;

  return true;
}

export function validateContactFields(body: unknown): ContactFieldResult {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return { ok: false, error: "Invalid request body" };
  }

  const record = body as { name?: unknown; email?: unknown; message?: unknown };
  const name = typeof record.name === "string" ? record.name.trim() : "";
  const email = typeof record.email === "string" ? record.email.trim() : "";
  const message = typeof record.message === "string" ? record.message.trim() : "";

  if (!name || name.length > 200 || CONTROL_CHARS.test(name)) {
    return { ok: false, error: "Name is required" };
  }
  if (!email || email.length > 320 || !EMAIL_RE.test(email) || CONTROL_CHARS.test(email)) {
    return { ok: false, error: "Valid email is required" };
  }
  if (!message || message.length > 5000) {
    return { ok: false, error: "Message is required" };
  }

  return { ok: true, fields: { name, email, message } };
}
