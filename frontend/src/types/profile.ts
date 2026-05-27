export type Profile = {
  id: number;
  name: string;
  headline: string;
  bio: string;
  landing_photo_url: string | null;
  resume_url: string | null;
  location: string | null;
  is_available: boolean;
  updated_at: string;
};
