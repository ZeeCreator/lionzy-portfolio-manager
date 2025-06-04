
import { useState, useEffect } from "react";
import { getProjects } from "@/utils/projectService";
import { Project } from "@/types";
import { ProjectGrid } from "@/components/ui/ProjectGrid";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { PlusCircle, Search } from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import { Input } from "@/components/ui/input";

const Projects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const { isLoggedIn } = useUser();

  useEffect(() => {
    // Load projects
    const loadProjects = async () => {
      try {
        const projectsData = getProjects();
        setProjects(projectsData);
        setFilteredProjects(projectsData);
      } catch (error) {
        console.error("Failed to load projects:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, []);

  // Get all unique tags
  const allTags = Array.from(new Set(projects.flatMap(project => project.tags)));

  // Filter projects based on search and tags
  useEffect(() => {
    let filtered = projects;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(project =>
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Filter by selected tags
    if (selectedTags.length > 0) {
      filtered = filtered.filter(project =>
        selectedTags.some(tag => project.tags.includes(tag))
      );
    }

    setFilteredProjects(filtered);
  }, [searchTerm, selectedTags, projects]);

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

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
            A collection of my recent work and personal projects ({filteredProjects.length} projects)
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

      {/* Search and Filter Section */}
      <div className="mb-8 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Tags Filter */}
        {allTags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <span className="text-sm font-medium text-muted-foreground">Filter by tags:</span>
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`px-3 py-1 rounded-full text-xs transition-colors ${
                  selectedTags.includes(tag)
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                }`}
              >
                {tag}
              </button>
            ))}
            {selectedTags.length > 0 && (
              <button
                onClick={() => setSelectedTags([])}
                className="px-3 py-1 rounded-full text-xs bg-destructive/10 text-destructive hover:bg-destructive/20"
              >
                Clear filters
              </button>
            )}
          </div>
        )}
      </div>

      <ProjectGrid projects={filteredProjects} showAll={true} />
    </div>
  );
};

export default Projects;
