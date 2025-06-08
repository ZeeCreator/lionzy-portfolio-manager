
import { useState } from "react";
import { ShortLinkGenerator } from "@/components/ShortLink/ShortLinkGenerator";
import { ShortLinkManager } from "@/components/ShortLink/ShortLinkManager";
import { createShortLink } from "@/utils/shortLinkService";
import { toast } from "@/components/ui/sonner";

const ShortLinks = () => {
  const [refreshKey, setRefreshKey] = useState(0);

  const generateShortLink = (originalUrl: string, title: string): string => {
    try {
      const newLink = createShortLink(originalUrl, title);
      setRefreshKey(prev => prev + 1);
      return newLink.shortCode;
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to create short link");
      throw error;
    }
  };

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="min-h-screen">
      <section className="py-20 px-6 md:px-12 bg-secondary/50">
        <div className="container">
          <h1 className="text-4xl font-bold animate-fade-in">Short Links</h1>
          <p className="text-muted-foreground mt-2 animate-fade-in">
            Create and manage your short links
          </p>
        </div>
      </section>
      
      <section className="py-16 px-6 md:px-12">
        <div className="container space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <ShortLinkGenerator onGenerate={generateShortLink} />
            
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold">Analytics Overview</h2>
              <div className="glass-card p-6 rounded-lg">
                <p className="text-muted-foreground">Link analytics and statistics will appear here</p>
              </div>
            </div>
          </div>
          
          <div>
            <h2 className="text-2xl font-semibold mb-6">Manage Links</h2>
            <ShortLinkManager key={refreshKey} onRefresh={handleRefresh} />
          </div>
        </div>
      </section>
    </div>
  );
};

export default ShortLinks;
