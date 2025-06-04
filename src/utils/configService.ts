
import { AppConfig, FeatureConfig } from "@/types/config";

const CONFIG_STORAGE_KEY = "lionzy_app_config";

const defaultFeatures: FeatureConfig[] = [
  {
    id: "projects",
    name: "Project Management",
    description: "Manage and showcase your projects",
    enabled: true,
  },
  {
    id: "file-manager",
    name: "File Manager",
    description: "Upload, manage, and share files",
    enabled: true,
  },
  {
    id: "short-links",
    name: "Short Link Generator",
    description: "Create and manage short links",
    enabled: true,
  },
  {
    id: "education-roadmap",
    name: "Education Roadmap",
    description: "Display learning progress and roadmap",
    enabled: true,
  },
  {
    id: "contact-form",
    name: "Contact Form",
    description: "Enable contact form functionality",
    enabled: true,
  },
  {
    id: "animations",
    name: "Page Animations",
    description: "Enable various page animations",
    enabled: true,
  },
];

const defaultConfig: AppConfig = {
  projects: {
    downloadEnabled: true,
    paidDownloadsEnabled: true,
    sourceCodeLinksEnabled: true,
    downloadButtonText: "Download",
    buyButtonText: "Buy Now",
  },
  fileManager: {
    uploadEnabled: true,
    urlGeneratorEnabled: true,
    restApiEnabled: true,
    maxFileSize: 50, // 50MB
    allowedFileTypes: ["*"], // All file types
    gridViewDefault: true,
  },
  shortLinks: {
    generatorEnabled: true,
    clickTrackingEnabled: true,
    customDomainEnabled: false,
    analyticsEnabled: true,
    defaultDomain: window.location.origin,
  },
  animations: {
    typingAnimationEnabled: true,
    fadeInAnimationEnabled: true,
    typingSpeed: 100,
    fadeInDuration: 1000,
  },
  theme: {
    darkModeEnabled: false,
    autoThemeEnabled: true,
    primaryColor: "#3B82F6",
    secondaryColor: "#10B981",
    fontFamily: "Inter",
  },
  features: defaultFeatures,
};

export const getAppConfig = (): AppConfig => {
  if (typeof window === "undefined") return defaultConfig;
  
  const storedConfig = localStorage.getItem(CONFIG_STORAGE_KEY);
  if (!storedConfig) {
    localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(defaultConfig));
    return defaultConfig;
  }
  
  try {
    const config = JSON.parse(storedConfig);
    // Merge with default config to ensure all properties exist
    return {
      ...defaultConfig,
      ...config,
      features: config.features || defaultFeatures,
    };
  } catch (error) {
    console.error("Error parsing app config:", error);
    return defaultConfig;
  }
};

export const updateAppConfig = (updates: Partial<AppConfig>): AppConfig => {
  const currentConfig = getAppConfig();
  const updatedConfig = {
    ...currentConfig,
    ...updates,
  };
  
  localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(updatedConfig));
  return updatedConfig;
};

export const updateFeatureConfig = (featureId: string, enabled: boolean): AppConfig => {
  const currentConfig = getAppConfig();
  const updatedFeatures = currentConfig.features.map(feature =>
    feature.id === featureId ? { ...feature, enabled } : feature
  );
  
  return updateAppConfig({ features: updatedFeatures });
};

export const isFeatureEnabled = (featureId: string): boolean => {
  const config = getAppConfig();
  const feature = config.features.find(f => f.id === featureId);
  return feature ? feature.enabled : false;
};

export const getFeatureConfig = (featureId: string): FeatureConfig | undefined => {
  const config = getAppConfig();
  return config.features.find(f => f.id === featureId);
};
