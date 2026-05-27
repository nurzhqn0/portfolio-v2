import { Download, ExternalLink } from "lucide-react";

import { Footer } from "../components/layout/Footer";
import { ContactForm } from "../features/contacts/components/ContactForm";
import { useContactLinks } from "../features/contacts/api";
import { useProfile } from "../features/profile/api";
import { mediaUrl } from "../lib/api";

export function ContactsPage() {
  const { data: links = [] } = useContactLinks();
  const { data: profile } = useProfile();

  return (
    <>
      <main className="relative mx-auto max-w-7xl overflow-hidden px-5 py-20">
        <div className="pointer-events-none absolute left-[-10rem] top-[20%] h-[28rem] w-[28rem] rounded-full bg-brand-neon/20 blur-[110px]" />
        <div className="relative z-10 grid gap-8 lg:grid-cols-[.85fr_1.15fr]">
          <div className="glass-panel rounded-[28px] p-8 lg:p-10">
            <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-clay">
              Ready to build something?
            </p>
            <h1 className="mt-3 font-display text-5xl italic text-ink">
              Contacts
            </h1>
            <div className="mt-10 space-y-4">
              {links.map((link) => (
                <a
                  key={link.id}
                  href={link.url ?? "#"}
                  target={link.url ? "_blank" : undefined}
                  rel="noreferrer"
                  className="group flex items-center justify-between rounded-xl border border-ink/10 bg-white px-6 py-4 text-sm shadow-sm transition-all duration-300 hover:border-clay/30 hover:shadow-glow"
                >
                  <span className="font-medium text-graphite">
                    {link.label}
                  </span>
                  <span className="flex items-center gap-2 font-semibold text-ink transition-colors group-hover:text-clay">
                    {link.value}
                    {link.url && <ExternalLink size={16} />}
                  </span>
                </a>
              ))}
              {profile?.resume_url && (
                <a
                  href={mediaUrl(profile.resume_url) ?? "#"}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-center justify-between rounded-xl border border-ink/10 bg-white px-6 py-4 text-sm shadow-sm transition-all duration-300 hover:border-clay/30 hover:shadow-glow"
                >
                  <span className="font-medium text-graphite">Resume</span>
                  <span className="flex items-center gap-2 font-semibold text-ink transition-colors group-hover:text-clay">
                    <Download size={16} />
                  </span>
                </a>
              )}
            </div>
          </div>
          <div className="glass-panel rounded-[28px] p-8 lg:p-10">
            <h2 className="mb-2 font-display text-4xl italic text-ink">
              Send a message
            </h2>
            <p className="mb-8 text-base text-graphite">
              Messages are saved in the admin dashboard. Let's discuss your next
              project.
            </p>
            <ContactForm />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
