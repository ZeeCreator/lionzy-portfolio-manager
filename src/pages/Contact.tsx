
import { useState, useEffect } from "react";
import { getSettings } from "@/utils/settingsService";
import { SiteSettings } from "@/types";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Edit, MessageSquare, Send, User, Mail, MapPin, Briefcase } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/sonner";
import { createContactMessage } from "@/utils/contactService";
import { useUser } from "@/contexts/UserContext";

const Contact = () => {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { isLoggedIn } = useUser();

  useEffect(() => {
    const loadSettings = async () => {
      const settingsData = await getSettings();
      setSettings(settingsData);
    };
    loadSettings();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      createContactMessage({
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        message: formData.message
      });

      toast.success("Message sent successfully and stored on server!");
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      toast.error("Failed to send message. Please try again.");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!settings) {
    return (
      <div className="container mx-auto py-12 px-4">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading contact page...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Contact {settings.displayName}</h1>
        
        {isLoggedIn && (
          <div className="space-x-3">
            <Button asChild variant="outline" size="sm">
              <Link to="/admin/messages">
                <MessageSquare className="h-4 w-4 mr-1" />
                View Messages
              </Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link to="/settings">
                <Edit className="h-4 w-4 mr-1" />
                Edit Settings
              </Link>
            </Button>
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div>
          <p className="text-lg mb-6">
            Have a question or want to work together? Feel free to reach out!
          </p>
          
          <div className="space-y-6">
            <div className="glass-card p-4 rounded-lg">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <User className="h-5 w-5 mr-2" />
                About {settings.displayName}
              </h2>
              <div className="space-y-2 text-muted-foreground">
                <p><strong>Full Name:</strong> {settings.fullName}</p>
                <p><strong>Profession:</strong> {settings.profession}</p>
                <p><strong>Company:</strong> {settings.company}</p>
                <p className="flex items-center"><MapPin className="h-4 w-4 mr-1" /> {settings.location}</p>
              </div>
            </div>

            <div className="glass-card p-4 rounded-lg">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <Mail className="h-5 w-5 mr-2" />
                Contact Information
              </h2>
              <div className="space-y-2 text-muted-foreground">
                <p>
                  <strong>Email:</strong> <a href={`mailto:${settings.contactEmail}`} className="text-primary hover:underline">{settings.contactEmail}</a>
                </p>
                {settings.phoneNumber && (
                  <p>
                    <strong>Phone:</strong> <a href={`tel:${settings.phoneNumber}`} className="text-primary hover:underline">{settings.phoneNumber}</a>
                  </p>
                )}
              </div>
            </div>
          
            {settings.saweria?.username && (
              <div className="glass-card p-4 rounded-lg">
                <h2 className="text-xl font-semibold mb-2 flex items-center">
                  <Briefcase className="h-5 w-5 mr-2" />
                  Support My Work
                </h2>
                <p className="text-muted-foreground mb-3">
                  If you find my work valuable, you can support me via Saweria.
                </p>
                <Button asChild variant="outline">
                  <a 
                    href={settings.saweria.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Support via Saweria
                  </a>
                </Button>
              </div>
            )}
          </div>
        </div>
        
        <div className="glass-card rounded-xl p-6 md:p-8">
          <h2 className="text-xl font-semibold mb-6">Send Me a Message</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                name="subject"
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
                rows={5}
                value={formData.message}
                onChange={handleChange}
                required
              />
            </div>
            
            <Button type="submit" disabled={isSubmitting}>
              <Send className="h-4 w-4 mr-2" />
              {isSubmitting ? "Sending..." : "Send Message"}
            </Button>
          </form>
          
          <div className="mt-4 text-xs text-muted-foreground">
            <p>✓ Messages are stored securely on our server</p>
            <p>✓ Storage type: {settings.serverConfig.storageType.toUpperCase()}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
