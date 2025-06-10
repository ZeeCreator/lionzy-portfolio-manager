
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Copy, Link, ExternalLink, QrCode } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { FileItem } from "@/types";

interface DownloadLinkGeneratorProps {
  file: FileItem;
}

export function DownloadLinkGenerator({ file }: DownloadLinkGeneratorProps) {
  const [downloadLink, setDownloadLink] = useState<string>("");

  const generateDownloadLink = () => {
    const baseUrl = window.location.origin;
    const link = `${baseUrl}/download/${file.id}`;
    setDownloadLink(link);
    toast.success("Tautan unduhan telah dibuat!");
  };

  const copyToClipboard = async () => {
    if (!downloadLink) return;
    
    try {
      await navigator.clipboard.writeText(downloadLink);
      toast.success("Tautan disalin ke clipboard!");
    } catch (error) {
      toast.error("Gagal menyalin tautan");
    }
  };

  const openInNewTab = () => {
    if (!downloadLink) return;
    window.open(downloadLink, '_blank');
  };

  const generateQRCode = () => {
    if (!downloadLink) return;
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(downloadLink)}`;
    window.open(qrUrl, '_blank');
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
          
          {!downloadLink ? (
            <Button onClick={generateDownloadLink} className="w-full">
              <Link className="h-4 w-4 mr-2" />
              Buat Tautan Unduhan
            </Button>
          ) : (
            <div className="space-y-3">
              <div className="flex gap-2">
                <Input 
                  value={downloadLink} 
                  readOnly 
                  className="flex-1"
                />
                <Button variant="outline" size="sm" onClick={copyToClipboard}>
                  <Copy className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={openInNewTab}>
                  <ExternalLink className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={generateQRCode}>
                  <QrCode className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" size="sm" onClick={copyToClipboard}>
                  <Copy className="h-4 w-4 mr-1" />
                  Salin
                </Button>
                <Button variant="outline" size="sm" onClick={generateQRCode}>
                  <QrCode className="h-4 w-4 mr-1" />
                  QR Code
                </Button>
              </div>
              
              <p className="text-xs text-muted-foreground">
                Tautan ini dapat dibagikan kepada siapa saja untuk mengunduh file.
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
