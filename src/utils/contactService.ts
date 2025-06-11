
import { ContactMessage } from "@/types";
import { getSettings } from "./settingsService";

const STORAGE_KEY = "lionzy_messages";

// Mock server-like JSON storage
const mockServerStorage = {
  data: [] as ContactMessage[],
  
  // Simulate server API calls
  async saveToServer(messages: ContactMessage[]): Promise<boolean> {
    try {
      const settings = getSettings();
      
      if (settings.serverConfig.storageType === 'json') {
        // Simulate API call to server
        console.log(`Saving to server: ${settings.serverConfig.serverUrl}/api/messages`);
        console.log('Messages:', messages);
        
        // For now, we'll still use localStorage but structure it like server data
        const serverData = {
          timestamp: new Date().toISOString(),
          messages: messages,
          metadata: {
            total: messages.length,
            unread: messages.filter(m => !m.read).length,
          }
        };
        
        localStorage.setItem(STORAGE_KEY, JSON.stringify(serverData));
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Failed to save to server:', error);
      return false;
    }
  },
  
  async loadFromServer(): Promise<ContactMessage[]> {
    try {
      const settings = getSettings();
      
      if (settings.serverConfig.storageType === 'json') {
        // Simulate API call to server
        console.log(`Loading from server: ${settings.serverConfig.serverUrl}/api/messages`);
        
        const storedData = localStorage.getItem(STORAGE_KEY);
        if (!storedData) {
          const initialData = {
            timestamp: new Date().toISOString(),
            messages: [],
            metadata: { total: 0, unread: 0 }
          };
          localStorage.setItem(STORAGE_KEY, JSON.stringify(initialData));
          return [];
        }
        
        const serverData = JSON.parse(storedData);
        return serverData.messages || [];
      }
      
      return [];
    } catch (error) {
      console.error('Failed to load from server:', error);
      return [];
    }
  }
};

// Get all contact messages from server
export const getContactMessages = (): ContactMessage[] => {
  // For now, we'll use sync loading but in real implementation this would be async
  const storedData = localStorage.getItem(STORAGE_KEY);
  if (!storedData) {
    return [];
  }
  
  try {
    const serverData = JSON.parse(storedData);
    return serverData.messages || [];
  } catch (error) {
    console.error('Failed to parse server data:', error);
    return [];
  }
};

// Get a single contact message by ID
export const getContactMessageById = (id: string): ContactMessage | undefined => {
  const messages = getContactMessages();
  return messages.find(message => message.id === id);
};

// Create a new contact message
export const createContactMessage = (message: Omit<ContactMessage, "id" | "createdAt" | "read">): ContactMessage => {
  const messages = getContactMessages();
  const newMessage: ContactMessage = {
    ...message,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    read: false,
  };
  
  const updatedMessages = [...messages, newMessage];
  
  // Save to server-like storage
  mockServerStorage.saveToServer(updatedMessages);
  
  return newMessage;
};

// Update an existing contact message
export const updateContactMessage = (id: string, updates: Partial<Omit<ContactMessage, "id" | "createdAt">>): ContactMessage | undefined => {
  const messages = getContactMessages();
  const messageIndex = messages.findIndex(m => m.id === id);
  
  if (messageIndex === -1) return undefined;
  
  const updatedMessage: ContactMessage = {
    ...messages[messageIndex],
    ...updates,
  };
  
  messages[messageIndex] = updatedMessage;
  
  // Save to server-like storage
  mockServerStorage.saveToServer(messages);
  
  return updatedMessage;
};

// Delete a contact message
export const deleteContactMessage = (id: string): boolean => {
  const messages = getContactMessages();
  const filteredMessages = messages.filter(m => m.id !== id);
  
  if (filteredMessages.length === messages.length) {
    return false;
  }
  
  // Save to server-like storage
  mockServerStorage.saveToServer(filteredMessages);
  return true;
};

// Get message statistics
export const getMessageStats = () => {
  const messages = getContactMessages();
  return {
    total: messages.length,
    unread: messages.filter(m => !m.read).length,
    read: messages.filter(m => m.read).length,
  };
};
