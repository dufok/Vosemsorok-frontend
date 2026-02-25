import { PhotoGallery } from './PhotoGallery';
import type { Project } from '../types';

const YEAR_INDENT = 120;

export function ProjectCard({ project }: { project: Project }) {
  const { slug, year, role, overview, project_images } = project;

  return (
    <article className="project-card">
      <div className="project-header">
        <span className="project-year">{year}</span>
        {role && <span className="project-role">{role}</span>}
      </div>

      {project_images.length > 0 && (
        <div className="project-gallery-wrap">
          <PhotoGallery
            slug={slug}
            images={project_images}
            leftOffset={YEAR_INDENT}
          />
        </div>
      )}

      {overview && (
        <div className="project-overview-wrap">
          <p className="project-overview">{overview}</p>
        </div>
      )}
    </article>
  );
}
