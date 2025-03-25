
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Search } from "lucide-react";
import { getProjects } from "@/utils/projectService";
import { Project } from "@/types";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { Input } from "@/components/ui/input";

const Projects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTag, setActiveTag] = useState<string | null>(null);

  useEffect(() => {
    const allProjects = getProjects();
    setProjects(allProjects);
    setFilteredProjects(allProjects);
  }, []);

  useEffect(() => {
    let result = projects;
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        project => 
          project.title.toLowerCase().includes(query) || 
          project.description.toLowerCase().includes(query) ||
          project.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }
    
    // Filter by tag
    if (activeTag) {
      result = result.filter(project => 
        project.tags.some(tag => tag.toLowerCase() === activeTag.toLowerCase())
      );
    }
    
    setFilteredProjects(result);
  }, [searchQuery, activeTag, projects]);

  // Get all unique tags from projects
  const allTags = Array.from(
    new Set(projects.flatMap(project => project.tags.map(tag => tag.toLowerCase())))
  ).sort();

  return (
    <div className="min-h-screen">
      <section className="py-20 px-6 md:px-12 bg-secondary/50">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
            <div>
              <span className="chip mb-3">Portfolio</span>
              <h1 className="text-4xl font-bold">Projects</h1>
            </div>
            <Link to="/settings" className="btn-primary">
              <Plus size={18} className="mr-2" />
              Add Project
            </Link>
          </div>
          
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="relative w-full md:w-96">
              <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex flex-wrap gap-2 w-full md:w-auto">
              <button 
                className={`text-xs px-3 py-1.5 rounded-full transition-colors ${
                  activeTag === null
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                }`}
                onClick={() => setActiveTag(null)}
              >
                All
              </button>
              
              {allTags.map((tag) => (
                <button
                  key={tag}
                  className={`text-xs px-3 py-1.5 rounded-full transition-colors ${
                    activeTag === tag
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  }`}
                  onClick={() => setActiveTag(activeTag === tag ? null : tag)}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>
      
      <section className="py-16 px-6 md:px-12">
        <div className="container">
          {filteredProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-muted-foreground mb-4">
                {projects.length === 0
                  ? "No projects available. Add your first project!"
                  : "No projects match your search criteria."
                }
              </p>
              {projects.length === 0 && (
                <Link to="/settings" className="btn-primary">
                  Add Project
                </Link>
              )}
              {projects.length > 0 && (
                <button 
                  className="btn-secondary"
                  onClick={() => {
                    setSearchQuery("");
                    setActiveTag(null);
                  }}
                >
                  Clear Filters
                </button>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Projects;
