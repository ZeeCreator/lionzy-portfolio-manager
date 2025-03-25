
import { useState, useEffect } from "react";
import { getProjects } from "@/utils/projectService";
import { Project } from "@/types";
import ProjectCard from "@/components/ui/ProjectCard";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { PlusCircle } from "lucide-react";
import { useUser } from "@/contexts/UserContext";

const Projects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const { isLoggedIn } = useUser();

  useEffect(() => {
    // Load projects
    const loadProjects = async () => {
      try {
        const projectsData = getProjects();
        setProjects(projectsData);
      } catch (error) {
        console.error("Failed to load projects:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto py-12 px-4">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading projects...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">My Projects</h1>
          <p className="text-muted-foreground mt-2">
            A collection of my recent work and personal projects
          </p>
        </div>
        
        {isLoggedIn && (
          <Button asChild>
            <Link to="/admin/projects">
              <PlusCircle className="h-4 w-4 mr-2" />
              Manage Projects
            </Link>
          </Button>
        )}
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No projects found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Projects;
