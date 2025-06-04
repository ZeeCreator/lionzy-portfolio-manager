
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Copy, Link } from "lucide-react";
import { toast } from "@/components/ui/sonner";

interface ShortLinkGeneratorProps {
  onGenerate: (url: string, title: string) => string;
}

export function ShortLinkGenerator({ onGenerate }: ShortLinkGeneratorProps) {
  const [originalUrl, setOriginalUrl] = useState("");
  const [title, setTitle] = useState("");
  const [generatedUrl, setGeneratedUrl] = useState("");

  const handleGenerate = () => {
    if (!originalUrl) {
      toast.error("Please enter a URL");
      return;
    }

    const shortCode = onGenerate(originalUrl, title || "Untitled");
    const shortUrl = `${window.location.origin}/s/${shortCode}`;
    setGeneratedUrl(shortUrl);
    toast.success("Short link generated!");
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedUrl);
    toast.success("Short link copied to clipboard!");
  };

  return (
    <Card className="p-6 animate-fade-in">
      <div className="space-y-4">
        <div className="flex items-center space-x-2 mb-4">
          <Link className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">Generate Short Link</h2>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="original-url">Original URL</Label>
            <Input
              id="original-url"
              value={originalUrl}
              onChange={(e) => setOriginalUrl(e.target.value)}
              placeholder="https://example.com/very-long-url"
              required
            />
          </div>

          <div>
            <Label htmlFor="title">Title (Optional)</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="My Link"
            />
          </div>

          <Button onClick={handleGenerate} className="w-full">
            Generate Short Link
          </Button>

          {generatedUrl && (
            <div className="p-4 bg-secondary rounded-lg">
              <Label className="text-sm font-medium">Generated Short Link:</Label>
              <div className="flex items-center space-x-2 mt-2">
                <Input value={generatedUrl} readOnly />
                <Button size="sm" onClick={copyToClipboard}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
