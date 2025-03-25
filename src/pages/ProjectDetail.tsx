
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Github, ExternalLink, Edit } from "lucide-react";
import { getProjectById } from "@/utils/projectService";
import { Project } from "@/types";
import { Button } from "@/components/ui/button";
import { useUser } from "@/contexts/UserContext";

const ProjectDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const { isLoggedIn } = useUser();

  useEffect(() => {
    if (id) {
      // Load project
      const projectData = getProjectById(id);
      if (projectData) {
        setProject(projectData);
      }
      setLoading(false);
    }
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto py-12 px-4">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading project...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="container mx-auto py-12 px-4">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-2">Project Not Found</h2>
          <p className="text-muted-foreground mb-6">
            The project you're looking for doesn't exist or has been removed.
          </p>
          <Button asChild>
            <Link to="/projects">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Projects
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="mb-8 flex justify-between items-center">
        <Link 
          to="/projects" 
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Projects
        </Link>
        
        {isLoggedIn && (
          <Button asChild variant="outline" size="sm">
            <Link to="/admin/projects">
              <Edit className="h-4 w-4 mr-1" />
              Edit Project
            </Link>
          </Button>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div>
          <img 
            src={project.imageUrl} 
            alt={project.title} 
            className="w-full h-auto rounded-lg shadow-md object-cover aspect-video"
          />
        </div>
        <div>
          <h1 className="text-3xl font-bold mb-2">{project.title}</h1>
          <div className="flex flex-wrap gap-2 mb-4">
            {project.tags.map((tag) => (
              <span 
                key={tag} 
                className="px-2 py-1 bg-secondary text-secondary-foreground rounded-md text-xs"
              >
                {tag}
              </span>
            ))}
          </div>
          <p className="text-muted-foreground mb-6">
            {project.description}
          </p>
          <div className="flex flex-wrap gap-3">
            {project.githubUrl && (
              <Button asChild variant="outline">
                <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                  <Github className="h-4 w-4 mr-2" />
                  View Code
                </a>
              </Button>
            )}
            {project.liveUrl && (
              <Button asChild>
                <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Live Demo
                </a>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
