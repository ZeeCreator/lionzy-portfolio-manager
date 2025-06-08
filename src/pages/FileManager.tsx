import { useState, useEffect } from "react";
import { FileItem } from "@/types";
import { FileUploader } from "@/components/FileManager/FileUploader";
import { FileGrid } from "@/components/FileManager/FileGrid";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Grid, List, Filter, Trash2, Download } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { 
  getFiles, 
  uploadFile, 
  deleteFile, 
  incrementDownloadCount,
  deleteMultipleFiles,
  searchFiles,
  getFilesByType,
  getFileStats
} from "@/utils/fileService";
import { getAppConfig } from "@/utils/configService";
import { useDownloadManager } from "@/hooks/useDownloadManager";
import { DownloadProgress } from "@/components/FileManager/DownloadProgress";

const FileManager = () => {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [filteredFiles, setFilteredFiles] = useState<FileItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedFileType, setSelectedFileType] = useState<string>("all");
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [fileStats, setFileStats] = useState<any>(null);
  const config = getAppConfig();
  const { downloads, startDownload, cancelDownload, completeDownload } = useDownloadManager();

  useEffect(() => {
    loadFiles();
    loadFileStats();
  }, []);

  useEffect(() => {
    filterFiles();
  }, [files, searchTerm, selectedFileType]);

  const loadFiles = () => {
    const loadedFiles = getFiles();
    setFiles(loadedFiles);
    setFilteredFiles(loadedFiles);
  };

  const loadFileStats = () => {
    const stats = getFileStats();
    setFileStats(stats);
  };

  const filterFiles = () => {
    let filtered = files;

    if (searchTerm) {
      filtered = searchFiles(searchTerm);
    }

    if (selectedFileType !== "all") {
      filtered = getFilesByType(selectedFileType);
    }

    if (searchTerm && selectedFileType !== "all") {
      filtered = filtered.filter(file => {
        const extension = file.name.split('.').pop()?.toLowerCase();
        return extension === selectedFileType &&
               file.name.toLowerCase().includes(searchTerm.toLowerCase());
      });
    }

    setFilteredFiles(filtered);
  };

  const handleUpload = async (file: File) => {
    if (!config.fileManager.uploadEnabled) {
      toast.error("File upload is disabled");
      return;
    }

    const maxSizeBytes = config.fileManager.maxFileSize * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      toast.error(`File size exceeds limit of ${config.fileManager.maxFileSize}MB`);
      return;
    }

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
      loadFileStats();
      toast.success("File uploaded successfully!");
    } catch (error) {
      toast.error("Failed to upload file");
    }
  };

  const handleDownload = (file: FileItem) => {
    incrementDownloadCount(file.id);
    startDownload(file);
    toast.success(`Download started: ${file.name}`);
  };

  const handleView = (file: FileItem) => {
    window.open(file.url, '_blank');
  };

  const handleDelete = (id: string) => {
    if (deleteFile(id)) {
      loadFiles();
      loadFileStats();
      setSelectedFiles(prev => prev.filter(fileId => fileId !== id));
      toast.success("File deleted successfully");
    } else {
      toast.error("Failed to delete file");
    }
  };

  const handleBulkDelete = () => {
    if (selectedFiles.length === 0) {
      toast.error("No files selected");
      return;
    }

    const deletedCount = deleteMultipleFiles(selectedFiles);
    loadFiles();
    loadFileStats();
    setSelectedFiles([]);
    toast.success(`${deletedCount} files deleted successfully`);
  };

  const toggleFileSelection = (id: string) => {
    setSelectedFiles(prev =>
      prev.includes(id)
        ? prev.filter(fileId => fileId !== id)
        : [...prev, id]
    );
  };

  const selectAllFiles = () => {
    if (selectedFiles.length === filteredFiles.length) {
      setSelectedFiles([]);
    } else {
      setSelectedFiles(filteredFiles.map(file => file.id));
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
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
          
          {fileStats && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <div className="glass-card p-4 rounded-lg">
                <p className="text-2xl font-bold">{fileStats.totalFiles}</p>
                <p className="text-sm text-muted-foreground">Total Files</p>
              </div>
              <div className="glass-card p-4 rounded-lg">
                <p className="text-2xl font-bold">{formatFileSize(fileStats.totalSize)}</p>
                <p className="text-sm text-muted-foreground">Total Size</p>
              </div>
              <div className="glass-card p-4 rounded-lg">
                <p className="text-2xl font-bold">{fileStats.totalDownloads}</p>
                <p className="text-sm text-muted-foreground">Total Downloads</p>
              </div>
              <div className="glass-card p-4 rounded-lg">
                <p className="text-2xl font-bold">{Object.keys(fileStats.typeStats).length}</p>
                <p className="text-sm text-muted-foreground">File Types</p>
              </div>
            </div>
          )}
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

              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-4">
                  <p className="text-sm text-muted-foreground">
                    Showing {filteredFiles.length} of {files.length} files
                  </p>
                  {selectedFiles.length > 0 && (
                    <p className="text-sm text-primary">
                      {selectedFiles.length} files selected
                    </p>
                  )}
                </div>
                
                <div className="flex gap-2">
                  {filteredFiles.length > 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={selectAllFiles}
                    >
                      {selectedFiles.length === filteredFiles.length ? "Deselect All" : "Select All"}
                    </Button>
                  )}
                  
                  {selectedFiles.length > 0 && (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={handleBulkDelete}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete Selected
                    </Button>
                  )}
                </div>
              </div>

              {filteredFiles.length > 0 ? (
                <FileGrid 
                  files={filteredFiles}
                  onDownload={handleDownload}
                  onView={handleView}
                  onDelete={handleDelete}
                  selectedFiles={selectedFiles}
                  onToggleSelection={toggleFileSelection}
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
};

export default FileManager;
