export type ContactLink = {
  id: number;
  label: string;
  type: string;
  value: string;
  url: string | null;
  sort_order: number;
  is_visible: boolean;
};
