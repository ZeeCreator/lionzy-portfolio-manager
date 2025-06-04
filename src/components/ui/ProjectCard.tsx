
import { Link } from "react-router-dom";
import { Project } from "@/types";
import { Github, ExternalLink, Download, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const handleDownload = () => {
    if (project.downloadType === 'paid') {
      // Redirect to payment gateway
      window.open('/payment/' + project.id, '_blank');
    } else if (project.downloadUrl) {
      // Direct download
      window.open(project.downloadUrl, '_blank');
    }
  };

  return (
    <div className="glass-card rounded-lg overflow-hidden group animate-fade-in h-full flex flex-col transition-all duration-300 hover:translate-y-[-5px] hover:shadow-md">
      <Link to={`/projects/${project.id}`} className="block overflow-hidden">
        <div className="aspect-video overflow-hidden bg-muted">
          <img 
            src={project.imageUrl} 
            alt={project.title} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      </Link>
      
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex-grow">
          {project.featured && (
            <div className="mb-3">
              <span className="chip bg-primary/10 text-primary">Featured</span>
            </div>
          )}
          
          <Link to={`/projects/${project.id}`}>
            <h3 className="text-xl font-medium mb-2 hover:text-primary transition-colors">
              {project.title}
            </h3>
          </Link>
          
          <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
            {project.description}
          </p>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {project.tags.map((tag) => (
              <span 
                key={tag} 
                className="text-xs px-2 py-1 bg-secondary text-secondary-foreground rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Download Section */}
          {(project.downloadUrl || project.downloadType === 'paid') && (
            <div className="mb-4 p-3 bg-secondary/50 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">
                  {project.downloadType === 'paid' ? `$${project.price}` : 'Free Download'}
                </span>
                <Button size="sm" onClick={handleDownload}>
                  {project.downloadType === 'paid' ? (
                    <>
                      <DollarSign className="h-3 w-3 mr-1" />
                      Buy
                    </>
                  ) : (
                    <>
                      <Download className="h-3 w-3 mr-1" />
                      Download
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>
        
        <div className="flex justify-between items-center pt-4 border-t border-border mt-auto">
          <Link 
            to={`/projects/${project.id}`} 
            className="text-sm font-medium text-primary hover:underline"
          >
            View details
          </Link>
          
          <div className="flex space-x-3">
            {project.sourceVisible && project.githubUrl && (
              <a 
                href={project.githubUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="View GitHub repository"
              >
                <Github size={18} />
              </a>
            )}
            
            {project.liveUrl && (
              <a 
                href={project.liveUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="View live site"
              >
                <ExternalLink size={18} />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProjectCard;
