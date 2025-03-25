
import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Github, ExternalLink, Calendar, Clock } from "lucide-react";
import { getProjectById } from "@/utils/projectService";
import { Project } from "@/types";
import { toast } from "@/components/ui/sonner";

const ProjectDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      const projectData = getProjectById(id);
      if (projectData) {
        setProject(projectData);
      } else {
        toast.error("Project not found");
        navigate("/projects");
      }
    }
    setLoading(false);
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="container py-20 px-6 animate-pulse">
        <div className="h-8 w-32 bg-secondary rounded mb-4"></div>
        <div className="h-12 w-96 bg-secondary rounded mb-8"></div>
        <div className="aspect-video w-full bg-secondary rounded-lg mb-8"></div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="container py-20 px-6 text-center">
        <h1 className="text-2xl font-bold mb-4">Project not found</h1>
        <Link to="/projects" className="btn-primary">
          Back to Projects
        </Link>
      </div>
    );
  }

  // Format dates
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  return (
    <div className="min-h-screen pb-20">
      <div className="h-[50vh] relative overflow-hidden">
        <div className="absolute inset-0 bg-black/40 z-10"></div>
        <img 
          src={project.imageUrl} 
          alt={project.title} 
          className="w-full h-full object-cover"
        />
        <div className="absolute top-0 left-0 right-0 z-20">
          <div className="container py-8 px-6 md:px-12">
            <Link to="/projects" className="inline-flex items-center text-white hover:text-white/80 transition-colors">
              <ArrowLeft size={18} className="mr-2" />
              Back to Projects
            </Link>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 z-20">
          <div className="container py-8 px-6 md:px-12">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">{project.title}</h1>
            {project.featured && (
              <span className="chip bg-primary/90 text-white">Featured</span>
            )}
          </div>
        </div>
      </div>
      
      <div className="container px-6 md:px-12 -mt-6 relative z-20">
        <div className="glass-card rounded-xl p-8 shadow-lg">
          <div className="flex flex-wrap gap-4 mb-6">
            {project.tags.map((tag) => (
              <span 
                key={tag} 
                className="text-sm px-3 py-1 bg-secondary text-secondary-foreground rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <h2 className="text-xl font-medium mb-4">About the Project</h2>
              <p className="text-muted-foreground whitespace-pre-line">
                {project.description}
              </p>
            </div>
            
            <div className="lg:col-span-1">
              <div className="glass-card rounded-lg p-6">
                <h3 className="font-medium mb-4">Project Information</h3>
                
                <div className="space-y-4">
                  <div className="flex items-start">
                    <Calendar size={18} className="mt-0.5 mr-3 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Created on</p>
                      <p className="font-medium">{formatDate(project.createdAt)}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Clock size={18} className="mt-0.5 mr-3 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Last updated</p>
                      <p className="font-medium">{formatDate(project.updatedAt)}</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col gap-3 mt-8">
                  {project.githubUrl && (
                    <a 
                      href={project.githubUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="btn-outline flex items-center justify-center"
                    >
                      <Github size={18} className="mr-2" />
                      View Repository
                    </a>
                  )}
                  
                  {project.liveUrl && (
                    <a 
                      href={project.liveUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="btn-primary flex items-center justify-center"
                    >
                      <ExternalLink size={18} className="mr-2" />
                      Visit Live Site
                    </a>
                  )}
                  
                  <Link 
                    to="/settings" 
                    className="btn-secondary flex items-center justify-center mt-4"
                  >
                    Edit Project
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
