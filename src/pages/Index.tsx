import Navigation from "@/components/wedding/Navigation";
import HeroSection from "@/components/wedding/HeroSection";
import OurStory from "@/components/wedding/OurStory";
import WeddingDetails from "@/components/wedding/WeddingDetails";
import Schedule from "@/components/wedding/Schedule";
import CalendarSection from "@/components/wedding/CalendarSection";
import Gallery from "@/components/wedding/Gallery";
import PhotoDump from "@/components/wedding/PhotoDump";
import LocationMap from "@/components/wedding/LocationMap";
import Footer from "@/components/wedding/Footer";

const Index = () => {
  return (
    <main className="min-h-screen">
      <Navigation />
      <HeroSection />
      <OurStory />
      <WeddingDetails />
      <Schedule />
      <CalendarSection />
      <Gallery />
      <PhotoDump />
      <LocationMap />
      <Footer />
    </main>
  );
};

export default Index;