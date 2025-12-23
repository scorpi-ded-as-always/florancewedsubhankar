import { useState } from "react";
import { Heart, X } from "lucide-react";

const galleryImages = [
  { id: 1, alt: "Engagement Photo 1" },
  { id: 2, alt: "Engagement Photo 2" },
  { id: 3, alt: "Pre-wedding Photo 1" },
  { id: 4, alt: "Pre-wedding Photo 2" },
  { id: 5, alt: "Couple Photo 1" },
  { id: 6, alt: "Couple Photo 2" },
];

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  
  return (
    <section id="gallery" className="py-20 md:py-32 px-6 bg-card/50">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-16">
          <p className="font-sans text-sm uppercase tracking-[0.3em] text-primary mb-4">
            Moments
          </p>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-light text-foreground">
            Gallery
          </h2>
          <div className="flex items-center justify-center gap-4 mt-6">
            <div className="h-px w-12 bg-primary/30" />
            <Heart className="w-4 h-4 text-primary" fill="currentColor" />
            <div className="h-px w-12 bg-primary/30" />
          </div>
        </div>
        
        {/* Masonry-style gallery */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {galleryImages.map((image, index) => (
            <div
              key={image.id}
              onClick={() => setSelectedImage(image.id)}
              className={`relative cursor-pointer group overflow-hidden rounded-xl elegant-border shadow-md hover:shadow-xl transition-all duration-500 ${
                index % 3 === 0 ? 'row-span-2' : ''
              }`}
            >
              {/* Placeholder */}
              <div className={`w-full bg-secondary/50 ${index % 3 === 0 ? 'aspect-[3/4]' : 'aspect-square'}`}>
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center p-4">
                    <Heart className="w-8 h-8 mx-auto mb-2 text-primary/30" />
                    <p className="text-sm font-sans text-muted-foreground/50">{image.alt}</p>
                  </div>
                </div>
              </div>
              
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/20 transition-all duration-300 flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transform scale-75 group-hover:scale-100 transition-all duration-300">
                  <div className="w-12 h-12 rounded-full bg-background/90 flex items-center justify-center">
                    <Heart className="w-5 h-5 text-primary" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Lightbox */}
        {selectedImage !== null && (
          <div 
            className="fixed inset-0 z-50 bg-foreground/90 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <button 
              className="absolute top-6 right-6 p-2 rounded-full bg-background/20 hover:bg-background/40 transition-colors"
              onClick={() => setSelectedImage(null)}
            >
              <X className="w-6 h-6 text-background" />
            </button>
            <div className="max-w-4xl max-h-[80vh] bg-secondary rounded-xl overflow-hidden flex items-center justify-center p-12">
              <div className="text-center">
                <Heart className="w-16 h-16 mx-auto mb-4 text-primary/30" />
                <p className="text-lg font-sans text-muted-foreground/50">
                  {galleryImages.find(img => img.id === selectedImage)?.alt}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Gallery;