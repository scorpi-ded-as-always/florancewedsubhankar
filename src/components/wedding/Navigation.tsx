import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import fsLogo from "@/assets/fs-logo.png";

const navLinks = [
  { href: "#our-story", label: "Our Story" },
  { href: "#wedding-details", label: "Details" },
  { href: "#schedule", label: "Schedule" },
  { href: "#calendar", label: "Save Date" },
  { href: "#gallery", label: "Gallery" },
  { href: "#location", label: "Venues" },
];

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const element = document.querySelector(href);
    element?.scrollIntoView({ behavior: 'smooth' });
    setIsMobileMenuOpen(false);
  };
  
  return (
    <>
      {/* Desktop Navigation */}
      <nav 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled 
            ? 'bg-background/95 backdrop-blur-md shadow-lg py-3' 
            : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <a 
            href="#"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <img 
              src={fsLogo} 
              alt="F & S" 
              className={`transition-all duration-300 ${
                isScrolled ? 'h-10 w-10' : 'h-12 w-12'
              }`}
              style={{ 
                filter: 'sepia(100%) saturate(400%) brightness(60%) hue-rotate(-10deg)'
              }}
            />
          </a>
          
          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="font-sans text-sm uppercase tracking-wider text-foreground/80 hover:text-primary transition-colors relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-primary after:transition-all hover:after:w-full"
              >
                {link.label}
              </a>
            ))}
          </div>
          
          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-foreground hover:text-primary transition-colors"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </nav>
      
      {/* Mobile Menu */}
      <div 
        className={`fixed inset-0 z-40 bg-background/98 backdrop-blur-md transition-all duration-500 md:hidden ${
          isMobileMenuOpen 
            ? 'opacity-100 pointer-events-auto' 
            : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex flex-col items-center justify-center h-full gap-8">
          <img 
            src={fsLogo} 
            alt="F & S" 
            className="h-20 w-20 mb-4" 
            style={{ 
              filter: 'sepia(100%) saturate(400%) brightness(60%) hue-rotate(-10deg)'
            }}
          />
          {navLinks.map((link, index) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className="font-serif text-2xl text-foreground hover:text-primary transition-colors"
              style={{ 
                animationDelay: `${index * 100}ms`,
                opacity: isMobileMenuOpen ? 1 : 0,
                transform: isMobileMenuOpen ? 'translateY(0)' : 'translateY(20px)',
                transition: `opacity 0.3s ease ${index * 100}ms, transform 0.3s ease ${index * 100}ms`
              }}
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </>
  );
};

export default Navigation;