
export interface FeatureConfig {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  settings?: Record<string, any>;
}

export interface ProjectFeatureConfig {
  downloadEnabled: boolean;
  paidDownloadsEnabled: boolean;
  sourceCodeLinksEnabled: boolean;
  downloadButtonText: string;
  buyButtonText: string;
}

export interface FileManagerConfig {
  uploadEnabled: boolean;
  urlGeneratorEnabled: boolean;
  restApiEnabled: boolean;
  maxFileSize: number; // in MB
  allowedFileTypes: string[];
  gridViewDefault: boolean;
}

export interface ShortLinkConfig {
  generatorEnabled: boolean;
  clickTrackingEnabled: boolean;
  customDomainEnabled: boolean;
  analyticsEnabled: boolean;
  defaultDomain: string;
}

export interface AnimationConfig {
  typingAnimationEnabled: boolean;
  fadeInAnimationEnabled: boolean;
  typingSpeed: number;
  fadeInDuration: number;
}

export interface ThemeConfig {
  darkModeEnabled: boolean;
  autoThemeEnabled: boolean;
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
}

export interface AppConfig {
  projects: ProjectFeatureConfig;
  fileManager: FileManagerConfig;
  shortLinks: ShortLinkConfig;
  animations: AnimationConfig;
  theme: ThemeConfig;
  features: FeatureConfig[];
}
