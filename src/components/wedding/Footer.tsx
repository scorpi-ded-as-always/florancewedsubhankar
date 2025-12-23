import { Heart } from "lucide-react";
import fsLogo from "@/assets/fs-logo.png";

const Footer = () => {
  return (
    <footer className="py-16 md:py-24 px-6 bg-gradient-to-b from-accent to-forest text-accent-foreground relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-64 h-64 rounded-full bg-primary/5 blur-3xl" />
      <div className="absolute bottom-0 right-0 w-64 h-64 rounded-full bg-gold/5 blur-3xl" />
      
      <div className="max-w-4xl mx-auto text-center relative z-10">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img src={fsLogo} alt="F & S" className="w-16 h-16 opacity-80" />
        </div>
        
        {/* Decorative element */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <div className="h-px w-16 bg-gradient-to-r from-transparent to-accent-foreground/30" />
          <Heart className="w-5 h-5 text-rose-light" fill="currentColor" />
          <div className="h-px w-16 bg-gradient-to-l from-transparent to-accent-foreground/30" />
        </div>
        
        {/* Names */}
        <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-light mb-6">
          Florance & Subhankar
        </h2>
        
        {/* Message */}
        <p className="font-serif text-lg md:text-xl italic text-accent-foreground/80 max-w-2xl mx-auto mb-8">
          "Your presence and blessings mean everything to us."
        </p>
        
        {/* Date */}
        <p className="font-sans text-sm uppercase tracking-[0.3em] text-accent-foreground/60 mb-8">
          February 14, 2025
        </p>
        
        {/* Decorative dots */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-1 h-1 rounded-full bg-rose-light/50" />
          <div className="w-1.5 h-1.5 rounded-full bg-rose-light/70" />
          <div className="w-2 h-2 rounded-full bg-rose-light" />
          <div className="w-1.5 h-1.5 rounded-full bg-rose-light/70" />
          <div className="w-1 h-1 rounded-full bg-rose-light/50" />
        </div>
        
        {/* Navigation links */}
        <nav className="flex flex-wrap justify-center gap-6 md:gap-8 mb-12">
          <a href="#our-story" className="font-sans text-sm uppercase tracking-wider text-accent-foreground/70 hover:text-rose-light transition-colors">
            Our Story
          </a>
          <a href="#wedding-details" className="font-sans text-sm uppercase tracking-wider text-accent-foreground/70 hover:text-rose-light transition-colors">
            Details
          </a>
          <a href="#schedule" className="font-sans text-sm uppercase tracking-wider text-accent-foreground/70 hover:text-rose-light transition-colors">
            Schedule
          </a>
          <a href="#gallery" className="font-sans text-sm uppercase tracking-wider text-accent-foreground/70 hover:text-rose-light transition-colors">
            Gallery
          </a>
          <a href="#location" className="font-sans text-sm uppercase tracking-wider text-accent-foreground/70 hover:text-rose-light transition-colors">
            Venues
          </a>
        </nav>
        
        {/* Copyright */}
        <p className="font-sans text-xs text-accent-foreground/50">
          Made with love for our special day
        </p>
      </div>
    </footer>
  );
};

export default Footer;