
import { Skill } from "@/types";

const STORAGE_KEY = "lionzy_skills";

// Initial skills data
const initialSkills: Skill[] = [
  {
    id: "1",
    name: "React",
    level: 90,
    category: "Frontend",
    icon: "react",
  },
  {
    id: "2",
    name: "TypeScript",
    level: 85,
    category: "Language",
    icon: "typescript",
  },
  {
    id: "3",
    name: "Node.js",
    level: 80,
    category: "Backend",
    icon: "nodejs",
  },
  {
    id: "4",
    name: "Tailwind CSS",
    level: 90,
    category: "Frontend",
    icon: "tailwind",
  },
  {
    id: "5",
    name: "MongoDB",
    level: 75,
    category: "Database",
    icon: "mongodb",
  },
];

// Get all skills
export const getSkills = (): Skill[] => {
  if (typeof window === "undefined") return initialSkills;
  
  const storedSkills = localStorage.getItem(STORAGE_KEY);
  if (!storedSkills) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialSkills));
    return initialSkills;
  }
  
  return JSON.parse(storedSkills);
};

// Get a skill by ID
export const getSkillById = (id: string): Skill | undefined => {
  const skills = getSkills();
  return skills.find(skill => skill.id === id);
};

// Create a new skill
export const createSkill = (skill: Omit<Skill, "id">): Skill => {
  const skills = getSkills();
  const newSkill: Skill = {
    ...skill,
    id: Date.now().toString(),
  };
  
  const updatedSkills = [...skills, newSkill];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedSkills));
  
  return newSkill;
};

// Update an existing skill
export const updateSkill = (id: string, updates: Partial<Omit<Skill, "id">>): Skill | undefined => {
  const skills = getSkills();
  const skillIndex = skills.findIndex(s => s.id === id);
  
  if (skillIndex === -1) return undefined;
  
  const updatedSkill: Skill = {
    ...skills[skillIndex],
    ...updates,
  };
  
  skills[skillIndex] = updatedSkill;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(skills));
  
  return updatedSkill;
};

// Delete a skill
export const deleteSkill = (id: string): boolean => {
  const skills = getSkills();
  const filteredSkills = skills.filter(s => s.id !== id);
  
  if (filteredSkills.length === skills.length) {
    return false;
  }
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredSkills));
  return true;
};
