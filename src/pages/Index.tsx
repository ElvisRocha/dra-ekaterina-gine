import { useNavigate } from 'react-router-dom';
import { LanguageProvider } from '@/contexts/LanguageContext';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import WhyChooseUs from '@/components/WhyChooseUs';
import ServicesSection from '@/components/ServicesSection';
import TestimonialsSection from '@/components/TestimonialsSection';
import FinalCTA from '@/components/FinalCTA';
import Footer from '@/components/Footer';
import type { Service } from '@/data/services';

const IndexContent = () => {
  const navigate = useNavigate();

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
