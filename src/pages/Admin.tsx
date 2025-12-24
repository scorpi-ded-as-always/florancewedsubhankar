import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Download, RefreshCw, Image, Lock, Trash2, Archive, X, Play } from "lucide-react";
import JSZip from "jszip";

interface MediaFile {
  name: string;
  id: string;
  created_at: string;
  metadata?: {
    size?: number;
    mimetype?: string;
  };
}

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [media, setMedia] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<Set<string>>(new Set());
  const [lightboxItem, setLightboxItem] = useState<MediaFile | null>(null);

  // Simple password check - in production, use proper auth
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
      const { data, error } = await supabase.storage
        .from("photo-dump")
        .list("", {
          limit: 1000,
          sortBy: { column: "created_at", order: "desc" },
        });

      if (error) throw error;
      
      const mediaList = (data || []).filter(file => file.name && !file.name.startsWith('.'));
      setMedia(mediaList);
    } catch (error) {
      console.error("Error fetching media:", error);
      toast.error("Failed to fetch media");
    } finally {
      setLoading(false);
    }
  };

  const getMediaUrl = (fileName: string) => {
    const { data } = supabase.storage
      .from("photo-dump")
      .getPublicUrl(fileName);
    return data.publicUrl;
  };

  const downloadItem = async (fileName: string) => {
    try {
      const { data, error } = await supabase.storage
        .from("photo-dump")
        .download(fileName);

      if (error) throw error;

      const url = URL.createObjectURL(data);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success(`Downloaded ${fileName}`);
    } catch (error) {
      console.error("Download error:", error);
      toast.error("Failed to download");
    }
  };

  const downloadAsZip = async (itemsToDownload: MediaFile[], zipName: string) => {
    if (itemsToDownload.length === 0) return;
    
    setDownloading(true);
    const zip = new JSZip();
    
    try {
      toast.info(`Preparing ${itemsToDownload.length} files for download...`);
      
      let completed = 0;
      for (const item of itemsToDownload) {
        try {
          const { data, error } = await supabase.storage
            .from("photo-dump")
            .download(item.name);

          if (error) {
            console.error(`Failed to download ${item.name}:`, error);
            continue;
          }

          zip.file(item.name, data);
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

  const deleteItem = async (fileName: string) => {
    try {
      const { error } = await supabase.storage
        .from("photo-dump")
        .remove([fileName]);

      if (error) throw error;

      setMedia((prev) => prev.filter((p) => p.name !== fileName));
      setLightboxItem(null);
      toast.success("Deleted successfully");
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete");
    }
  };

  const toggleSelect = (name: string) => {
    setSelectedMedia((prev) => {
      const next = new Set(prev);
      if (next.has(name)) {
        next.delete(name);
      } else {
        next.add(name);
      }
      return next;
    });
  };

  const downloadSelected = async () => {
    const toDownload = media.filter((p) => selectedMedia.has(p.name));
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

  const openLightbox = (item: MediaFile, e: React.MouseEvent) => {
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
              {media.length} file(s) uploaded
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
        {media.length === 0 ? (
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
                  selectedMedia.has(item.name)
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
                    src={getMediaUrl(item.name)}
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
                    toggleSelect(item.name);
                  }}
                >
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center border-2 ${
                    selectedMedia.has(item.name) 
                      ? "bg-primary border-primary" 
                      : "bg-background/80 border-muted-foreground/50"
                  }`}>
                    {selectedMedia.has(item.name) && (
                      <span className="text-xs text-primary-foreground font-bold">✓</span>
                    )}
                  </div>
                </div>

                {/* Info */}
                <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-foreground/80 to-transparent">
                  <p className="text-xs text-background truncate">{item.name}</p>
                  <p className="text-xs text-background/70">
                    {formatDate(item.created_at)}
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
                  src={getMediaUrl(lightboxItem.name)} 
                  controls 
                  className="max-w-full max-h-[70vh] rounded-lg"
                  autoPlay
                />
              ) : (
                <img
                  src={getMediaUrl(lightboxItem.name)}
                  alt={lightboxItem.name}
                  className="max-w-full max-h-[70vh] object-contain rounded-lg"
                />
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4 mt-6">
              <Button
                variant="secondary"
                onClick={() => downloadItem(lightboxItem.name)}
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  if (confirm(`Delete ${lightboxItem.name}?`)) {
                    deleteItem(lightboxItem.name);
                  }
                }}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>
            </div>

            {/* File name */}
            <p className="text-white/70 text-sm mt-4 text-center truncate max-w-full">
              {lightboxItem.name}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;