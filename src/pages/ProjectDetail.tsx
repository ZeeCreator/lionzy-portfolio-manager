
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Github, ExternalLink, Edit, Download, DollarSign, Calendar, Tag } from "lucide-react";
import { getProjectById } from "@/utils/projectService";
import { Project } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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

  const handleDownload = () => {
    if (!project) return;

    if (project.downloadType === 'paid') {
      // Redirect to payment gateway
      window.open('/payment/' + project.id, '_blank');
    } else if (project.downloadUrl) {
      // Direct download
      window.open(project.downloadUrl, '_blank');
    }
  };

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
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Project Image */}
          <div className="aspect-video overflow-hidden rounded-lg">
            <img 
              src={project.imageUrl} 
              alt={project.title} 
              className="w-full h-full object-cover"
            />
          </div>

          {/* Project Description */}
          <Card>
            <CardHeader>
              <CardTitle>About This Project</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                {project.description}
              </p>
            </CardContent>
          </Card>

          {/* Technologies Used */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Tag className="h-4 w-4" />
                Technologies Used
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span 
                    key={tag} 
                    className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Project Info */}
          <Card>
            <CardHeader>
              <CardTitle>{project.title}</CardTitle>
              {project.featured && (
                <div className="mb-2">
                  <span className="chip bg-primary/10 text-primary">Featured Project</span>
                </div>
              )}
              <CardDescription className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-3 w-3" />
                Created {new Date(project.createdAt).toLocaleDateString()}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Action Buttons */}
              <div className="space-y-3">
                {project.liveUrl && (
                  <Button asChild className="w-full">
                    <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View Live Demo
                    </a>
                  </Button>
                )}

                {project.sourceVisible && project.githubUrl && (
                  <Button asChild variant="outline" className="w-full">
                    <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                      <Github className="h-4 w-4 mr-2" />
                      View Source Code
                    </a>
                  </Button>
                )}

                {/* Download Section */}
                {(project.downloadUrl || project.downloadType === 'paid') && (
                  <div className="border-t pt-4">
                    <h4 className="font-medium mb-3">Download Project</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-sm">
                        <span>Price:</span>
                        <span className="font-medium">
                          {project.downloadType === 'paid' ? `$${project.price}` : 'Free'}
                        </span>
                      </div>
                      <Button onClick={handleDownload} className="w-full">
                        {project.downloadType === 'paid' ? (
                          <>
                            <DollarSign className="h-4 w-4 mr-2" />
                            Buy & Download
                          </>
                        ) : (
                          <>
                            <Download className="h-4 w-4 mr-2" />
                            Free Download
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Project Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Project Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span>Status:</span>
                <span className="font-medium text-green-600">Completed</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span>Type:</span>
                <span className="font-medium">
                  {project.downloadType === 'paid' ? 'Premium' : 'Open Source'}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span>Last Updated:</span>
                <span className="font-medium">
                  {new Date(project.updatedAt).toLocaleDateString()}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
