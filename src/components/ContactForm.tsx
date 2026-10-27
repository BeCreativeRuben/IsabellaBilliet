"use client";

import { FormEvent, useState } from "react";
import { useTranslations } from "next-intl";

type Status = "idle" | "sending" | "success" | "error";
type FieldErrors = {
  name?: string;
  email?: string;
  message?: string;
};

const EMAIL_RE = /^[^\s@,<>()"\\;:]+@[^\s@,<>()"\\;:]+\.[^\s@,<>()"\\;:]+$/;

export function ContactForm() {
  const t = useTranslations("contact");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const form = event.currentTarget;
    const data = new FormData(form);
    const payload = {
      name: String(data.get("name") ?? "").trim(),
      email: String(data.get("email") ?? "").trim(),
      message: String(data.get("message") ?? "").trim(),
    };

    const nextErrors: FieldErrors = {};
    if (!payload.name || payload.name.length > 200) nextErrors.name = t("formNameInvalid");
    if (!payload.email || payload.email.length > 320 || !EMAIL_RE.test(payload.email)) {
      nextErrors.email = t("formEmailInvalid");
    }
    if (!payload.message || payload.message.length > 5000) {
      nextErrors.message = t("formMessageInvalid");
    }
    setFieldErrors(nextErrors);
    if (nextErrors.name || nextErrors.email || nextErrors.message) {
      setStatus("idle");
      return;
    }

    setStatus("sending");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = (await res.json().catch(() => null)) as
        | { ok?: boolean; error?: string }
        | null;

      if (!res.ok || !json?.ok) {
        setStatus("error");
        setError(json?.error || t("formError"));
        return;
      }

      form.reset();
      setStatus("success");
    } catch {
      setStatus("error");
      setError(t("formError"));
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="space-y-5 border border-ink/10 bg-cream-dark/30 p-6 md:p-8"
    >
      <div>
        <label htmlFor="name" className="text-xs tracking-[0.18em] text-ink-muted uppercase">
          {t("formName")}
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          autoComplete="name"
          maxLength={200}
          disabled={status === "sending"}
          aria-invalid={fieldErrors.name ? true : undefined}
          aria-describedby={fieldErrors.name ? "name-error" : undefined}
          className="mt-2 min-h-11 w-full border-b border-ink/15 bg-transparent py-2 text-ink focus:border-ink disabled:opacity-60"
        />
        {fieldErrors.name ? (
          <p id="name-error" className="mt-2 text-xs text-ink" role="alert">
            {fieldErrors.name}
          </p>
        ) : null}
      </div>
      <div>
        <label htmlFor="email" className="text-xs tracking-[0.18em] text-ink-muted uppercase">
          {t("formEmail")}
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          maxLength={320}
          disabled={status === "sending"}
          aria-invalid={fieldErrors.email ? true : undefined}
          aria-describedby={fieldErrors.email ? "email-error" : undefined}
          className="mt-2 min-h-11 w-full border-b border-ink/15 bg-transparent py-2 text-ink focus:border-ink disabled:opacity-60"
        />
        {fieldErrors.email ? (
          <p id="email-error" className="mt-2 text-xs text-ink" role="alert">
            {fieldErrors.email}
          </p>
        ) : null}
      </div>
      <div>
        <label
          htmlFor="message"
          className="text-xs tracking-[0.18em] text-ink-muted uppercase"
        >
          {t("formMessage")}
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          maxLength={5000}
          disabled={status === "sending"}
          aria-invalid={fieldErrors.message ? true : undefined}
          aria-describedby={fieldErrors.message ? "message-error" : undefined}
          className="mt-2 w-full resize-none border-b border-ink/15 bg-transparent py-2 text-ink focus:border-ink disabled:opacity-60"
        />
        {fieldErrors.message ? (
          <p id="message-error" className="mt-2 text-xs text-ink" role="alert">
            {fieldErrors.message}
          </p>
        ) : null}
      </div>
      <button
        type="submit"
        disabled={status === "sending"}
        className="min-h-11 rounded-full border border-ink bg-ink px-6 py-3 text-xs tracking-[0.22em] text-cream uppercase transition-colors hover:bg-ink/90 disabled:opacity-60"
        data-cursor="hover"
      >
        {status === "sending" ? t("formSending") : t("formSend")}
      </button>
      {status === "success" ? (
        <p className="text-xs leading-relaxed text-sage-ink">{t("formSuccess")}</p>
      ) : status === "error" ? (
        <p className="text-xs leading-relaxed text-ink-muted">{error ?? t("formError")}</p>
      ) : (
        <p className="text-xs leading-relaxed text-ink-muted">{t("formNote")}</p>
      )}
    </form>
  );
}
