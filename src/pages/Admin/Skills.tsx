
import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { getSkills, createSkill, updateSkill, deleteSkill } from "@/utils/skillsService";
import { Skill } from "@/types";
import { toast } from "@/components/ui/sonner";
import { Input } from "@/components/ui/input";
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
} from "@/components/ui/dialog";

const Skills = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    level: 75,
    category: "",
    icon: "",
  });

  useEffect(() => {
    loadSkills();
  }, []);

  const loadSkills = async () => {
    const data = await getSkills();
    setSkills(data);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      level: 75,
      category: "",
      icon: "",
    });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    if (type === "number") {
      setFormData((prev) => ({
        ...prev,
        [name]: parseInt(value, 10) || 0,
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const newSkill = await createSkill({
      name: formData.name,
      level: formData.level,
      category: formData.category,
      icon: formData.icon,
    });
    
    setSkills((prev) => [...prev, newSkill]);
    toast.success("Skill added successfully!");
    setIsAddDialogOpen(false);
    resetForm();
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedSkill) return;
    
    const updatedSkill = await updateSkill(selectedSkill.id, {
      name: formData.name,
      level: formData.level,
      category: formData.category,
      icon: formData.icon,
    });
    
    if (updatedSkill) {
      setSkills((prev) =>
        prev.map((s) => (s.id === updatedSkill.id ? updatedSkill : s))
      );
      toast.success("Skill updated successfully!");
      setIsEditDialogOpen(false);
      setSelectedSkill(null);
    }
  };

  const handleDelete = async () => {
    if (!selectedSkill) return;
    
    const success = await deleteSkill(selectedSkill.id);
    
    if (success) {
      setSkills((prev) => prev.filter((s) => s.id !== selectedSkill.id));
      toast.success("Skill deleted successfully!");
      setIsDeleteDialogOpen(false);
      setSelectedSkill(null);
    } else {
      toast.error("Failed to delete skill");
    }
  };

  const openEditDialog = (skill: Skill) => {
    setSelectedSkill(skill);
    setFormData({
      name: skill.name,
      level: skill.level,
      category: skill.category,
      icon: skill.icon,
    });
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (skill: Skill) => {
    setSelectedSkill(skill);
    setIsDeleteDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Skills</h1>
        <button
          className="btn-primary"
          onClick={() => {
            resetForm();
            setIsAddDialogOpen(true);
          }}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Skill
        </button>
      </div>

      <div className="glass-card rounded-xl p-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Level</TableHead>
              <TableHead>Icon</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {skills.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  No skills found. Add your first skill!
                </TableCell>
              </TableRow>
            ) : (
              skills.map((skill) => (
                <TableRow key={skill.id}>
                  <TableCell className="font-medium">{skill.name}</TableCell>
                  <TableCell>{skill.category}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <div className="w-40 h-2 bg-secondary rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary"
                          style={{ width: `${skill.level}%` }}
                        />
                      </div>
                      <span className="ml-2 text-xs">{skill.level}%</span>
                    </div>
                  </TableCell>
                  <TableCell>{skill.icon}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <button
                      onClick={() => openEditDialog(skill)}
                      className="btn-outline py-1 px-2"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => openDeleteDialog(skill)}
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

      {/* Add Skill Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Skill</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddSubmit} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Skill Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                placeholder="Frontend, Backend, etc."
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="level">
                Proficiency Level ({formData.level}%)
              </Label>
              <Input
                id="level"
                name="level"
                type="range"
                min="0"
                max="100"
                value={formData.level}
                onChange={handleChange}
                className="w-full"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="icon">Icon Name</Label>
              <Input
                id="icon"
                name="icon"
                value={formData.icon}
                onChange={handleChange}
                placeholder="react, typescript, etc."
                required
              />
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
                Add Skill
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Skill Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Skill</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditSubmit} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Skill Name</Label>
              <Input
                id="edit-name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-category">Category</Label>
              <Input
                id="edit-category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-level">
                Proficiency Level ({formData.level}%)
              </Label>
              <Input
                id="edit-level"
                name="level"
                type="range"
                min="0"
                max="100"
                value={formData.level}
                onChange={handleChange}
                className="w-full"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-icon">Icon Name</Label>
              <Input
                id="edit-icon"
                name="icon"
                value={formData.icon}
                onChange={handleChange}
                required
              />
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
                Update Skill
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
              Are you sure you want to delete the skill "{selectedSkill?.name}"? This action cannot be undone.
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

export default Skills;
