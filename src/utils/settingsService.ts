import { SiteSettings, EducationItem } from "@/types";
import { database } from "@/lib/firebase";
import { ref, get, set, update } from "firebase/database";

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
  serverConfig: {
    storageType: "database",
    serverUrl: "",
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

// Get settings from Firebase
export const getSettings = async (): Promise<SiteSettings> => {
  try {
    console.log('Loading settings from Firebase...');
    
    const settingsRef = ref(database, 'site_settings');
    const snapshot = await get(settingsRef);
    
    if (!snapshot.exists()) {
      console.log('No settings found, initializing with defaults...');
      await set(settingsRef, defaultSettings);
      return defaultSettings;
    }
    
    const settings = snapshot.val();
    console.log('Settings loaded from Firebase successfully');
    return settings;
  } catch (error) {
    console.error('Error loading settings from Firebase:', error);
    return defaultSettings;
  }
};

// Synchronous version for backwards compatibility (returns defaults)
export const getSettingsSync = (): SiteSettings => {
  console.warn('getSettingsSync is deprecated, use getSettings() instead');
  return defaultSettings;
};

// Update settings
export const updateSettings = async (updates: Partial<SiteSettings>): Promise<SiteSettings> => {
  try {
    console.log('Updating settings...');
    
    const settingsRef = ref(database, 'site_settings');
    
    // Get current settings
    const snapshot = await get(settingsRef);
    const currentSettings = snapshot.exists() ? snapshot.val() : defaultSettings;
    
    // Merge updates with current settings
    const updatedSettings = {
      ...currentSettings,
      ...updates,
      social: {
        ...currentSettings.social,
        ...updates.social,
      },
      saweria: {
        ...currentSettings.saweria,
        ...updates.saweria,
      },
      serverConfig: {
        ...currentSettings.serverConfig,
        ...updates.serverConfig,
      },
    };
    
    await set(settingsRef, updatedSettings);
    
    console.log('Settings updated successfully');
    return updatedSettings;
  } catch (error) {
    console.error('Error updating settings in Firebase:', error);
    throw error;
  }
};
