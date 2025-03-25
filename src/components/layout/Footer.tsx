
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Github, Twitter, Linkedin, Instagram } from "lucide-react";
import { getSettings } from "@/utils/settingsService";
import { SiteSettings } from "@/types";

export default function Footer() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    setSettings(getSettings());
  }, []);

  if (!settings) return null;

  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { name: "GitHub", icon: Github, url: settings.social.github },
    { name: "Twitter", icon: Twitter, url: settings.social.twitter },
    { name: "LinkedIn", icon: Linkedin, url: settings.social.linkedin },
    { name: "Instagram", icon: Instagram, url: settings.social.instagram },
  ].filter((link) => link.url);

  return (
    <footer className="border-t border-border bg-background/50 backdrop-blur-sm">
      <div className="container mx-auto py-12 px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <Link to="/" className="text-xl font-medium tracking-tight">
              {settings.siteName}
            </Link>
            <p className="mt-2 text-muted-foreground text-sm">
              &copy; {currentYear} {settings.ownerName}. All rights reserved.
            </p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium mb-4">Navigate</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/projects" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Projects
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-medium mb-4">Connect</h3>
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
            <div className="mt-4">
              <Link to="/settings" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Settings
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
