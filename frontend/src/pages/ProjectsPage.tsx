import { Footer } from "../components/layout/Footer";
import { ProjectCard } from "../features/projects/components/ProjectCard";
import { useProjects } from "../features/projects/api";

export function ProjectsPage() {
  const { data: projects = [], isLoading } = useProjects();

  return (
    <>
      <main className="relative mx-auto max-w-7xl overflow-hidden px-5 py-20">
        <div className="pointer-events-none absolute right-[10%] top-[-12rem] h-[28rem] w-[28rem] rounded-full bg-brand-cyan/20 blur-[120px]" />
        <div className="relative z-10 mb-14 max-w-3xl">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-clay">
            Works
          </p>
          <h1 className="font-display text-5xl italic leading-tight text-ink md:text-7xl">
            Projects
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-graphite">
            Case studies, experiments, and shipped interfaces collected in one
            place.
          </p>
        </div>
        {isLoading ? (
          <div className="flex h-64 items-center justify-center font-medium text-clay">
            Loading projects...
          </div>
        ) : (
          <div className="relative z-10 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
