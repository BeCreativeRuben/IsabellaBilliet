import Image from "next/image";
import { Link } from "@/i18n/navigation";
import type { Work } from "@/lib/works";

type Props = {
  work: Work;
  viewLabel: string;
  priority?: boolean;
};

export function WorkCard({ work, viewLabel, priority = false }: Props) {
  return (
    <article className="group" data-cursor="hover">
      <Link href={`/works/${work.slug}`} className="block">
        <div className="relative aspect-[4/5] overflow-hidden bg-cream-dark">
          <Image
            src={work.imageUrl}
            alt={work.title}
            fill
            priority={priority}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="image-hover object-cover"
          />
          <div className="absolute inset-0 bg-ink/0 transition-colors duration-500 group-hover:bg-ink/10" />
        </div>
        <div className="mt-4 flex items-start justify-between gap-4">
          <div>
            <h3 className="font-display text-xl text-ink md:text-2xl">{work.title}</h3>
            <p className="mt-1 text-sm text-ink-muted">
              {work.medium} · {work.year}
            </p>
          </div>
          <span className="mt-1 text-xs tracking-[0.2em] text-ink-muted uppercase opacity-0 transition-opacity group-hover:opacity-100">
            {viewLabel}
          </span>
        </div>
      </Link>
    </article>
  );
}
