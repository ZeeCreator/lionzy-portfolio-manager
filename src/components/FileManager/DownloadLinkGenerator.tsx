
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Copy, Link, ExternalLink, QrCode, Trash2 } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { FileItem } from "@/types";
import { 
  createDownloadLink, 
  getDownloadLinksByFileId, 
  deleteDownloadLink 
} from "@/utils/downloadLinkService";

interface DownloadLinkGeneratorProps {
  file: FileItem;
}

export function DownloadLinkGenerator({ file }: DownloadLinkGeneratorProps) {
  const [downloadLinks, setDownloadLinks] = useState<any[]>([]);

  useEffect(() => {
    loadDownloadLinks();
  }, [file.id]);

  const loadDownloadLinks = () => {
    const links = getDownloadLinksByFileId(file.id);
    setDownloadLinks(links);
  };

  const generateDownloadLink = () => {
    const newLink = createDownloadLink(file.id, file.name);
    loadDownloadLinks();
    toast.success("Tautan unduhan telah dibuat dan disimpan!");
  };

  const copyToClipboard = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Tautan disalin ke clipboard!");
    } catch (error) {
      toast.error("Gagal menyalin tautan");
    }
  };

  const openInNewTab = (url: string) => {
    window.open(url, '_blank');
  };

  const generateQRCode = (url: string) => {
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(url)}`;
    window.open(qrUrl, '_blank');
  };

  const handleDeleteLink = (linkId: string) => {
    if (deleteDownloadLink(linkId)) {
      loadDownloadLinks();
      toast.success("Tautan berhasil dihapus!");
    } else {
      toast.error("Gagal menghapus tautan");
    }
  };

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Link className="h-5 w-5" />
          Generator Tautan Unduhan
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            Buat tautan unduhan yang dapat dibagikan untuk file: <strong>{file.name}</strong>
          </p>
          
          <Button onClick={generateDownloadLink} className="w-full">
            <Link className="h-4 w-4 mr-2" />
            Buat Tautan Unduhan Baru
          </Button>

          {downloadLinks.length > 0 && (
            <div className="space-y-3 mt-4">
              <h4 className="font-medium">Tautan yang Tersimpan:</h4>
              {downloadLinks.map((link) => (
                <div key={link.id} className="space-y-2 p-3 border rounded-lg">
                  <div className="flex gap-2">
                    <Input 
                      value={link.url} 
                      readOnly 
                      className="flex-1"
                    />
                    <Button variant="outline" size="sm" onClick={() => copyToClipboard(link.url)}>
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => openInNewTab(link.url)}>
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => generateQRCode(link.url)}>
                      <QrCode className="h-4 w-4" />
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDeleteLink(link.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="text-xs text-muted-foreground">
                    <p>Dibuat: {new Date(link.createdAt).toLocaleDateString('id-ID')}</p>
                    <p>Klik: {link.clicks}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {downloadLinks.length === 0 && (
            <p className="text-xs text-muted-foreground text-center py-4">
              Belum ada tautan unduhan yang dibuat untuk file ini.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
