import { useState, useCallback } from "react";
import { Camera, Upload, X, Check, Heart, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface UploadedFile {
  id: string;
  file: File;
  preview: string;
  status: 'pending' | 'uploading' | 'success' | 'error';
  progress: number;
}

const PhotoDump = () => {
  const [guestName, setGuestName] = useState("");
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    
    const newFiles: UploadedFile[] = selectedFiles.map(file => ({
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      file,
      preview: URL.createObjectURL(file),
      status: 'pending' as const,
      progress: 0
    }));

    setFiles(prev => [...prev, ...newFiles]);
  }, []);

  const removeFile = (id: string) => {
    setFiles(prev => {
      const fileToRemove = prev.find(f => f.id === id);
      if (fileToRemove) {
        URL.revokeObjectURL(fileToRemove.preview);
      }
      return prev.filter(f => f.id !== id);
    });
  };

  const uploadFiles = async () => {
    if (files.length === 0) {
      toast.error("Please select at least one photo");
      return;
    }

    setIsUploading(true);

    let successCount = 0;
    let errorCount = 0;

    for (const uploadedFile of files) {
      if (uploadedFile.status === 'success') continue;

      try {
        // Update status to uploading
        setFiles(prev => prev.map(f => 
          f.id === uploadedFile.id ? { ...f, status: 'uploading' as const } : f
        ));

        // Generate unique file path with guest name prefix
        const fileExt = uploadedFile.file.name.split('.').pop();
        const guestPrefix = guestName.trim() ? `${guestName.trim().replace(/\s+/g, '-')}_` : '';
        const filePath = `${guestPrefix}${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`;

        // Upload directly to Lovable Cloud storage
        const { error: uploadError } = await supabase.storage
          .from('photo-dump')
          .upload(filePath, uploadedFile.file);

        if (uploadError) {
          throw new Error(uploadError.message);
        }

        successCount += 1;

        // Update status to success
        setFiles(prev => prev.map(f => 
          f.id === uploadedFile.id ? { ...f, status: 'success' as const, progress: 100 } : f
        ));

      } catch (error) {
        const message = error instanceof Error ? error.message : 'Upload failed';
        console.error('Upload error:', error);
        errorCount += 1;

        toast.error(`Couldn't upload ${uploadedFile.file.name}`, {
          description: message,
        });

        setFiles(prev => prev.map(f => 
          f.id === uploadedFile.id ? { ...f, status: 'error' as const } : f
        ));
      }
    }

    setIsUploading(false);

    if (successCount > 0) {
      toast.success(`${successCount} photo(s) uploaded successfully! Thank you for sharing your memories.`);
    }
    if (errorCount > 0 && successCount === 0) {
      toast.error('No photos were uploaded. Please try again.');
    }
  };

  const clearCompleted = () => {
    setFiles(prev => {
      prev.forEach(f => {
        if (f.status === 'success') {
          URL.revokeObjectURL(f.preview);
        }
      });
      return prev.filter(f => f.status !== 'success');
    });
  };

  return (
    <section id="photo-dump" className="py-20 md:py-32 px-6 bg-secondary/30">
      <div className="max-w-4xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-12">
          <p className="font-sans text-sm uppercase tracking-[0.3em] text-primary mb-4">
            Share Your Moments
          </p>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-light text-foreground">
            Photo Dump
          </h2>
          <div className="flex items-center justify-center gap-4 mt-6">
            <div className="h-px w-12 bg-primary/30" />
            <Camera className="w-4 h-4 text-primary" />
            <div className="h-px w-12 bg-primary/30" />
          </div>
          <p className="mt-6 text-muted-foreground max-w-lg mx-auto">
            Captured a beautiful moment? Share your photos with the couple! 
            All photos will be collected and treasured forever.
          </p>
        </div>

        {/* Upload area */}
        <div className="bg-card rounded-2xl p-8 elegant-border shadow-lg">
          {/* Guest name input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-foreground mb-2">
              Your Name (optional)
            </label>
            <Input
              type="text"
              placeholder="Enter your name"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              className="max-w-sm"
            />
          </div>

          {/* Camera capture */}
          <label className="block cursor-pointer">
            <div className="border-2 border-dashed border-primary/30 rounded-xl p-8 md:p-12 text-center hover:border-primary/60 transition-colors bg-background/50">
              <input
                type="file"
                accept="image/*"
                capture="environment"
                multiple
                onChange={handleFileSelect}
                className="hidden"
              />
              <Camera className="w-12 h-12 mx-auto mb-4 text-primary/50" />
              <p className="text-lg font-medium text-foreground mb-2">
                Tap to open camera
              </p>
              <p className="text-sm text-muted-foreground">
                Take a photo to share with the couple
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                JPG, PNG, WebP • Max 10MB each
              </p>
            </div>
          </label>

          {/* Preview grid */}
          {files.length > 0 && (
            <div className="mt-8">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-medium text-foreground">
                  {files.length} photo(s) selected
                </p>
                {files.some(f => f.status === 'success') && (
                  <Button variant="ghost" size="sm" onClick={clearCompleted}>
                    Clear completed
                  </Button>
                )}
              </div>
              
              <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {files.map((file) => (
                  <div key={file.id} className="relative aspect-square rounded-lg overflow-hidden group">
                    <img
                      src={file.preview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    
                    {/* Status overlay */}
                    <div className={`absolute inset-0 flex items-center justify-center transition-opacity ${
                      file.status === 'pending' ? 'bg-transparent group-hover:bg-foreground/40' :
                      file.status === 'uploading' ? 'bg-foreground/60' :
                      file.status === 'success' ? 'bg-green-500/60' :
                      'bg-red-500/60'
                    }`}>
                      {file.status === 'pending' && (
                        <button
                          onClick={() => removeFile(file.id)}
                          className="opacity-0 group-hover:opacity-100 p-1.5 rounded-full bg-background/90 transition-opacity"
                        >
                          <X className="w-4 h-4 text-foreground" />
                        </button>
                      )}
                      {file.status === 'uploading' && (
                        <Loader2 className="w-6 h-6 text-background animate-spin" />
                      )}
                      {file.status === 'success' && (
                        <Check className="w-6 h-6 text-background" />
                      )}
                      {file.status === 'error' && (
                        <X className="w-6 h-6 text-background" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Upload button */}
          {files.length > 0 && files.some(f => f.status === 'pending' || f.status === 'error') && (
            <div className="mt-8 text-center">
              <Button
                onClick={uploadFiles}
                disabled={isUploading}
                size="lg"
                className="px-8"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Heart className="w-4 h-4 mr-2" />
                    Share {files.filter(f => f.status !== 'success').length} Photo(s)
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default PhotoDump;