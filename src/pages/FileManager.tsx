
import { useState, useEffect } from "react";
import { FileItem } from "@/types";
import { FileUploader } from "@/components/FileManager/FileUploader";
import { FileGrid } from "@/components/FileManager/FileGrid";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Grid, List, Filter } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { 
  getFiles, 
  uploadFile, 
  deleteFile, 
  incrementDownloadCount,
  generateFileUrl 
} from "@/utils/fileService";
import { getAppConfig } from "@/utils/configService";

const FileManager = () => {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [filteredFiles, setFilteredFiles] = useState<FileItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedFileType, setSelectedFileType] = useState<string>("all");
  const config = getAppConfig();

  useEffect(() => {
    loadFiles();
  }, []);

  useEffect(() => {
    filterFiles();
  }, [files, searchTerm, selectedFileType]);

  const loadFiles = () => {
    const loadedFiles = getFiles();
    setFiles(loadedFiles);
    setFilteredFiles(loadedFiles);
  };

  const filterFiles = () => {
    let filtered = files;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(file =>
        file.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by file type
    if (selectedFileType !== "all") {
      filtered = filtered.filter(file => {
        const fileExtension = file.name.split('.').pop()?.toLowerCase();
        return fileExtension === selectedFileType;
      });
    }

    setFilteredFiles(filtered);
  };

  const handleUpload = async (file: File) => {
    if (!config.fileManager.uploadEnabled) {
      toast.error("File upload is disabled");
      return;
    }

    // Check file size limit
    const maxSizeBytes = config.fileManager.maxFileSize * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      toast.error(`File size exceeds limit of ${config.fileManager.maxFileSize}MB`);
      return;
    }

    // Check allowed file types
    if (!config.fileManager.allowedFileTypes.includes("*")) {
      const fileExtension = file.name.split('.').pop()?.toLowerCase();
      if (!fileExtension || !config.fileManager.allowedFileTypes.includes(fileExtension)) {
        toast.error("File type not allowed");
        return;
      }
    }

    try {
      await uploadFile(file);
      loadFiles();
      toast.success("File uploaded successfully!");
    } catch (error) {
      toast.error("Failed to upload file");
    }
  };

  const handleDownload = (file: FileItem) => {
    incrementDownloadCount(file.id);
    setFiles(getFiles()); // Refresh to show updated download count
    
    // Create a download link
    const link = document.createElement('a');
    link.href = file.url;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success("Download started");
  };

  const handleView = (file: FileItem) => {
    window.open(file.url, '_blank');
  };

  const handleDelete = (id: string) => {
    if (deleteFile(id)) {
      loadFiles();
      toast.success("File deleted successfully");
    } else {
      toast.error("Failed to delete file");
    }
  };

  const getUniqueFileTypes = () => {
    const types = new Set<string>();
    files.forEach(file => {
      const extension = file.name.split('.').pop()?.toLowerCase();
      if (extension) types.add(extension);
    });
    return Array.from(types);
  };

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
          <div className="space-y-8">
            {config.fileManager.uploadEnabled && (
              <div className="glass-card p-6 rounded-lg">
                <h2 className="text-2xl font-semibold mb-4">Upload Files</h2>
                <FileUploader onUpload={handleUpload} />
              </div>
            )}

            <div className="glass-card p-6 rounded-lg">
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search files..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <div className="flex gap-2">
                  <select 
                    className="px-3 py-2 border border-input bg-background rounded-md"
                    value={selectedFileType}
                    onChange={(e) => setSelectedFileType(e.target.value)}
                  >
                    <option value="all">All Types</option>
                    {getUniqueFileTypes().map(type => (
                      <option key={type} value={type}>{type.toUpperCase()}</option>
                    ))}
                  </select>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
                  >
                    {viewMode === "grid" ? <List className="h-4 w-4" /> : <Grid className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-sm text-muted-foreground">
                  Showing {filteredFiles.length} of {files.length} files
                </p>
              </div>

              {filteredFiles.length > 0 ? (
                <FileGrid 
                  files={filteredFiles}
                  onDownload={handleDownload}
                  onView={handleView}
                  onDelete={handleDelete}
                />
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">
                    {files.length === 0 ? "No files uploaded yet" : "No files match your search criteria"}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FileManager;
