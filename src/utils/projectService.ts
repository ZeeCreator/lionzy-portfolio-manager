
import { Project } from "@/types";
import { storageService } from "./storageService";

const STORAGE_KEY = "lionzy_projects";

// Seed data for initial projects
const initialProjects: Project[] = [
  {
    id: "1",
    title: "Website Portfolio",
    description: "Website portfolio modern yang dibuat dengan React dan Tailwind CSS.",
    imageUrl: "/placeholder.svg",
    tags: ["React", "Tailwind CSS", "TypeScript"],
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
    githubUrl: "https://github.com/",
    liveUrl: "https://example.com",
    featured: true,
    downloadType: 'free',
    downloadUrl: "https://github.com/user/repo/archive/main.zip",
    sourceVisible: true,
  },
  {
    id: "2",
    title: "Dashboard E-commerce",
    description: "Dashboard admin untuk mengelola inventori dan pesanan toko e-commerce.",
    imageUrl: "/placeholder.svg",
    tags: ["React", "Redux", "Material UI"],
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
    githubUrl: "https://github.com/",
    featured: false,
    downloadType: 'paid',
    price: 29.99,
    sourceVisible: false,
  },
  {
    id: "3",
    title: "Aplikasi Cuaca",
    description: "Aplikasi cuaca yang indah dengan prakiraan 7 hari.",
    imageUrl: "/placeholder.svg",
    tags: ["React", "Weather API", "Styled Components"],
    createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
    githubUrl: "https://github.com/",
    liveUrl: "https://example.com",
    featured: true,
    downloadType: 'free',
    downloadUrl: "https://github.com/user/weather-app/archive/main.zip",
    sourceVisible: true,
  },
];

// Load projects from storage
export const getProjects = async (): Promise<Project[]> => {
  try {
    const storedProjects = await storageService.getItem(STORAGE_KEY);
    
    if (!storedProjects) {
      await storageService.setItem(STORAGE_KEY, initialProjects);
      return initialProjects;
    }
    
    // Ensure new fields exist in existing projects
    return storedProjects.map((project: any) => ({
      ...project,
      downloadType: project.downloadType || 'free',
      sourceVisible: project.sourceVisible !== undefined ? project.sourceVisible : true,
    }));
  } catch (error) {
    console.error('Error loading projects:', error);
    return initialProjects;
  }
};

// Synchronous version for components that need immediate data
export const getProjectsSync = (): Project[] => {
  if (typeof window === "undefined") return initialProjects;
  
  try {
    const storedProjects = localStorage.getItem(STORAGE_KEY);
    if (!storedProjects) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialProjects));
      return initialProjects;
    }
    
    const projects = JSON.parse(storedProjects);
    return projects.map((project: any) => ({
      ...project,
      downloadType: project.downloadType || 'free',
      sourceVisible: project.sourceVisible !== undefined ? project.sourceVisible : true,
    }));
  } catch (error) {
    console.error('Error loading projects sync:', error);
    return initialProjects;
  }
};

// Get a single project by ID
export const getProjectById = (id: string): Project | undefined => {
  const projects = getProjectsSync();
  return projects.find(project => project.id === id);
};

// Create a new project
export const createProject = async (project: Omit<Project, "id" | "createdAt" | "updatedAt">): Promise<Project> => {
  const projects = await getProjects();
  const newProject: Project = {
    ...project,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    downloadType: project.downloadType || 'free',
    sourceVisible: project.sourceVisible !== undefined ? project.sourceVisible : true,
  };
  
  const updatedProjects = [...projects, newProject];
  await storageService.setItem(STORAGE_KEY, updatedProjects);
  
  return newProject;
};

// Update an existing project
export const updateProject = async (id: string, updates: Partial<Omit<Project, "id" | "createdAt" | "updatedAt">>): Promise<Project | undefined> => {
  const projects = await getProjects();
  const projectIndex = projects.findIndex(p => p.id === id);
  
  if (projectIndex === -1) return undefined;
  
  const updatedProject: Project = {
    ...projects[projectIndex],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  
  projects[projectIndex] = updatedProject;
  await storageService.setItem(STORAGE_KEY, projects);
  
  return updatedProject;
};

// Delete a project
export const deleteProject = async (id: string): Promise<boolean> => {
  const projects = await getProjects();
  const filteredProjects = projects.filter(p => p.id !== id);
  
  if (filteredProjects.length === projects.length) {
    return false;
  }
  
  await storageService.setItem(STORAGE_KEY, filteredProjects);
  return true;
};

// Sync version for backward compatibility
export const createProjectSync = (project: Omit<Project, "id" | "createdAt" | "updatedAt">): Project => {
  const projects = getProjectsSync();
  const newProject: Project = {
    ...project,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    downloadType: project.downloadType || 'free',
    sourceVisible: project.sourceVisible !== undefined ? project.sourceVisible : true,
  };
  
  const updatedProjects = [...projects, newProject];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedProjects));
  
  return newProject;
};
