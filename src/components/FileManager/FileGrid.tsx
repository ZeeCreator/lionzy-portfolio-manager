
import { FileItem } from "@/types";
import { File, Download, Grid } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FileGridProps {
  files: FileItem[];
  onDownload: (file: FileItem) => void;
  onView: (file: FileItem) => void;
  onDelete: (id: string) => void;
}

export function FileGrid({ files, onDownload, onView, onDelete }: FileGridProps) {
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 animate-fade-in">
      {files.map((file) => (
        <div key={file.id} className="glass-card p-4 rounded-lg hover:shadow-md transition-shadow">
          <div className="flex flex-col space-y-3">
            <div className="flex items-center space-x-2">
              <File className="h-8 w-8 text-primary" />
              <div className="flex-grow min-w-0">
                <h3 className="font-medium text-sm truncate">{file.name}</h3>
                <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
              </div>
            </div>
            
            <div className="text-xs text-muted-foreground">
              <p>Downloads: {file.downloadCount}</p>
              <p>Uploaded: {new Date(file.uploadedAt).toLocaleDateString()}</p>
            </div>
            
            <div className="flex space-x-2">
              <Button size="sm" variant="outline" onClick={() => onView(file)}>
                View
              </Button>
              <Button size="sm" onClick={() => onDownload(file)}>
                <Download className="h-3 w-3 mr-1" />
                Download
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
