
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Github, Twitter, Linkedin, Instagram, Edit } from "lucide-react";
import { getSettings } from "@/utils/settingsService";
import { SiteSettings } from "@/types";

const About = () => {
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    setSettings(getSettings());
  }, []);

  if (!settings) return null;

  const socialLinks = [
    { name: "GitHub", icon: Github, url: settings.social.github },
    { name: "Twitter", icon: Twitter, url: settings.social.twitter },
    { name: "LinkedIn", icon: Linkedin, url: settings.social.linkedin },
    { name: "Instagram", icon: Instagram, url: settings.social.instagram },
  ].filter((link) => link.url);

  return (
    <div className="min-h-screen">
      <section className="py-20 px-6 md:px-12 bg-secondary/50">
        <div className="container">
          <div className="flex justify-between items-end">
            <div>
              <span className="chip mb-3">About</span>
              <h1 className="text-4xl font-bold">About Me</h1>
            </div>
            <Link to="/settings" className="btn-outline">
              <Edit size={16} className="mr-2" />
              Edit
            </Link>
          </div>
        </div>
      </section>
      
      <section className="py-16 px-6 md:px-12">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2">
              <div className="glass-card rounded-xl p-8 mb-8">
                <h2 className="text-2xl font-medium mb-6">Hello, I'm {settings.ownerName}</h2>
                <div className="prose prose-gray max-w-none">
                  <p className="text-muted-foreground whitespace-pre-line">{settings.aboutText}</p>
                </div>
              </div>
              
              <div className="glass-card rounded-xl p-8">
                <h2 className="text-2xl font-medium mb-6">My Skills</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {['JavaScript', 'React', 'TypeScript', 'Tailwind CSS', 'Node.js', 'UI/UX Design'].map((skill) => (
                    <div key={skill} className="glass-card rounded-lg p-4 text-center">
                      <span className="font-medium">{skill}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-1">
              <div className="glass-card rounded-xl p-8 sticky top-24">
                <div className="bg-muted aspect-square rounded-lg flex items-center justify-center mb-6">
                  <span className="text-muted-foreground">Profile Image</span>
                </div>
                
                <h3 className="text-xl font-medium mb-4">{settings.ownerName}</h3>
                <p className="text-muted-foreground mb-6">Portfolio Owner</p>
                
                {socialLinks.length > 0 && (
                  <div className="mb-6">
                    <h4 className="text-sm font-medium mb-3">Connect with me</h4>
                    <div className="flex space-x-4">
                      {socialLinks.map((link) => (
                        <a 
                          key={link.name}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={link.name}
                          className="text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <link.icon size={20} />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="flex flex-col gap-3">
                  <Link to="/contact" className="btn-primary w-full">
                    Contact Me
                  </Link>
                  
                  <a 
                    href={settings.saweria.url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="btn-outline w-full"
                  >
                    Support via Saweria
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
