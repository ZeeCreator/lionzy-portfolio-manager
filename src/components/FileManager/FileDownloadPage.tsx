
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FileItem } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, File, ArrowLeft, Eye } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { getFileById, incrementDownloadCount } from "@/utils/fileService";

export function FileDownloadPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [file, setFile] = useState<FileItem | null>(null);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    if (id) {
      const foundFile = getFileById(id);
      if (foundFile) {
        setFile(foundFile);
      } else {
        toast.error("File not found");
        navigate("/file-manager");
      }
    }
  }, [id, navigate]);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleDownload = () => {
    if (!file) return;
    
    setDownloading(true);
    incrementDownloadCount(file.id);
    
    const link = document.createElement('a');
    link.href = file.url;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success("Download started");
    setDownloading(false);
    
    // Update file data to show new download count
    const updatedFile = getFileById(file.id);
    if (updatedFile) {
      setFile(updatedFile);
    }
  };

  const handlePreview = () => {
    if (!file) return;
    window.open(file.url, '_blank');
  };

  if (!file) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary/20">
      <div className="container py-16 px-6">
        <Button 
          variant="outline" 
          onClick={() => navigate("/file-manager")}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to File Manager
        </Button>

        <Card className="max-w-2xl mx-auto">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <File className="h-16 w-16 text-primary" />
            </div>
            <CardTitle className="text-2xl">{file.name}</CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">File Size:</span>
                <p className="text-muted-foreground">{formatFileSize(file.size)}</p>
              </div>
              <div>
                <span className="font-medium">File Type:</span>
                <p className="text-muted-foreground">{file.type}</p>
              </div>
              <div>
                <span className="font-medium">Uploaded:</span>
                <p className="text-muted-foreground">
                  {new Date(file.uploadedAt).toLocaleDateString()}
                </p>
              </div>
              <div>
                <span className="font-medium">Downloads:</span>
                <p className="text-muted-foreground">{file.downloadCount}</p>
              </div>
            </div>

            <div className="flex gap-4 justify-center">
              <Button 
                onClick={handleDownload}
                disabled={downloading}
                size="lg"
              >
                <Download className="h-4 w-4 mr-2" />
                {downloading ? "Downloading..." : "Download File"}
              </Button>
              
              <Button 
                variant="outline"
                onClick={handlePreview}
                size="lg"
              >
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </Button>
            </div>

            <div className="text-center text-xs text-muted-foreground">
              <p>This download is free and secure</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
