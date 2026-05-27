import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

import { Button } from "../components/ui/button";
import { Footer } from "../components/layout/Footer";
import { ProjectCard } from "../features/projects/components/ProjectCard";
import { useProfile } from "../features/profile/api";
import { useProjects } from "../features/projects/api";
import { mediaUrl } from "../lib/api";

export function LandingPage() {
  const { data: profile, isLoading: isProfileLoading } = useProfile();
  const { data: projects = [], isLoading: areProjectsLoading } = useProjects();
  const featured = projects
    .filter((project) => project.is_featured)
    .slice(0, 3);
  const photo = mediaUrl(profile?.landing_photo_url);

  if (isProfileLoading) {
    return (
      <>
        <main className="relative overflow-hidden pt-8">
          <div className="relative z-10 mx-auto grid max-w-7xl gap-7 px-5 py-8 lg:grid-cols-[1.12fr_.88fr] lg:py-12">
            <div className="glass-panel min-h-[470px] rounded-[28px] p-7 sm:p-10 lg:p-12">
              <div className="h-5 w-64 rounded-full bg-ink/10" />
              <div className="mt-12 h-16 w-11/12 rounded-2xl bg-ink/10" />
              <div className="mt-4 h-16 w-8/12 rounded-2xl bg-ink/10" />
              <div className="mt-8 h-5 w-9/12 rounded-full bg-ink/10" />
              <div className="mt-3 h-5 w-7/12 rounded-full bg-ink/10" />
            </div>
            <div className="min-h-[470px] rounded-[28px] border border-white bg-white/50 shadow-soft" />
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <main className="relative overflow-hidden pt-8">
        <div className="pointer-events-none absolute right-[-6rem] top-[-8rem] h-[28rem] w-[28rem] rounded-full bg-brand-cyan/20 blur-[110px]" />
        <div className="pointer-events-none absolute bottom-[18%] left-[-8rem] h-[24rem] w-[24rem] rounded-full bg-brand-neon/20 blur-[100px]" />

        <section className="relative z-10 mx-auto grid max-w-7xl gap-7 px-5 py-8 lg:grid-cols-[1.12fr_.88fr] lg:py-12">
          <div className="glass-panel relative flex min-h-[470px] flex-col justify-center overflow-hidden rounded-[28px] p-7 sm:p-10 lg:p-12">
            <div className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full border border-clay/20" />
            <div className="pointer-events-none absolute bottom-8 right-8 hidden rounded-full bg-brand-cyan/10 px-5 py-2 text-sm italic text-brand-navy md:block">
              selected work
            </div>

            <div className="mb-8 flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.18em] text-clay">
              <Sparkles size={18} className="text-brand-neon" />
              {profile?.is_available
                ? "Available for selected work"
                : "Portfolio archive"}
            </div>

            <p className="mb-4 text-base font-semibold uppercase tracking-widest text-graphite">
              {profile?.name}
            </p>

            <h1 className="max-w-4xl font-display text-[2.85rem] italic leading-[0.98] text-ink sm:text-5xl lg:text-[4.15rem]">
              {profile?.headline}
            </h1>

            <p className="mt-7 max-w-xl text-lg leading-8 text-graphite">
              {profile?.bio}
            </p>

            <div className="mt-9 flex flex-wrap gap-4">
              <Link to="/projects">
                <Button className="group h-12 px-6">
                  View projects
                  <ArrowRight
                    size={18}
                    className="ml-1 transition-transform group-hover:translate-x-1"
                  />
                </Button>
              </Link>
              <Link to="/contacts">
                <Button variant="ghost" className="h-12 px-6">
                  Contact
                </Button>
              </Link>
            </div>
          </div>

          <div
            className="image-field min-h-[470px] rounded-[28px] border border-white shadow-soft transition-transform duration-700 hover:scale-[1.01]"
            style={photo ? { backgroundImage: `url(${photo})` } : undefined}
          />
        </section>

        <section className="relative z-10 mx-auto max-w-7xl px-5 py-16">
          <div className="mb-12 flex items-end justify-between gap-4">
            <div>
              <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-clay">
                Sneak peek of my works
              </p>
              <h2 className="font-display text-4xl italic text-ink md:text-5xl">
                Selected projects
              </h2>
            </div>
            <Link
              to="/projects"
              className="group flex items-center text-sm font-semibold text-graphite transition-colors hover:text-clay"
            >
              All projects
              <ArrowRight
                size={16}
                className="ml-2 -translate-x-2 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100"
              />
            </Link>
          </div>
          {areProjectsLoading ? (
            <div className="grid gap-8 md:grid-cols-3">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="h-80 rounded-[24px] bg-white/70 shadow-soft"
                />
              ))}
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-3">
              {(featured.length ? featured : projects.slice(0, 3)).map(
                (project) => (
                  <ProjectCard key={project.id} project={project} />
                ),
              )}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
