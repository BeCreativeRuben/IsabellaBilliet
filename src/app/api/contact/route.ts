import { NextResponse } from "next/server";
import { Resend } from "resend";

const CONTACT_TO =
  process.env.CONTACT_TO ?? "isabella.billiet@gmail.com";
const CONTACT_FROM =
  process.env.CONTACT_FROM ??
  "Isabella Billiet <noreply@studiothielman.com>";
const CONTACT_REPLY_TO =
  process.env.CONTACT_REPLY_TO ?? "isabella.billiet@gmail.com";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { ok: false, error: "Invalid request body" },
        { status: 400 },
      );
    }

    const name =
      typeof (body as { name?: unknown }).name === "string"
        ? (body as { name: string }).name.trim()
        : "";
    const email =
      typeof (body as { email?: unknown }).email === "string"
        ? (body as { email: string }).email.trim()
        : "";
    const message =
      typeof (body as { message?: unknown }).message === "string"
        ? (body as { message: string }).message.trim()
        : "";

    if (!name || name.length > 200) {
      return NextResponse.json(
        { ok: false, error: "Name is required" },
        { status: 400 },
      );
    }
    if (!email || !EMAIL_RE.test(email) || email.length > 320) {
      return NextResponse.json(
        { ok: false, error: "Valid email is required" },
        { status: 400 },
      );
    }
    if (!message || message.length > 5000) {
      return NextResponse.json(
        { ok: false, error: "Message is required" },
        { status: 400 },
      );
    }

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.error("[contact] RESEND_API_KEY is not set");
      return NextResponse.json(
        { ok: false, error: "Email service is not configured" },
        { status: 500 },
      );
    }

    const resend = new Resend(apiKey);
    const subject = `Contact form — ${name}`;
    const text = [
      `Name: ${name}`,
      `Email: ${email}`,
      "",
      message,
    ].join("\n");
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
