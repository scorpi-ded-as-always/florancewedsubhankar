import { useState } from "react";
import { Heart, X } from "lucide-react";

import couplePalace from "@/assets/gallery/couple-palace.png";
import coupleForest from "@/assets/gallery/couple-forest.png";
import coupleLibrary1 from "@/assets/gallery/couple-library1.png";
import coupleBeach from "@/assets/gallery/couple-beach.png";
import coupleLibrary2 from "@/assets/gallery/couple-library2.png";
import coupleRocks from "@/assets/gallery/couple-rocks.png";
import coupleReading from "@/assets/gallery/couple-reading.png";
import coupleUmbrella from "@/assets/gallery/couple-umbrella.png";
import coupleStairs from "@/assets/gallery/couple-stairs.png";

// Surrounding small images
const smallImages = [
  { id: 1, src: couplePalace, alt: "Palace courtyard photo" },
  { id: 2, src: coupleForest, alt: "Enchanted forest moment" },
  { id: 3, src: coupleUmbrella, alt: "Umbrella flower moment" },
  { id: 4, src: coupleLibrary1, alt: "Library candlelight" },
  { id: 5, src: coupleStairs, alt: "Staircase portrait" },
  { id: 6, src: coupleLibrary2, alt: "Romantic library scene" },
  { id: 7, src: coupleRocks, alt: "Seaside rocks" },
  { id: 8, src: coupleReading, alt: "Quiet reading moment" },
];

// Featured center image
const featuredImage = { id: 0, src: coupleBeach, alt: "Sunset beach walk" };

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  
  const ImageCard = ({ src, alt, size = "small" }: { src: string; alt: string; size?: "small" | "large" }) => (
    <div
      onClick={() => setSelectedImage(src)}
      className={`relative cursor-pointer group overflow-hidden rounded-xl elegant-border shadow-md hover:shadow-xl transition-all duration-500 ${
        size === "large" ? "aspect-square" : "aspect-square"
      }`}
    >
      <img 
        src={src} 
        alt={alt}
        className="w-full h-full object-cover"
      />
      
      {/* Hover overlay */}
      <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/20 transition-all duration-300 flex items-center justify-center">
        <div className="opacity-0 group-hover:opacity-100 transform scale-75 group-hover:scale-100 transition-all duration-300">
          <div className="w-12 h-12 rounded-full bg-background/90 flex items-center justify-center">
            <Heart className="w-5 h-5 text-primary" />
          </div>
        </div>
      </div>
    </div>
  );
  
  return (
    <section id="gallery" className="py-20 md:py-32 px-6 bg-card/50">
      <div className="max-w-5xl mx-auto">
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
        
        {/* Collage frame layout - no border, larger photos */}
        <div className="grid grid-cols-4 grid-rows-4 gap-3 md:gap-5">
          {/* Top row */}
          <div className="col-span-1 row-span-1">
            <ImageCard src={smallImages[0].src} alt={smallImages[0].alt} />
          </div>
          <div className="col-span-1 row-span-1">
            <ImageCard src={smallImages[1].src} alt={smallImages[1].alt} />
          </div>
          <div className="col-span-1 row-span-1">
            <ImageCard src={smallImages[2].src} alt={smallImages[2].alt} />
          </div>
          <div className="col-span-1 row-span-1">
            <ImageCard src={smallImages[3].src} alt={smallImages[3].alt} />
          </div>
          
          {/* Second row - left, center (large spanning), right */}
          <div className="col-span-1 row-span-1">
            <ImageCard src={smallImages[4].src} alt={smallImages[4].alt} />
          </div>
          <div className="col-span-2 row-span-2">
            <div
              onClick={() => setSelectedImage(featuredImage.src)}
              className="relative cursor-pointer group overflow-hidden rounded-xl elegant-border shadow-lg hover:shadow-2xl transition-all duration-500 h-full"
            >
              <img 
                src={featuredImage.src} 
                alt={featuredImage.alt}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/20 transition-all duration-300 flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transform scale-75 group-hover:scale-100 transition-all duration-300">
                  <div className="w-16 h-16 rounded-full bg-background/90 flex items-center justify-center">
                    <Heart className="w-7 h-7 text-primary" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-span-1 row-span-1">
            <ImageCard src={smallImages[5].src} alt={smallImages[5].alt} />
          </div>
          
          {/* Third row - sides only (center is spanning from above) */}
          <div className="col-span-1 row-span-1">
            <ImageCard src={smallImages[6].src} alt={smallImages[6].alt} />
          </div>
          <div className="col-span-1 row-span-1">
            <ImageCard src={smallImages[7].src} alt={smallImages[7].alt} />
          </div>
          
          {/* Bottom row */}
          <div className="col-span-1 row-span-1">
            <ImageCard src={smallImages[0].src} alt={smallImages[0].alt} />
          </div>
          <div className="col-span-1 row-span-1">
            <ImageCard src={smallImages[1].src} alt={smallImages[1].alt} />
          </div>
          <div className="col-span-1 row-span-1">
            <ImageCard src={smallImages[2].src} alt={smallImages[2].alt} />
          </div>
          <div className="col-span-1 row-span-1">
            <ImageCard src={smallImages[3].src} alt={smallImages[3].alt} />
          </div>
        </div>
        
        {/* Lightbox */}
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
            <div className="max-w-4xl max-h-[80vh] rounded-xl overflow-hidden">
              <img 
                src={selectedImage}
                alt="Gallery photo"
                className="max-w-full max-h-[80vh] object-contain"
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Gallery;
