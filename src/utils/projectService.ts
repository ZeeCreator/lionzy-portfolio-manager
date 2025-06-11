
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

// Load projects from server storage only
export const getProjects = async (): Promise<Project[]> => {
  try {
    console.log('Loading projects from server...');
    const storedProjects = await storageService.getItem(STORAGE_KEY);
    
    if (!storedProjects) {
      console.log('No projects found on server, initializing with default projects...');
      const success = await storageService.setItem(STORAGE_KEY, initialProjects);
      if (success) {
        return initialProjects;
      } else {
        console.error('Failed to initialize projects on server');
        return [];
      }
    }
    
    // Ensure new fields exist in existing projects
    const projects = storedProjects.map((project: any) => ({
      ...project,
      downloadType: project.downloadType || 'free',
      sourceVisible: project.sourceVisible !== undefined ? project.sourceVisible : true,
    }));
    
    console.log(`Loaded ${projects.length} projects from server`);
    return projects;
  } catch (error) {
    console.error('Error loading projects from server:', error);
    return [];
  }
};

// Get a single project by ID
export const getProjectById = async (id: string): Promise<Project | undefined> => {
  const projects = await getProjects();
  return projects.find(project => project.id === id);
};

// Create a new project
export const createProject = async (project: Omit<Project, "id" | "createdAt" | "updatedAt">): Promise<Project> => {
  console.log('Creating new project...');
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
  const success = await storageService.setItem(STORAGE_KEY, updatedProjects);
  
  if (success) {
    console.log('Project created successfully:', newProject.title);
    return newProject;
  } else {
    throw new Error('Failed to save project to server');
  }
};

// Update an existing project
export const updateProject = async (id: string, updates: Partial<Omit<Project, "id" | "createdAt" | "updatedAt">>): Promise<Project | undefined> => {
  console.log('Updating project:', id);
  const projects = await getProjects();
  const projectIndex = projects.findIndex(p => p.id === id);
  
  if (projectIndex === -1) {
    console.error('Project not found:', id);
    return undefined;
  }
  
  const updatedProject: Project = {
    ...projects[projectIndex],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  
  projects[projectIndex] = updatedProject;
  const success = await storageService.setItem(STORAGE_KEY, projects);
  
  if (success) {
    console.log('Project updated successfully:', updatedProject.title);
    return updatedProject;
  } else {
    throw new Error('Failed to update project on server');
  }
};

// Delete a project
export const deleteProject = async (id: string): Promise<boolean> => {
  console.log('Deleting project:', id);
  const projects = await getProjects();
  const originalLength = projects.length;
  const filteredProjects = projects.filter(p => p.id !== id);
  
  if (filteredProjects.length === originalLength) {
    console.error('Project not found for deletion:', id);
    return false;
  }
  
  const success = await storageService.setItem(STORAGE_KEY, filteredProjects);
  
  if (success) {
    console.log('Project deleted successfully');
    return true;
  } else {
    throw new Error('Failed to delete project from server');
  }
};

// Synchronous version for components that need immediate data (fallback only)
export const getProjectsSync = (): Project[] => {
  console.warn('getProjectsSync is deprecated, use getProjects() instead');
  return [];
};
