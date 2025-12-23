import { useState } from "react";
import { ChevronLeft, ChevronRight, CalendarPlus } from "lucide-react";
import { Button } from "@/components/ui/button";

const WEDDING_DATE = new Date(2025, 1, 14); // February 14, 2025

const CalendarSection = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date(2025, 1, 1)); // February 2025
  
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
    const details = encodeURIComponent("Two ceremonies celebrating the union of Florance & Subhankar.\n\nMorning: Catholic Wedding at St. Thomas Cathedral\nEvening: Hindu Wedding at The Grand Pavilion");
    const location = encodeURIComponent("Mumbai, India");
    const startDate = "20250214T040000Z"; // 9:30 AM IST
    const endDate = "20250215T000000Z"; // 5:30 AM IST (next day)
    
    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}&dates=${startDate}/${endDate}`;
    window.open(url, '_blank');
  };
  
  const addToAppleCalendar = () => {
    const event = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'BEGIN:VEVENT',
      'DTSTART:20250214T093000',
      'DTEND:20250215T010000',
      'SUMMARY:Florance & Subhankar\'s Wedding',
      'DESCRIPTION:Two ceremonies celebrating the union of Florance & Subhankar.\\n\\nMorning: Catholic Wedding at St. Thomas Cathedral\\nEvening: Hindu Wedding at The Grand Pavilion',
      'LOCATION:Mumbai, India',
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
                      : 'hover:bg-secondary'
                }`}
              >
                {day && (
                  <span className={`font-sans text-sm md:text-base ${
                    isWeddingDay(day) ? 'font-bold' : 'text-foreground'
                  }`}>
                    {day}
                  </span>
                )}
              </div>
            ))}
          </div>
          
          {/* Wedding date highlight */}
          <div className="mt-8 text-center">
            <p className="font-serif text-lg text-foreground">
              February 14, 2025 — <span className="text-primary">Our Wedding Day</span>
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