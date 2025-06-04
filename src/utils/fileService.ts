
import { FileItem } from "@/types";

const STORAGE_KEY = "lionzy_files";

export const getFiles = (): FileItem[] => {
  if (typeof window === "undefined") return [];
  
  const storedFiles = localStorage.getItem(STORAGE_KEY);
  if (!storedFiles) return [];
  
  return JSON.parse(storedFiles);
};

export const getFileById = (id: string): FileItem | undefined => {
  const files = getFiles();
  return files.find(file => file.id === id);
};

export const uploadFile = (file: File): Promise<FileItem> => {
  return new Promise((resolve, reject) => {
    try {
      const files = getFiles();
      
      // Create a URL for the file (in a real app, this would be uploaded to a server)
      const fileUrl = URL.createObjectURL(file);
      
      const newFile: FileItem = {
        id: Date.now().toString(),
        name: file.name,
        size: file.size,
        type: file.type,
        url: fileUrl,
        downloadCount: 0,
        uploadedAt: new Date().toISOString(),
      };
      
      const updatedFiles = [...files, newFile];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedFiles));
      
      resolve(newFile);
    } catch (error) {
      reject(error);
    }
  });
};

export const deleteFile = (id: string): boolean => {
  const files = getFiles();
  const filteredFiles = files.filter(f => f.id !== id);
  
  if (filteredFiles.length === files.length) {
    return false;
  }
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredFiles));
  return true;
};

export const incrementDownloadCount = (id: string): void => {
  const files = getFiles();
  const fileIndex = files.findIndex(f => f.id === id);
  
  if (fileIndex !== -1) {
    files[fileIndex].downloadCount++;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(files));
  }
};

export const generateFileUrl = (id: string): string | null => {
  const file = getFileById(id);
  if (!file) return null;
  
  // In a real app, this would generate a secure download URL
  return `${window.location.origin}/api/files/${id}/download`;
};

export const updateFileName = (id: string, newName: string): FileItem | undefined => {
  const files = getFiles();
  const fileIndex = files.findIndex(f => f.id === id);
  
  if (fileIndex === -1) return undefined;
  
  files[fileIndex].name = newName;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(files));
  
  return files[fileIndex];
};
