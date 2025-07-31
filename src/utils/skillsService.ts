
import { Skill } from "@/types";
import { supabase } from "@/integrations/supabase/client";

// Transform database row to Skill interface
const transformToSkill = (row: any): Skill => ({
  id: row.id,
  name: row.name,
  level: row.level,
  category: row.category,
  icon: row.icon,
});

// Get all skills
export const getSkills = async (): Promise<Skill[]> => {
  try {
    console.log('Loading skills from Supabase...');
    
    const { data, error } = await supabase
      .from('skills')
      .select('*')
      .order('category', { ascending: true });
    
    if (error) {
      console.error('Error loading skills:', error);
      return [];
    }
    
    const skills = data?.map(transformToSkill) || [];
    console.log(`Loaded ${skills.length} skills from Supabase`);
    return skills;
  } catch (error) {
    console.error('Error loading skills from Supabase:', error);
    return [];
  }
};

// Get a skill by ID
export const getSkillById = async (id: string): Promise<Skill | undefined> => {
  try {
    const { data, error } = await supabase
      .from('skills')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error loading skill:', error);
      return undefined;
    }
    
    return data ? transformToSkill(data) : undefined;
  } catch (error) {
    console.error('Error loading skill from Supabase:', error);
    return undefined;
  }
};

// Create a new skill
export const createSkill = async (skill: Omit<Skill, "id">): Promise<Skill> => {
  try {
    console.log('Creating new skill...');
    
    const { data, error } = await supabase
      .from('skills')
      .insert([{
        name: skill.name,
        level: skill.level,
        category: skill.category,
        icon: skill.icon,
      }])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating skill:', error);
      throw new Error('Failed to create skill');
    }
    
    const newSkill = transformToSkill(data);
    console.log('Skill created successfully:', newSkill.name);
    return newSkill;
  } catch (error) {
    console.error('Error creating skill in Supabase:', error);
    throw error;
  }
};

// Update an existing skill
export const updateSkill = async (id: string, updates: Partial<Omit<Skill, "id">>): Promise<Skill | undefined> => {
  try {
    console.log('Updating skill:', id);
    
    const { data, error } = await supabase
      .from('skills')
      .update({
        name: updates.name,
        level: updates.level,
        category: updates.category,
        icon: updates.icon,
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating skill:', error);
      return undefined;
    }
    
    const updatedSkill = transformToSkill(data);
    console.log('Skill updated successfully:', updatedSkill.name);
    return updatedSkill;
  } catch (error) {
    console.error('Error updating skill in Supabase:', error);
    return undefined;
  }
};

// Delete a skill
export const deleteSkill = async (id: string): Promise<boolean> => {
  try {
    console.log('Deleting skill:', id);
    
    const { error } = await supabase
      .from('skills')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting skill:', error);
      return false;
    }
    
    console.log('Skill deleted successfully');
    return true;
  } catch (error) {
    console.error('Error deleting skill from Supabase:', error);
    return false;
  }
};
