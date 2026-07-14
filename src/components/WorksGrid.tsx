"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { WorkCard } from "@/components/WorkCard";
import type { Work, WorkCategory } from "@/lib/works";
import clsx from "clsx";

type Filter = "all" | WorkCategory;

type Props = {
  works: Work[];
};

const filters: { key: Filter; labelKey: string }[] = [
  { key: "all", labelKey: "filterAll" },
  { key: "painting", labelKey: "filterPainting" },
  { key: "works-on-paper", labelKey: "filterWorksOnPaper" },
  { key: "textile", labelKey: "filterTextile" },
];

export function WorksGrid({ works }: Props) {
  const t = useTranslations("works");
  const [active, setActive] = useState<Filter>("all");

  const filtered =
    active === "all" ? works : works.filter((work) => work.category === active);

  return (
    <div>
      <div className="mb-10 flex flex-wrap gap-3">
        {filters.map((filter) => (
          <button
            key={filter.key}
            type="button"
            onClick={() => setActive(filter.key)}
            className={clsx(
              "rounded-full border px-4 py-2 text-xs tracking-[0.18em] uppercase transition-all duration-300",
              active === filter.key
                ? "border-ink bg-ink text-cream"
                : "border-ink/15 text-ink-muted hover:border-ink/40 hover:text-ink",
            )}
            data-cursor="hover"
          >
            {t(filter.labelKey)}
          </button>
        ))}
      </div>

      <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((work, index) => (
          <WorkCard
            key={work.slug}
            work={work}
            viewLabel={t("details")}
            priority={index < 3}
          />
        ))}
      </div>
    </div>
  );
}
