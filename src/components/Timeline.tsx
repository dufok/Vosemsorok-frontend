import { ProjectCard } from './ProjectCard';
import type { Project } from '../types';

export function Timeline({ projects }: { projects: Project[] }) {
  // Already sorted newest-first by API (project_date DESC)
  return (
    <div className="timeline">
      <div className="timeline-spine" />
      <div className="timeline-projects">
        {projects.map((p) => (
          <ProjectCard key={p.id} project={p} />
        ))}
      </div>
      {/* Infinite line continues below last project */}
      <div className="timeline-tail" />
    </div>
  );
}
