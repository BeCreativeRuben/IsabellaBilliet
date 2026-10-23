import { NextResponse } from "next/server";
import { Resend } from "resend";
import {
  isAllowedContactRequest,
  MAX_CONTACT_BODY_BYTES,
  validateContactFields,
} from "@/lib/request-guards";

const CONTACT_TO = process.env.CONTACT_TO ?? "isabella.billiet@gmail.com";
const CONTACT_FROM =
  process.env.CONTACT_FROM ?? "Isabella Billiet <noreply@studiothielman.com>";
const CONTACT_REPLY_TO = process.env.CONTACT_REPLY_TO ?? "isabella.billiet@gmail.com";

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

async function readLimitedBody(
  request: Request,
  maxBytes: number,
): Promise<{ ok: true; text: string } | { ok: false; reason: "too-large" | "invalid" }> {
  const declared = request.headers.get("content-length");
  if (declared !== null && (!/^\d+$/.test(declared) || Number(declared) > maxBytes)) {
    return { ok: false, reason: "too-large" };
  }
  if (!request.body) return { ok: false, reason: "invalid" };

  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      if (!value) continue;
      total += value.byteLength;
      if (total > maxBytes) {
        await reader.cancel();
        return { ok: false, reason: "too-large" };
      }
      chunks.push(value);
    }
  } catch {
    return { ok: false, reason: "invalid" };
  }

  const merged = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    merged.set(chunk, offset);
    offset += chunk.byteLength;
  }

  return { ok: true, text: new TextDecoder().decode(merged) };
}

export async function POST(request: Request) {
  try {
    if (
      !isAllowedContactRequest({
        origin: request.headers.get("origin"),
        host: request.headers.get("host"),
        contentType: request.headers.get("content-type"),
        secFetchSite: request.headers.get("sec-fetch-site"),
      })
    ) {
      return NextResponse.json({ ok: false, error: "Forbidden" }, { status: 403 });
    }

    const bodyResult = await readLimitedBody(request, MAX_CONTACT_BODY_BYTES);
    if (!bodyResult.ok) {
      if (bodyResult.reason === "too-large") {
        return NextResponse.json({ ok: false, error: "Payload too large" }, { status: 413 });
      }
      return NextResponse.json({ ok: false, error: "Invalid request body" }, { status: 400 });
    }

    let parsed: unknown;
    try {
      parsed = JSON.parse(bodyResult.text);
    } catch {
      parsed = null;
    }

    const fields = validateContactFields(parsed);
    if (!fields.ok) {
      return NextResponse.json({ ok: false, error: fields.error }, { status: 400 });
    }

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.error("[contact] RESEND_API_KEY is not set");
      return NextResponse.json(
        { ok: false, error: "Email service is not configured" },
        { status: 500 },
      );
    }

    const { name, email, message } = fields.fields;
    const resend = new Resend(apiKey);
    const subject = `Contact form — ${name}`;
    const text = [`Name: ${name}`, `Email: ${email}`, "", message].join("\n");
    const html = `
      <p><strong>Name:</strong> ${escapeHtml(name)}</p>
      <p><strong>Email:</strong> ${escapeHtml(email)}</p>
      <p><strong>Message:</strong></p>
      <p>${escapeHtml(message).replace(/\n/g, "<br />")}</p>
    `;

    const { error } = await resend.emails.send({
      from: CONTACT_FROM,
      to: CONTACT_TO,
      replyTo: email || CONTACT_REPLY_TO,
      subject,
      text,
      html,
    });

    if (error) {
      console.error("[contact] Resend error:", error.message ?? error);
      return NextResponse.json(
        { ok: false, error: "Failed to send message" },
        { status: 500 },
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[contact] Unexpected error:", message);
    return NextResponse.json(
      { ok: false, error: "Failed to send message" },
      { status: 500 },
    );
  }
}
