
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { getProjects } from "@/utils/projectService";
import { getSettings } from "@/utils/settingsService";
import { Project, SiteSettings } from "@/types";
import { ProjectGrid } from "@/components/ui/ProjectGrid";
import { TypingAnimation } from "@/components/ui/TypingAnimation";
import { EducationRoadmap } from "@/components/EducationRoadmap";
import { t } from "@/utils/translations";

const Index = () => {
  const [featuredProjects, setFeaturedProjects] = useState<Project[]>([]);
  const [allProjects, setAllProjects] = useState<Project[]>([]);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        console.log('Loading homepage data...');
        const [projects, siteSettings] = await Promise.all([
          getProjects(),
          getSettings()
        ]);
        
        setAllProjects(projects);
        setFeaturedProjects(projects.filter(p => p.featured).slice(0, 3));
        setSettings(siteSettings);
        console.log('Homepage data loaded successfully');
      } catch (error) {
        console.error('Error loading homepage data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Memuat data...</p>
        </div>
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Gagal memuat pengaturan situs</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section 
        className="relative h-screen flex items-center justify-center overflow-hidden" 
        style={{
          backgroundImage: `url(${settings.backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]"></div>
        <div className="container relative z-10 px-6 md:px-12 text-center">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 animate-fade-in text-balance">
            {settings.siteName}
          </h1>
          <div className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto mb-4 animate-slide-in-bottom">
            <span>{t("heroSubtitle")} </span>
            <TypingAnimation 
              text={settings.displayName || settings.ownerName} 
              speed={150}
              className="text-primary font-semibold"
            />
          </div>
          <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-8 animate-slide-in-bottom text-balance" style={{ animationDelay: "500ms" }}>
            {t("heroDescription")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-in-bottom" style={{ animationDelay: "700ms" }}>
            <Link to="/projects" className="btn-primary px-8 py-3">
              {t("projects")}
            </Link>
            <Link to="/contact" className="btn-outline border-white/30 text-white hover:bg-white/10 px-8 py-3">
              {t("getInTouch")}
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
              <h2 className="text-3xl font-bold">{t("featuredProjects")}</h2>
            </div>
            <Link to="/projects" className="flex items-center text-sm font-medium text-primary hover:underline">
              {t("viewAllProjects")} <ArrowRight size={16} className="ml-1" />
            </Link>
          </div>
          
          <ProjectGrid projects={featuredProjects} maxItems={3} />
          
          {featuredProjects.length === 0 && (
            <div className="text-center py-20">
              <p className="text-muted-foreground mb-4">{t("noProjectsFound")}</p>
              <Link to="/admin/projects/add" className="btn-primary">
                {t("addFirstProject")}
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* All Projects Preview Section */}
      {allProjects.length > 3 && (
        <section className="section bg-secondary/30">
          <div className="container">
            <div className="flex justify-between items-end mb-10">
              <div>
                <span className="chip mb-3">Karya Terbaru</span>
                <h2 className="text-3xl font-bold">{t("latestProjects")}</h2>
                <p className="text-muted-foreground mt-2">Showcase karya pengembangan terbaru saya</p>
              </div>
              <Link to="/projects" className="flex items-center text-sm font-medium text-primary hover:underline">
                {t("viewAllProjects")} <ArrowRight size={16} className="ml-1" />
              </Link>
            </div>
            
            <ProjectGrid projects={allProjects} maxItems={6} />
          </div>
        </section>
      )}

      {/* Education Roadmap Section */}
      {settings.showEducationRoadmap && settings.educationItems && settings.educationItems.length > 0 && (
        <section className="section bg-secondary/30">
          <div className="container">
            <div className="mb-10">
              <span className="chip mb-3">{t("learningJourney")}</span>
              <h2 className="text-3xl font-bold">{t("educationRoadmap")}</h2>
              <p className="text-muted-foreground mt-2">Progress belajar dan pencapaian saya</p>
            </div>
            
            <EducationRoadmap items={settings.educationItems} showProgress={true} />
          </div>
        </section>
      )}

      {/* About Section Preview */}
      <section className="section bg-secondary/50">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="chip mb-3">{t("aboutMe")}</span>
              <h2 className="text-3xl font-bold mb-6">Halo, saya {settings.displayName || settings.ownerName}</h2>
              <p className="text-muted-foreground mb-6 text-balance">
                {settings.aboutText.substring(0, 300)}
                {settings.aboutText.length > 300 ? "..." : ""}
              </p>
              <Link to="/about" className="btn-primary">
                Selengkapnya
              </Link>
            </div>
            <div className="bg-muted aspect-square rounded-lg flex items-center justify-center">
              <span className="text-muted-foreground">Foto Profil</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section bg-background">
        <div className="container">
          <div className="glass-card rounded-xl p-10 md:p-16 text-center max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-6">{t("letsWorkTogether")}</h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Punya proyek dalam pikiran? Saya saat ini tersedia untuk pekerjaan freelance. 
              Mari ciptakan sesuatu yang luar biasa bersama-sama.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/contact" className="btn-primary px-8 py-3">
                {t("getInTouch")}
              </Link>
              <a 
                href={settings.saweria.url} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="btn-outline px-8 py-3"
              >
                {t("supportViaSaweria")}
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
