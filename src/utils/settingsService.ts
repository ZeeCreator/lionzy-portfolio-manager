
import { SiteSettings, EducationItem } from "@/types";

const STORAGE_KEY = "lionzy_settings";

const defaultEducationItems: EducationItem[] = [
  {
    id: "1",
    title: "HTML & CSS Fundamentals",
    description: "Learn the basics of web development with HTML and CSS",
    progress: 100,
    category: "Frontend Development",
    completed: true
  },
  {
    id: "2",
    title: "JavaScript ES6+",
    description: "Modern JavaScript features and best practices",
    progress: 85,
    category: "Frontend Development",
    completed: false
  },
  {
    id: "3",
    title: "React.js Framework",
    description: "Building interactive user interfaces with React",
    progress: 70,
    category: "Frontend Development",
    completed: false
  },
  {
    id: "4",
    title: "Node.js Backend",
    description: "Server-side JavaScript development",
    progress: 45,
    category: "Backend Development",
    completed: false
  }
];

const defaultSettings: SiteSettings = {
  siteName: "Lionzy Portfolio",
  ownerName: "Lionzy",
  aboutText: "I'm a passionate developer specializing in creating beautiful and functional websites and applications. With a focus on user experience and clean code, I deliver high-quality digital solutions.",
  contactEmail: "hello@example.com",
  social: {
    github: "https://github.com/",
    twitter: "https://twitter.com/",
    linkedin: "https://linkedin.com/in/",
    instagram: "https://instagram.com/",
  },
  backgroundImage: "mountain-1.jpg",
  saweria: {
    username: "lionzy",
    url: "https://saweria.co/lionzy",
  },
  showEducationRoadmap: true,
  educationItems: defaultEducationItems,
};

// Mountain background images
export const availableBackgrounds = [
  { id: "mountain-1.jpg", name: "Mountain Range" },
  { id: "mountain-2.jpg", name: "Snow Peak" },
  { id: "mountain-3.jpg", name: "Foggy Mountains" },
  { id: "mountain-4.jpg", name: "Mountain Lake" },
  { id: "mountain-5.jpg", name: "Mountain Sunset" },
];

// Get settings from localStorage or use defaults
export const getSettings = (): SiteSettings => {
  if (typeof window === "undefined") return defaultSettings;
  
  const storedSettings = localStorage.getItem(STORAGE_KEY);
  if (!storedSettings) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultSettings));
    return defaultSettings;
  }
  
  const settings = JSON.parse(storedSettings);
  // Ensure education items exist
  if (!settings.educationItems) {
    settings.educationItems = defaultEducationItems;
    settings.showEducationRoadmap = true;
  }
  
  return settings;
};

// Update settings
export const updateSettings = (updates: Partial<SiteSettings>): SiteSettings => {
  const currentSettings = getSettings();
  const updatedSettings = {
    ...currentSettings,
    ...updates,
  };
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedSettings));
  return updatedSettings;
};
