import { MapPin, Navigation, Church, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const venues = [
  {
    name: "Krishnagar Cathedral Church",
    type: "Catholic Wedding",
    time: "From 10:00 AM",
    date: "06 February, 2026 - Friday",
    address: "Cathedral Road, Krishnagar, Nadia - 741101",
    icon: Church,
    mapUrl: "https://maps.google.com/?q=Krishnagar+Cathedral+Church+Cathedral+Road+Krishnagar+Nadia+741101",
    embedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3661.4832888663695!2d88.48655459999999!3d23.4069029!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39f92024904875af%3A0xe6bb2f933b60224e!2sKrishnanagar%20Cathedral%20Church!5e0!3m2!1sen!2sin!4v1766591306453!5m2!1sen!2sin",
  },
  {
    name: "Lodge Bhakti Bhawan",
    type: "Hindu Wedding",
    time: "From 10:15 PM",
    date: "06 February, 2026 - Friday",
    address: "D.L. Roy Road, Bowbazar, Krishnagar, Nadia - 741101",
    icon: Sparkles,
    mapUrl: "https://maps.app.goo.gl/XQhLyJV6iv6DzcH48",
    embedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3661.640918242916!2d88.48992299999999!3d23.401204099999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39f92194b5b1f555%3A0x84eebb0e964d9!2sPromoda%20Bhavan!5e0!3m2!1sen!2sin!4v1768306086647!5m2!1sen!2sin",
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
              {/* Map embed or placeholder */}
              <div className="relative h-64 bg-secondary overflow-hidden">
                {venue.embedUrl ? (
                  <iframe
                    src={venue.embedUrl}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title={`Map of ${venue.name}`}
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <MapPin className="w-12 h-12 mx-auto mb-2 text-primary/30" />
                      <p className="text-sm font-sans text-muted-foreground/50">Map Preview</p>
                    </div>
                  </div>
                )}
                {/* Decorative gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent pointer-events-none" />
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
                    <p className="font-sans text-sm font-medium text-foreground/80 mt-2">
                      {venue.time} • {venue.date}
                    </p>
                    <p className="font-sans text-sm text-muted-foreground mt-1">
                      {venue.address}
                    </p>
                  </div>
                </div>
                
                <Button 
                  asChild
                  className="w-full mt-6 bg-primary hover:bg-primary/90 text-primary-foreground font-sans"
                >
                  <a href={venue.mapUrl} target="_blank" rel="noopener noreferrer">
                    <Navigation className="w-4 h-4 mr-2" />
                    Get Directions
                  </a>
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