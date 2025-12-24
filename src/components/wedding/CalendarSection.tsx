import { useState } from "react";
import { ChevronLeft, ChevronRight, CalendarPlus } from "lucide-react";
import { Button } from "@/components/ui/button";

const HALDI_DATE = new Date(2026, 1, 5); // February 5, 2026
const WEDDING_DATE = new Date(2026, 1, 6); // February 6, 2026

const CalendarSection = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 1, 1)); // February 2026
  
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }
    
    // Add the days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }
    
    return days;
  };
  
  const isHaldiDay = (day: number | null) => {
    if (!day) return false;
    return (
      currentMonth.getFullYear() === HALDI_DATE.getFullYear() &&
      currentMonth.getMonth() === HALDI_DATE.getMonth() &&
      day === HALDI_DATE.getDate()
    );
  };

  const isWeddingDay = (day: number | null) => {
    if (!day) return false;
    return (
      currentMonth.getFullYear() === WEDDING_DATE.getFullYear() &&
      currentMonth.getMonth() === WEDDING_DATE.getMonth() &&
      day === WEDDING_DATE.getDate()
    );
  };
  
  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };
  
  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };
  
  const addToGoogleCalendar = () => {
    const title = encodeURIComponent("Florance & Subhankar's Wedding");
    const details = encodeURIComponent("Two ceremonies celebrating the union of Florance & Subhankar.\n\nMorning: Catholic Wedding at Krishnagar Cathedral Church\nEvening: Hindu Wedding at XYZ Lodge, Krishnagar");
    const location = encodeURIComponent("Krishnagar, India");
    const startDate = "20260206T043000Z"; // 10:00 AM IST
    const endDate = "20260207T000000Z"; // 5:30 AM IST (next day)
    
    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}&dates=${startDate}/${endDate}`;
    window.open(url, '_blank');
  };
  
  const addToAppleCalendar = () => {
    const event = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'BEGIN:VEVENT',
      'DTSTART:20260206T100000',
      'DTEND:20260207T010000',
      'SUMMARY:Florance & Subhankar\'s Wedding',
      'DESCRIPTION:Two ceremonies celebrating the union of Florance & Subhankar.\\n\\nMorning: Catholic Wedding at Krishnagar Cathedral Church\\nEvening: Hindu Wedding at XYZ Lodge, Krishnagar',
      'LOCATION:Krishnagar, India',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\n');
    
    const blob = new Blob([event], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'florance-subhankar-wedding.ics';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };
  
  const days = getDaysInMonth(currentMonth);
  
  return (
    <section id="calendar" className="py-20 md:py-32 px-6 bg-background">
      <div className="max-w-2xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-12">
          <p className="font-sans text-sm uppercase tracking-[0.3em] text-primary mb-4">
            Save The Date
          </p>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-light text-foreground">
            Mark Your Calendar
          </h2>
          <div className="flex items-center justify-center gap-4 mt-6">
            <div className="h-px w-12 bg-primary/30" />
            <div className="w-2 h-2 rounded-full bg-primary" />
            <div className="h-px w-12 bg-primary/30" />
          </div>
        </div>
        
        {/* Calendar */}
        <div className="bg-card rounded-2xl p-6 md:p-8 elegant-border shadow-lg">
          {/* Month navigation */}
          <div className="flex items-center justify-between mb-6">
            <button 
              onClick={prevMonth}
              className="p-2 rounded-full hover:bg-secondary transition-colors"
              aria-label="Previous month"
            >
              <ChevronLeft className="w-5 h-5 text-foreground" />
            </button>
            <h3 className="font-serif text-2xl md:text-3xl font-light text-foreground">
              {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </h3>
            <button 
              onClick={nextMonth}
              className="p-2 rounded-full hover:bg-secondary transition-colors"
              aria-label="Next month"
            >
              <ChevronRight className="w-5 h-5 text-foreground" />
            </button>
          </div>
          
          {/* Days of week header */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {daysOfWeek.map((day) => (
              <div key={day} className="text-center py-2">
                <span className="font-sans text-xs uppercase tracking-wider text-muted-foreground">
                  {day}
                </span>
              </div>
            ))}
          </div>
          
          {/* Calendar days */}
          <div className="grid grid-cols-7 gap-1">
            {days.map((day, index) => (
              <div 
                key={index}
                className={`aspect-square flex items-center justify-center rounded-lg transition-all duration-300 ${
                  day === null 
                    ? '' 
                    : isWeddingDay(day)
                      ? 'bg-primary text-primary-foreground shadow-lg transform scale-110 ring-4 ring-primary/30'
                      : isHaldiDay(day)
                        ? 'bg-haldi text-haldi-foreground shadow-md ring-2 ring-haldi/30'
                        : 'hover:bg-secondary'
                }`}
              >
                {day && (
                  <span className={`font-sans text-sm md:text-base ${
                    isWeddingDay(day) || isHaldiDay(day) ? 'font-bold' : 'text-foreground'
                  }`}>
                    {day}
                  </span>
                )}
              </div>
            ))}
          </div>
          
          {/* Wedding date highlight */}
          <div className="mt-8 text-center space-y-2">
            <p className="font-serif text-base text-foreground">
              February 5, 2026 — <span className="text-haldi font-medium">Haldi Ceremony</span>
            </p>
            <p className="font-serif text-lg text-foreground">
              February 6, 2026 — <span className="text-primary">Our Wedding Day</span>
            </p>
          </div>
        </div>
        
        {/* Calendar buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <Button 
            onClick={addToGoogleCalendar}
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-sans"
          >
            <CalendarPlus className="w-4 h-4 mr-2" />
            Add to Google Calendar
          </Button>
          <Button 
            onClick={addToAppleCalendar}
            variant="outline"
            className="border-primary text-foreground hover:bg-primary hover:text-primary-foreground font-sans"
          >
            <CalendarPlus className="w-4 h-4 mr-2" />
            Add to Apple Calendar
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CalendarSection;