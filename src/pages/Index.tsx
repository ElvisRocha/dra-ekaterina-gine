import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LanguageProvider } from '@/contexts/LanguageContext';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import WhyChooseUs from '@/components/WhyChooseUs';
import ServicesSection from '@/components/ServicesSection';
import TestimonialsSection from '@/components/TestimonialsSection';
import FAQ from '@/components/FAQ';
import FinalCTA from '@/components/FinalCTA';
import Footer from '@/components/Footer';
import type { Service } from '@/data/services';

const IndexContent = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const scrollTo = (location.state as { scrollTo?: string })?.scrollTo;
    if (scrollTo) {
      setTimeout(() => {
        const element = document.getElementById(scrollTo);
        if (element) {
          const headerOffset = 80;
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
          window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
        }
      }, 100);
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const handleBookClick = () => {
    navigate('/BookAppointment');
  };

  const handleBookService = (service: Service) => {
    navigate(`/BookAppointment?service=${service.id}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar onBookClick={handleBookClick} />
      <HeroSection onBookClick={handleBookClick} />
      <WhyChooseUs onBookClick={handleBookClick} />
      <ServicesSection onBookService={handleBookService} />
      <TestimonialsSection />
      <FAQ onBookClick={handleBookClick} />
      <FinalCTA onBookClick={handleBookClick} />
      <Footer />
    </div>
  );
};

const Index = () => {
  return (
    <LanguageProvider>
      <IndexContent />
    </LanguageProvider>
  );
};

export default Index;
