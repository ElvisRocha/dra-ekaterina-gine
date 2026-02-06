import { useState } from 'react';
import { LanguageProvider } from '@/contexts/LanguageContext';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import WhyChooseUs from '@/components/WhyChooseUs';
import ServicesSection from '@/components/ServicesSection';
import TestimonialsSection from '@/components/TestimonialsSection';
import FinalCTA from '@/components/FinalCTA';
import Footer from '@/components/Footer';
import BookingModal from '@/components/BookingModal';
import type { Service } from '@/data/services';

const Index = () => {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [preselectedService, setPreselectedService] = useState<Service | null>(null);

  const handleBookClick = () => {
    setPreselectedService(null);
    setIsBookingOpen(true);
  };

  const handleBookService = (service: Service) => {
    setPreselectedService(service);
    setIsBookingOpen(true);
  };

  const handleCloseBooking = () => {
    setIsBookingOpen(false);
    setPreselectedService(null);
  };

  return (
    <LanguageProvider>
      <div className="min-h-screen bg-background">
        <Navbar onBookClick={handleBookClick} />
        <HeroSection onBookClick={handleBookClick} />
        <WhyChooseUs onBookClick={handleBookClick} />
        <ServicesSection onBookService={handleBookService} />
        <TestimonialsSection />
        <FinalCTA onBookClick={handleBookClick} />
        <Footer />
        
        <BookingModal
          isOpen={isBookingOpen}
          onClose={handleCloseBooking}
          preselectedService={preselectedService}
        />
      </div>
    </LanguageProvider>
  );
};

export default Index;
