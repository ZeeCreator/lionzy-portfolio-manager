
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
}

export interface SiteSettings {
  siteName: string;
  ownerName: string;
  aboutText: string;
  contactEmail: string;
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
