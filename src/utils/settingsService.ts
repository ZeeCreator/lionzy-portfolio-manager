
import { SiteSettings } from "@/types";

const STORAGE_KEY = "lionzy_settings";

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
  
  return JSON.parse(storedSettings);
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
