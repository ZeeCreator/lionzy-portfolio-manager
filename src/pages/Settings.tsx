import { useState, useEffect } from "react";
import { updateSettings, getSettings } from "@/utils/settingsService";
import { SiteSettings, EducationItem } from "@/types";
import { toast } from "@/components/ui/sonner";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Trash2, Edit, Save } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { Sun, Moon, Monitor } from "lucide-react";

const Settings = () => {
  const [settings, setSettings] = useState<SiteSettings>(getSettings());
  const [editingEducation, setEditingEducation] = useState<string | null>(null);
  const [newEducationItem, setNewEducationItem] = useState<Partial<EducationItem>>({
    title: "",
    description: "",
    progress: 0,
    category: "",
    completed: false,
  });
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    const storedSettings = getSettings();
    setSettings(storedSettings);
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setSettings((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof SiteSettings] as Record<string, unknown>,
          [child]: value
        }
      }));
    } else if (type === "checkbox") {
      setSettings((prev) => ({ ...prev, [name]: checked }));
    } else {
      setSettings((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleEducationItemChange = (id: string, field: keyof EducationItem, value: any) => {
    setSettings(prev => ({
      ...prev,
      educationItems: prev.educationItems.map(item =>
        item.id === id ? { ...item, [field]: value } : item
      )
    }));
  };

  const addEducationItem = () => {
    if (!newEducationItem.title || !newEducationItem.category) {
      toast.error("Please fill in title and category");
      return;
    }

    const item: EducationItem = {
      id: Date.now().toString(),
      title: newEducationItem.title || "",
      description: newEducationItem.description || "",
      progress: newEducationItem.progress || 0,
      category: newEducationItem.category || "",
      completed: newEducationItem.completed || false,
    };

    setSettings(prev => ({
      ...prev,
      educationItems: [...prev.educationItems, item]
    }));

    setNewEducationItem({
      title: "",
      description: "",
      progress: 0,
      category: "",
      completed: false,
    });

    toast.success("Education item added!");
  };

  const deleteEducationItem = (id: string) => {
    setSettings(prev => ({
      ...prev,
      educationItems: prev.educationItems.filter(item => item.id !== id)
    }));
    toast.success("Education item deleted!");
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
          <h1 className="text-4xl font-bold">Pengaturan</h1>
          <p className="text-muted-foreground mt-2">
            Sesuaikan situs web portofolio Anda
          </p>
        </div>
      </section>
      
      <section className="py-16 px-6 md:px-12">
        <div className="container">
          <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
            <Tabs defaultValue="general" className="w-full">
              <TabsList className="grid w-full grid-cols-6">
                <TabsTrigger value="general">Umum</TabsTrigger>
                <TabsTrigger value="social">Sosial</TabsTrigger>
                <TabsTrigger value="education">Pendidikan</TabsTrigger>
                <TabsTrigger value="features">Fitur</TabsTrigger>
                <TabsTrigger value="appearance">Tampilan</TabsTrigger>
                <TabsTrigger value="theme">Tema</TabsTrigger>
              </TabsList>

              <TabsContent value="general" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Pengaturan Umum</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="siteName">Nama Situs</Label>
                        <Input
                          id="siteName"
                          name="siteName"
                          value={settings.siteName}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="ownerName">Nama Anda</Label>
                        <Input
                          id="ownerName"
                          name="ownerName"
                          value={settings.ownerName}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="aboutText">Teks Tentang</Label>
                      <Textarea
                        id="aboutText"
                        name="aboutText"
                        value={settings.aboutText}
                        onChange={handleInputChange}
                        rows={5}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="contactEmail">Email Kontak</Label>
                      <Input
                        id="contactEmail"
                        name="contactEmail"
                        type="email"
                        value={settings.contactEmail}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="social" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Sosial Media & Donasi</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="social.github">GitHub</Label>
                        <Input
                          id="social.github"
                          name="social.github"
                          value={settings.social.github || ""}
                          onChange={handleInputChange}
                          placeholder="https://github.com/yourusername"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="social.twitter">Twitter</Label>
                        <Input
                          id="social.twitter"
                          name="social.twitter"
                          value={settings.social.twitter || ""}
                          onChange={handleInputChange}
                          placeholder="https://twitter.com/yourusername"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="social.linkedin">LinkedIn</Label>
                        <Input
                          id="social.linkedin"
                          name="social.linkedin"
                          value={settings.social.linkedin || ""}
                          onChange={handleInputChange}
                          placeholder="https://linkedin.com/in/yourusername"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="social.instagram">Instagram</Label>
                        <Input
                          id="social.instagram"
                          name="social.instagram"
                          value={settings.social.instagram || ""}
                          onChange={handleInputChange}
                          placeholder="https://instagram.com/yourusername"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                      <div className="space-y-2">
                        <Label htmlFor="saweria.username">Username Saweria</Label>
                        <Input
                          id="saweria.username"
                          name="saweria.username"
                          value={settings.saweria.username}
                          onChange={handleInputChange}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="saweria.url">URL Saweria</Label>
                        <Input
                          id="saweria.url"
                          name="saweria.url"
                          value={settings.saweria.url}
                          onChange={handleInputChange}
                          placeholder="https://saweria.co/yourusername"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="education" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Rencana Pendidikan</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <input
                        id="showEducationRoadmap"
                        name="showEducationRoadmap"
                        type="checkbox"
                        checked={settings.showEducationRoadmap}
                        onChange={handleInputChange}
                        className="rounded"
                      />
                      <Label htmlFor="showEducationRoadmap">Tampilkan Rencana Pendidikan</Label>
                    </div>

                    {settings.showEducationRoadmap && (
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Tambahkan Item Baru</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <Input
                            placeholder="Judul"
                            value={newEducationItem.title || ""}
                            onChange={(e) => setNewEducationItem(prev => ({ ...prev, title: e.target.value }))}
                          />
                          <Input
                            placeholder="Kategori"
                            value={newEducationItem.category || ""}
                            onChange={(e) => setNewEducationItem(prev => ({ ...prev, category: e.target.value }))}
                          />
                        </div>
                        <Textarea
                          placeholder="Deskripsi"
                          value={newEducationItem.description || ""}
                          onChange={(e) => setNewEducationItem(prev => ({ ...prev, description: e.target.value }))}
                        />
                        <div className="flex items-center space-x-4">
                          <div className="space-y-2">
                            <Label>Progres (%)</Label>
                            <Input
                              type="number"
                              min="0"
                              max="100"
                              value={newEducationItem.progress || 0}
                              onChange={(e) => setNewEducationItem(prev => ({ ...prev, progress: parseInt(e.target.value) }))}
                            />
                          </div>
                          <div className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={newEducationItem.completed || false}
                              onChange={(e) => setNewEducationItem(prev => ({ ...prev, completed: e.target.checked }))}
                              className="rounded"
                            />
                            <Label>Selesai</Label>
                          </div>
                          <Button type="button" onClick={addEducationItem}>
                            <Plus className="h-4 w-4 mr-2" />
                            Tambahkan Item
                          </Button>
                        </div>

                        <div className="space-y-4">
                          <h3 className="text-lg font-medium">Item Saat Ini</h3>
                          {settings.educationItems.map((item) => (
                            <div key={item.id} className="border rounded-lg p-4 space-y-2">
                              {editingEducation === item.id ? (
                                <div className="space-y-2">
                                  <Input
                                    value={item.title}
                                    onChange={(e) => handleEducationItemChange(item.id, 'title', e.target.value)}
                                  />
                                  <Input
                                    value={item.category}
                                    onChange={(e) => handleEducationItemChange(item.id, 'category', e.target.value)}
                                  />
                                  <Textarea
                                    value={item.description}
                                    onChange={(e) => handleEducationItemChange(item.id, 'description', e.target.value)}
                                  />
                                  <div className="flex items-center space-x-4">
                                    <Input
                                      type="number"
                                      min="0"
                                      max="100"
                                      value={item.progress}
                                      onChange={(e) => handleEducationItemChange(item.id, 'progress', parseInt(e.target.value))}
                                    />
                                    <div className="flex items-center space-x-2">
                                      <input
                                        type="checkbox"
                                        checked={item.completed}
                                        onChange={(e) => handleEducationItemChange(item.id, 'completed', e.target.checked)}
                                        className="rounded"
                                      />
                                      <Label>Selesai</Label>
                                    </div>
                                    <Button size="sm" onClick={() => setEditingEducation(null)}>
                                      <Save className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>
                              ) : (
                                <div className="flex justify-between items-start">
                                  <div>
                                    <h4 className="font-medium">{item.title}</h4>
                                    <p className="text-sm text-muted-foreground">{item.category}</p>
                                    <p className="text-sm">{item.description}</p>
                                    <p className="text-sm">Progres: {item.progress}% {item.completed && "(Selesai)"}</p>
                                  </div>
                                  <div className="flex space-x-2">
                                    <Button size="sm" variant="outline" onClick={() => setEditingEducation(item.id)}>
                                      <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button size="sm" variant="destructive" onClick={() => deleteEducationItem(item.id)}>
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="features" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Konfigurasi Fitur</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Fitur Proyek</h3>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label>Enable Download Feature</Label>
                            <input type="checkbox" defaultChecked className="rounded" />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label>Enable Paid Downloads</Label>
                            <input type="checkbox" defaultChecked className="rounded" />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label>Show Source Code Links</Label>
                            <input type="checkbox" defaultChecked className="rounded" />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">File Manager</h3>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label>Enable File Upload</Label>
                            <input type="checkbox" defaultChecked className="rounded" />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label>Enable URL Generator</Label>
                            <input type="checkbox" defaultChecked className="rounded" />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label>Enable REST API</Label>
                            <input type="checkbox" defaultChecked className="rounded" />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Short Links</h3>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label>Enable Short Link Generator</Label>
                            <input type="checkbox" defaultChecked className="rounded" />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label>Enable Click Tracking</Label>
                            <input type="checkbox" defaultChecked className="rounded" />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Animations</h3>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label>Enable Typing Animation</Label>
                            <input type="checkbox" defaultChecked className="rounded" />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label>Enable Fade-in Animation</Label>
                            <input type="checkbox" defaultChecked className="rounded" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="appearance" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Pengaturan Tampilan</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="backgroundImage">Gambar Latar Belakang</Label>
                      <Input
                        id="backgroundImage"
                        name="backgroundImage"
                        value={settings.backgroundImage}
                        onChange={handleInputChange}
                        placeholder="mountain-1.jpg"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Pengaturan Tema</Label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center justify-between">
                          <Label>Mode Gelap</Label>
                          <input type="checkbox" className="rounded" />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label>Auto Tema</Label>
                          <input type="checkbox" defaultChecked className="rounded" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="theme" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Pengaturan Tema</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <Label className="text-base font-medium">Pilih Tema</Label>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div 
                          className={`p-4 border rounded-lg cursor-pointer transition-all ${theme === 'light' ? 'border-primary bg-primary/5' : 'border-border'}`}
                          onClick={() => setTheme('light')}
                        >
                          <div className="flex items-center space-x-2">
                            <Sun className="h-5 w-5" />
                            <span className="font-medium">Terang</span>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            Tema terang untuk penggunaan siang hari
                          </p>
                        </div>
                        
                        <div 
                          className={`p-4 border rounded-lg cursor-pointer transition-all ${theme === 'dark' ? 'border-primary bg-primary/5' : 'border-border'}`}
                          onClick={() => setTheme('dark')}
                        >
                          <div className="flex items-center space-x-2">
                            <Moon className="h-5 w-5" />
                            <span className="font-medium">Gelap</span>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            Tema gelap untuk penggunaan malam hari
                          </p>
                        </div>
                        
                        <div 
                          className={`p-4 border rounded-lg cursor-pointer transition-all ${theme === 'auto' ? 'border-primary bg-primary/5' : 'border-border'}`}
                          onClick={() => setTheme('auto')}
                        >
                          <div className="flex items-center space-x-2">
                            <Monitor className="h-5 w-5" />
                            <span className="font-medium">Otomatis</span>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            Mengikuti pengaturan sistem
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            <div className="mt-8 flex justify-end">
              <Button type="submit" className="btn-primary">
                Simpan Semua Pengaturan
              </Button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Settings;

</edits_to_apply>
