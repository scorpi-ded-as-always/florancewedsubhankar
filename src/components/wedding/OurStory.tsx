import { Heart } from "lucide-react";

import photo1 from "@/assets/story/photo1.png";
import photo2 from "@/assets/story/photo2.png";
import photo3 from "@/assets/story/photo3.png";

const OurStory = () => {
  return (
    <section id="our-story" className="py-20 md:py-32 px-6 bg-gradient-to-b from-background via-secondary/40 to-background relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-20 right-0 w-72 h-72 rounded-full bg-primary/5 blur-3xl" />
      <div className="absolute bottom-20 left-0 w-72 h-72 rounded-full bg-accent/5 blur-3xl" />
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section header */}
        <div className="text-center mb-16">
          <p className="font-sans text-sm uppercase tracking-[0.3em] text-primary mb-4 opacity-0 animate-fade-up">
            Our Journey
          </p>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-light text-foreground opacity-0 animate-fade-up animation-delay-200">
            Our Story
          </h2>
          <div className="flex items-center justify-center gap-4 mt-6 opacity-0 animate-fade-up animation-delay-400">
            <div className="h-px w-12 bg-primary/30" />
            <Heart className="w-4 h-4 text-primary" fill="currentColor" />
            <div className="h-px w-12 bg-primary/30" />
          </div>
        </div>
        
        {/* Story content */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Text content */}
          <div className="space-y-6 order-2 lg:order-1">
            <p className="font-serif text-lg md:text-xl leading-relaxed text-muted-foreground italic">
              "Sometimes the heart sees what is invisible to the eye..."
            </p>
            <p className="font-sans text-base md:text-lg leading-relaxed text-foreground/80">
              Our story began in the most unexpected way — a chance encounter that felt like destiny. 
              From the first moment our eyes met, we knew something magical was unfolding. What started 
              as friendship blossomed into a love that has only grown stronger with each passing day.
            </p>
            <p className="font-sans text-base md:text-lg leading-relaxed text-foreground/80">
              Through shared laughter, dreams, and countless cups of chai, we discovered that true love 
              is not about finding a perfect person, but about finding someone who makes your imperfect 
              life perfect. Together, we've learned that love is patient, love is kind, and love is 
              choosing each other every single day.
            </p>
            <p className="font-sans text-base md:text-lg leading-relaxed text-foreground/80">
              Now, as we prepare to unite our two families and celebrate our love through two beautiful 
              ceremonies, we invite you to be part of our forever. This is not just our wedding — it's 
              the beginning of our greatest adventure together.
            </p>
          </div>
          
          {/* Photos */}
          <div className="grid grid-cols-2 gap-4 order-1 lg:order-2">
            <div className="space-y-4">
              <div className="aspect-[3/4] rounded-lg overflow-hidden elegant-border shadow-lg transform hover:scale-[1.02] transition-transform duration-300">
                <img 
                  src={photo1} 
                  alt="Couple at palace courtyard" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="aspect-square rounded-lg overflow-hidden elegant-border shadow-lg transform hover:scale-[1.02] transition-transform duration-300">
                <img 
                  src={photo2} 
                  alt="Romantic library moment" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="pt-8">
              <div className="aspect-[3/4] rounded-lg overflow-hidden elegant-border shadow-lg transform hover:scale-[1.02] transition-transform duration-300">
                <img 
                  src={photo3} 
                  alt="Quiet reading together" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OurStory;
