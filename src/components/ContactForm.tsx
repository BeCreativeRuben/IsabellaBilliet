"use client";

import { FormEvent, useState } from "react";
import { useTranslations } from "next-intl";

type Status = "idle" | "sending" | "success" | "error";

export function ContactForm() {
  const t = useTranslations("contact");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    setError(null);

    const form = event.currentTarget;
    const data = new FormData(form);
    const payload = {
      name: String(data.get("name") ?? "").trim(),
      email: String(data.get("email") ?? "").trim(),
      message: String(data.get("message") ?? "").trim(),
    };

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
          disabled={status === "sending"}
          className="mt-2 w-full border-b border-ink/15 bg-transparent py-2 text-ink outline-none focus:border-ink disabled:opacity-60"
        />
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
          disabled={status === "sending"}
          className="mt-2 w-full border-b border-ink/15 bg-transparent py-2 text-ink outline-none focus:border-ink disabled:opacity-60"
        />
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
          disabled={status === "sending"}
          className="mt-2 w-full resize-none border-b border-ink/15 bg-transparent py-2 text-ink outline-none focus:border-ink disabled:opacity-60"
        />
      </div>
      <button
        type="submit"
        disabled={status === "sending"}
        className="rounded-full border border-ink bg-ink px-6 py-3 text-xs tracking-[0.22em] text-cream uppercase transition-colors hover:bg-ink/90 disabled:opacity-60"
        data-cursor="hover"
      >
        {status === "sending" ? t("formSending") : t("formSend")}
      </button>
      {status === "success" ? (
        <p className="text-xs leading-relaxed text-sage">{t("formSuccess")}</p>
      ) : status === "error" ? (
        <p className="text-xs leading-relaxed text-ink-muted">{error ?? t("formError")}</p>
      ) : (
        <p className="text-xs leading-relaxed text-ink-muted">{t("formNote")}</p>
      )}
    </form>
  );
}
