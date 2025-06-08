
import { useState, useEffect } from "react";
import { X, Download, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";

interface DownloadProgressProps {
  fileName: string;
  onCancel: () => void;
  onComplete: () => void;
  downloadUrl: string;
}

export function DownloadProgress({ 
  fileName, 
  onCancel, 
  onComplete, 
  downloadUrl 
}: DownloadProgressProps) {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<'downloading' | 'completed' | 'error' | 'cancelled'>('downloading');
  const [abortController, setAbortController] = useState<AbortController | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    setAbortController(controller);

    const startDownload = async () => {
      try {
        // Simulate download progress
        const response = await fetch(downloadUrl, {
          signal: controller.signal
        });

        if (!response.ok) {
          throw new Error('Download failed');
        }

        const contentLength = response.headers.get('content-length');
        const total = contentLength ? parseInt(contentLength, 10) : 0;
        
        const reader = response.body?.getReader();
        if (!reader) throw new Error('Failed to read response');

        let received = 0;
        const chunks: Uint8Array[] = [];

        // Read the stream
        while (true) {
          const { done, value } = await reader.read();
          
          if (done) break;
          
          chunks.push(value);
          received += value.length;
          
          if (total > 0) {
            const progressPercent = Math.round((received / total) * 100);
            setProgress(progressPercent);
          } else {
            // If no content length, simulate progress
            setProgress(prev => Math.min(prev + 10, 90));
          }
        }

        // Create blob and download
        const blob = new Blob(chunks);
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        setProgress(100);
        setStatus('completed');
        setTimeout(() => {
          onComplete();
        }, 2000);

      } catch (error: any) {
        if (error.name === 'AbortError') {
          setStatus('cancelled');
        } else {
          setStatus('error');
          console.error('Download error:', error);
        }
      }
    };

    startDownload();

    return () => {
      controller.abort();
    };
  }, [downloadUrl, fileName, onComplete]);

  const handleCancel = () => {
    if (abortController) {
      abortController.abort();
    }
    setStatus('cancelled');
    onCancel();
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'downloading':
        return <Download className="h-4 w-4 text-primary animate-pulse" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-destructive" />;
      case 'cancelled':
        return <X className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'downloading':
        return 'Downloading...';
      case 'completed':
        return 'Download completed';
      case 'error':
        return 'Download failed';
      case 'cancelled':
        return 'Download cancelled';
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'downloading':
        return 'border-primary/20 bg-primary/5';
      case 'completed':
        return 'border-green-500/20 bg-green-500/5';
      case 'error':
        return 'border-destructive/20 bg-destructive/5';
      case 'cancelled':
        return 'border-muted-foreground/20 bg-muted/5';
    }
  };

  return (
    <Card className={`fixed bottom-4 right-4 w-80 z-50 shadow-lg ${getStatusColor()}`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            {getStatusIcon()}
            <span className="text-sm font-medium">{getStatusText()}</span>
          </div>
          {status === 'downloading' && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCancel}
              className="h-6 w-6 p-0"
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>
        
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground truncate">{fileName}</p>
          {status === 'downloading' && (
            <div className="space-y-1">
              <Progress value={progress} className="h-2" />
              <p className="text-xs text-muted-foreground text-right">{progress}%</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
