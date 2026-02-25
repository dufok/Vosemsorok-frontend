import { PhotoGallery } from './PhotoGallery';
import type { Project } from '../types';

// How far the year label sits from the timeline spine
const YEAR_INDENT = 120; // px — matches CSS --year-indent

const MONTHS = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function ProjectCard({ project }: { project: Project }) {
  const { slug, month, year, role, overview, project_images } = project;

  return (
    <article className="project-card">
      {/* Horizontal branch line + year + role */}
      <div className="project-header">
        <span className="project-year">{year}</span>
        {role && <span className="project-role">{role}</span>}
      </div>

      {/* Gallery — left clip at YEAR_INDENT, bleeds right */}
      {project_images.length > 0 && (
        <div className="project-gallery-wrap">
          <PhotoGallery
            slug={slug}
            images={project_images}
            leftOffset={YEAR_INDENT}
          />
        </div>
      )}

      {/* Overview — width matches one photo */}
      {overview && (
        <div className="project-overview-wrap">
          <p className="project-overview">{overview}</p>
        </div>
      )}
    </article>
  );
}
