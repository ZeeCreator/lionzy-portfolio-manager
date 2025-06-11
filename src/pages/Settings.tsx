
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/sonner";
import { 
  Settings as SettingsIcon, 
  User, 
  Bell, 
  Shield, 
  Palette, 
  Save,
  Download,
  Upload,
  Link,
  Database,
  Monitor,
  Moon,
  Sun
} from "lucide-react";
import { getAppConfig, updateAppConfig, updateFeatureConfig } from "@/utils/configService";
import { getSettings, updateSettings } from "@/utils/settingsService";
import { AppConfig } from "@/types/config";
import { SiteSettings } from "@/types";
import { ThemeToggle } from "@/components/ui/theme-toggle";

const Settings = () => {
  const [config, setConfig] = useState<AppConfig | null>(null);
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = () => {
    try {
      const appConfig = getAppConfig();
      const settings = getSettings();
      setConfig(appConfig);
      setSiteSettings(settings);
    } catch (error) {
      toast.error("Gagal memuat konfigurasi");
    } finally {
      setLoading(false);
    }
  };

  const handleFeatureToggle = (featureId: string, enabled: boolean) => {
    try {
      const updatedConfig = updateFeatureConfig(featureId, enabled);
      setConfig(updatedConfig);
      toast.success(enabled ? "Fitur diaktifkan" : "Fitur dinonaktifkan");
    } catch (error) {
      toast.error("Gagal memperbarui konfigurasi");
    }
  };

  const handleConfigUpdate = (section: keyof AppConfig, updates: any) => {
    if (!config) return;

    try {
      const updatedConfig = updateAppConfig({
        [section]: { ...config[section], ...updates }
      });
      setConfig(updatedConfig);
      toast.success("Konfigurasi berhasil diperbarui");
    } catch (error) {
      toast.error("Gagal memperbarui konfigurasi");
    }
  };

  const handleSiteSettingsUpdate = (updates: Partial<SiteSettings>) => {
    if (!siteSettings) return;

    try {
      const updatedSettings = updateSettings(updates);
      setSiteSettings(updatedSettings);
      toast.success("Pengaturan berhasil diperbarui");
    } catch (error) {
      toast.error("Gagal memperbarui pengaturan");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Memuat pengaturan...</p>
        </div>
      </div>
    );
  }

  if (!config || !siteSettings) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Gagal memuat konfigurasi</p>
          <Button onClick={loadConfig} className="mt-4">
            Coba Lagi
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container py-16 px-6">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="p-3 bg-primary/10 rounded-full">
                <SettingsIcon className="h-8 w-8 text-primary" />
              </div>
            </div>
            <h1 className="text-4xl font-bold">Pengaturan Aplikasi</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Kelola konfigurasi dan fitur aplikasi sesuai kebutuhan Anda
            </p>
          </div>

          {/* Profile & About Settings */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Pengaturan Profil & Tentang
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="siteName">Nama Situs</Label>
                  <Input
                    id="siteName"
                    value={siteSettings.siteName}
                    onChange={(e) => handleSiteSettingsUpdate({ siteName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ownerName">Nama Pemilik</Label>
                  <Input
                    id="ownerName"
                    value={siteSettings.ownerName}
                    onChange={(e) => handleSiteSettingsUpdate({ ownerName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="displayName">Nama Tampilan</Label>
                  <Input
                    id="displayName"
                    value={siteSettings.displayName}
                    onChange={(e) => handleSiteSettingsUpdate({ displayName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fullName">Nama Lengkap</Label>
                  <Input
                    id="fullName"
                    value={siteSettings.fullName}
                    onChange={(e) => handleSiteSettingsUpdate({ fullName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="profession">Profesi</Label>
                  <Input
                    id="profession"
                    value={siteSettings.profession}
                    onChange={(e) => handleSiteSettingsUpdate({ profession: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company">Perusahaan</Label>
                  <Input
                    id="company"
                    value={siteSettings.company}
                    onChange={(e) => handleSiteSettingsUpdate({ company: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Lokasi</Label>
                  <Input
                    id="location"
                    value={siteSettings.location}
                    onChange={(e) => handleSiteSettingsUpdate({ location: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactEmail">Email Kontak</Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    value={siteSettings.contactEmail}
                    onChange={(e) => handleSiteSettingsUpdate({ contactEmail: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Nomor Telepon</Label>
                  <Input
                    id="phoneNumber"
                    value={siteSettings.phoneNumber}
                    onChange={(e) => handleSiteSettingsUpdate({ phoneNumber: e.target.value })}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="aboutText">Tentang Saya</Label>
                <Textarea
                  id="aboutText"
                  value={siteSettings.aboutText}
                  onChange={(e) => handleSiteSettingsUpdate({ aboutText: e.target.value })}
                  rows={4}
                />
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="github">GitHub URL</Label>
                  <Input
                    id="github"
                    value={siteSettings.social.github || ''}
                    onChange={(e) => handleSiteSettingsUpdate({ 
                      social: { ...siteSettings.social, github: e.target.value }
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="linkedin">LinkedIn URL</Label>
                  <Input
                    id="linkedin"
                    value={siteSettings.social.linkedin || ''}
                    onChange={(e) => handleSiteSettingsUpdate({ 
                      social: { ...siteSettings.social, linkedin: e.target.value }
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="twitter">Twitter URL</Label>
                  <Input
                    id="twitter"
                    value={siteSettings.social.twitter || ''}
                    onChange={(e) => handleSiteSettingsUpdate({ 
                      social: { ...siteSettings.social, twitter: e.target.value }
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="instagram">Instagram URL</Label>
                  <Input
                    id="instagram"
                    value={siteSettings.social.instagram || ''}
                    onChange={(e) => handleSiteSettingsUpdate({ 
                      social: { ...siteSettings.social, instagram: e.target.value }
                    })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Theme Settings */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Pengaturan Tema
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base font-medium">Pengalih Tema</Label>
                  <p className="text-sm text-muted-foreground">
                    Aktifkan pengalih tema gelap/terang/otomatis
                  </p>
                </div>
                <ThemeToggle />
              </div>
            </CardContent>
          </Card>

          {/* Feature Management */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Manajemen Fitur
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {config.features.map((feature) => (
                <div key={feature.id} className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Label className="text-base font-medium">{feature.name}</Label>
                      <Badge variant={feature.enabled ? "default" : "secondary"}>
                        {feature.enabled ? "Aktif" : "Nonaktif"}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                  <Switch
                    checked={feature.enabled}
                    onCheckedChange={(checked) => handleFeatureToggle(feature.id, checked)}
                  />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Project Settings */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Pengaturan Proyek
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="downloadButton">Teks Tombol Unduh</Label>
                  <Input
                    id="downloadButton"
                    value={config.projects.downloadButtonText}
                    onChange={(e) => handleConfigUpdate('projects', { downloadButtonText: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="buyButton">Teks Tombol Beli</Label>
                  <Input
                    id="buyButton"
                    value={config.projects.buyButtonText}
                    onChange={(e) => handleConfigUpdate('projects', { buyButtonText: e.target.value })}
                  />
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">Unduhan Diaktifkan</Label>
                    <p className="text-sm text-muted-foreground">
                      Aktifkan fitur unduhan untuk proyek
                    </p>
                  </div>
                  <Switch
                    checked={config.projects.downloadEnabled}
                    onCheckedChange={(checked) => handleConfigUpdate('projects', { downloadEnabled: checked })}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">Unduhan Berbayar</Label>
                    <p className="text-sm text-muted-foreground">
                      Aktifkan fitur unduhan berbayar
                    </p>
                  </div>
                  <Switch
                    checked={config.projects.paidDownloadsEnabled}
                    onCheckedChange={(checked) => handleConfigUpdate('projects', { paidDownloadsEnabled: checked })}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">Tautan Source Code</Label>
                    <p className="text-sm text-muted-foreground">
                      Tampilkan tautan ke source code proyek
                    </p>
                  </div>
                  <Switch
                    checked={config.projects.sourceCodeLinksEnabled}
                    onCheckedChange={(checked) => handleConfigUpdate('projects', { sourceCodeLinksEnabled: checked })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* File Manager Settings */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Pengaturan Pengelola File
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="maxFileSize">Ukuran File Maksimal (MB)</Label>
                  <Input
                    id="maxFileSize"
                    type="number"
                    value={config.fileManager.maxFileSize}
                    onChange={(e) => handleConfigUpdate('fileManager', { maxFileSize: parseInt(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="allowedTypes">Jenis File yang Diizinkan</Label>
                  <Input
                    id="allowedTypes"
                    value={config.fileManager.allowedFileTypes.join(', ')}
                    onChange={(e) => handleConfigUpdate('fileManager', { allowedFileTypes: e.target.value.split(', ') })}
                    placeholder="jpg, png, pdf, atau * untuk semua"
                  />
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">Unggah File</Label>
                    <p className="text-sm text-muted-foreground">
                      Aktifkan fitur unggah file
                    </p>
                  </div>
                  <Switch
                    checked={config.fileManager.uploadEnabled}
                    onCheckedChange={(checked) => handleConfigUpdate('fileManager', { uploadEnabled: checked })}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">Generator URL</Label>
                    <p className="text-sm text-muted-foreground">
                      Aktifkan generator URL untuk file
                    </p>
                  </div>
                  <Switch
                    checked={config.fileManager.urlGeneratorEnabled}
                    onCheckedChange={(checked) => handleConfigUpdate('fileManager', { urlGeneratorEnabled: checked })}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">REST API</Label>
                    <p className="text-sm text-muted-foreground">
                      Aktifkan REST API untuk file
                    </p>
                  </div>
                  <Switch
                    checked={config.fileManager.restApiEnabled}
                    onCheckedChange={(checked) => handleConfigUpdate('fileManager', { restApiEnabled: checked })}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">Tampilan Grid Default</Label>
                    <p className="text-sm text-muted-foreground">
                      Gunakan tampilan grid sebagai default
                    </p>
                  </div>
                  <Switch
                    checked={config.fileManager.gridViewDefault}
                    onCheckedChange={(checked) => handleConfigUpdate('fileManager', { gridViewDefault: checked })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Short Links Settings */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Link className="h-5 w-5" />
                Pengaturan Tautan Pendek
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="defaultDomain">Domain Default</Label>
                <Input
                  id="defaultDomain"
                  value={config.shortLinks.defaultDomain}
                  onChange={(e) => handleConfigUpdate('shortLinks', { defaultDomain: e.target.value })}
                />
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">Generator Tautan</Label>
                    <p className="text-sm text-muted-foreground">
                      Aktifkan generator tautan pendek
                    </p>
                  </div>
                  <Switch
                    checked={config.shortLinks.generatorEnabled}
                    onCheckedChange={(checked) => handleConfigUpdate('shortLinks', { generatorEnabled: checked })}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">Pelacakan Klik</Label>
                    <p className="text-sm text-muted-foreground">
                      Aktifkan pelacakan klik untuk tautan
                    </p>
                  </div>
                  <Switch
                    checked={config.shortLinks.clickTrackingEnabled}
                    onCheckedChange={(checked) => handleConfigUpdate('shortLinks', { clickTrackingEnabled: checked })}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">Domain Kustom</Label>
                    <p className="text-sm text-muted-foreground">
                      Aktifkan dukungan domain kustom
                    </p>
                  </div>
                  <Switch
                    checked={config.shortLinks.customDomainEnabled}
                    onCheckedChange={(checked) => handleConfigUpdate('shortLinks', { customDomainEnabled: checked })}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">Analitik</Label>
                    <p className="text-sm text-muted-foreground">
                      Aktifkan fitur analitik untuk tautan
                    </p>
                  </div>
                  <Switch
                    checked={config.shortLinks.analyticsEnabled}
                    onCheckedChange={(checked) => handleConfigUpdate('shortLinks', { analyticsEnabled: checked })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Animation Settings */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Monitor className="h-5 w-5" />
                Pengaturan Animasi
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="typingSpeed">Kecepatan Mengetik (ms)</Label>
                  <Input
                    id="typingSpeed"
                    type="number"
                    value={config.animations.typingSpeed}
                    onChange={(e) => handleConfigUpdate('animations', { typingSpeed: parseInt(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fadeInDuration">Durasi Fade In (ms)</Label>
                  <Input
                    id="fadeInDuration"
                    type="number"
                    value={config.animations.fadeInDuration}
                    onChange={(e) => handleConfigUpdate('animations', { fadeInDuration: parseInt(e.target.value) })}
                  />
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">Animasi Mengetik</Label>
                    <p className="text-sm text-muted-foreground">
                      Aktifkan animasi efek mengetik
                    </p>
                  </div>
                  <Switch
                    checked={config.animations.typingAnimationEnabled}
                    onCheckedChange={(checked) => handleConfigUpdate('animations', { typingAnimationEnabled: checked })}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">Animasi Fade In</Label>
                    <p className="text-sm text-muted-foreground">
                      Aktifkan animasi fade in untuk elemen
                    </p>
                  </div>
                  <Switch
                    checked={config.animations.fadeInAnimationEnabled}
                    onCheckedChange={(checked) => handleConfigUpdate('animations', { fadeInAnimationEnabled: checked })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Save Configuration */}
          <div className="flex justify-center">
            <Button 
              onClick={() => toast.success("Konfigurasi tersimpan otomatis")}
              size="lg"
              className="min-w-[200px]"
            >
              <Save className="h-4 w-4 mr-2" />
              Simpan Perubahan
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
