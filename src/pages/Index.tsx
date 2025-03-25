
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { getProjects } from "@/utils/projectService";
import { getSettings } from "@/utils/settingsService";
import { Project, SiteSettings } from "@/types";
import { ProjectCard } from "@/components/ui/ProjectCard";

const Index = () => {
  const [featuredProjects, setFeaturedProjects] = useState<Project[]>([]);
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    const projects = getProjects();
    setFeaturedProjects(projects.filter(p => p.featured).slice(0, 3));
    setSettings(getSettings());
  }, []);

  if (!settings) return null;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section 
        className="relative h-screen flex items-center justify-center overflow-hidden" 
        style={{
          backgroundImage: `url(/src/assets/mountains/${settings.backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]"></div>
        <div className="container relative z-10 px-6 md:px-12 text-center">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 animate-fade-in text-balance">
            {settings.siteName}
          </h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto mb-8 animate-slide-in-bottom text-balance">
            Creating beautiful digital experiences with attention to detail and pixel-perfect design.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-in-bottom" style={{ animationDelay: "200ms" }}>
            <Link to="/projects" className="btn-primary px-8 py-3">
              View Projects
            </Link>
            <Link to="/contact" className="btn-outline border-white/30 text-white hover:bg-white/10 px-8 py-3">
              Get in Touch
            </Link>
          </div>
        </div>
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
          <a href="#featured" className="text-white/80 hover:text-white transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 5v14M5 12l7 7 7-7"/>
            </svg>
          </a>
        </div>
      </section>

      {/* Featured Projects Section */}
      <section id="featured" className="section bg-background">
        <div className="container">
          <div className="flex justify-between items-end mb-10">
            <div>
              <span className="chip mb-3">Portfolio</span>
              <h2 className="text-3xl font-bold">Featured Projects</h2>
            </div>
            <Link to="/projects" className="flex items-center text-sm font-medium text-primary hover:underline">
              View all projects <ArrowRight size={16} className="ml-1" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
          
          {featuredProjects.length === 0 && (
            <div className="text-center py-20">
              <p className="text-muted-foreground mb-4">No featured projects yet.</p>
              <Link to="/settings" className="btn-primary">
                Add Projects
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* About Section Preview */}
      <section className="section bg-secondary/50">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="chip mb-3">About Me</span>
              <h2 className="text-3xl font-bold mb-6">Hi, I'm {settings.ownerName}</h2>
              <p className="text-muted-foreground mb-6 text-balance">
                {settings.aboutText.substring(0, 300)}
                {settings.aboutText.length > 300 ? "..." : ""}
              </p>
              <Link to="/about" className="btn-primary">
                Learn More
              </Link>
            </div>
            <div className="bg-muted aspect-square rounded-lg flex items-center justify-center">
              <span className="text-muted-foreground">Profile Image</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section bg-background">
        <div className="container">
          <div className="glass-card rounded-xl p-10 md:p-16 text-center max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-6">Let's Work Together</h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Have a project in mind? I'm currently available for freelance work. 
              Let's create something amazing together.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/contact" className="btn-primary px-8 py-3">
                Get in Touch
              </Link>
              <a 
                href={settings.saweria.url} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="btn-outline px-8 py-3"
              >
                Support via Saweria
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
