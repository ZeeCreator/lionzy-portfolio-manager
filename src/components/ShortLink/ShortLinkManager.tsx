
import { useState, useEffect } from "react";
import { ShortLink } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { 
  Copy, 
  ExternalLink, 
  Trash2, 
  ToggleLeft, 
  ToggleRight, 
  Edit, 
  Plus,
  Search
} from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { 
  getShortLinks, 
  updateShortLink, 
  deleteShortLink, 
  toggleShortLinkStatus,
  duplicateShortLink,
  searchShortLinks
} from "@/utils/shortLinkService";

interface ShortLinkManagerProps {
  onRefresh: () => void;
}

export function ShortLinkManager({ onRefresh }: ShortLinkManagerProps) {
  const [shortLinks, setShortLinks] = useState<ShortLink[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingLink, setEditingLink] = useState<ShortLink | null>(null);
  const [editForm, setEditForm] = useState({ title: "", originalUrl: "", shortCode: "" });

  useEffect(() => {
    loadShortLinks();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      setShortLinks(searchShortLinks(searchQuery));
    } else {
      setShortLinks(getShortLinks());
    }
  }, [searchQuery]);

  const loadShortLinks = () => {
    setShortLinks(getShortLinks());
  };

  const copyToClipboard = (shortCode: string) => {
    const shortUrl = `${window.location.origin}/s/${shortCode}`;
    navigator.clipboard.writeText(shortUrl);
    toast.success("Short link copied to clipboard!");
  };

  const toggleActive = (id: string) => {
    if (toggleShortLinkStatus(id)) {
      loadShortLinks();
      onRefresh();
      toast.success("Link status updated");
    } else {
      toast.error("Failed to update link status");
    }
  };

  const handleDeleteLink = (id: string) => {
    if (deleteShortLink(id)) {
      loadShortLinks();
      onRefresh();
      toast.success("Short link deleted");
    } else {
      toast.error("Failed to delete short link");
    }
  };

  const handleDuplicateLink = (id: string) => {
    try {
      duplicateShortLink(id);
      loadShortLinks();
      onRefresh();
      toast.success("Short link duplicated");
    } catch (error) {
      toast.error("Failed to duplicate short link");
    }
  };

  const openEditDialog = (link: ShortLink) => {
    setEditingLink(link);
    setEditForm({
      title: link.title,
      originalUrl: link.originalUrl,
      shortCode: link.shortCode,
    });
  };

  const handleUpdateLink = () => {
    if (!editingLink) return;

    try {
      updateShortLink(editingLink.id, editForm);
      loadShortLinks();
      onRefresh();
      setEditingLink(null);
      toast.success("Short link updated");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update short link");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search links..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {shortLinks.length > 0 ? (
        <div className="glass-card rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Short Code</TableHead>
                <TableHead>Original URL</TableHead>
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
                  <TableCell className="max-w-xs truncate">
                    {link.originalUrl}
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
                    <div className="flex space-x-1">
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
                        onClick={() => openEditDialog(link)}
                      >
                        <Edit className="h-3 w-3" />
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
                        variant="outline"
                        onClick={() => handleDuplicateLink(link.id)}
                      >
                        <Plus className="h-3 w-3" />
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
          <p className="text-muted-foreground">
            {searchQuery ? "No links match your search" : "No short links created yet"}
          </p>
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={!!editingLink} onOpenChange={(open) => !open && setEditingLink(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Short Link</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-title">Title</Label>
              <Input
                id="edit-title"
                value={editForm.title}
                onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="edit-url">Original URL</Label>
              <Input
                id="edit-url"
                value={editForm.originalUrl}
                onChange={(e) => setEditForm({ ...editForm, originalUrl: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="edit-code">Short Code</Label>
              <Input
                id="edit-code"
                value={editForm.shortCode}
                onChange={(e) => setEditForm({ ...editForm, shortCode: e.target.value })}
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleUpdateLink}>Update</Button>
              <Button variant="outline" onClick={() => setEditingLink(null)}>Cancel</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
