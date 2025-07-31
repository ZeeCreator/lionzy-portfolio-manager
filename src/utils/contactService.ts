
import { ContactMessage } from "@/types";
import { supabase } from "@/integrations/supabase/client";

// Transform database row to ContactMessage interface
const transformToContactMessage = (row: any): ContactMessage => ({
  id: row.id,
  name: row.name,
  email: row.email,
  subject: row.subject,
  message: row.message,
  read: row.read,
  createdAt: row.created_at,
});

// Get all contact messages from Supabase
export const getContactMessages = async (): Promise<ContactMessage[]> => {
  try {
    console.log('Loading contact messages from Supabase...');
    
    const { data, error } = await supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error loading contact messages:', error);
      return [];
    }
    
    const messages = data?.map(transformToContactMessage) || [];
    console.log(`Loaded ${messages.length} contact messages from Supabase`);
    return messages;
  } catch (error) {
    console.error('Error loading contact messages from Supabase:', error);
    return [];
  }
};

// Get a single contact message by ID
export const getContactMessageById = async (id: string): Promise<ContactMessage | undefined> => {
  try {
    const { data, error } = await supabase
      .from('contact_messages')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error loading contact message:', error);
      return undefined;
    }
    
    return data ? transformToContactMessage(data) : undefined;
  } catch (error) {
    console.error('Error loading contact message from Supabase:', error);
    return undefined;
  }
};

// Create a new contact message
export const createContactMessage = async (message: Omit<ContactMessage, "id" | "createdAt" | "read">): Promise<ContactMessage> => {
  try {
    console.log('Creating new contact message...');
    
    const { data, error } = await supabase
      .from('contact_messages')
      .insert([{
        name: message.name,
        email: message.email,
        subject: message.subject,
        message: message.message,
        read: false,
      }])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating contact message:', error);
      throw new Error('Failed to create contact message');
    }
    
    const newMessage = transformToContactMessage(data);
    console.log('Contact message created successfully');
    return newMessage;
  } catch (error) {
    console.error('Error creating contact message in Supabase:', error);
    throw error;
  }
};

// Update an existing contact message
export const updateContactMessage = async (id: string, updates: Partial<Omit<ContactMessage, "id" | "createdAt">>): Promise<ContactMessage | undefined> => {
  try {
    console.log('Updating contact message:', id);
    
    const { data, error } = await supabase
      .from('contact_messages')
      .update({
        name: updates.name,
        email: updates.email,
        subject: updates.subject,
        message: updates.message,
        read: updates.read,
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating contact message:', error);
      return undefined;
    }
    
    const updatedMessage = transformToContactMessage(data);
    console.log('Contact message updated successfully');
    return updatedMessage;
  } catch (error) {
    console.error('Error updating contact message in Supabase:', error);
    return undefined;
  }
};

// Delete a contact message
export const deleteContactMessage = async (id: string): Promise<boolean> => {
  try {
    console.log('Deleting contact message:', id);
    
    const { error } = await supabase
      .from('contact_messages')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting contact message:', error);
      return false;
    }
    
    console.log('Contact message deleted successfully');
    return true;
  } catch (error) {
    console.error('Error deleting contact message from Supabase:', error);
    return false;
  }
};

// Get message statistics
export const getMessageStats = async () => {
  try {
    const { data, error } = await supabase
      .from('contact_messages')
      .select('read');
    
    if (error) {
      console.error('Error getting message stats:', error);
      return { total: 0, unread: 0, read: 0 };
    }
    
    const total = data?.length || 0;
    const unread = data?.filter(m => !m.read).length || 0;
    const read = total - unread;
    
    return { total, unread, read };
  } catch (error) {
    console.error('Error getting message stats from Supabase:', error);
    return { total: 0, unread: 0, read: 0 };
  }
};
