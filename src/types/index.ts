
export interface Project {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  githubUrl?: string;
  liveUrl?: string;
  featured: boolean;
  // New download features
  downloadType: 'free' | 'paid';
  downloadUrl?: string;
  price?: number;
  sourceVisible: boolean;
}

export interface SiteSettings {
  siteName: string;
  ownerName: string;
  displayName: string;
  fullName: string;
  profession: string;
  company: string;
  location: string;
  aboutText: string;
  contactEmail: string;
  phoneNumber: string;
  social: {
    github?: string;
    twitter?: string;
    linkedin?: string;
    instagram?: string;
  };
  backgroundImage: string;
  saweria: {
    username: string;
    url: string;
  };
  // New education roadmap settings
  showEducationRoadmap: boolean;
  educationItems: EducationItem[];
  // Server configuration
  serverConfig: {
    storageType: 'json' | 'database';
    serverUrl: string;
    apiKey: string;
  };
}

export interface Skill {
  id: string;
  name: string;
  level: number;
  category: string;
  icon: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
  read: boolean;
}

// New types for additional features
export interface EducationItem {
  id: string;
  title: string;
  description: string;
  progress: number;
  category: string;
  completed: boolean;
}

export interface FileItem {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  uploadedAt: string;
  downloadCount: number;
}

export interface ShortLink {
  id: string;
  originalUrl: string;
  shortCode: string;
  title: string;
  clickCount: number;
  createdAt: string;
  active: boolean;
}
