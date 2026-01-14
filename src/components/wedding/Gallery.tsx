import { useState } from "react";
import { Heart, X } from "lucide-react";

import coupleRocksSea from "@/assets/gallery/couple-rocks-sea.png";
import coupleUmbrellaFlowers from "@/assets/gallery/couple-umbrella-flowers.png";
import coupleForestGolden from "@/assets/gallery/couple-forest-golden.png";
import coupleBeachWalk from "@/assets/gallery/couple-beach-walk.png";
import coupleLibrary from "@/assets/gallery/couple-library.png";
import couplePalace from "@/assets/gallery/couple-palace.png";
import coupleMeadow from "@/assets/gallery/couple-meadow.png";
import coupleDoor from "@/assets/gallery/couple-door.png";
import coupleReading from "@/assets/gallery/couple-reading.png";
import coupleStairs from "@/assets/gallery/couple-stairs.png";

// Surrounding small images
const smallImages = [
  { id: 1, src: coupleRocksSea, alt: "Seaside rocks moment" },
  { id: 2, src: coupleUmbrellaFlowers, alt: "Umbrella with flowers" },
  { id: 3, src: coupleForestGolden, alt: "Golden forest moment" },
  { id: 4, src: couplePalace, alt: "Palace courtyard" },
  { id: 5, src: coupleMeadow, alt: "Meadow portrait" },
  { id: 6, src: coupleDoor, alt: "Wooden door moment" },
  { id: 7, src: coupleReading, alt: "Reading together" },
  { id: 8, src: coupleStairs, alt: "Staircase portrait" },
];

// Featured center image
const featuredImage = { id: 0, src: coupleBeachWalk, alt: "Beach walk at sunset" };

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  
  const ImageCard = ({ src, alt, size = "small" }: { src: string; alt: string; size?: "small" | "large" }) => (
    <div
      onClick={() => setSelectedImage(src)}
      className={`relative cursor-pointer group overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1 hover:scale-[1.02] ${
        size === "large" ? "aspect-square" : "aspect-square"
      }`}
      style={{
        boxShadow: '0 8px 20px -4px rgba(0,0,0,0.2), 0 4px 8px -2px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.1)'
      }}
    >
      <img 
        src={src} 
        alt={alt}
        className="w-full h-full object-cover"
      />
      
      {/* 3D border effect */}
      <div className="absolute inset-0 rounded-xl border-2 border-white/20 pointer-events-none" />
      <div className="absolute inset-0 rounded-xl shadow-[inset_0_2px_4px_rgba(255,255,255,0.2),inset_0_-2px_4px_rgba(0,0,0,0.1)] pointer-events-none" />
      
      {/* Hover overlay */}
      <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/10 transition-all duration-300 flex items-center justify-center">
        <div className="opacity-0 group-hover:opacity-100 transform scale-75 group-hover:scale-100 transition-all duration-300">
          <div className="w-12 h-12 rounded-full bg-background/90 shadow-lg flex items-center justify-center">
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
        <div className="grid grid-cols-4 grid-rows-3 gap-3 md:gap-5">
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
              className="relative cursor-pointer group overflow-hidden rounded-xl shadow-xl hover:shadow-2xl transition-all duration-500 h-full transform hover:-translate-y-1 hover:scale-[1.01]"
              style={{
                boxShadow: '0 12px 28px -6px rgba(0,0,0,0.25), 0 6px 12px -4px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.1)'
              }}
            >
              <img 
                src={featuredImage.src} 
                alt={featuredImage.alt}
                className="w-full h-full object-cover"
              />
              {/* 3D border effect */}
              <div className="absolute inset-0 rounded-xl border-2 border-white/20 pointer-events-none" />
              <div className="absolute inset-0 rounded-xl shadow-[inset_0_2px_4px_rgba(255,255,255,0.2),inset_0_-2px_4px_rgba(0,0,0,0.1)] pointer-events-none" />
              
              <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/10 transition-all duration-300 flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transform scale-75 group-hover:scale-100 transition-all duration-300">
                  <div className="w-16 h-16 rounded-full bg-background/90 shadow-lg flex items-center justify-center">
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
