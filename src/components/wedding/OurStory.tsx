import { Heart } from "lucide-react";

const OurStory = () => {
  return (
    <section id="our-story" className="py-20 md:py-32 px-6 bg-card/50">
      <div className="max-w-6xl mx-auto">
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
          
          {/* Photo placeholders */}
          <div className="grid grid-cols-2 gap-4 order-1 lg:order-2">
            <div className="space-y-4">
              <div className="aspect-[3/4] bg-secondary/50 rounded-lg overflow-hidden elegant-border shadow-lg transform hover:scale-[1.02] transition-transform duration-300">
                <div className="w-full h-full flex items-center justify-center text-muted-foreground/50">
                  <div className="text-center p-4">
                    <Heart className="w-8 h-8 mx-auto mb-2 text-primary/30" />
                    <p className="text-sm font-sans">Photo 1</p>
                  </div>
                </div>
              </div>
              <div className="aspect-square bg-secondary/50 rounded-lg overflow-hidden elegant-border shadow-lg transform hover:scale-[1.02] transition-transform duration-300">
                <div className="w-full h-full flex items-center justify-center text-muted-foreground/50">
                  <div className="text-center p-4">
                    <Heart className="w-8 h-8 mx-auto mb-2 text-primary/30" />
                    <p className="text-sm font-sans">Photo 2</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="pt-8">
              <div className="aspect-[3/4] bg-secondary/50 rounded-lg overflow-hidden elegant-border shadow-lg transform hover:scale-[1.02] transition-transform duration-300">
                <div className="w-full h-full flex items-center justify-center text-muted-foreground/50">
                  <div className="text-center p-4">
                    <Heart className="w-8 h-8 mx-auto mb-2 text-primary/30" />
                    <p className="text-sm font-sans">Photo 3</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OurStory;