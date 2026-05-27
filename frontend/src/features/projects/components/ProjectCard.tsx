import { ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";

import { mediaUrl } from "../../../lib/api";
import { Project } from "../../../types/project";

export function ProjectCard({ project }: { project: Project }) {
  const image = mediaUrl(project.cover_image_url);

  return (
    <Link
      to={`/projects/${project.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-[24px] border border-white bg-porcelain shadow-soft transition hover:-translate-y-2 hover:shadow-neon"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-cover bg-center">
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
          style={{
            backgroundImage: image
              ? `url(${image})`
              : "linear-gradient(135deg, rgba(255,199,117,0.5), rgba(98,182,203,0.45))",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-white/45 via-transparent to-transparent" />
      </div>
      <div className="relative z-10 flex flex-1 flex-col bg-white/85 p-6">
        <div className="mb-4 flex items-start justify-between gap-3">
          <h3 className="font-display text-2xl italic leading-tight text-ink transition-colors group-hover:text-clay">
            {project.title}
          </h3>
          <ExternalLink
            size={20}
            className="-translate-x-2 text-clay opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100"
          />
        </div>
        <p className="mb-6 flex-1 text-sm leading-relaxed text-graphite">
          {project.summary}
        </p>
        <div className="mt-auto flex flex-wrap gap-2">
          {project.tech_stack.map((tech) => (
            <span
              key={tech}
              className="rounded-full bg-brand-cyan/12 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-brand-navy ring-1 ring-brand-cyan/20"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}
