
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

export const uploadMultipleFiles = (files: FileList): Promise<FileItem[]> => {
  const uploadPromises = Array.from(files).map(file => uploadFile(file));
  return Promise.all(uploadPromises);
};

export const deleteFile = (id: string): boolean => {
  const files = getFiles();
  const fileToDelete = files.find(f => f.id === id);
  
  if (fileToDelete && fileToDelete.url.startsWith('blob:')) {
    URL.revokeObjectURL(fileToDelete.url);
  }
  
  const filteredFiles = files.filter(f => f.id !== id);
  
  if (filteredFiles.length === files.length) {
    return false;
  }
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredFiles));
  return true;
};

export const deleteMultipleFiles = (ids: string[]): number => {
  let deletedCount = 0;
  ids.forEach(id => {
    if (deleteFile(id)) {
      deletedCount++;
    }
  });
  return deletedCount;
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

export const duplicateFile = (id: string): FileItem | undefined => {
  const originalFile = getFileById(id);
  if (!originalFile) return undefined;
  
  const files = getFiles();
  const fileExtension = originalFile.name.split('.').pop();
  const baseName = originalFile.name.replace(/\.[^/.]+$/, "");
  
  const newFile: FileItem = {
    ...originalFile,
    id: Date.now().toString(),
    name: `${baseName}_copy.${fileExtension}`,
    uploadedAt: new Date().toISOString(),
    downloadCount: 0,
  };
  
  const updatedFiles = [...files, newFile];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedFiles));
  
  return newFile;
};

export const searchFiles = (query: string): FileItem[] => {
  const files = getFiles();
  if (!query) return files;
  
  const searchTerm = query.toLowerCase();
  return files.filter(file =>
    file.name.toLowerCase().includes(searchTerm) ||
    file.type.toLowerCase().includes(searchTerm)
  );
};

export const getFilesByType = (fileType: string): FileItem[] => {
  const files = getFiles();
  if (fileType === "all") return files;
  
  return files.filter(file => {
    const extension = file.name.split('.').pop()?.toLowerCase();
    return extension === fileType;
  });
};

export const getFileStats = () => {
  const files = getFiles();
  const totalSize = files.reduce((sum, file) => sum + file.size, 0);
  const totalDownloads = files.reduce((sum, file) => sum + file.downloadCount, 0);
  
  const typeStats = files.reduce((stats, file) => {
    const extension = file.name.split('.').pop()?.toLowerCase() || 'unknown';
    stats[extension] = (stats[extension] || 0) + 1;
    return stats;
  }, {} as Record<string, number>);
  
  return {
    totalFiles: files.length,
    totalSize,
    totalDownloads,
    typeStats,
  };
};
