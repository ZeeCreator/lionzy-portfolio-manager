import { Skill } from "@/types";
import { database } from "@/lib/firebase";
import { ref, get, set, update, remove, push } from "firebase/database";

// Transform database value to Skill interface
const transformToSkill = (id: string, data: any): Skill => ({
  id,
  name: data.name,
  level: data.level,
  category: data.category,
  icon: data.icon,
});

// Get all skills
export const getSkills = async (): Promise<Skill[]> => {
  try {
    console.log('Loading skills from Firebase...');
    
    const skillsRef = ref(database, 'skills');
    const snapshot = await get(skillsRef);
    
    if (!snapshot.exists()) {
      console.log('No skills found');
      return [];
    }
    
    const skillsData = snapshot.val();
    const skills = Object.entries(skillsData).map(([id, data]) => 
      transformToSkill(id, data)
    ).sort((a, b) => a.category.localeCompare(b.category));
    
    console.log(`Loaded ${skills.length} skills from Firebase`);
    return skills;
  } catch (error) {
    console.error('Error loading skills from Firebase:', error);
    return [];
  }
};

// Get a skill by ID
export const getSkillById = async (id: string): Promise<Skill | undefined> => {
  try {
    const skillRef = ref(database, `skills/${id}`);
    const snapshot = await get(skillRef);
    
    if (!snapshot.exists()) {
      console.log('Skill not found');
      return undefined;
    }
    
    return transformToSkill(id, snapshot.val());
  } catch (error) {
    console.error('Error loading skill from Firebase:', error);
    return undefined;
  }
};

// Create a new skill
export const createSkill = async (skill: Omit<Skill, "id">): Promise<Skill> => {
  try {
    console.log('Creating new skill...');
    
    const skillsRef = ref(database, 'skills');
    const newSkillRef = push(skillsRef);
    
    const sanitized = JSON.parse(JSON.stringify(skill));
    await set(newSkillRef, sanitized);
    
    const newSkill = transformToSkill(newSkillRef.key!, skill);
    console.log('Skill created successfully:', newSkill.name);
    return newSkill;
  } catch (error) {
    console.error('Error creating skill in Firebase:', error);
    throw error;
  }
};

// Update an existing skill
export const updateSkill = async (id: string, updates: Partial<Omit<Skill, "id">>): Promise<Skill | undefined> => {
  try {
    console.log('Updating skill:', id);
    
    const skillRef = ref(database, `skills/${id}`);
    const sanitized = JSON.parse(JSON.stringify(updates));
    await update(skillRef, sanitized);
    
    const snapshot = await get(skillRef);
    if (!snapshot.exists()) {
      return undefined;
    }
    
    const updatedSkill = transformToSkill(id, snapshot.val());
    console.log('Skill updated successfully:', updatedSkill.name);
    return updatedSkill;
  } catch (error) {
    console.error('Error updating skill in Firebase:', error);
    return undefined;
  }
};

// Delete a skill
export const deleteSkill = async (id: string): Promise<boolean> => {
  try {
    console.log('Deleting skill:', id);
    
    const skillRef = ref(database, `skills/${id}`);
    await remove(skillRef);
    
    console.log('Skill deleted successfully');
    return true;
  } catch (error) {
    console.error('Error deleting skill from Firebase:', error);
    return false;
  }
};
