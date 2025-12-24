import { useState, useCallback } from "react";
import { Camera, Upload, X, Check, Heart, Loader2, Video } from "lucide-react";
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
  isVideo: boolean;
}

const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB

const PhotoDump = () => {
  const [guestName, setGuestName] = useState("");
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const isVideoFile = (file: File) => {
    return file.type.startsWith('video/');
  };

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    
    const validFiles: UploadedFile[] = [];
    
    for (const file of selectedFiles) {
      if (file.size > MAX_FILE_SIZE) {
        toast.error(`${file.name} is too large. Maximum size is 100MB.`);
        continue;
      }
      
      validFiles.push({
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        file,
        preview: URL.createObjectURL(file),
        status: 'pending' as const,
        progress: 0,
        isVideo: isVideoFile(file)
      });
    }

    setFiles(prev => [...prev, ...validFiles]);
    
    // Reset the input so the same file can be selected again
    e.target.value = '';
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
      toast.error("Please select at least one file");
      return;
    }

    setIsUploading(true);

    let successCount = 0;
    let errorCount = 0;

    for (const uploadedFile of files) {
      if (uploadedFile.status === 'success') continue;

      try {
        setFiles(prev => prev.map(f => 
          f.id === uploadedFile.id ? { ...f, status: 'uploading' as const } : f
        ));

        const fileExt = uploadedFile.file.name.split('.').pop();
        const guestPrefix = guestName.trim() ? `${guestName.trim().replace(/\s+/g, '-')}_` : '';
        const filePath = `${guestPrefix}${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('photo-dump')
          .upload(filePath, uploadedFile.file);

        if (uploadError) {
          throw new Error(uploadError.message);
        }

        successCount += 1;

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
      toast.success(`${successCount} file(s) uploaded successfully! Thank you for sharing your memories.`);
    }
    if (errorCount > 0 && successCount === 0) {
      toast.error('No files were uploaded. Please try again.');
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

  const fileCount = files.filter(f => f.status !== 'success').length;
  const photoCount = files.filter(f => !f.isVideo && f.status !== 'success').length;
  const videoCount = files.filter(f => f.isVideo && f.status !== 'success').length;

  return (
    <section id="photo-dump" className="py-20 md:py-32 px-6 bg-secondary/30">
      <div className="max-w-4xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-12">
          <p className="font-sans text-sm uppercase tracking-[0.3em] text-primary mb-4">
            Share Your Moments
          </p>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-light text-foreground">
            Photo & Video Dump
          </h2>
          <div className="flex items-center justify-center gap-4 mt-6">
            <div className="h-px w-12 bg-primary/30" />
            <Camera className="w-4 h-4 text-primary" />
            <div className="h-px w-12 bg-primary/30" />
          </div>
          <p className="mt-6 text-muted-foreground max-w-lg mx-auto">
            Captured a beautiful moment? Share your photos and videos with the couple! 
            All memories will be treasured forever.
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

          {/* Upload options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Camera capture photo */}
            <label className="block cursor-pointer">
              <div className="border-2 border-dashed border-primary/30 rounded-xl p-4 md:p-6 text-center hover:border-primary/60 transition-colors bg-background/50 h-full flex flex-col items-center justify-center">
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <Camera className="w-8 h-8 mx-auto mb-2 text-primary/50" />
                <p className="text-sm font-medium text-foreground mb-1">
                  Take Photo
                </p>
                <p className="text-xs text-muted-foreground">
                  Open camera
                </p>
              </div>
            </label>

            {/* Record video */}
            <label className="block cursor-pointer">
              <div className="border-2 border-dashed border-primary/30 rounded-xl p-4 md:p-6 text-center hover:border-primary/60 transition-colors bg-background/50 h-full flex flex-col items-center justify-center">
                <input
                  type="file"
                  accept="video/*"
                  capture="environment"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <Video className="w-8 h-8 mx-auto mb-2 text-primary/50" />
                <p className="text-sm font-medium text-foreground mb-1">
                  Record Video
                </p>
                <p className="text-xs text-muted-foreground">
                  Open camera
                </p>
              </div>
            </label>

            {/* Gallery upload photos */}
            <label className="block cursor-pointer">
              <div className="border-2 border-dashed border-primary/30 rounded-xl p-4 md:p-6 text-center hover:border-primary/60 transition-colors bg-background/50 h-full flex flex-col items-center justify-center">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <Upload className="w-8 h-8 mx-auto mb-2 text-primary/50" />
                <p className="text-sm font-medium text-foreground mb-1">
                  Upload Photos
                </p>
                <p className="text-xs text-muted-foreground">
                  From gallery
                </p>
              </div>
            </label>

            {/* Gallery upload videos */}
            <label className="block cursor-pointer">
              <div className="border-2 border-dashed border-primary/30 rounded-xl p-4 md:p-6 text-center hover:border-primary/60 transition-colors bg-background/50 h-full flex flex-col items-center justify-center">
                <input
                  type="file"
                  accept="video/*"
                  multiple
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <Video className="w-8 h-8 mx-auto mb-2 text-primary/50" />
                <p className="text-sm font-medium text-foreground mb-1">
                  Upload Videos
                </p>
                <p className="text-xs text-muted-foreground">
                  From gallery
                </p>
              </div>
            </label>
          </div>

          <p className="text-xs text-muted-foreground text-center mt-4">
            Photos: JPG, PNG, WebP • Videos: MP4, MOV, WebM • Max 100MB each
          </p>

          {/* Preview grid */}
          {files.length > 0 && (
            <div className="mt-8">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-medium text-foreground">
                  {files.length} file(s) selected
                  {photoCount > 0 && videoCount > 0 && ` (${photoCount} photos, ${videoCount} videos)`}
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
                    {file.isVideo ? (
                      <video
                        src={file.preview}
                        className="w-full h-full object-cover"
                        muted
                      />
                    ) : (
                      <img
                        src={file.preview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    )}
                    
                    {/* Video indicator */}
                    {file.isVideo && file.status === 'pending' && (
                      <div className="absolute top-2 right-2 bg-black/60 rounded px-1.5 py-0.5">
                        <Video className="w-3 h-3 text-white" />
                      </div>
                    )}
                    
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
                    Share {fileCount} File(s)
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