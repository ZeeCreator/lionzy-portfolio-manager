
import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { createProject } from "@/utils/projectService";
import { toast } from "@/components/ui/sonner";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { t } from "@/utils/translations";

const AddProject = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await createProject({
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
      
      toast.success(t("projectAddedSuccess"));
      navigate("/admin/projects");
    } catch (error) {
      console.error('Error creating project:', error);
      toast.error("Gagal menambahkan proyek");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={() => navigate("/admin/projects")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">{t("addProject")}</h1>
      </div>

      <div className="glass-card rounded-xl p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">{t("title")}</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                autoComplete="off"
                disabled={isSubmitting}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="imageUrl">{t("imageUrl")}</Label>
              <Input
                id="imageUrl"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleChange}
                placeholder="/placeholder.svg"
                autoComplete="off"
                disabled={isSubmitting}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">{t("description")}</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={3}
              disabled={isSubmitting}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="tags">{t("tags")}</Label>
            <Input
              id="tags"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              placeholder="React, TypeScript, Tailwind"
              required
              autoComplete="off"
              disabled={isSubmitting}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="githubUrl">{t("githubUrl")}</Label>
              <Input
                id="githubUrl"
                name="githubUrl"
                value={formData.githubUrl}
                onChange={handleChange}
                placeholder="https://github.com/..."
                autoComplete="off"
                disabled={isSubmitting}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="liveUrl">{t("liveUrl")}</Label>
              <Input
                id="liveUrl"
                name="liveUrl"
                value={formData.liveUrl}
                onChange={handleChange}
                placeholder="https://..."
                autoComplete="off"
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="downloadType">{t("downloadType")}</Label>
            <select
              id="downloadType"
              name="downloadType"
              value={formData.downloadType}
              onChange={handleChange}
              disabled={isSubmitting}
              className="w-full px-3 py-2 border border-input bg-background rounded-md"
            >
              <option value="free">{t("free")}</option>
              <option value="paid">{t("paid")}</option>
            </select>
          </div>

          {formData.downloadType === 'free' && (
            <div className="space-y-2">
              <Label htmlFor="downloadUrl">{t("downloadUrl")}</Label>
              <Input
                id="downloadUrl"
                name="downloadUrl"
                value={formData.downloadUrl}
                onChange={handleChange}
                placeholder="https://github.com/user/repo/archive/main.zip"
                autoComplete="off"
                disabled={isSubmitting}
              />
            </div>
          )}

          {formData.downloadType === 'paid' && (
            <div className="space-y-2">
              <Label htmlFor="price">{t("price")}</Label>
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
                disabled={isSubmitting}
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
                disabled={isSubmitting}
                className="rounded"
              />
              <Label htmlFor="featured">{t("featured")}</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <input
                id="sourceVisible"
                name="sourceVisible"
                type="checkbox"
                checked={formData.sourceVisible}
                onChange={handleChange}
                disabled={isSubmitting}
                className="rounded"
              />
              <Label htmlFor="sourceVisible">{t("sourceVisible")}</Label>
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/admin/projects")}
              disabled={isSubmitting}
            >
              {t("cancel")}
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? t("loading") : t("addProject")}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProject;
