
import { FileItem } from "@/types";
import { File, Download, Eye, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

interface FileGridProps {
  files: FileItem[];
  onDownload: (file: FileItem) => void;
  onView: (file: FileItem) => void;
  onDelete: (id: string) => void;
  selectedFiles?: string[];
  onToggleSelection?: (id: string) => void;
}

export function FileGrid({ 
  files, 
  onDownload, 
  onView, 
  onDelete,
  selectedFiles = [],
  onToggleSelection
}: FileGridProps) {
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
        <div 
          key={file.id} 
          className={`glass-card p-4 rounded-lg hover:shadow-md transition-all ${
            selectedFiles.includes(file.id) ? 'ring-2 ring-primary' : ''
          }`}
        >
          <div className="flex flex-col space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-2 flex-1 min-w-0">
                <File className="h-8 w-8 text-primary flex-shrink-0" />
                <div className="flex-grow min-w-0">
                  <h3 className="font-medium text-sm truncate">{file.name}</h3>
                  <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                </div>
              </div>
              {onToggleSelection && (
                <Checkbox
                  checked={selectedFiles.includes(file.id)}
                  onCheckedChange={() => onToggleSelection(file.id)}
                />
              )}
            </div>
            
            <div className="text-xs text-muted-foreground">
              <p>Downloads: {file.downloadCount}</p>
              <p>Uploaded: {new Date(file.uploadedAt).toLocaleDateString()}</p>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Button size="sm" variant="outline" onClick={() => onView(file)}>
                <Eye className="h-3 w-3 mr-1" />
                View
              </Button>
              <Button size="sm" onClick={() => onDownload(file)}>
                <Download className="h-3 w-3 mr-1" />
                Download
              </Button>
              <Button 
                size="sm" 
                variant="destructive" 
                onClick={() => onDelete(file.id)}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
