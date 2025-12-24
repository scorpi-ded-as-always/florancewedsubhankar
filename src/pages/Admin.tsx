import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Download, RefreshCw, Image, Lock, Trash2 } from "lucide-react";

interface PhotoFile {
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
  const [photos, setPhotos] = useState<PhotoFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedPhotos, setSelectedPhotos] = useState<Set<string>>(new Set());

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
    // Check session
    if (sessionStorage.getItem("admin_auth") === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchPhotos();
    }
  }, [isAuthenticated]);

  const fetchPhotos = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.storage
        .from("photo-dump")
        .list("", {
          limit: 1000,
          sortBy: { column: "created_at", order: "desc" },
        });

      if (error) throw error;
      
      // Filter out any placeholder/empty files
      const photoList = (data || []).filter(file => file.name && !file.name.startsWith('.'));
      setPhotos(photoList);
    } catch (error) {
      console.error("Error fetching photos:", error);
      toast.error("Failed to fetch photos");
    } finally {
      setLoading(false);
    }
  };

  const getPhotoUrl = (fileName: string) => {
    const { data } = supabase.storage
      .from("photo-dump")
      .getPublicUrl(fileName);
    return data.publicUrl;
  };

  const downloadPhoto = async (fileName: string) => {
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
      toast.error("Failed to download photo");
    }
  };

  const downloadAllPhotos = async () => {
    toast.info(`Downloading ${photos.length} photos...`);
    for (const photo of photos) {
      await downloadPhoto(photo.name);
      // Small delay to prevent overwhelming the browser
      await new Promise((r) => setTimeout(r, 300));
    }
    toast.success("All photos downloaded!");
  };

  const deletePhoto = async (fileName: string) => {
    if (!confirm(`Delete ${fileName}?`)) return;

    try {
      const { error } = await supabase.storage
        .from("photo-dump")
        .remove([fileName]);

      if (error) throw error;

      setPhotos((prev) => prev.filter((p) => p.name !== fileName));
      toast.success("Photo deleted");
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete photo");
    }
  };

  const toggleSelect = (name: string) => {
    setSelectedPhotos((prev) => {
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
    const toDownload = photos.filter((p) => selectedPhotos.has(p.name));
    toast.info(`Downloading ${toDownload.length} photos...`);
    for (const photo of toDownload) {
      await downloadPhoto(photo.name);
      await new Promise((r) => setTimeout(r, 300));
    }
    toast.success("Selected photos downloaded!");
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return "Unknown size";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
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
              Enter password to view uploaded photos
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
                Access Photos
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
            <h1 className="text-3xl font-serif text-foreground">Photo Admin</h1>
            <p className="text-muted-foreground">
              {photos.length} photo(s) uploaded
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={fetchPhotos} disabled={loading}>
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            {selectedPhotos.size > 0 && (
              <Button variant="outline" onClick={downloadSelected}>
                <Download className="w-4 h-4 mr-2" />
                Download Selected ({selectedPhotos.size})
              </Button>
            )}
            <Button onClick={downloadAllPhotos} disabled={photos.length === 0}>
              <Download className="w-4 h-4 mr-2" />
              Download All
            </Button>
          </div>
        </div>

        {/* Photos grid */}
        {photos.length === 0 ? (
          <div className="text-center py-20">
            <Image className="w-16 h-16 mx-auto mb-4 text-muted-foreground/30" />
            <p className="text-muted-foreground">No photos uploaded yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {photos.map((photo) => (
              <div
                key={photo.id}
                className={`group relative aspect-square rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                  selectedPhotos.has(photo.name)
                    ? "border-primary ring-2 ring-primary/20"
                    : "border-transparent hover:border-primary/30"
                }`}
                onClick={() => toggleSelect(photo.name)}
              >
                <img
                  src={getPhotoUrl(photo.name)}
                  alt={photo.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/40 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                  <Button
                    size="icon"
                    variant="secondary"
                    className="h-8 w-8"
                    onClick={(e) => {
                      e.stopPropagation();
                      downloadPhoto(photo.name);
                    }}
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="destructive"
                    className="h-8 w-8"
                    onClick={(e) => {
                      e.stopPropagation();
                      deletePhoto(photo.name);
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>

                {/* Selection indicator */}
                {selectedPhotos.has(photo.name) && (
                  <div className="absolute top-2 left-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                    <span className="text-xs text-primary-foreground font-bold">✓</span>
                  </div>
                )}

                {/* Info */}
                <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-foreground/80 to-transparent">
                  <p className="text-xs text-background truncate">{photo.name}</p>
                  <p className="text-xs text-background/70">
                    {formatDate(photo.created_at)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
