import type { Project } from '../types';

const API = import.meta.env.VITE_API_URL;

export async function fetchProjects(category?: string): Promise<Project[]> {
  const url = category
    ? `${API}/api/projects?category=${encodeURIComponent(category)}`
    : `${API}/api/projects`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`API ${res.status}`);
  return res.json();
}

export async function fetchProject(slug: string): Promise<Project> {
  const res = await fetch(`${API}/api/projects/${slug}`);
  if (!res.ok) throw new Error(`API ${res.status}`);
  return res.json();
}

export function imageUrl(slug: string, filename: string): string {
  return `${API}/images/${slug}/${filename}`;
}
