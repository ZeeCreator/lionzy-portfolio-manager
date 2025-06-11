
import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { createProject } from "@/utils/projectService";
import { toast } from "@/components/ui/sonner";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const AddProject = () => {
  const navigate = useNavigate();
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

  const handleSubmit = (e: React.FormEvent) => {
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
    
    toast.success("Project added successfully!");
    navigate("/admin/projects");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={() => navigate("/admin/projects")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">Add New Project</h1>
      </div>

      <div className="glass-card rounded-xl p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                autoComplete="off"
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
                autoComplete="off"
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
              autoComplete="off"
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
                autoComplete="off"
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
                autoComplete="off"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="downloadType">Download Type</Label>
            <select
              id="downloadType"
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
              <Label htmlFor="downloadUrl">Download URL</Label>
              <Input
                id="downloadUrl"
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
              <Label htmlFor="price">Price ($)</Label>
              <Input
                id="price"
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
                id="featured"
                name="featured"
                type="checkbox"
                checked={formData.featured}
                onChange={handleChange}
                className="rounded"
              />
              <Label htmlFor="featured">Featured Project</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <input
                id="sourceVisible"
                name="sourceVisible"
                type="checkbox"
                checked={formData.sourceVisible}
                onChange={handleChange}
                className="rounded"
              />
              <Label htmlFor="sourceVisible">Show Source Code</Label>
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/admin/projects")}
            >
              Cancel
            </Button>
            <Button type="submit">
              Add Project
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProject;
