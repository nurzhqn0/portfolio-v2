import {
  Check,
  Eye,
  FileImage,
  Inbox,
  Link as LinkIcon,
  Pencil,
  Plus,
  Trash2,
  Upload,
} from 'lucide-react';
import { ChangeEvent, FormEvent, ReactNode, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { AdminLayout } from '../components/layout/AdminLayout';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Input, Textarea } from '../components/ui/input';
import { EmptyState } from '../features/admin/components/EmptyState';
import {
  useAdminContactLinks,
  useCreateContactLink,
  useDeleteContactLink,
  useMarkMessage,
  useMessages,
  useUpdateContactLink,
} from '../features/contacts/api';
import {
  useAdminProjects,
  useCreateProject,
  useDeleteProject,
  useUpdateProject,
} from '../features/projects/api';
import { useProfile, useUpdateProfile } from '../features/profile/api';
import { api, mediaUrl, type ContactLink, type Profile, type Project } from '../lib/api';
import { isAuthenticated } from '../lib/auth';

type Tab = 'profile' | 'projects' | 'contacts' | 'messages' | 'uploads';

const tabs: { id: Tab; label: string }[] = [
  { id: 'profile', label: 'Profile' },
  { id: 'projects', label: 'Projects' },
  { id: 'contacts', label: 'Contacts' },
  { id: 'messages', label: 'Messages' },
  { id: 'uploads', label: 'Uploads' },
];

const emptyProject = {
  title: '',
  slug: '',
  summary: '',
  description: '',
  cover_image_url: '',
  gallery_image_urls: '',
  tech_stack: '',
  live_url: '',
  github_url: '',
  is_featured: false,
  sort_order: 0,
  is_published: true,
};

type FieldErrors = Record<string, string>;

function Field({
  label,
  help,
  error,
  children,
}: {
  label: string;
  help?: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <label className="grid gap-1.5">
      <span className="text-sm font-semibold text-ink">{label}</span>
      {children}
      {help && !error && <span className="text-xs leading-5 text-ink/50">{help}</span>}
      {error && <span className="text-xs font-medium leading-5 text-red-600">{error}</span>}
    </label>
  );
}

function FormAlert({ message, tone = 'error' }: { message: string | null; tone?: 'error' | 'success' }) {
  if (!message) return null;

  return (
    <div
      className={`rounded-xl px-4 py-3 text-sm leading-6 ${
        tone === 'success'
          ? 'bg-moss/10 text-moss ring-1 ring-moss/20'
          : 'bg-red-50 text-red-700 ring-1 ring-red-200'
      }`}
    >
      {message}
    </div>
  );
}

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}


