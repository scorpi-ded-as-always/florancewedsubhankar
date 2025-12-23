import { Heart, ChevronDown } from "lucide-react";

const HeroSection = () => {
  const scrollToStory = () => {
    document.getElementById('our-story')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background with elegant pattern */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/30 to-background" />
      
      {/* Decorative floral corners */}
      <div className="absolute top-0 left-0 w-32 h-32 md:w-48 md:h-48 opacity-20">
        <svg viewBox="0 0 100 100" className="w-full h-full text-primary">
          <path d="M0,50 Q25,25 50,0 Q25,25 0,50" fill="none" stroke="currentColor" strokeWidth="0.5" />
          <path d="M0,70 Q35,35 70,0 Q35,35 0,70" fill="none" stroke="currentColor" strokeWidth="0.5" />
          <circle cx="20" cy="20" r="3" fill="currentColor" opacity="0.5" />
          <circle cx="35" cy="10" r="2" fill="currentColor" opacity="0.3" />
        </svg>
      </div>
      <div className="absolute top-0 right-0 w-32 h-32 md:w-48 md:h-48 opacity-20 transform scale-x-[-1]">
        <svg viewBox="0 0 100 100" className="w-full h-full text-primary">
          <path d="M0,50 Q25,25 50,0 Q25,25 0,50" fill="none" stroke="currentColor" strokeWidth="0.5" />
          <path d="M0,70 Q35,35 70,0 Q35,35 0,70" fill="none" stroke="currentColor" strokeWidth="0.5" />
          <circle cx="20" cy="20" r="3" fill="currentColor" opacity="0.5" />
          <circle cx="35" cy="10" r="2" fill="currentColor" opacity="0.3" />
        </svg>
      </div>
      
      {/* Main content */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        {/* Decorative line */}
        <div className="flex items-center justify-center gap-4 mb-8 opacity-0 animate-fade-up">
          <div className="h-px w-16 md:w-24 bg-gradient-to-r from-transparent to-primary/50" />
          <Heart className="w-4 h-4 text-primary" fill="currentColor" />
          <div className="h-px w-16 md:w-24 bg-gradient-to-l from-transparent to-primary/50" />
        </div>
        
        {/* Names */}
        <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-light tracking-wide text-foreground opacity-0 animate-fade-up animation-delay-200">
          Florance
          <span className="block text-3xl sm:text-4xl md:text-5xl text-primary my-4 italic font-light">&</span>
          Subhankar
        </h1>
        
        {/* Subtitle */}
        <p className="font-serif text-xl md:text-2xl text-muted-foreground mt-8 mb-6 italic opacity-0 animate-fade-up animation-delay-400">
          Two Ceremonies, One Love Story
        </p>
        
        {/* Date and location */}
        <div className="space-y-3 opacity-0 animate-fade-up animation-delay-600">
          <p className="font-sans text-lg md:text-xl tracking-[0.3em] uppercase text-foreground/80">
            February 14, 2025
          </p>
          <p className="font-sans text-base md:text-lg text-muted-foreground">
            Mumbai, India
          </p>
        </div>
        
        {/* Decorative element */}
        <div className="mt-12 flex items-center justify-center gap-2 opacity-0 animate-fade-up animation-delay-800">
          <div className="w-1 h-1 rounded-full bg-primary" />
          <div className="w-1.5 h-1.5 rounded-full bg-primary" />
          <div className="w-2 h-2 rounded-full bg-primary" />
          <div className="w-1.5 h-1.5 rounded-full bg-primary" />
          <div className="w-1 h-1 rounded-full bg-primary" />
        </div>
      </div>
      
      {/* Scroll indicator */}
      <button 
        onClick={scrollToStory}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted-foreground hover:text-primary transition-colors cursor-pointer opacity-0 animate-fade-in animation-delay-800"
      >
        <span className="text-xs uppercase tracking-widest font-sans">Scroll</span>
        <ChevronDown className="w-5 h-5 animate-bounce" />
      </button>
    </section>
  );
};

export default HeroSection;