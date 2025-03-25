
import { Project } from "@/types";

const STORAGE_KEY = "lionzy_projects";

// Seed data for initial projects
const initialProjects: Project[] = [
  {
    id: "1",
    title: "Portfolio Website",
    description: "A modern portfolio website built with React and Tailwind CSS.",
    imageUrl: "/placeholder.svg",
    tags: ["React", "Tailwind CSS", "TypeScript"],
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
    githubUrl: "https://github.com/",
    liveUrl: "https://example.com",
    featured: true,
  },
  {
    id: "2",
    title: "E-commerce Dashboard",
    description: "Admin dashboard for managing e-commerce store inventory and orders.",
    imageUrl: "/placeholder.svg",
    tags: ["React", "Redux", "Material UI"],
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
    githubUrl: "https://github.com/",
    featured: false,
  },
  {
    id: "3",
    title: "Weather App",
    description: "A beautiful weather application with 7-day forecast.",
    imageUrl: "/placeholder.svg",
    tags: ["React", "Weather API", "Styled Components"],
    createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
    githubUrl: "https://github.com/",
    liveUrl: "https://example.com",
    featured: true,
  },
];

// Load projects from localStorage or use initial data
export const getProjects = (): Project[] => {
  if (typeof window === "undefined") return initialProjects;
  
  const storedProjects = localStorage.getItem(STORAGE_KEY);
  if (!storedProjects) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialProjects));
    return initialProjects;
  }
  
  return JSON.parse(storedProjects);
};

// Get a single project by ID
export const getProjectById = (id: string): Project | undefined => {
  const projects = getProjects();
  return projects.find(project => project.id === id);
};

// Create a new project
export const createProject = (project: Omit<Project, "id" | "createdAt" | "updatedAt">): Project => {
  const projects = getProjects();
  const newProject: Project = {
    ...project,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  const updatedProjects = [...projects, newProject];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedProjects));
  
  return newProject;
};

// Update an existing project
export const updateProject = (id: string, updates: Partial<Omit<Project, "id" | "createdAt" | "updatedAt">>): Project | undefined => {
  const projects = getProjects();
  const projectIndex = projects.findIndex(p => p.id === id);
  
  if (projectIndex === -1) return undefined;
  
  const updatedProject: Project = {
    ...projects[projectIndex],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  
  projects[projectIndex] = updatedProject;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  
  return updatedProject;
};

// Delete a project
export const deleteProject = (id: string): boolean => {
  const projects = getProjects();
  const filteredProjects = projects.filter(p => p.id !== id);
  
  if (filteredProjects.length === projects.length) {
    return false;
  }
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredProjects));
  return true;
};
