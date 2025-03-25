
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Github, Twitter, Linkedin, Instagram, Mail, Edit } from "lucide-react";
import { getSettings } from "@/utils/settingsService";
import { createContactMessage } from "@/utils/contactService";
import { SiteSettings } from "@/types";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/sonner";

const Contact = () => {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Save the message
    createContactMessage(formData);
    
    // Show success message
    toast.success("Message sent successfully!");
    
    // Reset form
    setFormData({
      name: "",
      email: "",
      subject: "",
      message: "",
    });
  };

  return (
    <div className="min-h-screen">
      <section className="py-20 px-6 md:px-12 bg-secondary/50">
        <div className="container">
          <div className="flex justify-between items-end">
            <div>
              <span className="chip mb-3">Contact</span>
              <h1 className="text-4xl font-bold">Get in Touch</h1>
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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="glass-card rounded-xl p-8">
                <h2 className="text-2xl font-medium mb-6">Send a Message</h2>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Your Name</Label>
                      <Input
                        id="name"
                        name="name"
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      name="subject"
                      placeholder="Project Inquiry"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      name="message"
                      placeholder="Write your message here..."
                      rows={6}
                      value={formData.message}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  <button type="submit" className="btn-primary w-full md:w-auto px-8">
                    Send Message
                  </button>
                </form>
              </div>
            </div>
            
            <div className="lg:col-span-1">
              <div className="glass-card rounded-xl p-8 sticky top-24">
                <h3 className="text-xl font-medium mb-6">Contact Information</h3>
                
                <div className="space-y-6">
                  <div className="flex items-start">
                    <Mail size={20} className="mt-1 mr-4 text-primary" />
                    <div>
                      <p className="font-medium">Email</p>
                      <a 
                        href={`mailto:${settings.contactEmail}`}
                        className="text-muted-foreground hover:text-primary transition-colors"
                      >
                        {settings.contactEmail}
                      </a>
                    </div>
                  </div>
                </div>
                
                {socialLinks.length > 0 && (
                  <div className="mt-8">
                    <h4 className="font-medium mb-4">Social Media</h4>
                    <div className="flex flex-wrap gap-4">
                      {socialLinks.map((link) => (
                        <a 
                          key={link.name}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="glass-card rounded-full p-3 text-muted-foreground hover:text-primary transition-colors"
                          aria-label={link.name}
                        >
                          <link.icon size={20} />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="mt-8">
                  <h4 className="font-medium mb-4">Support My Work</h4>
                  <a 
                    href={settings.saweria.url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="btn-outline w-full flex items-center justify-center"
                  >
                    Donate via Saweria
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

export default Contact;
