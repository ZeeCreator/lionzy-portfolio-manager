
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
