
import { ShortLink } from "@/types";

const STORAGE_KEY = "lionzy_shortlinks";

export const getShortLinks = (): ShortLink[] => {
  if (typeof window === "undefined") return [];
  
  const storedLinks = localStorage.getItem(STORAGE_KEY);
  if (!storedLinks) return [];
  
  return JSON.parse(storedLinks);
};

export const getShortLinkById = (id: string): ShortLink | undefined => {
  const links = getShortLinks();
  return links.find(link => link.id === id);
};

export const getShortLinkByCode = (shortCode: string): ShortLink | undefined => {
  const links = getShortLinks();
  return links.find(link => link.shortCode === shortCode);
};

export const createShortLink = (originalUrl: string, title: string, customCode?: string): ShortLink => {
  const links = getShortLinks();
  const shortCode = customCode || Math.random().toString(36).substring(2, 8);
  
  if (customCode && links.some(link => link.shortCode === customCode)) {
    throw new Error("Short code already exists");
  }
  
  const newLink: ShortLink = {
    id: Date.now().toString(),
    originalUrl,
    shortCode,
    title,
    clickCount: 0,
    createdAt: new Date().toISOString(),
    active: true
  };
  
  const updatedLinks = [...links, newLink];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedLinks));
  
  return newLink;
};

export const updateShortLink = (id: string, updates: Partial<Omit<ShortLink, "id" | "createdAt">>): ShortLink | undefined => {
  const links = getShortLinks();
  const linkIndex = links.findIndex(l => l.id === id);
  
  if (linkIndex === -1) return undefined;
  
  // Check if shortCode is being updated and already exists
  if (updates.shortCode && updates.shortCode !== links[linkIndex].shortCode) {
    const existingLink = links.find(l => l.shortCode === updates.shortCode && l.id !== id);
    if (existingLink) {
      throw new Error("Short code already exists");
    }
  }
  
  const updatedLink: ShortLink = {
    ...links[linkIndex],
    ...updates,
  };
  
  links[linkIndex] = updatedLink;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(links));
  
  return updatedLink;
};

export const deleteShortLink = (id: string): boolean => {
  const links = getShortLinks();
  const filteredLinks = links.filter(l => l.id !== id);
  
  if (filteredLinks.length === links.length) {
    return false;
  }
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredLinks));
  return true;
};

export const incrementClickCount = (shortCode: string): void => {
  const links = getShortLinks();
  const linkIndex = links.findIndex(l => l.shortCode === shortCode);
  
  if (linkIndex !== -1) {
    links[linkIndex].clickCount++;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(links));
  }
};

export const toggleShortLinkStatus = (id: string): boolean => {
  const links = getShortLinks();
  const linkIndex = links.findIndex(l => l.id === id);
  
  if (linkIndex === -1) return false;
  
  links[linkIndex].active = !links[linkIndex].active;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(links));
  
  return true;
};

export const duplicateShortLink = (id: string): ShortLink | undefined => {
  const originalLink = getShortLinkById(id);
  if (!originalLink) return undefined;
  
  const newShortCode = Math.random().toString(36).substring(2, 8);
  return createShortLink(
    originalLink.originalUrl,
    `${originalLink.title} (Copy)`,
    newShortCode
  );
};

export const searchShortLinks = (query: string): ShortLink[] => {
  const links = getShortLinks();
  if (!query) return links;
  
  const searchTerm = query.toLowerCase();
  return links.filter(link =>
    link.title.toLowerCase().includes(searchTerm) ||
    link.originalUrl.toLowerCase().includes(searchTerm) ||
    link.shortCode.toLowerCase().includes(searchTerm)
  );
};
