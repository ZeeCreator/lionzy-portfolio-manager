import { AppConfig, FeatureConfig } from "@/types/config";

const CONFIG_STORAGE_KEY = "lionzy_app_config";

const defaultFeatures: FeatureConfig[] = [
  {
    id: "projects",
    name: "Pengelolaan Proyek",
    description: "Kelola dan tampilkan proyek Anda",
    enabled: true,
  },
  {
    id: "file-manager",
    name: "Pengelola File",
    description: "Unggah, kelola, dan bagikan file",
    enabled: true,
  },
  {
    id: "short-links",
    name: "Generator Tautan Pendek",
    description: "Buat dan kelola tautan pendek",
    enabled: true,
  },
  {
    id: "education-roadmap",
    name: "Peta Jalan Pendidikan",
    description: "Tampilkan kemajuan belajar dan peta jalan",
    enabled: true,
  },
  {
    id: "contact-form",
    name: "Formulir Kontak",
    description: "Aktifkan fungsi formulir kontak",
    enabled: true,
  },
  {
    id: "animations",
    name: "Animasi Halaman",
    description: "Aktifkan berbagai animasi halaman",
    enabled: true,
  },
  {
    id: "theme-toggle",
    name: "Pengalih Tema",
    description: "Aktifkan pengalih tema gelap/terang/otomatis",
    enabled: true,
  },
];

const defaultConfig: AppConfig = {
  projects: {
    downloadEnabled: true,
    paidDownloadsEnabled: true,
    sourceCodeLinksEnabled: true,
    downloadButtonText: "Unduh",
    buyButtonText: "Beli Sekarang",
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
    defaultDomain: typeof window !== 'undefined' ? window.location.origin : '',
  },
  animations: {
    typingAnimationEnabled: true,
    fadeInAnimationEnabled: true,
    typingSpeed: 100,
    fadeInDuration: 1000,
  },
  theme: {
    darkModeEnabled: true,
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
