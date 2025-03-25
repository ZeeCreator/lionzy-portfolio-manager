
import { ContactMessage } from "@/types";

const STORAGE_KEY = "lionzy_contact_messages";

// Get all messages
export const getContactMessages = (): ContactMessage[] => {
  if (typeof window === "undefined") return [];
  
  const storedMessages = localStorage.getItem(STORAGE_KEY);
  if (!storedMessages) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
    return [];
  }
  
  return JSON.parse(storedMessages);
};

// Get a message by ID
export const getContactMessageById = (id: string): ContactMessage | undefined => {
  const messages = getContactMessages();
  return messages.find(message => message.id === id);
};

// Create a new message
export const createContactMessage = (message: Omit<ContactMessage, "id" | "createdAt" | "read">): ContactMessage => {
  const messages = getContactMessages();
  const newMessage: ContactMessage = {
    ...message,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    read: false,
  };
  
  const updatedMessages = [...messages, newMessage];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedMessages));
  
  return newMessage;
};

// Update a message (e.g., mark as read)
export const updateContactMessage = (id: string, updates: Partial<Omit<ContactMessage, "id" | "createdAt">>): ContactMessage | undefined => {
  const messages = getContactMessages();
  const messageIndex = messages.findIndex(m => m.id === id);
  
  if (messageIndex === -1) return undefined;
  
  const updatedMessage: ContactMessage = {
    ...messages[messageIndex],
    ...updates,
  };
  
  messages[messageIndex] = updatedMessage;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  
  return updatedMessage;
};

// Delete a message
export const deleteContactMessage = (id: string): boolean => {
  const messages = getContactMessages();
  const filteredMessages = messages.filter(m => m.id !== id);
  
  if (filteredMessages.length === messages.length) {
    return false;
  }
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredMessages));
  return true;
};
