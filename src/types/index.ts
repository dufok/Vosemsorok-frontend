export interface ProjectImage {
  id: number;
  project_id: number | null;
  filename: string;
  display_order: number | null;
  is_cover: boolean | null;
  alt_text: string | null;
}

export interface Project {
  id: number;
  slug: string;
  name: string;
  month: number;
  year: number;
  project_date: string;
  year_label: string | null;
  role: string | null;
  overview: string | null;
  short_desc: string | null;
  category: string | null;
  tags: string[];
  viewer_url: string | null;
  folder_mtime: string | null;
  last_synced_at: string | null;
  created_at: string | null;
  project_images: ProjectImage[];
}