function normalizeOptionalUrl(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return null;
  if (trimmed.startsWith('/media/')) return trimmed;
  if (/^https?:\/\//i.test(trimmed) || /^mailto:/i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

function isValidOptionalUrl(value: string, allowMedia = true, allowMail = true) {
  const normalized = normalizeOptionalUrl(value);
  if (!normalized) return true;
  if (allowMedia && normalized.startsWith('/media/')) return true;
  if (normalized.startsWith('mailto:')) {
    return allowMail && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized.slice(7));
  }

  try {
    const url = new URL(normalized);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

function inferContactType(label: string, value: string) {
  const text = `${label} ${value}`.toLowerCase();
  if (text.includes('@') || text.includes('email')) return 'email';
  if (text.includes('github')) return 'github';
  if (text.includes('linkedin')) return 'linkedin';
  if (text.includes('telegram')) return 'telegram';
  if (text.includes('phone')) return 'phone';
  if (text.includes('resume')) return 'resume';
  return 'website';
}

function prepareContactUrl(value: string, url: string) {
  if (url.trim()) return normalizeOptionalUrl(url);
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) return `mailto:${value.trim()}`;
  if (/^(https?:\/\/|www\.|[a-z0-9-]+\.)/i.test(value.trim())) return normalizeOptionalUrl(value);
  return null;
}

export function AdminPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>('profile');

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login');
    }
  }, [navigate]);

  return (
    <AdminLayout>
      <div className="mb-6 flex flex-wrap gap-2">
        {tabs.map((item) => (
          <button
            key={item.id}
            onClick={() => setTab(item.id)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              tab === item.id ? 'bg-ink text-white' : 'bg-white text-ink/60 hover:text-ink'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
      {tab === 'profile' && <ProfileAdmin />}
      {tab === 'projects' && <ProjectsAdmin />}
      {tab === 'contacts' && <ContactsAdmin />}
      {tab === 'messages' && <MessagesAdmin />}
      {tab === 'uploads' && <UploadsAdmin />}
    </AdminLayout>
  );
}

function ProfileAdmin() {
  const { data: profile, isLoading } = useProfile();
  const updateProfile = useUpdateProfile();
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: '',
    headline: '',
    bio: '',
    landing_photo_url: '',
    resume_url: '',
    location: '',
    is_available: true,
  });

  useEffect(() => {
    if (profile) {
      setForm({
        name: profile.name,
        headline: profile.headline,
        bio: profile.bio,
        landing_photo_url: profile.landing_photo_url ?? '',
        resume_url: profile.resume_url ?? '',
        location: profile.location ?? '',
        is_available: profile.is_available,
      });
    }
  }, [profile]);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setStatus(null);
    const nextErrors = validateProfile(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    try {
      await updateProfile.mutateAsync({
        ...form,
        landing_photo_url: normalizeOptionalUrl(form.landing_photo_url),
        resume_url: normalizeOptionalUrl(form.resume_url),
        location: form.location.trim() || null,
      } as Partial<Profile>);
      setStatus('Profile saved.');
    } catch (err) {
      setStatus(err instanceof Error ? err.message : 'Could not save profile.');
    }
  }

  async function uploadInto(field: 'landing_photo_url' | 'resume_url', file?: File) {
    if (!file) return;
    setStatus(null);
    try {
      const response = await api.upload(file);
      setForm((current) => ({ ...current, [field]: response.url }));
      setStatus('File uploaded and inserted into the form.');
    } catch (err) {
      setStatus(err instanceof Error ? err.message : 'Upload failed.');
    }
  }

  if (isLoading) {
    return <AdminLoadingCard title="Loading profile..." />;
  }

  return (
    <Card className="p-6">
      <h2 className="font-display text-3xl italic">Profile</h2>
      <p className="mt-2 text-sm leading-6 text-ink/60">
        Fill this once and the public landing page updates automatically. Image and resume fields can use uploads or normal links.
      </p>
      <form onSubmit={submit} className="mt-6 grid gap-4">
        <FormAlert message={status} tone={status?.includes('saved') || status?.includes('uploaded') ? 'success' : 'error'} />
        <Field label="Name" error={errors.name} help="Your display name on the portfolio.">
          <Input
            placeholder="Nurzhan Zimbetov"
            value={form.name}
            onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
          />
        </Field>
        <Field label="Headline" error={errors.headline} help="Short sentence shown in the big hero title.">
          <Input
            placeholder="Creative developer building thoughtful digital products"
            value={form.headline}
            onChange={(event) => setForm((current) => ({ ...current, headline: event.target.value }))}
          />
        </Field>
        <Field label="Bio" error={errors.bio} help="A short paragraph about you.">
          <Textarea
            placeholder="I build clean web apps, admin tools, and polished interfaces."
            value={form.bio}
            onChange={(event) => setForm((current) => ({ ...current, bio: event.target.value }))}
          />
        </Field>
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Landing photo" error={errors.landing_photo_url} help="Upload an image or paste a link.">
            <div className="flex gap-2">
              <Input
                placeholder="/media/photo.png or https://..."
                value={form.landing_photo_url}
                onChange={(event) =>
                  setForm((current) => ({ ...current, landing_photo_url: event.target.value }))
                }
              />
              <label className="inline-flex h-12 cursor-pointer items-center justify-center rounded-xl bg-white px-4 text-sm font-semibold text-ink ring-1 ring-ink/10 hover:ring-clay/30">
                <Upload size={16} />
                <input
                  className="sr-only"
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/gif"
                  onChange={(event) => uploadInto('landing_photo_url', event.target.files?.[0])}
                />
              </label>
            </div>
          </Field>
          <Field label="Resume" error={errors.resume_url} help="Upload a PDF or paste a resume link.">
            <div className="flex gap-2">
              <Input
                placeholder="/media/resume.pdf or https://..."
                value={form.resume_url}
                onChange={(event) =>
                  setForm((current) => ({ ...current, resume_url: event.target.value }))
                }
              />
              <label className="inline-flex h-12 cursor-pointer items-center justify-center rounded-xl bg-white px-4 text-sm font-semibold text-ink ring-1 ring-ink/10 hover:ring-clay/30">
                <Upload size={16} />
                <input
                  className="sr-only"
                  type="file"
                  accept="application/pdf"
                  onChange={(event) => uploadInto('resume_url', event.target.files?.[0])}
                />
              </label>
            </div>
          </Field>
        </div>
        <div className="grid gap-4 md:grid-cols-[1fr_auto]">
          <Field label="Location" help="Optional. Example: Almaty, Kazakhstan.">
            <Input
              placeholder="Almaty, Kazakhstan"
              value={form.location}
              onChange={(event) => setForm((current) => ({ ...current, location: event.target.value }))}
            />
          </Field>
          <label className="flex items-center gap-2 rounded-md bg-white px-4 text-sm">
            <input
              type="checkbox"
              checked={form.is_available}
              onChange={(event) =>
                setForm((current) => ({ ...current, is_available: event.target.checked }))
              }
            />
            Available
          </label>
        </div>
        <Button className="w-fit" type="submit" disabled={updateProfile.isPending}>
          <Check size={16} />
          Save profile
        </Button>
      </form>
    </Card>
  );
}

function AdminLoadingCard({ title }: { title: string }) {
  return (
    <Card className="p-6">
      <h2 className="font-display text-3xl italic">{title}</h2>
      <div className="mt-6 grid gap-4">
        <div className="h-12 rounded-xl bg-ink/10" />
        <div className="h-12 rounded-xl bg-ink/10" />
        <div className="h-32 rounded-xl bg-ink/10" />
      </div>
    </Card>
  );
}

function validateProfile(form: {
  name: string;
  headline: string;
  bio: string;
  landing_photo_url: string;
  resume_url: string;
}) {
  const errors: FieldErrors = {};
  if (!form.name.trim()) errors.name = 'Add your name.';
  if (!form.headline.trim()) errors.headline = 'Add a headline for the landing page.';
  if (!form.bio.trim()) errors.bio = 'Add a short bio.';
  if (!isValidOptionalUrl(form.landing_photo_url)) {
    errors.landing_photo_url = 'Use an upload URL, http(s) link, or leave it empty.';
  }
  if (!isValidOptionalUrl(form.resume_url)) {
    errors.resume_url = 'Use an upload URL, http(s) link, or leave it empty.';
  }
  return errors;
}

function ProjectsAdmin() {
  const { data: projects = [], isLoading } = useAdminProjects();
  const createProject = useCreateProject();
  const updateProject = useUpdateProject();
  const deleteProject = useDeleteProject();
  const [editing, setEditing] = useState<Project | null>(null);
  const [form, setForm] = useState(emptyProject);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    if (editing) {
      setForm({
        title: editing.title,
        slug: editing.slug,
        summary: editing.summary,
        description: editing.description,
        cover_image_url: editing.cover_image_url ?? '',
        gallery_image_urls: editing.gallery_image_urls.join(', '),
        tech_stack: editing.tech_stack.join(', '),
        live_url: editing.live_url ?? '',
        github_url: editing.github_url ?? '',
        is_featured: editing.is_featured,
        sort_order: editing.sort_order,
        is_published: editing.is_published,
      });
    }
  }, [editing]);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setStatus(null);
    const nextErrors = validateProject(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    const payload = buildProjectPayload(form);
    try {
      if (editing) {
        await updateProject.mutateAsync({ id: editing.id, payload: payload as Partial<Project> });
        setEditing(null);
        setStatus('Project updated.');
      } else {
        await createProject.mutateAsync(payload as Partial<Project>);
        setStatus('Project created.');
      }
      setForm(emptyProject);
    } catch (err) {
      setStatus(err instanceof Error ? err.message : 'Could not save project.');
    }
  }

  async function uploadInto(field: 'cover_image_url' | 'gallery_image_urls', file?: File) {
    if (!file) return;
    setStatus(null);
    try {
      const response = await api.upload(file);
      setForm((current) => ({
        ...current,
        [field]:
          field === 'gallery_image_urls'
            ? [...splitList(current.gallery_image_urls), response.url].join(', ')
            : response.url,
      }));
      setStatus('Image uploaded and inserted into the project form.');
    } catch (err) {
      setStatus(err instanceof Error ? err.message : 'Upload failed.');
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[.9fr_1.1fr]">
      <Card className="p-6">
        <h2 className="font-display text-3xl italic">{editing ? 'Edit project' : 'New project'}</h2>
        <p className="mt-2 text-sm leading-6 text-ink/60">
          Only title and description are required. The admin will generate the slug and summary when you leave them empty.
        </p>
        <form onSubmit={submit} className="mt-6 grid gap-3">
          <FormAlert message={status} tone={status?.includes('created') || status?.includes('updated') || status?.includes('uploaded') ? 'success' : 'error'} />
          <Field label="Project title" error={errors.title} help="Example: FinFlow Dashboard">
            <Input
              placeholder="FinFlow Dashboard"
              value={form.title}
              onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
            />
          </Field>
          <Field
            label="Slug"
            error={errors.slug}
            help={`Optional. Public URL will be /projects/${form.slug.trim() || slugify(form.title) || 'project-name'}.`}
          >
            <Input
              placeholder="Generated automatically from title"
              value={form.slug}
              onChange={(event) => setForm((current) => ({ ...current, slug: event.target.value }))}
            />
          </Field>
          <Field label="Short summary" help="Optional. If empty, it will be created from the description.">
            <Input
              placeholder="One sentence about the project"
              value={form.summary}
              onChange={(event) => setForm((current) => ({ ...current, summary: event.target.value }))}
            />
          </Field>
          <Field label="Description" error={errors.description} help="Write the project story, problem, solution, and result.">
            <Textarea
              placeholder="This project helps users..."
              value={form.description}
              onChange={(event) =>
                setForm((current) => ({ ...current, description: event.target.value }))
              }
            />
          </Field>
          <Field label="Cover image" error={errors.cover_image_url} help="Upload an image or paste a link.">
            <div className="flex gap-2">
              <Input
                placeholder="/media/project.png or https://..."
                value={form.cover_image_url}
                onChange={(event) =>
                  setForm((current) => ({ ...current, cover_image_url: event.target.value }))
                }
              />
              <label className="inline-flex h-12 cursor-pointer items-center justify-center rounded-xl bg-white px-4 text-sm font-semibold text-ink ring-1 ring-ink/10 hover:ring-clay/30">
                <Upload size={16} />
                <input
                  className="sr-only"
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/gif"
                  onChange={(event) => uploadInto('cover_image_url', event.target.files?.[0])}
                />
              </label>
            </div>
          </Field>
          <Field label="Gallery images" error={errors.gallery_image_urls} help="Optional. Upload one by one or paste links separated by commas.">
            <div className="flex gap-2">
              <Input
                placeholder="/media/one.png, /media/two.png"
                value={form.gallery_image_urls}
                onChange={(event) =>
                  setForm((current) => ({ ...current, gallery_image_urls: event.target.value }))
                }
              />
              <label className="inline-flex h-12 cursor-pointer items-center justify-center rounded-xl bg-white px-4 text-sm font-semibold text-ink ring-1 ring-ink/10 hover:ring-clay/30">
                <Upload size={16} />
                <input
                  className="sr-only"
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/gif"
                  onChange={(event) => uploadInto('gallery_image_urls', event.target.files?.[0])}
                />
              </label>
            </div>
          </Field>
          <Field label="Tech stack" help="Optional. Write simple words separated by commas. Example: React, FastAPI, SQLite">
            <Input
              placeholder="React, FastAPI, SQLite"
              value={form.tech_stack}
              onChange={(event) =>
                setForm((current) => ({ ...current, tech_stack: event.target.value }))
              }
            />
          </Field>
          <div className="grid gap-3 md:grid-cols-2">
            <Field label="Live URL" error={errors.live_url} help="Optional. You can paste domain.com; https:// is added.">
              <Input
                placeholder="example.com"
                value={form.live_url}
                onChange={(event) => setForm((current) => ({ ...current, live_url: event.target.value }))}
              />
            </Field>
            <Field label="GitHub URL" error={errors.github_url} help="Optional. You can paste github.com/user/repo.">
              <Input
                placeholder="github.com/user/repo"
                value={form.github_url}
                onChange={(event) =>
                  setForm((current) => ({ ...current, github_url: event.target.value }))
                }
              />
            </Field>
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            <Input
              type="number"
              placeholder="Sort order"
              value={form.sort_order}
              onChange={(event) =>
                setForm((current) => ({ ...current, sort_order: Number(event.target.value) }))
              }
            />
            <label className="flex items-center gap-2 rounded-md bg-white px-4 text-sm">
              <input
                type="checkbox"
                checked={form.is_featured}
                onChange={(event) =>
                  setForm((current) => ({ ...current, is_featured: event.target.checked }))
                }
              />
              Featured
            </label>
            <label className="flex items-center gap-2 rounded-md bg-white px-4 text-sm">
              <input
                type="checkbox"
                checked={form.is_published}
                onChange={(event) =>
                  setForm((current) => ({ ...current, is_published: event.target.checked }))
                }
              />
              Published
            </label>
          </div>
          <Button type="submit">
            <Plus size={16} />
            {editing ? 'Update project' : 'Create project'}
          </Button>
        </form>
      </Card>
      <div className="space-y-3">
        {isLoading && <AdminLoadingCard title="Loading projects..." />}
        {!isLoading && projects.length === 0 && <EmptyState title="No projects yet." />}
        {!isLoading && projects.map((project) => (
          <Card key={project.id} className="flex items-start justify-between gap-4 p-4">
            <div>
              <h3 className="font-semibold">{project.title}</h3>
              <p className="mt-1 text-sm text-ink/55">{project.summary}</p>
              <p className="mt-2 text-xs text-ink/40">
                {project.is_published ? 'Published' : 'Draft'} · {project.is_featured ? 'Featured' : 'Standard'}
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" onClick={() => setEditing(project)}>
                <Pencil size={16} />
              </Button>
              <Button variant="danger" onClick={() => deleteProject.mutate(project.id)}>
                <Trash2 size={16} />
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function validateProject(form: typeof emptyProject) {
  const errors: FieldErrors = {};
  if (!form.title.trim()) errors.title = 'Add a project title.';
  if (!form.description.trim()) errors.description = 'Add a project description.';
  if (form.slug.trim() && !slugify(form.slug)) errors.slug = 'Use letters, numbers, or dashes.';
  if (!isValidOptionalUrl(form.cover_image_url)) {
    errors.cover_image_url = 'Use an upload URL, http(s) link, or leave it empty.';
  }
  const badGalleryUrl = splitList(form.gallery_image_urls).find((url) => !isValidOptionalUrl(url));
  if (badGalleryUrl) {
    errors.gallery_image_urls = `This gallery link is not valid: ${badGalleryUrl}`;
  }
  if (!isValidOptionalUrl(form.live_url, false, false)) {
    errors.live_url = 'Use a valid website link or leave it empty.';
  }
  if (!isValidOptionalUrl(form.github_url, false, false)) {
    errors.github_url = 'Use a valid GitHub link or leave it empty.';
  }
  return errors;
}

function buildProjectPayload(form: typeof emptyProject) {
  const description = form.description.trim();
  const summary = form.summary.trim() || makeSummary(description);

  return {
    title: form.title.trim(),
    slug: slugify(form.slug || form.title),
    summary,
    description,
    cover_image_url: normalizeOptionalUrl(form.cover_image_url),
    gallery_image_urls: splitList(form.gallery_image_urls).map((url) => normalizeOptionalUrl(url) ?? url),
    tech_stack: splitList(form.tech_stack),
    live_url: normalizeOptionalUrl(form.live_url),
    github_url: normalizeOptionalUrl(form.github_url),
    is_featured: form.is_featured,
    sort_order: Number.isFinite(form.sort_order) ? form.sort_order : 0,
    is_published: form.is_published,
  };
}

function makeSummary(description: string) {
  const compact = description.replace(/\s+/g, ' ').trim();
  if (compact.length <= 220) return compact;
  return `${compact.slice(0, 217).trim()}...`;
}

function ContactsAdmin() {
  const { data: links = [], isLoading } = useAdminContactLinks();
  const createLink = useCreateContactLink();
  const updateLink = useUpdateContactLink();
  const deleteLink = useDeleteContactLink();
  const [form, setForm] = useState({ label: '', type: '', value: '', url: '', sort_order: 0 });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<string | null>(null);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setStatus(null);
    const nextErrors = validateContactLink(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    try {
      await createLink.mutateAsync({
        label: form.label.trim(),
        type: form.type.trim() || inferContactType(form.label, form.value),
        value: form.value.trim(),
        url: prepareContactUrl(form.value, form.url),
        sort_order: form.sort_order,
        is_visible: true,
      });
      setForm({ label: '', type: '', value: '', url: '', sort_order: 0 });
      setStatus('Contact link added.');
    } catch (err) {
      setStatus(err instanceof Error ? err.message : 'Could not add contact link.');
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[.8fr_1.2fr]">
      <Card className="p-6">
        <h2 className="font-display text-3xl italic">New contact link</h2>
        <p className="mt-2 text-sm leading-6 text-ink/60">
          Add simple contact rows like Email, LinkedIn, GitHub, Telegram, or Website. Type and URL can be inferred.
        </p>
        <form onSubmit={submit} className="mt-6 grid gap-3">
          <FormAlert message={status} tone={status?.includes('added') ? 'success' : 'error'} />
          <Field label="Label" error={errors.label} help="Example: Email, LinkedIn, GitHub, Website">
            <Input
              placeholder="LinkedIn"
              value={form.label}
              onChange={(event) => setForm((current) => ({ ...current, label: event.target.value }))}
            />
          </Field>
          <Field label="Displayed value" error={errors.value} help="What visitors will see. Example: linkedin.com/in/nurzhan">
            <Input
              placeholder="linkedin.com/in/nurzhan"
              value={form.value}
              onChange={(event) => setForm((current) => ({ ...current, value: event.target.value }))}
            />
          </Field>
          <Field label="Type" help={`Optional. Current guess: ${inferContactType(form.label, form.value)}.`}>
            <Input
              placeholder="Auto-detected"
              value={form.type}
              onChange={(event) => setForm((current) => ({ ...current, type: event.target.value }))}
            />
          </Field>
          <Field label="Clickable URL" error={errors.url} help="Optional. If value is an email or website, this can be left empty.">
            <Input
              placeholder="https://linkedin.com/in/nurzhan"
              value={form.url}
              onChange={(event) => setForm((current) => ({ ...current, url: event.target.value }))}
            />
          </Field>
          <Button type="submit">
            <LinkIcon size={16} />
            Add link
          </Button>
        </form>
      </Card>
      <div className="space-y-3">
        {isLoading && <AdminLoadingCard title="Loading contact links..." />}
        {!isLoading && links.map((link) => (
          <ContactLinkRow
            key={link.id}
            link={link}
            onToggle={() =>
              updateLink.mutate({
                id: link.id,
                payload: { is_visible: !link.is_visible },
              })
            }
            onDelete={() => deleteLink.mutate(link.id)}
          />
        ))}
      </div>
    </div>
  );
}

function validateContactLink(form: { label: string; value: string; url: string }) {
  const errors: FieldErrors = {};
  if (!form.label.trim()) errors.label = 'Add a label, for example Email or LinkedIn.';
  if (!form.value.trim()) errors.value = 'Add the contact value visitors should see.';
  if (form.url.trim() && !isValidOptionalUrl(form.url, false, true)) {
    errors.url = 'Use a valid website link, email link, or leave it empty.';
  }
  return errors;
}

function ContactLinkRow({
  link,
  onToggle,
  onDelete,
}: {
  link: ContactLink;
  onToggle: () => void;
  onDelete: () => void;
}) {
  return (
    <Card className="flex items-center justify-between gap-4 p-4">
      <div>
        <h3 className="font-semibold">{link.label}</h3>
        <p className="text-sm text-ink/55">{link.value}</p>
      </div>
      <div className="flex gap-2">
        <Button variant="ghost" onClick={onToggle}>
          <Eye size={16} />
          {link.is_visible ? 'Visible' : 'Hidden'}
        </Button>
        <Button variant="danger" onClick={onDelete}>
          <Trash2 size={16} />
        </Button>
      </div>
    </Card>
  );
}

function MessagesAdmin() {
  const { data: messages = [], isLoading } = useMessages();
  const markMessage = useMarkMessage();

  return (
    <div className="space-y-3">
      {isLoading && <AdminLoadingCard title="Loading messages..." />}
      {!isLoading && messages.length === 0 && <EmptyState title="No messages yet." />}
      {!isLoading && messages.map((message) => (
        <Card key={message.id} className="p-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h3 className="font-semibold">{message.name}</h3>
              <p className="text-sm text-ink/55">{message.email}</p>
            </div>
            <Button
              variant={message.is_read ? 'ghost' : 'secondary'}
              onClick={() => markMessage.mutate({ id: message.id, is_read: !message.is_read })}
            >
              <Inbox size={16} />
              {message.is_read ? 'Read' : 'Unread'}
            </Button>
          </div>
          <p className="mt-4 whitespace-pre-line leading-7 text-ink/70">{message.message}</p>
        </Card>
      ))}
    </div>
  );
}

function UploadsAdmin() {
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function upload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setError(null);
    try {
      const response = await api.upload(file);
      setResult(response.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    }
  }

  return (
    <Card className="p-6">
      <h2 className="font-display text-3xl italic">Uploads</h2>
      <p className="mt-2 text-sm text-ink/60">
        Upload an image or PDF, then paste the returned URL into a project, profile, or resume field.
      </p>
      <label className="mt-6 flex min-h-52 cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-ink/25 bg-white text-center">
        <FileImage className="mb-3 text-clay" size={34} />
        <span className="font-semibold">Choose file</span>
        <span className="mt-1 text-sm text-ink/50">JPEG, PNG, WEBP, GIF, or PDF</span>
        <input className="sr-only" type="file" onChange={upload} />
      </label>
      {result && (
        <div className="mt-5 rounded-md bg-ink/5 p-4">
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold">
            <Upload size={16} />
            Uploaded
          </div>
          <code className="break-all text-sm">{result}</code>
          {mediaUrl(result) && (
            <a className="mt-3 block text-sm text-clay" href={mediaUrl(result) ?? '#'} target="_blank">
              Preview file
            </a>
          )}
        </div>
      )}
      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
    </Card>
  );
}

function splitList(value: string) {
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}
