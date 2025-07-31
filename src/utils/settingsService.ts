
import { SiteSettings, EducationItem } from "@/types";
import { supabase } from "@/integrations/supabase/client";

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

// Transform database row to SiteSettings interface
const transformToSiteSettings = (row: any, educationItems: EducationItem[]): SiteSettings => ({
  siteName: row.site_name,
  ownerName: row.owner_name,
  displayName: row.display_name,
  fullName: row.full_name,
  profession: row.profession,
  company: row.company,
  location: row.location,
  aboutText: row.about_text,
  contactEmail: row.contact_email,
  phoneNumber: row.phone_number,
  social: {
    github: row.social_github,
    twitter: row.social_twitter,
    linkedin: row.social_linkedin,
    instagram: row.social_instagram,
  },
  backgroundImage: row.background_image,
  saweria: {
    username: row.saweria_username,
    url: row.saweria_url,
  },
  showEducationRoadmap: row.show_education_roadmap,
  educationItems: educationItems,
  serverConfig: {
    storageType: row.server_config_storage_type || 'database',
    serverUrl: row.server_config_server_url || '',
    apiKey: row.server_config_api_key || '',
  },
});

// Transform EducationItem to database row
const transformEducationItemToRow = (item: EducationItem) => ({
  id: item.id,
  title: item.title,
  description: item.description,
  progress: item.progress,
  category: item.category,
  completed: item.completed,
});

// Transform database row to EducationItem
const transformToEducationItem = (row: any): EducationItem => ({
  id: row.id,
  title: row.title,
  description: row.description,
  progress: row.progress,
  category: row.category,
  completed: row.completed,
});

// Get settings from Supabase
export const getSettings = async (): Promise<SiteSettings> => {
  try {
    console.log('Loading settings from Supabase...');
    
    // Load settings
    const { data: settingsData, error: settingsError } = await supabase
      .from('site_settings')
      .select('*')
      .limit(1)
      .single();
    
    // Load education items
    const { data: educationData, error: educationError } = await supabase
      .from('education_items')
      .select('*')
      .order('created_at', { ascending: true });
    
    if (settingsError && settingsError.code !== 'PGRST116') {
      console.error('Error loading settings:', settingsError);
    }
    
    if (educationError) {
      console.error('Error loading education items:', educationError);
    }
    
    const educationItems = educationData?.map(transformToEducationItem) || defaultEducationItems;
    
    if (!settingsData) {
      console.log('No settings found, initializing with defaults...');
      // Initialize with default settings
      const { data: newSettingsData, error: createError } = await supabase
        .from('site_settings')
        .insert([{
          site_name: defaultSettings.siteName,
          owner_name: defaultSettings.ownerName,
          display_name: defaultSettings.displayName,
          full_name: defaultSettings.fullName,
          profession: defaultSettings.profession,
          company: defaultSettings.company,
          location: defaultSettings.location,
          about_text: defaultSettings.aboutText,
          contact_email: defaultSettings.contactEmail,
          phone_number: defaultSettings.phoneNumber,
          social_github: defaultSettings.social.github,
          social_twitter: defaultSettings.social.twitter,
          social_linkedin: defaultSettings.social.linkedin,
          social_instagram: defaultSettings.social.instagram,
          background_image: defaultSettings.backgroundImage,
          saweria_username: defaultSettings.saweria.username,
          saweria_url: defaultSettings.saweria.url,
          show_education_roadmap: defaultSettings.showEducationRoadmap,
        }])
        .select()
        .single();
      
      if (createError) {
        console.error('Error creating default settings:', createError);
        return { ...defaultSettings, educationItems };
      }
      
      // Initialize education items if needed
      if (educationItems.length === 0) {
        await supabase
          .from('education_items')
          .insert(defaultEducationItems.map(transformEducationItemToRow));
      }
      
      console.log('Settings initialized successfully');
      return transformToSiteSettings(newSettingsData, educationItems.length > 0 ? educationItems : defaultEducationItems);
    }
    
    console.log('Settings loaded from Supabase successfully');
    return transformToSiteSettings(settingsData, educationItems);
  } catch (error) {
    console.error('Error loading settings from Supabase:', error);
    return { ...defaultSettings, educationItems: defaultEducationItems };
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
    
    // Update site settings
    const { data: settingsData, error: settingsError } = await supabase
      .from('site_settings')
      .update({
        site_name: updates.siteName,
        owner_name: updates.ownerName,
        display_name: updates.displayName,
        full_name: updates.fullName,
        profession: updates.profession,
        company: updates.company,
        location: updates.location,
        about_text: updates.aboutText,
        contact_email: updates.contactEmail,
        phone_number: updates.phoneNumber,
        social_github: updates.social?.github,
        social_twitter: updates.social?.twitter,
        social_linkedin: updates.social?.linkedin,
        social_instagram: updates.social?.instagram,
        background_image: updates.backgroundImage,
        saweria_username: updates.saweria?.username,
        saweria_url: updates.saweria?.url,
        show_education_roadmap: updates.showEducationRoadmap,
        server_config_storage_type: updates.serverConfig?.storageType,
        server_config_server_url: updates.serverConfig?.serverUrl,
        server_config_api_key: updates.serverConfig?.apiKey,
      })
      .select()
      .single();
    
    if (settingsError) {
      console.error('Error updating settings:', settingsError);
      throw new Error('Failed to update settings');
    }
    
    // Handle education items updates if provided
    let educationItems: EducationItem[] = [];
    if (updates.educationItems) {
      // Delete existing education items and insert new ones
      await supabase.from('education_items').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      
      const { data: educationData, error: educationError } = await supabase
        .from('education_items')
        .insert(updates.educationItems.map(transformEducationItemToRow))
        .select();
      
      if (educationError) {
        console.error('Error updating education items:', educationError);
      } else {
        educationItems = educationData?.map(transformToEducationItem) || [];
      }
    } else {
      // Load existing education items
      const { data: educationData } = await supabase
        .from('education_items')
        .select('*')
        .order('created_at', { ascending: true });
      
      educationItems = educationData?.map(transformToEducationItem) || [];
    }
    
    console.log('Settings updated successfully');
    return transformToSiteSettings(settingsData, educationItems);
  } catch (error) {
    console.error('Error updating settings in Supabase:', error);
    throw error;
  }
};
