
interface DownloadLink {
  id: string;
  fileId: string;
  fileName: string;
  url: string;
  createdAt: string;
  expiresAt?: string;
  clicks: number;
  isActive: boolean;
}

const DOWNLOAD_LINKS_KEY = "lionzy_download_links";

export const getDownloadLinks = (): DownloadLink[] => {
  if (typeof window === "undefined") return [];
  
  const storedLinks = localStorage.getItem(DOWNLOAD_LINKS_KEY);
  if (!storedLinks) return [];
  
  return JSON.parse(storedLinks);
};

export const getDownloadLinkById = (id: string): DownloadLink | undefined => {
  const links = getDownloadLinks();
  return links.find(link => link.id === id);
};

export const getDownloadLinksByFileId = (fileId: string): DownloadLink[] => {
  const links = getDownloadLinks();
  return links.filter(link => link.fileId === fileId);
};

export const createDownloadLink = (fileId: string, fileName: string): DownloadLink => {
  const links = getDownloadLinks();
  
  const newLink: DownloadLink = {
    id: Date.now().toString(),
    fileId,
    fileName,
    url: `${window.location.origin}/download/${fileId}`,
    createdAt: new Date().toISOString(),
    clicks: 0,
    isActive: true,
  };
  
  const updatedLinks = [...links, newLink];
  localStorage.setItem(DOWNLOAD_LINKS_KEY, JSON.stringify(updatedLinks));
  
  return newLink;
};

export const incrementLinkClicks = (linkId: string): void => {
  const links = getDownloadLinks();
  const linkIndex = links.findIndex(link => link.id === linkId);
  
  if (linkIndex !== -1) {
    links[linkIndex].clicks++;
    localStorage.setItem(DOWNLOAD_LINKS_KEY, JSON.stringify(links));
  }
};

export const deactivateDownloadLink = (linkId: string): boolean => {
  const links = getDownloadLinks();
  const linkIndex = links.findIndex(link => link.id === linkId);
  
  if (linkIndex !== -1) {
    links[linkIndex].isActive = false;
    localStorage.setItem(DOWNLOAD_LINKS_KEY, JSON.stringify(links));
    return true;
  }
  
  return false;
};

export const deleteDownloadLink = (linkId: string): boolean => {
  const links = getDownloadLinks();
  const filteredLinks = links.filter(link => link.id !== linkId);
  
  if (filteredLinks.length === links.length) {
    return false;
  }
  
  localStorage.setItem(DOWNLOAD_LINKS_KEY, JSON.stringify(filteredLinks));
  return true;
};
