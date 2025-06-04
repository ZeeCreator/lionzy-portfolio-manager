
import { useState, useEffect } from "react";
import { FileItem } from "@/types";
import { FileGrid } from "@/components/FileManager/FileGrid";
import { FileUploader } from "@/components/FileManager/FileUploader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, Search, Grid, List } from "lucide-react";
import { toast } from "@/components/ui/sonner";

const FileManager = () => {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showUploader, setShowUploader] = useState(false);

  useEffect(() => {
    // Load files from localStorage
    const storedFiles = localStorage.getItem('lionzy_files');
    if (storedFiles) {
      setFiles(JSON.parse(storedFiles));
    }
  }, []);

  const handleFileUpload = (file: File) => {
    const newFile: FileItem = {
      id: Date.now().toString(),
      name: file.name,
      size: file.size,
      type: file.type,
      url: URL.createObjectURL(file),
      uploadedAt: new Date().toISOString(),
      downloadCount: 0
    };

    const updatedFiles = [...files, newFile];
    setFiles(updatedFiles);
    localStorage.setItem('lionzy_files', JSON.stringify(updatedFiles));
    toast.success(`${file.name} uploaded successfully!`);
    setShowUploader(false);
  };

  const handleDownload = (file: FileItem) => {
    const updatedFiles = files.map(f => 
      f.id === file.id ? { ...f, downloadCount: f.downloadCount + 1 } : f
    );
    setFiles(updatedFiles);
    localStorage.setItem('lionzy_files', JSON.stringify(updatedFiles));
    
    // Create download link
    const link = document.createElement('a');
    link.href = file.url;
    link.download = file.name;
    link.click();
    
    toast.success(`Downloading ${file.name}`);
  };

  const handleView = (file: FileItem) => {
    window.open(file.url, '_blank');
  };

  const handleDelete = (id: string) => {
    const updatedFiles = files.filter(f => f.id !== id);
    setFiles(updatedFiles);
    localStorage.setItem('lionzy_files', JSON.stringify(updatedFiles));
    toast.success("File deleted successfully");
  };

  const generateDownloadUrl = (file: FileItem) => {
    const downloadUrl = `${window.location.origin}/download/${file.id}`;
    navigator.clipboard.writeText(downloadUrl);
    toast.success("Download URL copied to clipboard!");
  };

  const filteredFiles = files.filter(file =>
    file.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen">
      <section className="py-20 px-6 md:px-12 bg-secondary/50">
        <div className="container">
          <h1 className="text-4xl font-bold animate-fade-in">File Manager</h1>
          <p className="text-muted-foreground mt-2 animate-fade-in">
            Upload, manage, and share your files
          </p>
        </div>
      </section>
      
      <section className="py-16 px-6 md:px-12">
        <div className="container">
          <div className="mb-8 space-y-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex items-center space-x-4 flex-grow">
                <div className="relative flex-grow max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search files..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <Button onClick={() => setShowUploader(!showUploader)}>
                <Upload className="h-4 w-4 mr-2" />
                Upload File
              </Button>
            </div>
            
            {showUploader && (
              <FileUploader onUpload={handleFileUpload} />
            )}
          </div>

          {filteredFiles.length > 0 ? (
            <FileGrid
              files={filteredFiles}
              onDownload={handleDownload}
              onView={handleView}
              onDelete={handleDelete}
            />
          ) : (
            <div className="text-center py-20 animate-fade-in">
              <Upload className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-medium mb-2">No files uploaded yet</h3>
              <p className="text-muted-foreground mb-6">Get started by uploading your first file</p>
              <Button onClick={() => setShowUploader(true)}>
                <Upload className="h-4 w-4 mr-2" />
                Upload File
              </Button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default FileManager;
