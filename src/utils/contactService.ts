import { ContactMessage } from "@/types";
import { database } from "@/lib/firebase";
import { ref, get, set, update, remove, push } from "firebase/database";

// Transform database value to ContactMessage interface
const transformToContactMessage = (id: string, data: any): ContactMessage => ({
  id,
  name: data.name,
  email: data.email,
  subject: data.subject,
  message: data.message,
  read: data.read,
  createdAt: data.createdAt,
});

// Get all contact messages from Firebase
export const getContactMessages = async (): Promise<ContactMessage[]> => {
  try {
    console.log('Loading contact messages from Firebase...');
    
    const messagesRef = ref(database, 'contact_messages');
    const snapshot = await get(messagesRef);
    
    if (!snapshot.exists()) {
      console.log('No contact messages found');
      return [];
    }
    
    const messagesData = snapshot.val();
    const messages = Object.entries(messagesData).map(([id, data]) => 
      transformToContactMessage(id, data)
    ).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    console.log(`Loaded ${messages.length} contact messages from Firebase`);
    return messages;
  } catch (error) {
    console.error('Error loading contact messages from Firebase:', error);
    return [];
  }
};

// Get a single contact message by ID
export const getContactMessageById = async (id: string): Promise<ContactMessage | undefined> => {
  try {
    const messageRef = ref(database, `contact_messages/${id}`);
    const snapshot = await get(messageRef);
    
    if (!snapshot.exists()) {
      console.log('Contact message not found');
      return undefined;
    }
    
    return transformToContactMessage(id, snapshot.val());
  } catch (error) {
    console.error('Error loading contact message from Firebase:', error);
    return undefined;
  }
};

// Create a new contact message
export const createContactMessage = async (message: Omit<ContactMessage, "id" | "createdAt" | "read">): Promise<ContactMessage> => {
  try {
    console.log('Creating new contact message...');
    
    const messagesRef = ref(database, 'contact_messages');
    const newMessageRef = push(messagesRef);
    
    const newMessage = {
      ...message,
      read: false,
      createdAt: new Date().toISOString(),
    };
    
    await set(newMessageRef, newMessage);
    
    const createdMessage = transformToContactMessage(newMessageRef.key!, newMessage);
    console.log('Contact message created successfully');
    return createdMessage;
  } catch (error) {
    console.error('Error creating contact message in Firebase:', error);
    throw error;
  }
};

// Update an existing contact message
export const updateContactMessage = async (id: string, updates: Partial<Omit<ContactMessage, "id" | "createdAt">>): Promise<ContactMessage | undefined> => {
  try {
    console.log('Updating contact message:', id);
    
    const messageRef = ref(database, `contact_messages/${id}`);
    await update(messageRef, updates);
    
    const snapshot = await get(messageRef);
    if (!snapshot.exists()) {
      return undefined;
    }
    
    const updatedMessage = transformToContactMessage(id, snapshot.val());
    console.log('Contact message updated successfully');
    return updatedMessage;
  } catch (error) {
    console.error('Error updating contact message in Firebase:', error);
    return undefined;
  }
};

// Delete a contact message
export const deleteContactMessage = async (id: string): Promise<boolean> => {
  try {
    console.log('Deleting contact message:', id);
    
    const messageRef = ref(database, `contact_messages/${id}`);
    await remove(messageRef);
    
    console.log('Contact message deleted successfully');
    return true;
  } catch (error) {
    console.error('Error deleting contact message from Firebase:', error);
    return false;
  }
};

// Get message statistics
export const getMessageStats = async () => {
  try {
    const messagesRef = ref(database, 'contact_messages');
    const snapshot = await get(messagesRef);
    
    if (!snapshot.exists()) {
      return { total: 0, unread: 0, read: 0 };
    }
    
    const messagesData = snapshot.val();
    const messages = Object.values(messagesData) as any[];
    
    const total = messages.length;
    const unread = messages.filter(m => !m.read).length;
    const read = total - unread;
    
    return { total, unread, read };
  } catch (error) {
    console.error('Error getting message stats from Firebase:', error);
    return { total: 0, unread: 0, read: 0 };
  }
};
