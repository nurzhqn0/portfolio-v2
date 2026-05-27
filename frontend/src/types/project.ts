export type Project = {
  id: number;
  title: string;
  slug: string;
  summary: string;
  description: string;
  cover_image_url: string | null;
  gallery_image_urls: string[];
  tech_stack: string[];
  live_url: string | null;
  github_url: string | null;
  is_featured: boolean;
  sort_order: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
};
