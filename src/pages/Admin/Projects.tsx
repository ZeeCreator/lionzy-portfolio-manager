import { useState, useEffect, useCallback } from "react";
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
    downloadType: 'free' as 'free' | 'paid',
    downloadUrl: "",
    price: 0,
    sourceVisible: true,
  });

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = () => {
    const data = getProjects();
    setProjects(data);
  };

  const resetForm = useCallback(() => {
    setFormData({
      title: "",
      description: "",
      imageUrl: "/placeholder.svg",
      tags: "",
      githubUrl: "",
      liveUrl: "",
      featured: false,
      downloadType: 'free',
      downloadUrl: "",
      price: 0,
      sourceVisible: true,
    });
  }, []);

  const handleChange = useCallback((
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    setFormData((prev) => {
      if (type === "checkbox") {
        return {
          ...prev,
          [name]: (e.target as HTMLInputElement).checked,
        };
      } else if (name === "price") {
        return { ...prev, [name]: parseFloat(value) || 0 };
      } else {
        return { ...prev, [name]: value };
      }
    });
  }, []);

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
      downloadType: formData.downloadType,
      downloadUrl: formData.downloadUrl || undefined,
      price: formData.downloadType === 'paid' ? formData.price : undefined,
      sourceVisible: formData.sourceVisible,
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
      downloadType: formData.downloadType,
      downloadUrl: formData.downloadUrl || undefined,
      price: formData.downloadType === 'paid' ? formData.price : undefined,
      sourceVisible: formData.sourceVisible,
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
      downloadType: project.downloadType,
      downloadUrl: project.downloadUrl || "",
      price: project.price || 0,
      sourceVisible: project.sourceVisible,
    });
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (project: Project) => {
    setSelectedProject(project);
    setIsDeleteDialogOpen(true);
  };

  const ProjectForm = ({ isEdit = false }: { isEdit?: boolean }) => (
    <div className="space-y-4 py-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor={isEdit ? "edit-title" : "title"}>Title</Label>
          <Input
            id={isEdit ? "edit-title" : "title"}
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            autoComplete="off"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={isEdit ? "edit-imageUrl" : "imageUrl"}>Image URL</Label>
          <Input
            id={isEdit ? "edit-imageUrl" : "imageUrl"}
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleChange}
            placeholder="/placeholder.svg"
            autoComplete="off"
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor={isEdit ? "edit-description" : "description"}>Description</Label>
        <Textarea
          id={isEdit ? "edit-description" : "description"}
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          rows={3}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor={isEdit ? "edit-tags" : "tags"}>Tags (comma separated)</Label>
        <Input
          id={isEdit ? "edit-tags" : "tags"}
          name="tags"
          value={formData.tags}
          onChange={handleChange}
          placeholder="React, TypeScript, Tailwind"
          required
          autoComplete="off"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor={isEdit ? "edit-githubUrl" : "githubUrl"}>GitHub URL</Label>
          <Input
            id={isEdit ? "edit-githubUrl" : "githubUrl"}
            name="githubUrl"
            value={formData.githubUrl}
            onChange={handleChange}
            placeholder="https://github.com/..."
            autoComplete="off"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={isEdit ? "edit-liveUrl" : "liveUrl"}>Live URL</Label>
          <Input
            id={isEdit ? "edit-liveUrl" : "liveUrl"}
            name="liveUrl"
            value={formData.liveUrl}
            onChange={handleChange}
            placeholder="https://..."
            autoComplete="off"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor={isEdit ? "edit-downloadType" : "downloadType"}>Download Type</Label>
        <select
          id={isEdit ? "edit-downloadType" : "downloadType"}
          name="downloadType"
          value={formData.downloadType}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-input bg-background rounded-md"
        >
          <option value="free">Free</option>
          <option value="paid">Paid</option>
        </select>
      </div>

      {formData.downloadType === 'free' && (
        <div className="space-y-2">
          <Label htmlFor={isEdit ? "edit-downloadUrl" : "downloadUrl"}>Download URL</Label>
          <Input
            id={isEdit ? "edit-downloadUrl" : "downloadUrl"}
            name="downloadUrl"
            value={formData.downloadUrl}
            onChange={handleChange}
            placeholder="https://github.com/user/repo/archive/main.zip"
            autoComplete="off"
          />
        </div>
      )}

      {formData.downloadType === 'paid' && (
        <div className="space-y-2">
          <Label htmlFor={isEdit ? "edit-price" : "price"}>Price ($)</Label>
          <Input
            id={isEdit ? "edit-price" : "price"}
            name="price"
            type="number"
            step="0.01"
            min="0"
            value={formData.price}
            onChange={handleChange}
            placeholder="29.99"
            autoComplete="off"
          />
        </div>
      )}
      
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <input
            id={isEdit ? "edit-featured" : "featured"}
            name="featured"
            type="checkbox"
            checked={formData.featured}
            onChange={handleChange}
            className="rounded"
          />
          <Label htmlFor={isEdit ? "edit-featured" : "featured"}>Featured Project</Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <input
            id={isEdit ? "edit-sourceVisible" : "sourceVisible"}
            name="sourceVisible"
            type="checkbox"
            checked={formData.sourceVisible}
            onChange={handleChange}
            className="rounded"
          />
          <Label htmlFor={isEdit ? "edit-sourceVisible" : "sourceVisible"}>Show Source Code</Label>
        </div>
      </div>
    </div>
  );

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
              <TableHead>Type</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Featured</TableHead>
              <TableHead>Source</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  No projects found. Add your first project!
                </TableCell>
              </TableRow>
            ) : (
              projects.map((project) => (
                <TableRow key={project.id}>
                  <TableCell className="font-medium">{project.title}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded text-xs ${
                      project.downloadType === 'free' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {project.downloadType}
                      {project.downloadType === 'paid' && project.price && ` $${project.price}`}
                    </span>
                  </TableCell>
                  <TableCell>
                    {project.downloadType === 'paid' ? `$${project.price || 0}` : 'Free'}
                  </TableCell>
                  <TableCell>
                    {project.featured ? (
                      <Check className="h-5 w-5 text-green-500" />
                    ) : (
                      <X className="h-5 w-5 text-muted-foreground" />
                    )}
                  </TableCell>
                  <TableCell>
                    {project.sourceVisible ? (
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
        <DialogContent className="sm:max-w-[625px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Project</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddSubmit}>
            <ProjectForm />
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
        <DialogContent className="sm:max-w-[625px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Project</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditSubmit}>
            <ProjectForm isEdit={true} />
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
