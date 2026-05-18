import { ArrowLeft, ExternalLink, Github } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

import { Button } from '../components/ui/button';
import { Footer } from '../components/layout/Footer';
import { api, mediaUrl } from '../lib/api';

export function ProjectDetailPage() {
  const { slug = '' } = useParams();
  const { data: project, isLoading } = useQuery({
    queryKey: ['project', slug],
    queryFn: () => api.getProject(slug),
    enabled: Boolean(slug),
  });

  if (isLoading) {
    return <main className="mx-auto max-w-7xl px-5 py-24 text-center font-medium text-clay">Loading project...</main>;
  }

  if (!project) {
    return <main className="mx-auto max-w-7xl px-5 py-24 text-center font-display text-4xl italic text-ink">Project not found.</main>;
  }

  const cover = mediaUrl(project.cover_image_url);
  const gallery = project.gallery_image_urls.map(mediaUrl).filter(Boolean);

  return (
    <>
      <main className="relative mx-auto max-w-7xl overflow-hidden px-5 py-16">
        <div className="pointer-events-none absolute right-[-10rem] top-[5%] h-[28rem] w-[28rem] rounded-full bg-brand-cyan/20 blur-[120px]" />
        <div className="pointer-events-none absolute left-[-8rem] top-[40%] h-[20rem] w-[20rem] rounded-full bg-brand-neon/20 blur-[100px]" />
        
        <Link to="/projects" className="group relative z-10 mb-12 inline-flex items-center gap-2 text-sm font-medium text-graphite transition-colors hover:text-clay">
          <ArrowLeft size={18} className="transform transition-transform group-hover:-translate-x-1" />
          Back to projects
        </Link>
        <section className="relative z-10 grid gap-10 lg:grid-cols-[.9fr_1.1fr]">
          <div className="flex flex-col justify-center">
            <h1 className="font-display text-5xl italic leading-tight text-ink md:text-7xl">{project.title}</h1>
            <p className="mt-6 text-lg leading-relaxed text-graphite">{project.summary}</p>
            <div className="mt-8 flex flex-wrap gap-2">
              {project.tech_stack.map((tech) => (
                <span key={tech} className="rounded-full bg-white px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-brand-navy shadow-sm ring-1 ring-brand-cyan/20">
                  {tech}
                </span>
              ))}
            </div>
            <div className="mt-12 flex flex-wrap gap-4">
              {project.live_url && (
                <a href={project.live_url} target="_blank" rel="noreferrer">
                  <Button className="group h-12 px-6">
                    <ExternalLink size={18} className="mr-2" />
                    Live
                  </Button>
                </a>
              )}
              {project.github_url && (
                <a href={project.github_url} target="_blank" rel="noreferrer">
                  <Button variant="secondary" className="h-12 px-6">
                    <Github size={18} className="mr-2" />
                    GitHub
                  </Button>
                </a>
              )}
            </div>
          </div>
          <div
            className="group relative aspect-[4/3] overflow-hidden rounded-[28px] border border-white bg-cover bg-center shadow-soft"
          >
            <div 
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-[1.02]"
              style={{
                backgroundImage: cover
                  ? `url(${cover})`
                  : 'linear-gradient(135deg, rgba(255,199,117,.5), rgba(98,182,203,.45))',
              }}
            />
            <div className="absolute inset-0 bg-white/10" />
          </div>
        </section>
        
        <section className="relative z-10 mt-16 rounded-[28px] border border-white bg-porcelain p-8 shadow-soft lg:p-12">
          <h2 className="font-display text-4xl italic text-ink">Project overview</h2>
          <div className="mt-8 h-px w-full bg-gradient-to-r from-clay/40 to-transparent" />
          <p className="mt-8 whitespace-pre-line text-lg leading-relaxed text-graphite">{project.description}</p>
        </section>
        
        {gallery.length > 0 && (
          <section className="relative z-10 mt-16 grid gap-6 md:grid-cols-2">
            {gallery.map((image) => (
              <div key={image} className="group overflow-hidden rounded-[24px] border border-white shadow-soft">
                <img
                  src={image ?? ''}
                  alt=""
                  className="aspect-[4/3] w-full object-cover transition-transform duration-700 hover:scale-105"
                />
              </div>
            ))}
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
