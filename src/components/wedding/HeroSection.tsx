import { Heart, ChevronDown } from "lucide-react";
import fsLogo from "@/assets/fs-logo.png";

const HeroSection = () => {
  const scrollToStory = () => {
    document.getElementById('our-story')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24 pb-24 md:pt-28 md:pb-28">
      {/* Colorful gradient background */}
      <div className="absolute inset-0 gradient-bg" />
      
      {/* Decorative floating elements */}
      <div className="absolute top-20 left-10 w-32 h-32 rounded-full bg-primary/10 blur-3xl animate-float" />
      <div className="absolute bottom-40 right-10 w-40 h-40 rounded-full bg-accent/10 blur-3xl animate-float" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/3 right-1/4 w-24 h-24 rounded-full bg-gold/10 blur-2xl animate-float" style={{ animationDelay: '2s' }} />
      
      {/* Decorative floral corners */}
      <div className="absolute top-0 left-0 w-40 h-40 md:w-56 md:h-56 opacity-30">
        <svg viewBox="0 0 100 100" className="w-full h-full text-primary">
          <path d="M0,50 Q25,25 50,0 Q25,25 0,50" fill="none" stroke="currentColor" strokeWidth="0.5" />
          <path d="M0,70 Q35,35 70,0 Q35,35 0,70" fill="none" stroke="currentColor" strokeWidth="0.5" />
          <circle cx="20" cy="20" r="4" fill="currentColor" opacity="0.6" />
          <circle cx="35" cy="10" r="2.5" fill="currentColor" opacity="0.4" />
          <circle cx="10" cy="35" r="2" fill="currentColor" opacity="0.3" />
        </svg>
      </div>
      <div className="absolute top-0 right-0 w-40 h-40 md:w-56 md:h-56 opacity-30 transform scale-x-[-1]">
        <svg viewBox="0 0 100 100" className="w-full h-full text-primary">
          <path d="M0,50 Q25,25 50,0 Q25,25 0,50" fill="none" stroke="currentColor" strokeWidth="0.5" />
          <path d="M0,70 Q35,35 70,0 Q35,35 0,70" fill="none" stroke="currentColor" strokeWidth="0.5" />
          <circle cx="20" cy="20" r="4" fill="currentColor" opacity="0.6" />
          <circle cx="35" cy="10" r="2.5" fill="currentColor" opacity="0.4" />
          <circle cx="10" cy="35" r="2" fill="currentColor" opacity="0.3" />
        </svg>
      </div>
      <div className="absolute bottom-0 left-0 w-40 h-40 md:w-56 md:h-56 opacity-20 transform scale-y-[-1]">
        <svg viewBox="0 0 100 100" className="w-full h-full text-accent">
          <path d="M0,50 Q25,25 50,0 Q25,25 0,50" fill="none" stroke="currentColor" strokeWidth="0.5" />
          <path d="M0,70 Q35,35 70,0 Q35,35 0,70" fill="none" stroke="currentColor" strokeWidth="0.5" />
        </svg>
      </div>
      <div className="absolute bottom-0 right-0 w-40 h-40 md:w-56 md:h-56 opacity-20 transform scale-[-1]">
        <svg viewBox="0 0 100 100" className="w-full h-full text-accent">
          <path d="M0,50 Q25,25 50,0 Q25,25 0,50" fill="none" stroke="currentColor" strokeWidth="0.5" />
          <path d="M0,70 Q35,35 70,0 Q35,35 0,70" fill="none" stroke="currentColor" strokeWidth="0.5" />
        </svg>
      </div>
      
      {/* Main content */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        {/* Logo */}
        <div className="flex justify-center mb-8 opacity-0 animate-fade-up">
          <div className="relative">
            {/* Glow effect behind logo */}
            <div className="absolute inset-0 bg-primary/30 rounded-full blur-2xl scale-125" />
            <img 
              src={fsLogo} 
              alt="F & S Logo" 
              className="relative w-32 h-32 md:w-44 md:h-44 drop-shadow-2xl"
              style={{ 
                filter: 'sepia(100%) saturate(400%) brightness(70%) hue-rotate(5deg) contrast(1.1)',
              }}
            />
          </div>
        </div>
        
        {/* Decorative line */}
        <div className="flex items-center justify-center gap-4 mb-6 opacity-0 animate-fade-up animation-delay-200">
          <div className="h-px w-16 md:w-24 bg-gradient-to-r from-transparent via-primary/60 to-primary" />
          <Heart className="w-5 h-5 text-primary" fill="currentColor" />
          <div className="h-px w-16 md:w-24 bg-gradient-to-l from-transparent via-primary/60 to-primary" />
        </div>
        
        {/* Names */}
        <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-light tracking-wide text-foreground opacity-0 animate-fade-up animation-delay-200">
          <span className="text-rose-gradient">Florance</span>
          <span className="block text-3xl sm:text-4xl md:text-5xl text-accent my-4 italic font-light">&</span>
          <span className="text-rose-gradient">Subhankar</span>
        </h1>
        
        {/* Subtitle */}
        <p className="font-serif text-xl md:text-2xl text-muted-foreground mt-8 mb-6 italic opacity-0 animate-fade-up animation-delay-400">
          Two Ceremonies, One Love Story
        </p>
        
        {/* Date and location */}
        <div className="space-y-3 opacity-0 animate-fade-up animation-delay-600">
          <p className="font-sans text-lg md:text-xl tracking-[0.3em] uppercase text-foreground/80">
            February 6, 2026
          </p>
          <p className="font-sans text-base md:text-lg text-muted-foreground">
            Krishnagar, India
          </p>
        </div>
        
        {/* Decorative element */}
        <div className="mt-12 flex items-center justify-center gap-2 opacity-0 animate-fade-up animation-delay-800">
          <div className="w-1.5 h-1.5 rounded-full bg-accent" />
          <div className="w-2 h-2 rounded-full bg-primary/70" />
          <div className="w-2.5 h-2.5 rounded-full bg-primary" />
          <div className="w-2 h-2 rounded-full bg-primary/70" />
          <div className="w-1.5 h-1.5 rounded-full bg-accent" />
        </div>
      </div>
      
      {/* Scroll indicator */}
      <button 
        onClick={scrollToStory}
        className="absolute bottom-6 md:bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted-foreground hover:text-primary transition-colors cursor-pointer opacity-0 animate-fade-in animation-delay-800 z-20"
      >
        <span className="text-xs uppercase tracking-widest font-sans">Scroll</span>
        <ChevronDown className="w-5 h-5 animate-bounce" />
      </button>
    </section>
  );
};

export default HeroSection;