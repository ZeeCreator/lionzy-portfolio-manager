import { Project } from "@/types";
import { database } from "@/lib/firebase";
import { ref, get, set, update, remove, push } from "firebase/database";

// Transform database value to Project interface
const transformToProject = (id: string, data: any): Project => ({
  id,
  title: data.title,
  description: data.description,
  imageUrl: data.imageUrl,
  tags: data.tags || [],
  createdAt: data.createdAt,
  updatedAt: data.updatedAt,
  githubUrl: data.githubUrl,
  liveUrl: data.liveUrl,
  featured: data.featured,
  downloadType: data.downloadType,
  downloadUrl: data.downloadUrl,
  price: data.price,
  sourceVisible: data.sourceVisible,
});

// Load projects from Firebase
export const getProjects = async (): Promise<Project[]> => {
  try {
    console.log('Loading projects from Firebase...');
    
    const projectsRef = ref(database, 'projects');
    const snapshot = await get(projectsRef);
    
    if (!snapshot.exists()) {
      console.log('No projects found');
      return [];
    }
    
    const projectsData = snapshot.val();
    const projects = Object.entries(projectsData).map(([id, data]) => 
      transformToProject(id, data)
    ).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    console.log(`Loaded ${projects.length} projects from Firebase`);
    return projects;
  } catch (error) {
    console.error('Error loading projects from Firebase:', error);
    return [];
  }
};

// Get a single project by ID
export const getProjectById = async (id: string): Promise<Project | undefined> => {
  try {
    const projectRef = ref(database, `projects/${id}`);
    const snapshot = await get(projectRef);
    
    if (!snapshot.exists()) {
      console.log('Project not found');
      return undefined;
    }
    
    return transformToProject(id, snapshot.val());
  } catch (error) {
    console.error('Error loading project from Firebase:', error);
    return undefined;
  }
};

// Create a new project
export const createProject = async (project: Omit<Project, "id" | "createdAt" | "updatedAt">): Promise<Project> => {
  try {
    console.log('Creating new project...', project);
    
    if (!database) {
      throw new Error('Firebase database is not initialized');
    }
    
    const projectsRef = ref(database, 'projects');
    const newProjectRef = push(projectsRef);
    
    const now = new Date().toISOString();
    const newProject = {
      ...project,
      createdAt: now,
      updatedAt: now,
    };
    
    // Remove undefined values to satisfy Firebase RTDB constraints
    const sanitized = JSON.parse(JSON.stringify(newProject));
    console.log('Saving to Firebase with key:', newProjectRef.key);
    await set(newProjectRef, sanitized);
    
    const createdProject = transformToProject(newProjectRef.key!, newProject);
    console.log('Project created successfully:', createdProject.title);
    return createdProject;
  } catch (error) {
    console.error('Error creating project in Firebase:', error);
    throw error;
  }
};

// Update an existing project
export const updateProject = async (id: string, updates: Partial<Omit<Project, "id" | "createdAt" | "updatedAt">>): Promise<Project | undefined> => {
  try {
    console.log('Updating project:', id);
    
    const projectRef = ref(database, `projects/${id}`);
    const updatedData = {
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    
    // Remove undefined values before updating
    const sanitized = JSON.parse(JSON.stringify(updatedData));
    await update(projectRef, sanitized);
    
    const snapshot = await get(projectRef);
    if (!snapshot.exists()) {
      return undefined;
    }
    
    const updatedProject = transformToProject(id, snapshot.val());
    console.log('Project updated successfully:', updatedProject.title);
    return updatedProject;
  } catch (error) {
    console.error('Error updating project in Firebase:', error);
    return undefined;
  }
};

// Delete a project
export const deleteProject = async (id: string): Promise<boolean> => {
  try {
    console.log('Deleting project:', id);
    
    const projectRef = ref(database, `projects/${id}`);
    await remove(projectRef);
    
    console.log('Project deleted successfully');
    return true;
  } catch (error) {
    console.error('Error deleting project from Firebase:', error);
    return false;
  }
};

// Synchronous version for components that need immediate data (fallback only)
export const getProjectsSync = (): Project[] => {
  console.warn('getProjectsSync is deprecated, use getProjects() instead');
  return [];
};
