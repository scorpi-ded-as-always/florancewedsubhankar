import { MapPin, Navigation, Church, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const venues = [
  {
    name: "St. Thomas Cathedral",
    type: "Catholic Wedding",
    address: "123 Church Street, Bandra West, Mumbai 400050",
    icon: Church,
    mapUrl: "https://maps.google.com/?q=St+Thomas+Cathedral+Mumbai",
    embedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3771.2!2d72.83!3d19.05!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTnCsDAzJzAwLjAiTiA3MsKwNDknNDguMCJF!5e0!3m2!1sen!2sin!4v1234567890"
  },
  {
    name: "The Grand Pavilion",
    type: "Hindu Wedding",
    address: "456 Heritage Lane, Juhu, Mumbai 400049",
    icon: Sparkles,
    mapUrl: "https://maps.google.com/?q=Grand+Pavilion+Juhu+Mumbai",
    embedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3770.5!2d72.82!3d19.10!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTnCsDA2JzAwLjAiTiA3MsKwNDknMTIuMCJF!5e0!3m2!1sen!2sin!4v1234567890"
  }
];

const LocationMap = () => {
  return (
    <section id="location" className="py-20 md:py-32 px-6 bg-background">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-16">
          <p className="font-sans text-sm uppercase tracking-[0.3em] text-primary mb-4">
            Find Us
          </p>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-light text-foreground">
            Venues
          </h2>
          <div className="flex items-center justify-center gap-4 mt-6">
            <div className="h-px w-12 bg-primary/30" />
            <MapPin className="w-4 h-4 text-primary" />
            <div className="h-px w-12 bg-primary/30" />
          </div>
        </div>
        
        {/* Venues grid */}
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {venues.map((venue, index) => (
            <div 
              key={index}
              className="bg-card rounded-2xl overflow-hidden elegant-border shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              {/* Map placeholder */}
              <div className="relative h-64 bg-secondary">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="w-12 h-12 mx-auto mb-2 text-primary/30" />
                    <p className="text-sm font-sans text-muted-foreground/50">Map Preview</p>
                  </div>
                </div>
                {/* Decorative gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
              </div>
              
              {/* Venue info */}
              <div className="p-6 md:p-8">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                    <venue.icon className="w-6 h-6 text-accent" />
                  </div>
                  <div className="flex-1">
                    <span className="font-sans text-xs uppercase tracking-[0.2em] text-primary font-medium">
                      {venue.type}
                    </span>
                    <h3 className="font-serif text-2xl font-light text-foreground mt-1">
                      {venue.name}
                    </h3>
                    <p className="font-sans text-sm text-muted-foreground mt-2">
                      {venue.address}
                    </p>
                  </div>
                </div>
                
                <Button 
                  onClick={() => window.open(venue.mapUrl, '_blank')}
                  className="w-full mt-6 bg-primary hover:bg-primary/90 text-primary-foreground font-sans"
                >
                  <Navigation className="w-4 h-4 mr-2" />
                  Get Directions
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LocationMap;