import { Church, Sparkles, MapPin, Clock, Shirt, Sun, Calendar } from "lucide-react";

const WeddingDetails = () => {
  return (
    <section id="wedding-details" className="py-20 md:py-32 px-6 bg-background">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-16">
          <p className="font-sans text-sm uppercase tracking-[0.3em] text-primary mb-4">
            The Celebrations
          </p>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-light text-foreground">
            Wedding Details
          </h2>
          <div className="flex items-center justify-center gap-4 mt-6">
            <div className="h-px w-12 bg-primary/30" />
            <div className="w-2 h-2 rounded-full bg-primary" />
            <div className="h-px w-12 bg-primary/30" />
          </div>
        </div>
        
        {/* Events grid */}
        <div className="grid md:grid-cols-3 gap-8 lg:gap-10">
          {/* Haldi Ceremony */}
          <div className="group relative bg-card rounded-2xl p-8 md:p-10 elegant-border shadow-lg hover:shadow-xl transition-all duration-500">
            {/* Decorative corner */}
            <div className="absolute top-0 left-0 w-20 h-20 border-t-2 border-l-2 border-primary/30 rounded-tl-2xl" />
            <div className="absolute bottom-0 right-0 w-20 h-20 border-b-2 border-r-2 border-primary/30 rounded-br-2xl" />
            
            <div className="relative z-10">
              {/* Icon */}
              <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Sun className="w-8 h-8 text-accent" />
              </div>
              
              {/* Time label */}
              <span className="font-sans text-xs uppercase tracking-[0.2em] text-primary font-medium">
                Pre-Wedding
              </span>
              
              {/* Title */}
              <h3 className="font-serif text-3xl md:text-4xl font-light text-foreground mt-2 mb-6">
                Haldi Ceremony
              </h3>
              
              {/* Details */}
              <div className="space-y-4 text-foreground/80">
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-sans font-medium">5th February, 2026</p>
                    <p className="text-sm text-muted-foreground">All Day Celebration</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-sans font-medium">At Residency</p>
                    <p className="text-sm text-muted-foreground">Family residence</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Shirt className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-sans font-medium">Dress Code</p>
                    <p className="text-sm text-muted-foreground">Yellow / Traditional</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Catholic Wedding */}
          <div className="group relative bg-card rounded-2xl p-8 md:p-10 elegant-border shadow-lg hover:shadow-xl transition-all duration-500">
            {/* Decorative corner */}
            <div className="absolute top-0 left-0 w-20 h-20 border-t-2 border-l-2 border-primary/30 rounded-tl-2xl" />
            <div className="absolute bottom-0 right-0 w-20 h-20 border-b-2 border-r-2 border-primary/30 rounded-br-2xl" />
            
            <div className="relative z-10">
              {/* Icon */}
              <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Church className="w-8 h-8 text-accent" />
              </div>
              
              {/* Time label */}
              <span className="font-sans text-xs uppercase tracking-[0.2em] text-primary font-medium">
                Morning Ceremony
              </span>
              
              {/* Title */}
              <h3 className="font-serif text-3xl md:text-4xl font-light text-foreground mt-2 mb-6">
                Catholic Wedding
              </h3>
              
              {/* Details */}
              <div className="space-y-4 text-foreground/80">
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-sans font-medium">10:00 AM</p>
                    <p className="text-sm text-muted-foreground">6th February, 2026</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-sans font-medium">Krishnagar Cathedral Church</p>
                    <p className="text-sm text-muted-foreground">Holy Mass & Matrimony</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Shirt className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-sans font-medium">Dress Code</p>
                    <p className="text-sm text-muted-foreground">Elegant Formal</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Hindu Wedding */}
          <div className="group relative bg-card rounded-2xl p-8 md:p-10 elegant-border shadow-lg hover:shadow-xl transition-all duration-500">
            {/* Decorative corner */}
            <div className="absolute top-0 left-0 w-20 h-20 border-t-2 border-l-2 border-primary/30 rounded-tl-2xl" />
            <div className="absolute bottom-0 right-0 w-20 h-20 border-b-2 border-r-2 border-primary/30 rounded-br-2xl" />
            
            <div className="relative z-10">
              {/* Icon */}
              <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Sparkles className="w-8 h-8 text-accent" />
              </div>
              
              {/* Time label */}
              <span className="font-sans text-xs uppercase tracking-[0.2em] text-primary font-medium">
                Evening Ceremony
              </span>
              
              {/* Title */}
              <h3 className="font-serif text-3xl md:text-4xl font-light text-foreground mt-2 mb-6">
                Hindu Wedding
              </h3>
              
              {/* Details */}
              <div className="space-y-4 text-foreground/80">
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-sans font-medium">7:00 PM</p>
                    <p className="text-sm text-muted-foreground">6th February, 2026</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-sans font-medium">XYZ Lodge, Krishnagar</p>
                    <p className="text-sm text-muted-foreground">Traditional Ceremony & Pheras</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Shirt className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-sans font-medium">Dress Code</p>
                    <p className="text-sm text-muted-foreground">Traditional / Ethnic</p>
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

export default WeddingDetails;
