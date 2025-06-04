import { useState, useEffect } from "react";
import { getAppConfig, updateAppConfig, updateFeatureConfig } from "@/utils/configService";
import { AppConfig } from "@/types/config";
import { toast } from "@/components/ui/sonner";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { 
  Settings, 
  Download, 
  FileText, 
  Link, 
  Palette,
  Database,
  Globe,
  Upload,
  Eye,
  Zap
} from "lucide-react";

const Configuration = () => {
  const [config, setConfig] = useState<AppConfig>(getAppConfig());

  useEffect(() => {
    const storedConfig = getAppConfig();
    setConfig(storedConfig);
  }, []);

  const handleConfigUpdate = (section: keyof AppConfig, updates: any) => {
    const newConfig = {
      ...config,
      [section]: { ...config[section], ...updates },
    };
    setConfig(newConfig);
    updateAppConfig({ [section]: newConfig[section] });
    toast.success("Configuration updated!");
  };

  const handleFeatureToggle = (featureId: string, enabled: boolean) => {
    updateFeatureConfig(featureId, enabled);
    setConfig(prev => ({
      ...prev,
      features: prev.features.map(f => 
        f.id === featureId ? { ...f, enabled } : f
      )
    }));
    toast.success(`Feature ${enabled ? 'enabled' : 'disabled'}!`);
  };

  const saveAllConfig = () => {
    updateAppConfig(config);
    toast.success("All configurations saved successfully!");
  };

  return (
    <div className="min-h-screen">
      <section className="py-20 px-6 md:px-12 bg-secondary/50">
        <div className="container">
          <div className="flex items-center space-x-3">
            <Settings className="h-8 w-8" />
            <div>
              <h1 className="text-4xl font-bold">Configuration</h1>
              <p className="text-muted-foreground mt-2">
                Configure all features and settings for your portfolio
              </p>
            </div>
          </div>
        </div>
      </section>
      
      <section className="py-16 px-6 md:px-12">
        <div className="container">
          <div className="max-w-6xl mx-auto">
            <Tabs defaultValue="features" className="w-full">
              <TabsList className="grid w-full grid-cols-6">
                <TabsTrigger value="features">Features</TabsTrigger>
                <TabsTrigger value="projects">Projects</TabsTrigger>
                <TabsTrigger value="filemanager">Files</TabsTrigger>
                <TabsTrigger value="shortlinks">Links</TabsTrigger>
                <TabsTrigger value="animations">Animations</TabsTrigger>
                <TabsTrigger value="theme">Theme</TabsTrigger>
              </TabsList>

              <TabsContent value="features" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Zap className="h-5 w-5" />
                      <span>Feature Management</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {config.features.map((feature) => (
                        <div key={feature.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <h3 className="font-medium">{feature.name}</h3>
                            <p className="text-sm text-muted-foreground">{feature.description}</p>
                          </div>
                          <Switch
                            checked={feature.enabled}
                            onCheckedChange={(checked) => handleFeatureToggle(feature.id, checked)}
                          />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="projects" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Download className="h-5 w-5" />
                      <span>Project Configuration</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Download Settings</h3>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <Label>Enable Downloads</Label>
                            <Switch
                              checked={config.projects.downloadEnabled}
                              onCheckedChange={(checked) => 
                                handleConfigUpdate('projects', { downloadEnabled: checked })
                              }
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label>Enable Paid Downloads</Label>
                            <Switch
                              checked={config.projects.paidDownloadsEnabled}
                              onCheckedChange={(checked) => 
                                handleConfigUpdate('projects', { paidDownloadsEnabled: checked })
                              }
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label>Show Source Code Links</Label>
                            <Switch
                              checked={config.projects.sourceCodeLinksEnabled}
                              onCheckedChange={(checked) => 
                                handleConfigUpdate('projects', { sourceCodeLinksEnabled: checked })
                              }
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Button Text</h3>
                        <div className="space-y-3">
                          <div className="space-y-2">
                            <Label>Download Button Text</Label>
                            <Input
                              value={config.projects.downloadButtonText}
                              onChange={(e) => 
                                handleConfigUpdate('projects', { downloadButtonText: e.target.value })
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Buy Button Text</Label>
                            <Input
                              value={config.projects.buyButtonText}
                              onChange={(e) => 
                                handleConfigUpdate('projects', { buyButtonText: e.target.value })
                              }
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="filemanager" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <FileText className="h-5 w-5" />
                      <span>File Manager Configuration</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Core Features</h3>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <Label>Enable File Upload</Label>
                            <Switch
                              checked={config.fileManager.uploadEnabled}
                              onCheckedChange={(checked) => 
                                handleConfigUpdate('fileManager', { uploadEnabled: checked })
                              }
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label>Enable URL Generator</Label>
                            <Switch
                              checked={config.fileManager.urlGeneratorEnabled}
                              onCheckedChange={(checked) => 
                                handleConfigUpdate('fileManager', { urlGeneratorEnabled: checked })
                              }
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label>Enable REST API</Label>
                            <Switch
                              checked={config.fileManager.restApiEnabled}
                              onCheckedChange={(checked) => 
                                handleConfigUpdate('fileManager', { restApiEnabled: checked })
                              }
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label>Grid View by Default</Label>
                            <Switch
                              checked={config.fileManager.gridViewDefault}
                              onCheckedChange={(checked) => 
                                handleConfigUpdate('fileManager', { gridViewDefault: checked })
                              }
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Upload Settings</h3>
                        <div className="space-y-3">
                          <div className="space-y-2">
                            <Label>Max File Size (MB)</Label>
                            <Input
                              type="number"
                              value={config.fileManager.maxFileSize}
                              onChange={(e) => 
                                handleConfigUpdate('fileManager', { maxFileSize: parseInt(e.target.value) })
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Allowed File Types (comma separated)</Label>
                            <Input
                              value={config.fileManager.allowedFileTypes.join(', ')}
                              onChange={(e) => 
                                handleConfigUpdate('fileManager', { 
                                  allowedFileTypes: e.target.value.split(',').map(t => t.trim()) 
                                })
                              }
                              placeholder="jpg, png, pdf, * (for all types)"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="shortlinks" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Link className="h-5 w-5" />
                      <span>Short Links Configuration</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Features</h3>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <Label>Enable Generator</Label>
                            <Switch
                              checked={config.shortLinks.generatorEnabled}
                              onCheckedChange={(checked) => 
                                handleConfigUpdate('shortLinks', { generatorEnabled: checked })
                              }
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label>Enable Click Tracking</Label>
                            <Switch
                              checked={config.shortLinks.clickTrackingEnabled}
                              onCheckedChange={(checked) => 
                                handleConfigUpdate('shortLinks', { clickTrackingEnabled: checked })
                              }
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label>Enable Analytics</Label>
                            <Switch
                              checked={config.shortLinks.analyticsEnabled}
                              onCheckedChange={(checked) => 
                                handleConfigUpdate('shortLinks', { analyticsEnabled: checked })
                              }
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label>Custom Domain</Label>
                            <Switch
                              checked={config.shortLinks.customDomainEnabled}
                              onCheckedChange={(checked) => 
                                handleConfigUpdate('shortLinks', { customDomainEnabled: checked })
                              }
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Domain Settings</h3>
                        <div className="space-y-3">
                          <div className="space-y-2">
                            <Label>Default Domain</Label>
                            <Input
                              value={config.shortLinks.defaultDomain}
                              onChange={(e) => 
                                handleConfigUpdate('shortLinks', { defaultDomain: e.target.value })
                              }
                              placeholder="https://your-domain.com"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="animations" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Zap className="h-5 w-5" />
                      <span>Animation Configuration</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Enable Animations</h3>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <Label>Typing Animation</Label>
                            <Switch
                              checked={config.animations.typingAnimationEnabled}
                              onCheckedChange={(checked) => 
                                handleConfigUpdate('animations', { typingAnimationEnabled: checked })
                              }
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label>Fade-in Animation</Label>
                            <Switch
                              checked={config.animations.fadeInAnimationEnabled}
                              onCheckedChange={(checked) => 
                                handleConfigUpdate('animations', { fadeInAnimationEnabled: checked })
                              }
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Animation Settings</h3>
                        <div className="space-y-3">
                          <div className="space-y-2">
                            <Label>Typing Speed (ms per character)</Label>
                            <Input
                              type="number"
                              value={config.animations.typingSpeed}
                              onChange={(e) => 
                                handleConfigUpdate('animations', { typingSpeed: parseInt(e.target.value) })
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Fade-in Duration (ms)</Label>
                            <Input
                              type="number"
                              value={config.animations.fadeInDuration}
                              onChange={(e) => 
                                handleConfigUpdate('animations', { fadeInDuration: parseInt(e.target.value) })
                              }
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="theme" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Palette className="h-5 w-5" />
                      <span>Theme Configuration</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Theme Settings</h3>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <Label>Dark Mode</Label>
                            <Switch
                              checked={config.theme.darkModeEnabled}
                              onCheckedChange={(checked) => 
                                handleConfigUpdate('theme', { darkModeEnabled: checked })
                              }
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label>Auto Theme</Label>
                            <Switch
                              checked={config.theme.autoThemeEnabled}
                              onCheckedChange={(checked) => 
                                handleConfigUpdate('theme', { autoThemeEnabled: checked })
                              }
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Colors & Fonts</h3>
                        <div className="space-y-3">
                          <div className="space-y-2">
                            <Label>Primary Color</Label>
                            <Input
                              type="color"
                              value={config.theme.primaryColor}
                              onChange={(e) => 
                                handleConfigUpdate('theme', { primaryColor: e.target.value })
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Secondary Color</Label>
                            <Input
                              type="color"
                              value={config.theme.secondaryColor}
                              onChange={(e) => 
                                handleConfigUpdate('theme', { secondaryColor: e.target.value })
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Font Family</Label>
                            <select 
                              className="w-full px-3 py-2 border border-input bg-background rounded-md"
                              value={config.theme.fontFamily}
                              onChange={(e) => 
                                handleConfigUpdate('theme', { fontFamily: e.target.value })
                              }
                            >
                              <option value="Inter">Inter</option>
                              <option value="Roboto">Roboto</option>
                              <option value="Open Sans">Open Sans</option>
                              <option value="Poppins">Poppins</option>
                              <option value="Montserrat">Montserrat</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            <Separator className="my-8" />

            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-medium">Configuration Management</h3>
                <p className="text-sm text-muted-foreground">
                  Save all your configuration changes
                </p>
              </div>
              <Button onClick={saveAllConfig} className="btn-primary">
                Save All Configurations
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Configuration;
