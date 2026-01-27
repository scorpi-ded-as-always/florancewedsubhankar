import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Download, RefreshCw, Image, Lock, Trash2, Archive, X, Play } from "lucide-react";
import JSZip from "jszip";

interface B2File {
  id: string;
  name: string;
  size: number;
  contentType: string;
  uploadedAt: string;
  publicUrl: string;
}

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [media, setMedia] = useState<B2File[]>([]);
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<Set<string>>(new Set());
  const [lightboxItem, setLightboxItem] = useState<B2File | null>(null);

  const ADMIN_PASSWORD = "wedding2025";

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      sessionStorage.setItem("admin_auth", "true");
      toast.success("Welcome, Admin!");
    } else {
      toast.error("Incorrect password");
    }
  };

  useEffect(() => {
    if (sessionStorage.getItem("admin_auth") === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchMedia();
    }
  }, [isAuthenticated]);

  const isVideo = (fileName: string) => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    return ['mp4', 'mov', 'webm', 'avi', 'mkv'].includes(ext || '');
  };

  const fetchMedia = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("list-b2-files");

      if (error) throw error;
      if (!data.success) throw new Error(data.error);
      
      setMedia(data.files || []);
    } catch (error) {
      console.error("Error fetching media:", error);
      toast.error("Failed to fetch media from Backblaze");
    } finally {
      setLoading(false);
    }
  };

  const downloadItem = async (file: B2File) => {
    try {
      toast.info(`Downloading ${file.name}...`);
      
      const response = await fetch(file.publicUrl);
      if (!response.ok) throw new Error("Failed to download");
      
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = file.name.split('/').pop() || file.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success(`Downloaded ${file.name}`);
    } catch (error) {
      console.error("Download error:", error);
      toast.error("Failed to download");
    }
  };

  const downloadAsZip = async (itemsToDownload: B2File[], zipName: string) => {
    if (itemsToDownload.length === 0) return;
    
    setDownloading(true);
    const zip = new JSZip();
    
    try {
      toast.info(`Preparing ${itemsToDownload.length} files for download...`);
      
      let completed = 0;
      for (const item of itemsToDownload) {
        try {
          const response = await fetch(item.publicUrl);
          if (!response.ok) {
            console.error(`Failed to download ${item.name}`);
            continue;
          }

          const blob = await response.blob();
          const fileName = item.name.split('/').pop() || item.name;
          zip.file(fileName, blob);
          completed++;
          
          if (completed % 5 === 0) {
            toast.info(`Downloaded ${completed}/${itemsToDownload.length} files...`);
          }
        } catch (err) {
          console.error(`Error downloading ${item.name}:`, err);
        }
      }

      toast.info("Creating zip file...");
      const content = await zip.generateAsync({ type: "blob" });
      
      const url = URL.createObjectURL(content);
      const a = document.createElement("a");
      a.href = url;
      a.download = zipName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success(`${completed} files downloaded as ${zipName}`);
    } catch (error) {
      console.error("Zip creation error:", error);
      toast.error("Failed to create zip file");
    } finally {
      setDownloading(false);
    }
  };

  const downloadAll = async () => {
    await downloadAsZip(media, "wedding-media.zip");
  };

  const deleteItem = async (file: B2File) => {
    try {
      const { data, error } = await supabase.functions.invoke("delete-b2-file", {
        body: { fileId: file.id, fileName: file.name },
      });

      if (error) throw error;
      if (!data.success) throw new Error(data.error);

      setMedia((prev) => prev.filter((p) => p.id !== file.id));
      setLightboxItem(null);
      toast.success("Deleted successfully");
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete");
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedMedia((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const downloadSelected = async () => {
    const toDownload = media.filter((p) => selectedMedia.has(p.id));
    await downloadAsZip(toDownload, "selected-media.zip");
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const openLightbox = (item: B2File, e: React.MouseEvent) => {
    e.stopPropagation();
    setLightboxItem(item);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <div className="bg-card rounded-2xl p-8 shadow-lg border">
            <div className="flex items-center justify-center mb-6">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Lock className="w-6 h-6 text-primary" />
              </div>
            </div>
            <h1 className="text-2xl font-serif text-center mb-2">Admin Access</h1>
            <p className="text-muted-foreground text-center text-sm mb-6">
              Enter password to view uploaded media
            </p>
            <form onSubmit={handleLogin} className="space-y-4">
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="text-center"
              />
              <Button type="submit" className="w-full">
                Access Media
              </Button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-serif text-foreground">Media Admin</h1>
            <p className="text-muted-foreground">
              {media.length} file(s) in Backblaze B2
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={fetchMedia} disabled={loading}>
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            {selectedMedia.size > 0 && (
              <Button variant="outline" onClick={downloadSelected} disabled={downloading}>
                <Archive className="w-4 h-4 mr-2" />
                {downloading ? "Creating ZIP..." : `Download Selected (${selectedMedia.size})`}
              </Button>
            )}
            <Button onClick={downloadAll} disabled={media.length === 0 || downloading}>
              <Archive className="w-4 h-4 mr-2" />
              {downloading ? "Creating ZIP..." : "Download All (.zip)"}
            </Button>
          </div>
        </div>

        {/* Media grid */}
        {loading ? (
          <div className="text-center py-20">
            <RefreshCw className="w-8 h-8 mx-auto mb-4 text-primary animate-spin" />
            <p className="text-muted-foreground">Loading media from Backblaze...</p>
          </div>
        ) : media.length === 0 ? (
          <div className="text-center py-20">
            <Image className="w-16 h-16 mx-auto mb-4 text-muted-foreground/30" />
            <p className="text-muted-foreground">No media uploaded yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {media.map((item) => (
              <div
                key={item.id}
                className={`group relative aspect-square rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                  selectedMedia.has(item.id)
                    ? "border-primary ring-2 ring-primary/20"
                    : "border-transparent hover:border-primary/30"
                }`}
                onClick={(e) => openLightbox(item, e)}
              >
                {isVideo(item.name) ? (
                  <div className="w-full h-full bg-muted flex items-center justify-center">
                    <Play className="w-12 h-12 text-primary" />
                  </div>
                ) : (
                  <img
                    src={item.publicUrl}
                    alt={item.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                )}

                {/* Selection checkbox */}
                <div 
                  className="absolute top-2 left-2 z-10"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleSelect(item.id);
                  }}
                >
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center border-2 ${
                    selectedMedia.has(item.id) 
                      ? "bg-primary border-primary" 
                      : "bg-background/80 border-muted-foreground/50"
                  }`}>
                    {selectedMedia.has(item.id) && (
                      <span className="text-xs text-primary-foreground font-bold">✓</span>
                    )}
                  </div>
                </div>

                {/* Info */}
                <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-foreground/80 to-transparent">
                  <p className="text-xs text-background truncate">
                    {item.name.split('/').pop()}
                  </p>
                  <p className="text-xs text-background/70">
                    {formatSize(item.size)} • {formatDate(item.uploadedAt)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightboxItem && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setLightboxItem(null)}
        >
          <div 
            className="relative max-w-5xl max-h-[90vh] w-full flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button 
              onClick={() => setLightboxItem(null)}
              className="absolute -top-12 right-0 text-white hover:text-primary transition-colors"
            >
              <X className="w-8 h-8" />
            </button>

            {/* Media */}
            <div className="w-full flex-1 flex items-center justify-center overflow-hidden">
              {isVideo(lightboxItem.name) ? (
                <video 
                  src={lightboxItem.publicUrl} 
                  controls 
                  className="max-w-full max-h-[70vh] rounded-lg"
                  autoPlay
                />
              ) : (
                <img
                  src={lightboxItem.publicUrl}
                  alt={lightboxItem.name}
                  className="max-w-full max-h-[70vh] object-contain rounded-lg"
                />
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4 mt-6">
              <Button
                variant="secondary"
                onClick={() => downloadItem(lightboxItem)}
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  if (confirm(`Delete ${lightboxItem.name}?`)) {
                    deleteItem(lightboxItem);
                  }
                }}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>
            </div>

            {/* File info */}
            <div className="text-center mt-4">
              <p className="text-white/70 text-sm truncate max-w-full">
                {lightboxItem.name}
              </p>
              <p className="text-white/50 text-xs">
                {formatSize(lightboxItem.size)} • Uploaded {formatDate(lightboxItem.uploadedAt)}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
