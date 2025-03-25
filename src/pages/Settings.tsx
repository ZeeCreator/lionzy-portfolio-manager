
import { useState, useEffect } from "react";
import { updateSettings, getSettings } from "@/utils/settingsService";
import { SiteSettings } from "@/types";
import { toast } from "@/components/ui/sonner";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const Settings = () => {
  const [settings, setSettings] = useState<SiteSettings>({
    siteName: "",
    ownerName: "",
    aboutText: "",
    contactEmail: "",
    social: {
      github: "",
      twitter: "",
      linkedin: "",
      instagram: ""
    },
    backgroundImage: "",
    saweria: {
      username: "",
      url: ""
    }
  });

  useEffect(() => {
    const storedSettings = getSettings();
    if (storedSettings) {
      setSettings(storedSettings);
    }
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    
    // Handle nested properties
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setSettings((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof SiteSettings] as Record<string, unknown>,
          [child]: value
        }
      }));
    } else {
      setSettings((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(settings);
    toast.success("Settings saved successfully!");
  };

  return (
    <div className="min-h-screen">
      <section className="py-20 px-6 md:px-12 bg-secondary/50">
        <div className="container">
          <h1 className="text-4xl font-bold">Settings</h1>
          <p className="text-muted-foreground mt-2">
            Customize your portfolio website
          </p>
        </div>
      </section>
      
      <section className="py-16 px-6 md:px-12">
        <div className="container">
          <div className="glass-card rounded-xl p-8 max-w-3xl mx-auto">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-6">
                <h2 className="text-2xl font-medium">General Settings</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="siteName">Site Name</Label>
                    <Input
                      id="siteName"
                      name="siteName"
                      value={settings.siteName}
                      onChange={handleInputChange}
                      placeholder="Lionzy Portfolio"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="ownerName">Your Name</Label>
                    <Input
                      id="ownerName"
                      name="ownerName"
                      value={settings.ownerName}
                      onChange={handleInputChange}
                      placeholder="John Doe"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="aboutText">About Text</Label>
                  <Textarea
                    id="aboutText"
                    name="aboutText"
                    value={settings.aboutText}
                    onChange={handleInputChange}
                    rows={5}
                    placeholder="A brief description about yourself or your portfolio"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="contactEmail">Contact Email</Label>
                  <Input
                    id="contactEmail"
                    name="contactEmail"
                    type="email"
                    value={settings.contactEmail}
                    onChange={handleInputChange}
                    placeholder="john@example.com"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="backgroundImage">Background Image</Label>
                  <Input
                    id="backgroundImage"
                    name="backgroundImage"
                    value={settings.backgroundImage}
                    onChange={handleInputChange}
                    placeholder="URL to your background image"
                  />
                </div>
              </div>
              
              <div className="space-y-6">
                <h2 className="text-2xl font-medium">Social Media</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="social.github">GitHub</Label>
                    <Input
                      id="social.github"
                      name="social.github"
                      value={settings.social.github}
                      onChange={handleInputChange}
                      placeholder="https://github.com/yourusername"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="social.twitter">Twitter</Label>
                    <Input
                      id="social.twitter"
                      name="social.twitter"
                      value={settings.social.twitter}
                      onChange={handleInputChange}
                      placeholder="https://twitter.com/yourusername"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="social.linkedin">LinkedIn</Label>
                    <Input
                      id="social.linkedin"
                      name="social.linkedin"
                      value={settings.social.linkedin}
                      onChange={handleInputChange}
                      placeholder="https://linkedin.com/in/yourusername"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="social.instagram">Instagram</Label>
                    <Input
                      id="social.instagram"
                      name="social.instagram"
                      value={settings.social.instagram}
                      onChange={handleInputChange}
                      placeholder="https://instagram.com/yourusername"
                    />
                  </div>
                </div>
              </div>
              
              <div className="space-y-6">
                <h2 className="text-2xl font-medium">Donation Settings</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="saweria.username">Saweria Username</Label>
                    <Input
                      id="saweria.username"
                      name="saweria.username"
                      value={settings.saweria.username}
                      onChange={handleInputChange}
                      placeholder="yourusername"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="saweria.url">Saweria URL</Label>
                    <Input
                      id="saweria.url"
                      name="saweria.url"
                      value={settings.saweria.url}
                      onChange={handleInputChange}
                      placeholder="https://saweria.co/yourusername"
                    />
                  </div>
                </div>
              </div>
              
              <button type="submit" className="btn-primary w-full">
                Save Settings
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Settings;
