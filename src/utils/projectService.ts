
import { Project } from "@/types";
import { supabase } from "@/integrations/supabase/client";

// Transform database row to Project interface
const transformToProject = (row: any): Project => ({
  id: row.id,
  title: row.title,
  description: row.description,
  imageUrl: row.image_url,
  tags: row.tags || [],
  createdAt: row.created_at,
  updatedAt: row.updated_at,
  githubUrl: row.github_url,
  liveUrl: row.live_url,
  featured: row.featured,
  downloadType: row.download_type,
  downloadUrl: row.download_url,
  price: row.price,
  sourceVisible: row.source_visible,
});

// Transform Project interface to database row
const transformToRow = (project: Partial<Project>) => ({
  title: project.title,
  description: project.description,
  image_url: project.imageUrl,
  tags: project.tags,
  github_url: project.githubUrl,
  live_url: project.liveUrl,
  featured: project.featured,
  download_type: project.downloadType,
  download_url: project.downloadUrl,
  price: project.price,
  source_visible: project.sourceVisible,
});

// Load projects from Supabase
export const getProjects = async (): Promise<Project[]> => {
  try {
    console.log('Loading projects from Supabase...');
    
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error loading projects:', error);
      return [];
    }
    
    const projects = data?.map(transformToProject) || [];
    console.log(`Loaded ${projects.length} projects from Supabase`);
    return projects;
  } catch (error) {
    console.error('Error loading projects from Supabase:', error);
    return [];
  }
};

// Get a single project by ID
export const getProjectById = async (id: string): Promise<Project | undefined> => {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error loading project:', error);
      return undefined;
    }
    
    return data ? transformToProject(data) : undefined;
  } catch (error) {
    console.error('Error loading project from Supabase:', error);
    return undefined;
  }
};

// Create a new project
export const createProject = async (project: Omit<Project, "id" | "createdAt" | "updatedAt">): Promise<Project> => {
  try {
    console.log('Creating new project...');
    
    const { data, error } = await supabase
      .from('projects')
      .insert([transformToRow(project)])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating project:', error);
      throw new Error('Failed to create project');
    }
    
    const newProject = transformToProject(data);
    console.log('Project created successfully:', newProject.title);
    return newProject;
  } catch (error) {
    console.error('Error creating project in Supabase:', error);
    throw error;
  }
};

// Update an existing project
export const updateProject = async (id: string, updates: Partial<Omit<Project, "id" | "createdAt" | "updatedAt">>): Promise<Project | undefined> => {
  try {
    console.log('Updating project:', id);
    
    const { data, error } = await supabase
      .from('projects')
      .update(transformToRow(updates))
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating project:', error);
      return undefined;
    }
    
    const updatedProject = transformToProject(data);
    console.log('Project updated successfully:', updatedProject.title);
    return updatedProject;
  } catch (error) {
    console.error('Error updating project in Supabase:', error);
    return undefined;
  }
};

// Delete a project
export const deleteProject = async (id: string): Promise<boolean> => {
  try {
    console.log('Deleting project:', id);
    
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting project:', error);
      return false;
    }
    
    console.log('Project deleted successfully');
    return true;
  } catch (error) {
    console.error('Error deleting project from Supabase:', error);
    return false;
  }
};

// Synchronous version for components that need immediate data (fallback only)
export const getProjectsSync = (): Project[] => {
  console.warn('getProjectsSync is deprecated, use getProjects() instead');
  return [];
};
