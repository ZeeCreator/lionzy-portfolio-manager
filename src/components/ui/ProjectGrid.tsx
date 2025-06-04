
import { Project } from "@/types";
import { ProjectCard } from "@/components/ui/ProjectCard";

interface ProjectGridProps {
  projects: Project[];
  showAll?: boolean;
  maxItems?: number;
}

export function ProjectGrid({ projects, showAll = false, maxItems = 6 }: ProjectGridProps) {
  const displayProjects = showAll ? projects : projects.slice(0, maxItems);

  if (projects.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No projects found.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {displayProjects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
}

export default ProjectGrid;
