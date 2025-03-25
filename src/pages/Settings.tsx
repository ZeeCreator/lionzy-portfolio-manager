
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  Settings as SettingsIcon, 
  Save, 
  Plus, 
  Trash, 
  Edit as EditIcon,
  Image,
  ExternalLink
} from "lucide-react";
import { 
  getSettings, 
  updateSettings, 
  availableBackgrounds 
} from "@/utils/settingsService";
import { 
  getProjects, 
  createProject, 
  updateProject, 
  deleteProject 
} from "@/utils/projectService";
import { SiteSettings, Project } from "@/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "@/components/ui/sonner";

const Settings = () => {
  const [settings, setSettings] = useState<SiteSettings>(getSettings());
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeTab, setActiveTab] = useState("general");
  const [isProjectDialogOpen, setIsProjectDialogOpen] = useState(false);
  const [currentProject, setCurrentProject] = useState<Partial<Project> | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setSettings(getSettings());
    setProjects(getProjects());
  }, []);

  const handleSettingsChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    section?: string,
    subsection?: string
  ) => {
    const { name, value } = e.target;
    
    if (section && subsection) {
      setSettings((prev) => ({
        ...prev,
        [section]: {
          ...prev[section as keyof SiteSettings],
          [subsection]: {
            ...prev[section as keyof SiteSettings][subsection as keyof SiteSettings[typeof section]],
            [name]: value,
          },
        },
      }));
    } else if (section) {
      setSettings((prev) => ({
        ...prev,
        [section]: {
          ...prev[section as keyof SiteSettings],
          [name]: value,
        },
      }));
    } else {
      setSettings((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSaveSettings = () => {
    updateSettings(settings);
    toast.success("Settings saved successfully!");
  };

  const handleProjectInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setCurrentProject((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tagsValue = e.target.value;
    const tagsArray = tagsValue.split(",").map((tag) => tag.trim()).filter(Boolean);
    setCurrentProject((prev) => ({
      ...prev,
      tags: tagsArray,
    }));
  };

  const handleProjectSave = () => {
    if (!currentProject || !currentProject.title || !currentProject.description) {
      toast.error("Please fill in all required fields.");
      return;
    }

    if (isEditing && currentProject.id) {
      // Update existing project
      updateProject(currentProject.id, {
        title: currentProject.title,
        description: currentProject.description,
        imageUrl: currentProject.imageUrl || "/placeholder.svg",
        tags: currentProject.tags || [],
        githubUrl: currentProject.githubUrl,
        liveUrl: currentProject.liveUrl,
        featured: !!currentProject.featured,
      });
      toast.success("Project updated successfully!");
    } else {
      // Create new project
      createProject({
        title: currentProject.title,
        description: currentProject.description,
        imageUrl: currentProject.imageUrl || "/placeholder.svg",
        tags: currentProject.tags || [],
        githubUrl: currentProject.githubUrl,
        liveUrl: currentProject.liveUrl,
        featured: !!currentProject.featured,
      });
      toast.success("Project created successfully!");
    }

    setProjects(getProjects());
    setIsProjectDialogOpen(false);
    setCurrentProject(null);
    setIsEditing(false);
  };

  const handleDeleteProject = (id: string) => {
    deleteProject(id);
    setProjects(getProjects());
    toast.success("Project deleted successfully!");
  };

  const handleEditProject = (project: Project) => {
    setCurrentProject({
      ...project,
      tags: project.tags,
    });
    setIsEditing(true);
    setIsProjectDialogOpen(true);
  };

  return (
    <div className="min-h-screen">
      <section className="py-20 px-6 md:px-12 bg-secondary/50">
        <div className="container">
          <div className="flex justify-between items-end">
            <div>
              <span className="chip mb-3">Admin</span>
              <h1 className="text-4xl font-bold">Settings</h1>
            </div>
            <Link to="/" className="btn-outline">
              Back to Home
            </Link>
          </div>
        </div>
      </section>
      
      <section className="py-16 px-6 md:px-12">
        <div className="container">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-8">
              <TabsTrigger value="general" className="text-sm">
                <SettingsIcon size={16} className="mr-2" />
                General Settings
              </TabsTrigger>
              <TabsTrigger value="projects" className="text-sm">
                <Image size={16} className="mr-2" />
                Projects
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="general">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                  {/* General Information */}
                  <div className="glass-card rounded-xl p-8">
                    <h2 className="text-xl font-medium mb-6">General Information</h2>
                    
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="siteName">Website Name</Label>
                          <Input
                            id="siteName"
                            name="siteName"
                            value={settings.siteName}
                            onChange={handleSettingsChange}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="ownerName">Owner Name</Label>
                          <Input
                            id="ownerName"
                            name="ownerName"
                            value={settings.ownerName}
                            onChange={handleSettingsChange}
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="contactEmail">Contact Email</Label>
                        <Input
                          id="contactEmail"
                          name="contactEmail"
                          type="email"
                          value={settings.contactEmail}
                          onChange={handleSettingsChange}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="aboutText">About Text</Label>
                        <Textarea
                          id="aboutText"
                          name="aboutText"
                          rows={6}
                          value={settings.aboutText}
                          onChange={handleSettingsChange}
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* Background Setting */}
                  <div className="glass-card rounded-xl p-8">
                    <h2 className="text-xl font-medium mb-6">Background Image</h2>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                      {availableBackgrounds.map((bg) => (
                        <div 
                          key={bg.id}
                          className={`rounded-lg overflow-hidden border-2 cursor-pointer transition-all ${
                            settings.backgroundImage === bg.id ? "border-primary" : "border-transparent"
                          }`}
                          onClick={() => setSettings((prev) => ({ ...prev, backgroundImage: bg.id }))}
                        >
                          <div className="aspect-video bg-muted">
                            <img 
                              src={`/src/assets/mountains/${bg.id}`} 
                              alt={bg.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Social Media */}
                  <div className="glass-card rounded-xl p-8">
                    <h2 className="text-xl font-medium mb-6">Social Media</h2>
                    
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="github">GitHub URL</Label>
                          <Input
                            id="github"
                            name="github"
                            value={settings.social.github || ""}
                            onChange={(e) => handleSettingsChange(e, "social")}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="twitter">Twitter URL</Label>
                          <Input
                            id="twitter"
                            name="twitter"
                            value={settings.social.twitter || ""}
                            onChange={(e) => handleSettingsChange(e, "social")}
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="linkedin">LinkedIn URL</Label>
                          <Input
                            id="linkedin"
                            name="linkedin"
                            value={settings.social.linkedin || ""}
                            onChange={(e) => handleSettingsChange(e, "social")}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="instagram">Instagram URL</Label>
                          <Input
                            id="instagram"
                            name="instagram"
                            value={settings.social.instagram || ""}
                            onChange={(e) => handleSettingsChange(e, "social")}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Saweria Donation */}
                  <div className="glass-card rounded-xl p-8">
                    <h2 className="text-xl font-medium mb-6">Saweria Donation</h2>
                    
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="username">Saweria Username</Label>
                          <Input
                            id="username"
                            name="username"
                            value={settings.saweria.username}
                            onChange={(e) => handleSettingsChange(e, "saweria")}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="url">Saweria URL</Label>
                          <Input
                            id="url"
                            name="url"
                            value={settings.saweria.url}
                            onChange={(e) => handleSettingsChange(e, "saweria")}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <Button onClick={handleSaveSettings} className="w-full">
                    <Save size={16} className="mr-2" />
                    Save Settings
                  </Button>
                </div>
                
                <div className="lg:col-span-1">
                  <div className="glass-card rounded-xl p-8 sticky top-24">
                    <h3 className="text-xl font-medium mb-6">Preview</h3>
                    
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Website Name</p>
                        <p className="font-medium">{settings.siteName}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-muted-foreground">Owner</p>
                        <p className="font-medium">{settings.ownerName}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-muted-foreground">Background</p>
                        <div className="aspect-video rounded-md overflow-hidden bg-muted mt-1">
                          <img 
                            src={`/src/assets/mountains/${settings.backgroundImage}`} 
                            alt="Background Preview"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-8">
                      <Link to="/" className="btn-primary w-full">
                        View Site
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="projects">
              <div className="glass-card rounded-xl p-8 mb-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-medium">Manage Projects</h2>
                  
                  <Dialog open={isProjectDialogOpen} onOpenChange={setIsProjectDialogOpen}>
                    <DialogTrigger asChild>
                      <Button onClick={() => {
                        setCurrentProject({ 
                          title: "", 
                          description: "", 
                          imageUrl: "/placeholder.svg", 
                          tags: [],
                          featured: false 
                        });
                        setIsEditing(false);
                      }}>
                        <Plus size={16} className="mr-2" />
                        Add Project
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[550px]">
                      <DialogHeader>
                        <DialogTitle>{isEditing ? "Edit Project" : "Add New Project"}</DialogTitle>
                        <DialogDescription>
                          {isEditing 
                            ? "Update your project information below." 
                            : "Fill in the details for your new project."}
                        </DialogDescription>
                      </DialogHeader>
                      
                      <div className="space-y-6 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="project-title">Title *</Label>
                          <Input
                            id="project-title"
                            name="title"
                            value={currentProject?.title || ""}
                            onChange={handleProjectInputChange}
                            required
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="project-description">Description *</Label>
                          <Textarea
                            id="project-description"
                            name="description"
                            rows={4}
                            value={currentProject?.description || ""}
                            onChange={handleProjectInputChange}
                            required
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="project-image">Image URL</Label>
                          <Input
                            id="project-image"
                            name="imageUrl"
                            value={currentProject?.imageUrl || "/placeholder.svg"}
                            onChange={handleProjectInputChange}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="project-tags">Tags (comma separated)</Label>
                          <Input
                            id="project-tags"
                            name="tags"
                            value={currentProject?.tags?.join(", ") || ""}
                            onChange={handleTagsChange}
                            placeholder="React, Tailwind, TypeScript"
                          />
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="project-github">GitHub URL</Label>
                            <Input
                              id="project-github"
                              name="githubUrl"
                              value={currentProject?.githubUrl || ""}
                              onChange={handleProjectInputChange}
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="project-live">Live URL</Label>
                            <Input
                              id="project-live"
                              name="liveUrl"
                              value={currentProject?.liveUrl || ""}
                              onChange={handleProjectInputChange}
                            />
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="project-featured"
                            checked={!!currentProject?.featured}
                            onChange={(e) => 
                              setCurrentProject((prev) => ({ 
                                ...prev, 
                                featured: e.target.checked 
                              }))
                            }
                            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                          />
                          <Label htmlFor="project-featured" className="text-sm font-normal">
                            Feature this project on the homepage
                          </Label>
                        </div>
                      </div>
                      
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsProjectDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleProjectSave}>
                          {isEditing ? "Update Project" : "Add Project"}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
                
                {projects.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map((project) => (
                      <Card key={project.id}>
                        <CardHeader className="pb-2">
                          <div className="aspect-video bg-muted rounded-md overflow-hidden mb-2">
                            <img 
                              src={project.imageUrl} 
                              alt={project.title} 
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <CardTitle className="text-lg">{project.title}</CardTitle>
                          <CardDescription className="line-clamp-2">
                            {project.description}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="py-2">
                          <div className="flex flex-wrap gap-1">
                            {project.tags.map((tag) => (
                              <span 
                                key={tag} 
                                className="text-xs px-2 py-0.5 bg-secondary text-secondary-foreground rounded-full"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </CardContent>
                        <CardFooter className="flex justify-between border-t pt-4">
                          <div className="flex space-x-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => handleEditProject(project)}
                            >
                              <EditIcon size={14} className="mr-1" />
                              Edit
                            </Button>
                            
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="destructive" size="sm">
                                  <Trash size={14} className="mr-1" />
                                  Delete
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete Project</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete "{project.title}"? This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction 
                                    onClick={() => handleDeleteProject(project.id)}
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                          
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => navigate(`/projects/${project.id}`)}
                          >
                            <ExternalLink size={14} className="mr-1" />
                            View
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground mb-4">No projects added yet.</p>
                    <Button 
                      onClick={() => {
                        setCurrentProject({ 
                          title: "", 
                          description: "", 
                          imageUrl: "/placeholder.svg", 
                          tags: [],
                          featured: false 
                        });
                        setIsEditing(false);
                        setIsProjectDialogOpen(true);
                      }}
                    >
                      <Plus size={16} className="mr-2" />
                      Add Your First Project
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  );
};

export default Settings;
