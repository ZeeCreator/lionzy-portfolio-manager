
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FileItem } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, File, ArrowLeft, Eye, Share } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { getFileById, incrementDownloadCount } from "@/utils/fileService";
import { useDownloadManager } from "@/hooks/useDownloadManager";
import { DownloadProgress } from "./DownloadProgress";
import { DownloadLinkGenerator } from "./DownloadLinkGenerator";

export function FileDownloadPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [file, setFile] = useState<FileItem | null>(null);
  const [downloading, setDownloading] = useState(false);
  const [showLinkGenerator, setShowLinkGenerator] = useState(false);
  const { downloads, startDownload, cancelDownload, completeDownload } = useDownloadManager();

  useEffect(() => {
    if (id) {
      const foundFile = getFileById(id);
      if (foundFile) {
        setFile(foundFile);
      } else {
        toast.error("File tidak ditemukan");
        navigate("/files");
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
    startDownload(file);
    toast.success("Unduhan dimulai");
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
          <p className="text-muted-foreground">Memuat...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container py-16 px-6">
        <Button 
          variant="outline" 
          onClick={() => navigate("/files")}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Kembali ke Pengelola File
        </Button>

        <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Download Card */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="glass-card border-0 shadow-xl">
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <File className="h-16 w-16 text-primary" />
                </div>
                <CardTitle className="text-2xl">{file.name}</CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Ukuran File:</span>
                    <p className="text-muted-foreground">{formatFileSize(file.size)}</p>
                  </div>
                  <div>
                    <span className="font-medium">Jenis File:</span>
                    <p className="text-muted-foreground">{file.type}</p>
                  </div>
                  <div>
                    <span className="font-medium">Diunggah:</span>
                    <p className="text-muted-foreground">
                      {new Date(file.uploadedAt).toLocaleDateString('id-ID')}
                    </p>
                  </div>
                  <div>
                    <span className="font-medium">Unduhan:</span>
                    <p className="text-muted-foreground">{file.downloadCount}</p>
                  </div>
                </div>

                <div className="flex gap-4 justify-center flex-wrap">
                  <Button 
                    onClick={handleDownload}
                    disabled={downloading}
                    size="lg"
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    {downloading ? "Mengunduh..." : "Unduh File"}
                  </Button>
                  
                  <Button 
                    variant="outline"
                    onClick={handlePreview}
                    size="lg"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Pratinjau
                  </Button>

                  <Button 
                    variant="outline"
                    onClick={() => setShowLinkGenerator(!showLinkGenerator)}
                    size="lg"
                  >
                    <Share className="h-4 w-4 mr-2" />
                    Bagikan
                  </Button>
                </div>

                <div className="text-center text-xs text-muted-foreground">
                  <p>Unduhan ini gratis dan aman</p>
                </div>
              </CardContent>
            </Card>

            {/* Download Link Generator */}
            {showLinkGenerator && (
              <DownloadLinkGenerator file={file} />
            )}
          </div>

          {/* File Info Sidebar */}
          <div className="space-y-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-lg">Informasi File</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Ukuran:</span>
                    <span className="font-medium">{formatFileSize(file.size)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Jenis:</span>
                    <span className="font-medium">{file.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Diunggah:</span>
                    <span className="font-medium">
                      {new Date(file.uploadedAt).toLocaleDateString('id-ID')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Unduhan:</span>
                    <span className="font-medium">{file.downloadCount}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Instructions */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-lg">Cara Mengunduh</CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="text-sm space-y-2 text-muted-foreground">
                  <li className="flex gap-2">
                    <span className="bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs font-medium">1</span>
                    <span>Klik tombol "Unduh File"</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs font-medium">2</span>
                    <span>Pilih lokasi penyimpanan</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs font-medium">3</span>
                    <span>File akan terunduh otomatis</span>
                  </li>
                </ol>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Download Progress Bubbles */}
      {downloads.map((download) => (
        <DownloadProgress
          key={download.id}
          fileName={download.file.name}
          downloadUrl={download.file.url}
          onCancel={() => cancelDownload(download.id)}
          onComplete={() => completeDownload(download.id)}
        />
      ))}
    </div>
  );
}
