
import { SiteSettings, EducationItem } from "@/types";
import { storageService } from "./storageService";

const STORAGE_KEY = "lionzy_settings";

const defaultEducationItems: EducationItem[] = [
  {
    id: "1",
    title: "Dasar HTML & CSS",
    description: "Pelajari dasar-dasar pengembangan web dengan HTML dan CSS",
    progress: 100,
    category: "Pengembangan Frontend",
    completed: true
  },
  {
    id: "2",
    title: "JavaScript ES6+",
    description: "Fitur JavaScript modern dan praktik terbaik",
    progress: 85,
    category: "Pengembangan Frontend",
    completed: false
  },
  {
    id: "3",
    title: "Framework React.js",
    description: "Membangun antarmuka pengguna interaktif dengan React",
    progress: 70,
    category: "Pengembangan Frontend",
    completed: false
  },
  {
    id: "4",
    title: "Backend Node.js",
    description: "Pengembangan JavaScript sisi server",
    progress: 45,
    category: "Pengembangan Backend",
    completed: false
  }
];

const defaultSettings: SiteSettings = {
  siteName: "Z-PORTFOLIO",
  ownerName: "ZeroTzyID",
  displayName: "Zero Tzy",
  fullName: "Zero Tzy Indonesia",
  profession: "Full Stack Developer",
  company: "Freelancer",
  location: "Indonesia",
  aboutText: "Saya adalah seorang developer yang bersemangat yang mengkhususkan diri dalam menciptakan website dan aplikasi yang indah dan fungsional. Dengan fokus pada pengalaman pengguna dan kode yang bersih, saya menghadirkan solusi digital berkualitas tinggi.",
  contactEmail: "zeetzy@gmail.com",
  phoneNumber: "+62 123 456 7890",
  social: {
    github: "https://github.com/ZeeCreator",
    twitter: "https://twitter.com/",
    linkedin: "https://linkedin.com/in/",
    instagram: "https://instagram.com/zerotzy.id",
  },
  backgroundImage: "https://k.top4top.io/p_3448ixnnv1.png",
  saweria: {
    username: "zerotzyid",
    url: "https://saweria.co/zerotzyid",
  },
  showEducationRoadmap: true,
  educationItems: defaultEducationItems,
  // Server configuration
  serverConfig: {
    storageType: "json",
    serverUrl: "http://localhost:3001",
    apiKey: "",
  },
};

// Mountain background images
export const availableBackgrounds = [
  { id: "mountain-1.jpg", name: "Pegunungan" },
  { id: "mountain-2.jpg", name: "Puncak Bersalju" },
  { id: "mountain-3.jpg", name: "Pegunungan Berkabut" },
  { id: "mountain-4.jpg", name: "Danau Pegunungan" },
  { id: "mountain-5.jpg", name: "Sunset Pegunungan" },
];

// Initialize storage service with settings
const initializeStorage = () => {
  const settings = getSettings();
  if (settings.serverConfig) {
    storageService.setConfig({
      useServerStorage: settings.serverConfig.storageType === 'json',
      serverUrl: settings.serverConfig.serverUrl,
      apiKey: settings.serverConfig.apiKey,
    });
  }
};

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
  
  // Ensure new fields exist
  if (!settings.displayName) settings.displayName = settings.ownerName || "Developer";
  if (!settings.fullName) settings.fullName = settings.ownerName || "Developer";
  if (!settings.profession) settings.profession = "Developer";
  if (!settings.company) settings.company = "Freelancer";
  if (!settings.location) settings.location = "Location";
  if (!settings.phoneNumber) settings.phoneNumber = "";
  if (!settings.serverConfig) {
    settings.serverConfig = {
      storageType: "json",
      serverUrl: "http://localhost:3001",
      apiKey: "",
    };
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
  
  // Update storage service configuration if server config changed
  if (updates.serverConfig) {
    storageService.setConfig({
      useServerStorage: updatedSettings.serverConfig.storageType === 'json',
      serverUrl: updatedSettings.serverConfig.serverUrl,
      apiKey: updatedSettings.serverConfig.apiKey,
    });
  }
  
  return updatedSettings;
};

// Initialize storage on module load
if (typeof window !== "undefined") {
  initializeStorage();
}
