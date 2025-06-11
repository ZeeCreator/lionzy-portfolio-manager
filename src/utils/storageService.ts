
// Centralized storage service for cross-device data persistence
export interface StorageConfig {
  useServerStorage: boolean;
  serverUrl?: string;
  apiKey?: string;
}

class StorageService {
  private config: StorageConfig = {
    useServerStorage: false,
    serverUrl: 'http://localhost:3001',
    apiKey: '',
  };

  setConfig(config: Partial<StorageConfig>) {
    this.config = { ...this.config, ...config };
  }

  async setItem(key: string, value: any): Promise<boolean> {
    try {
      const data = JSON.stringify(value);
      
      if (this.config.useServerStorage && this.config.serverUrl) {
        // Try server storage first
        const response = await fetch(`${this.config.serverUrl}/api/storage/${key}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.config.apiKey}`,
          },
          body: data,
        });
        
        if (response.ok) {
          // Also save to localStorage as backup
          localStorage.setItem(key, data);
          return true;
        }
      }
      
      // Fallback to localStorage
      localStorage.setItem(key, data);
      return true;
    } catch (error) {
      console.error('Storage error:', error);
      // Always try localStorage as final fallback
      try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
      } catch (localError) {
        console.error('LocalStorage error:', localError);
        return false;
      }
    }
  }

  async getItem(key: string): Promise<any> {
    try {
      if (this.config.useServerStorage && this.config.serverUrl) {
        // Try server storage first
        const response = await fetch(`${this.config.serverUrl}/api/storage/${key}`, {
          headers: {
            'Authorization': `Bearer ${this.config.apiKey}`,
          },
        });
        
        if (response.ok) {
          const data = await response.json();
          // Update localStorage with server data
          localStorage.setItem(key, JSON.stringify(data));
          return data;
        }
      }
      
      // Fallback to localStorage
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Storage retrieval error:', error);
      // Always try localStorage as final fallback
      try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
      } catch (localError) {
        console.error('LocalStorage retrieval error:', localError);
        return null;
      }
    }
  }

  async removeItem(key: string): Promise<boolean> {
    try {
      if (this.config.useServerStorage && this.config.serverUrl) {
        // Try server storage first
        await fetch(`${this.config.serverUrl}/api/storage/${key}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${this.config.apiKey}`,
          },
        });
      }
      
      // Always remove from localStorage
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Storage removal error:', error);
      localStorage.removeItem(key);
      return true;
    }
  }
}

export const storageService = new StorageService();
