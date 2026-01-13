import { Heart, Church, Sparkles, Music, Users, Sun } from "lucide-react";

const scheduleItems = [
  {
    date: "5th February",
    time: "All Day",
    title: "Haldi Ceremony",
    description: "Pre-wedding celebration at Residency",
    icon: Sun,
  },
  {
    date: "6th February",
    time: "9:30 AM",
    title: "Welcome & Arrival",
    description: "Guests arrive at Krishnagar Cathedral Church",
    icon: Users,
  },
  {
    date: "6th February",
    time: "10:00 AM",
    title: "Catholic Ceremony",
    description: "Holy Mass & Exchange of Vows at Krishnagar Cathedral",
    icon: Church,
  },
  {
    date: "6th February",
    time: "6:30 PM",
    title: "Baraat Welcome",
    description: "Traditional groom's procession at Lodge Bhakti Bhawan",
    icon: Music,
  },
  {
    date: "6th February",
    time: "7:00 PM",
    title: "Hindu Ceremony",
    description: "Sacred rituals & Pheras at Lodge Bhakti Bhawan, Krishnagar",
    icon: Sparkles,
  },
  {
    date: "6th February",
    time: "10:00 PM",
    title: "Banquet & Dinner",
    description: "Celebration, dancing & feast",
    icon: Heart,
  },
];

const Schedule = () => {
  return (
    <section id="schedule" className="py-20 md:py-32 px-6 bg-card/50">
      <div className="max-w-4xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-16">
          <p className="font-sans text-sm uppercase tracking-[0.3em] text-primary mb-4">
            The Day
          </p>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-light text-foreground">
            Schedule
          </h2>
          <div className="flex items-center justify-center gap-4 mt-6">
            <div className="h-px w-12 bg-primary/30" />
            <div className="w-2 h-2 rounded-full bg-primary" />
            <div className="h-px w-12 bg-primary/30" />
          </div>
        </div>
        
        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-primary/20 via-primary/40 to-primary/20 transform md:-translate-x-1/2" />
          
          {/* Schedule items */}
          <div className="space-y-8 md:space-y-12">
            {scheduleItems.map((item, index) => (
              <div 
                key={index}
                className={`relative flex items-start gap-6 md:gap-0 ${
                  index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}
              >
                {/* Content */}
                <div className={`flex-1 md:w-1/2 ${index % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:pl-12 md:text-left'} pl-12 md:pl-0`}>
                  <div className="bg-card rounded-xl p-6 elegant-border shadow-md hover:shadow-lg transition-shadow duration-300">
                    <span className="font-sans text-xs text-muted-foreground tracking-wider">
                      {item.date}
                    </span>
                    <span className="font-sans text-sm text-primary font-medium tracking-wider block">
                      {item.time}
                    </span>
                    <h3 className="font-serif text-xl md:text-2xl font-medium text-foreground mt-1">
                      {item.title}
                    </h3>
                    <p className="font-sans text-sm text-muted-foreground mt-2">
                      {item.description}
                    </p>
                  </div>
                </div>
                
                {/* Icon circle */}
                <div className="absolute left-0 md:left-1/2 w-12 h-12 rounded-full bg-primary flex items-center justify-center transform md:-translate-x-1/2 shadow-lg z-10">
                  <item.icon className="w-5 h-5 text-primary-foreground" />
                </div>
                
                {/* Spacer for alternating layout */}
                <div className="hidden md:block flex-1 md:w-1/2" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Schedule;