
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getSettings } from "@/utils/settingsService";
import { SiteSettings } from "@/types";
import { getSkills } from "@/utils/skillsService";
import { Skill } from "@/types";
import { Button } from "@/components/ui/button";
import { Github, Linkedin, Twitter, Instagram, Edit } from "lucide-react";
import { useUser } from "@/contexts/UserContext";

const About = () => {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [skills, setSkills] = useState<Skill[]>([]);
  const { isLoggedIn } = useUser();

  useEffect(() => {
    const loadData = async () => {
      const settingsData = await getSettings();
      setSettings(settingsData);
      setSkills(getSkills());
    };
    loadData();
  }, []);

  if (!settings) {
    return (
      <div className="container mx-auto py-12 px-4">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading about page...</p>
        </div>
      </div>
    );
  }

  // Group skills by category
  const skillsByCategory = skills.reduce<Record<string, Skill[]>>((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {});

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">About Me</h1>
        {isLoggedIn && (
          <Button asChild variant="outline" size="sm">
            <Link to="/settings">
              <Edit className="h-4 w-4 mr-1" />
              Edit
            </Link>
          </Button>
        )}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2">
          <p className="text-lg mb-6 leading-relaxed whitespace-pre-line">
            {settings.aboutText}
          </p>
          
          <div className="flex space-x-4 mt-8">
            {settings.social.github && (
              <a 
                href={settings.social.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Github />
              </a>
            )}
            {settings.social.twitter && (
              <a 
                href={settings.social.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Twitter />
              </a>
            )}
            {settings.social.linkedin && (
              <a 
                href={settings.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Linkedin />
              </a>
            )}
            {settings.social.instagram && (
              <a 
                href={settings.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Instagram />
              </a>
            )}
          </div>
        </div>
        
        <div>
          <h2 className="text-xl font-semibold mb-4">My Skills</h2>
          
          {Object.entries(skillsByCategory).map(([category, categorySkills]) => (
            <div key={category} className="mb-8">
              <h3 className="text-base font-medium mb-3 text-muted-foreground">
                {category}
              </h3>
              <div className="space-y-4">
                {categorySkills.map((skill) => (
                  <div key={skill.id}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">{skill.name}</span>
                      <span className="text-sm text-muted-foreground">
                        {skill.level}/10
                      </span>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary rounded-full"
                        style={{ width: `${skill.level * 10}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
          
          {isLoggedIn && (
            <Button asChild className="w-full mt-4" variant="outline">
              <Link to="/admin/skills">
                Manage Skills
              </Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default About;
