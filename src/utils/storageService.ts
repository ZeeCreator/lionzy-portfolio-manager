
// Centralized storage service for cross-device data persistence
export interface StorageConfig {
  useServerStorage: boolean;
  serverUrl?: string;
  apiKey?: string;
}

class StorageService {
  private config: StorageConfig = {
    useServerStorage: true, // Default to server storage
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
        const response = await fetch(`${this.config.serverUrl}/api/storage/${key}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.config.apiKey}`,
          },
          body: data,
        });
        
        if (response.ok) {
          console.log(`Data saved to server for key: ${key}`);
          return true;
        } else {
          console.error('Server storage failed:', response.statusText);
          return false;
        }
      }
      
      console.error('Server storage not configured');
      return false;
    } catch (error) {
      console.error('Storage error:', error);
      return false;
    }
  }

  async getItem(key: string): Promise<any> {
    try {
      if (this.config.useServerStorage && this.config.serverUrl) {
        const response = await fetch(`${this.config.serverUrl}/api/storage/${key}`, {
          headers: {
            'Authorization': `Bearer ${this.config.apiKey}`,
          },
        });
        
        if (response.ok) {
          const data = await response.json();
          console.log(`Data retrieved from server for key: ${key}`);
          return data;
        } else if (response.status === 404) {
          console.log(`No data found on server for key: ${key}`);
          return null;
        } else {
          console.error('Server retrieval failed:', response.statusText);
          return null;
        }
      }
      
      console.error('Server storage not configured');
      return null;
    } catch (error) {
      console.error('Storage retrieval error:', error);
      return null;
    }
  }

  async removeItem(key: string): Promise<boolean> {
    try {
      if (this.config.useServerStorage && this.config.serverUrl) {
        const response = await fetch(`${this.config.serverUrl}/api/storage/${key}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${this.config.apiKey}`,
          },
        });
        
        if (response.ok) {
          console.log(`Data deleted from server for key: ${key}`);
          return true;
        } else {
          console.error('Server deletion failed:', response.statusText);
          return false;
        }
      }
      
      console.error('Server storage not configured');
      return false;
    } catch (error) {
      console.error('Storage removal error:', error);
      return false;
    }
  }

  // Method to check if server is available
  async isServerAvailable(): Promise<boolean> {
    try {
      if (!this.config.serverUrl) return false;
      
      const response = await fetch(`${this.config.serverUrl}/api/health`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
        },
      });
      
      return response.ok;
    } catch (error) {
      console.error('Server health check failed:', error);
      return false;
    }
  }
}

export const storageService = new StorageService();
