
import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Check, X } from "lucide-react";
import { getProjects, createProject, updateProject, deleteProject } from "@/utils/projectService";
import { Project } from "@/types";
import { toast } from "@/components/ui/sonner";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const Projects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    imageUrl: "/placeholder.svg",
    tags: "",
    githubUrl: "",
    liveUrl: "",
    featured: false,
  });

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = () => {
    const data = getProjects();
    setProjects(data);
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      imageUrl: "/placeholder.svg",
      tags: "",
      githubUrl: "",
      liveUrl: "",
      featured: false,
    });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked,
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newProject = createProject({
      title: formData.title,
      description: formData.description,
      imageUrl: formData.imageUrl || "/placeholder.svg",
      tags: formData.tags.split(",").map((tag) => tag.trim()),
      githubUrl: formData.githubUrl || undefined,
      liveUrl: formData.liveUrl || undefined,
      featured: formData.featured,
    });
    
    setProjects((prev) => [...prev, newProject]);
    toast.success("Project added successfully!");
    setIsAddDialogOpen(false);
    resetForm();
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedProject) return;
    
    const updatedProject = updateProject(selectedProject.id, {
      title: formData.title,
      description: formData.description,
      imageUrl: formData.imageUrl,
      tags: formData.tags.split(",").map((tag) => tag.trim()),
      githubUrl: formData.githubUrl || undefined,
      liveUrl: formData.liveUrl || undefined,
      featured: formData.featured,
    });
    
    if (updatedProject) {
      setProjects((prev) =>
        prev.map((p) => (p.id === updatedProject.id ? updatedProject : p))
      );
      toast.success("Project updated successfully!");
      setIsEditDialogOpen(false);
      setSelectedProject(null);
    }
  };

  const handleDelete = () => {
    if (!selectedProject) return;
    
    const success = deleteProject(selectedProject.id);
    
    if (success) {
      setProjects((prev) => prev.filter((p) => p.id !== selectedProject.id));
      toast.success("Project deleted successfully!");
      setIsDeleteDialogOpen(false);
      setSelectedProject(null);
    } else {
      toast.error("Failed to delete project");
    }
  };

  const openEditDialog = (project: Project) => {
    setSelectedProject(project);
    setFormData({
      title: project.title,
      description: project.description,
      imageUrl: project.imageUrl,
      tags: project.tags.join(", "),
      githubUrl: project.githubUrl || "",
      liveUrl: project.liveUrl || "",
      featured: project.featured,
    });
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (project: Project) => {
    setSelectedProject(project);
    setIsDeleteDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Projects</h1>
        <button
          className="btn-primary"
          onClick={() => {
            resetForm();
            setIsAddDialogOpen(true);
          }}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Project
        </button>
      </div>

      <div className="glass-card rounded-xl p-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Tags</TableHead>
              <TableHead>Featured</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  No projects found. Add your first project!
                </TableCell>
              </TableRow>
            ) : (
              projects.map((project) => (
                <TableRow key={project.id}>
                  <TableCell className="font-medium">{project.title}</TableCell>
                  <TableCell className="max-w-xs truncate">
                    {project.description}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {project.tags.slice(0, 2).map((tag) => (
                        <span
                          key={tag}
                          className="bg-secondary text-xs px-2 py-1 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                      {project.tags.length > 2 && (
                        <span className="bg-secondary text-xs px-2 py-1 rounded">
                          +{project.tags.length - 2}
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {project.featured ? (
                      <Check className="h-5 w-5 text-green-500" />
                    ) : (
                      <X className="h-5 w-5 text-muted-foreground" />
                    )}
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <button
                      onClick={() => openEditDialog(project)}
                      className="btn-outline py-1 px-2"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => openDeleteDialog(project)}
                      className="btn-outline py-1 px-2 text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Add Project Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[625px]">
          <DialogHeader>
            <DialogTitle>Add New Project</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddSubmit} className="space-y-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="imageUrl">Image URL</Label>
                <Input
                  id="imageUrl"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleChange}
                  placeholder="/placeholder.svg"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="tags">Tags (comma separated)</Label>
              <Input
                id="tags"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                placeholder="React, TypeScript, Tailwind"
                required
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="githubUrl">GitHub URL</Label>
                <Input
                  id="githubUrl"
                  name="githubUrl"
                  value={formData.githubUrl}
                  onChange={handleChange}
                  placeholder="https://github.com/..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="liveUrl">Live URL</Label>
                <Input
                  id="liveUrl"
                  name="liveUrl"
                  value={formData.liveUrl}
                  onChange={handleChange}
                  placeholder="https://..."
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <input
                id="featured"
                name="featured"
                type="checkbox"
                checked={formData.featured}
                onChange={handleChange}
                className="rounded"
              />
              <Label htmlFor="featured">Featured Project</Label>
            </div>
            
            <div className="flex justify-end space-x-2 pt-4">
              <button
                type="button"
                className="btn-outline"
                onClick={() => setIsAddDialogOpen(false)}
              >
                Cancel
              </button>
              <button type="submit" className="btn-primary">
                Add Project
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Project Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[625px]">
          <DialogHeader>
            <DialogTitle>Edit Project</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditSubmit} className="space-y-4 py-4">
            {/* Same form fields as Add Project Dialog */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-title">Title</Label>
                <Input
                  id="edit-title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-imageUrl">Image URL</Label>
                <Input
                  id="edit-imageUrl"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleChange}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-tags">Tags (comma separated)</Label>
              <Input
                id="edit-tags"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-githubUrl">GitHub URL</Label>
                <Input
                  id="edit-githubUrl"
                  name="githubUrl"
                  value={formData.githubUrl}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-liveUrl">Live URL</Label>
                <Input
                  id="edit-liveUrl"
                  name="liveUrl"
                  value={formData.liveUrl}
                  onChange={handleChange}
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <input
                id="edit-featured"
                name="featured"
                type="checkbox"
                checked={formData.featured}
                onChange={handleChange}
                className="rounded"
              />
              <Label htmlFor="edit-featured">Featured Project</Label>
            </div>
            
            <div className="flex justify-end space-x-2 pt-4">
              <button
                type="button"
                className="btn-outline"
                onClick={() => setIsEditDialogOpen(false)}
              >
                Cancel
              </button>
              <button type="submit" className="btn-primary">
                Update Project
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>
              Are you sure you want to delete the project "{selectedProject?.title}"? This action cannot be undone.
            </p>
          </div>
          <div className="flex justify-end space-x-2">
            <button
              className="btn-outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </button>
            <button
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors"
              onClick={handleDelete}
            >
              Delete
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Projects;
