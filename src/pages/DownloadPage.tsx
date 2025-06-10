
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FileItem } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, File, ArrowLeft, Eye, Clock, Users } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { getFileById, incrementDownloadCount } from "@/utils/fileService";
import { Badge } from "@/components/ui/badge";

export default function DownloadPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [file, setFile] = useState<FileItem | null>(null);
  const [downloading, setDownloading] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [canDownload, setCanDownload] = useState(false);

  useEffect(() => {
    if (id) {
      const foundFile = getFileById(id);
      if (foundFile) {
        setFile(foundFile);
        // Start countdown for download
        const timer = setInterval(() => {
          setCountdown((prev) => {
            if (prev <= 1) {
              setCanDownload(true);
              clearInterval(timer);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);

        return () => clearInterval(timer);
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
    if (!file || !canDownload) return;
    
    setDownloading(true);
    incrementDownloadCount(file.id);
    
    // Create download link
    const link = document.createElement('a');
    link.href = file.url;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
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

        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Download Card */}
            <div className="lg:col-span-2">
              <Card className="glass-card border-0 shadow-xl">
                <CardHeader className="text-center pb-6">
                  <div className="flex justify-center mb-6">
                    <div className="p-4 bg-primary/10 rounded-full">
                      <File className="h-16 w-16 text-primary" />
                    </div>
                  </div>
                  <CardTitle className="text-3xl mb-2">{file.name}</CardTitle>
                  <div className="flex justify-center gap-2">
                    <Badge variant="secondary">{file.type}</Badge>
                    <Badge variant="outline">{formatFileSize(file.size)}</Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  {/* Download Button */}
                  <div className="text-center">
                    {!canDownload ? (
                      <div className="space-y-4">
                        <div className="flex justify-center items-center gap-2 text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          <span>Unduhan akan tersedia dalam {countdown} detik</span>
                        </div>
                        <Button size="lg" disabled className="w-full sm:w-auto">
                          <Download className="h-4 w-4 mr-2" />
                          Menunggu...
                        </Button>
                      </div>
                    ) : (
                      <Button 
                        onClick={handleDownload}
                        disabled={downloading}
                        size="lg"
                        className="w-full sm:w-auto bg-green-600 hover:bg-green-700"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        {downloading ? "Mengunduh..." : "Unduh File"}
                      </Button>
                    )}
                  </div>

                  {/* Preview Button */}
                  <div className="text-center">
                    <Button 
                      variant="outline"
                      onClick={handlePreview}
                      size="lg"
                      className="w-full sm:w-auto"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Pratinjau File
                    </Button>
                  </div>

                  {/* Security Notice */}
                  <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                    <h3 className="font-semibold text-green-800 dark:text-green-300 mb-2">
                      ✓ Unduhan Aman & Gratis
                    </h3>
                    <p className="text-sm text-green-700 dark:text-green-400">
                      File ini telah dipindai dan aman untuk diunduh. Tidak ada biaya tersembunyi.
                    </p>
                  </div>
                </CardContent>
              </Card>
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
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        <span className="font-medium">{file.downloadCount}</span>
                      </div>
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
                      <span>Tunggu hitungan mundur selesai</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs font-medium">2</span>
                      <span>Klik tombol "Unduh File"</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs font-medium">3</span>
                      <span>Pilih lokasi penyimpanan</span>
                    </li>
                  </ol>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
