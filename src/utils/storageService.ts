
import { supabase } from '@/integrations/supabase/client';

// Centralized storage service using Supabase for cross-device data persistence
class StorageService {
  async setItem(key: string, value: any): Promise<boolean> {
    try {
      console.log(`Saving data to Supabase for key: ${key}`);
      
      const { error } = await supabase
        .from('app_storage')
        .upsert({ 
          key, 
          value: JSON.stringify(value),
          updated_at: new Date().toISOString()
        });
      
      if (error) {
        console.error('Supabase storage error:', error);
        return false;
      }
      
      console.log(`Data saved to Supabase for key: ${key}`);
      return true;
    } catch (error) {
      console.error('Storage error:', error);
      return false;
    }
  }

  async getItem(key: string): Promise<any> {
    try {
      console.log(`Loading data from Supabase for key: ${key}`);
      
      const { data, error } = await supabase
        .from('app_storage')
        .select('value')
        .eq('key', key)
        .single();
      
      if (error) {
        if (error.code === 'PGRST116') {
          console.log(`No data found in Supabase for key: ${key}`);
          return null;
        }
        console.error('Supabase retrieval error:', error);
        return null;
      }
      
      if (data?.value) {
        const parsedValue = JSON.parse(data.value);
        console.log(`Data retrieved from Supabase for key: ${key}`);
        return parsedValue;
      }
      
      return null;
    } catch (error) {
      console.error('Storage retrieval error:', error);
      return null;
    }
  }

  async removeItem(key: string): Promise<boolean> {
    try {
      console.log(`Deleting data from Supabase for key: ${key}`);
      
      const { error } = await supabase
        .from('app_storage')
        .delete()
        .eq('key', key);
      
      if (error) {
        console.error('Supabase deletion error:', error);
        return false;
      }
      
      console.log(`Data deleted from Supabase for key: ${key}`);
      return true;
    } catch (error) {
      console.error('Storage removal error:', error);
      return false;
    }
  }

  // Method to check if Supabase is available
  async isServerAvailable(): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('app_storage')
        .select('count', { count: 'exact', head: true });
      
      return !error;
    } catch (error) {
      console.error('Supabase health check failed:', error);
      return false;
    }
  }
}

export const storageService = new StorageService();
