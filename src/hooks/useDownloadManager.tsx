
import { useState, useCallback } from "react";
import { FileItem } from "@/types";

interface DownloadItem {
  id: string;
  file: FileItem;
}

export function useDownloadManager() {
  const [downloads, setDownloads] = useState<DownloadItem[]>([]);

  const startDownload = useCallback((file: FileItem) => {
    const downloadItem: DownloadItem = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      file
    };
    
    setDownloads(prev => [...prev, downloadItem]);
    console.log('Started download:', downloadItem.id, file.name);
    
    return downloadItem.id;
  }, []);

  const cancelDownload = useCallback((id: string) => {
    console.log('Cancelling download:', id);
    setDownloads(prev => prev.filter(download => download.id !== id));
  }, []);

  const completeDownload = useCallback((id: string) => {
    console.log('Completing download:', id);
    setDownloads(prev => prev.filter(download => download.id !== id));
  }, []);

  const clearAllDownloads = useCallback(() => {
    console.log('Clearing all downloads');
    setDownloads([]);
  }, []);

  return {
    downloads,
    startDownload,
    cancelDownload,
    completeDownload,
    clearAllDownloads
  };
}
