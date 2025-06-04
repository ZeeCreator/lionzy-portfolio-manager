
import { useState, useEffect } from "react";
import { ShortLink } from "@/types";
import { ShortLinkGenerator } from "@/components/ShortLink/ShortLinkGenerator";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Copy, ExternalLink, Trash2, ToggleLeft, ToggleRight } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { 
  getShortLinks, 
  createShortLink, 
  deleteShortLink, 
  toggleShortLinkStatus 
} from "@/utils/shortLinkService";

const ShortLinks = () => {
  const [shortLinks, setShortLinks] = useState<ShortLink[]>([]);

  useEffect(() => {
    setShortLinks(getShortLinks());
  }, []);

  const generateShortLink = (originalUrl: string, title: string): string => {
    try {
      const newLink = createShortLink(originalUrl, title);
      setShortLinks(getShortLinks());
      return newLink.shortCode;
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to create short link");
      throw error;
    }
  };

  const copyToClipboard = (shortCode: string) => {
    const shortUrl = `${window.location.origin}/s/${shortCode}`;
    navigator.clipboard.writeText(shortUrl);
    toast.success("Short link copied to clipboard!");
  };

  const toggleActive = (id: string) => {
    if (toggleShortLinkStatus(id)) {
      setShortLinks(getShortLinks());
      toast.success("Link status updated");
    } else {
      toast.error("Failed to update link status");
    }
  };

  const handleDeleteLink = (id: string) => {
    if (deleteShortLink(id)) {
      setShortLinks(getShortLinks());
      toast.success("Short link deleted");
    } else {
      toast.error("Failed to delete short link");
    }
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
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <ShortLinkGenerator onGenerate={generateShortLink} />
            
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold">Manage Links</h2>
              
              {shortLinks.length > 0 ? (
                <div className="glass-card rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Short Code</TableHead>
                        <TableHead>Clicks</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {shortLinks.map((link) => (
                        <TableRow key={link.id}>
                          <TableCell className="font-medium">
                            {link.title}
                          </TableCell>
                          <TableCell>
                            <code className="text-sm bg-secondary px-2 py-1 rounded">
                              {link.shortCode}
                            </code>
                          </TableCell>
                          <TableCell>{link.clickCount}</TableCell>
                          <TableCell>
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              link.active 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {link.active ? 'Active' : 'Inactive'}
                            </span>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => copyToClipboard(link.shortCode)}
                              >
                                <Copy className="h-3 w-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => window.open(link.originalUrl, '_blank')}
                              >
                                <ExternalLink className="h-3 w-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => toggleActive(link.id)}
                              >
                                {link.active ? (
                                  <ToggleRight className="h-3 w-3" />
                                ) : (
                                  <ToggleLeft className="h-3 w-3" />
                                )}
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleDeleteLink(link.id)}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-12 glass-card rounded-lg">
                  <p className="text-muted-foreground">No short links created yet</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ShortLinks;
