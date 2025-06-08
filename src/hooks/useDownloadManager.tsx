
import { useState } from "react";
import { FileItem } from "@/types";

interface DownloadItem {
  id: string;
  file: FileItem;
}

export function useDownloadManager() {
  const [downloads, setDownloads] = useState<DownloadItem[]>([]);

  const startDownload = (file: FileItem) => {
    const downloadItem: DownloadItem = {
      id: Date.now().toString(),
      file
    };
    
    setDownloads(prev => [...prev, downloadItem]);
  };

  const cancelDownload = (id: string) => {
    setDownloads(prev => prev.filter(download => download.id !== id));
  };

  const completeDownload = (id: string) => {
    setDownloads(prev => prev.filter(download => download.id !== id));
  };

  return {
    downloads,
    startDownload,
    cancelDownload,
    completeDownload
  };
}
