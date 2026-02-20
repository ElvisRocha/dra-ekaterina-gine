import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { type Service } from '@/data/services';
import ServiceInfoPanel from '@/components/booking/ServiceInfoPanel';
import DecisionTreeFlow from '@/components/booking/DecisionTreeFlow';
import IsotipoImg from '@/assets/Isotipo.png';

interface ServicesSectionProps {
  onBookService: (service: Service) => void;
}

const ServicesSection = ({ onBookService }: ServicesSectionProps) => {
  const { t, language } = useLanguage();
  const [previewService, setPreviewService] = useState<Service | null>(null);
  const [confirmedService, setConfirmedService] = useState<Service | null>(null);

  const panelService = previewService ?? confirmedService;

  const handleSelectService = (service: Service | null) => {
    setConfirmedService(service);
  };

  const handleBook = () => {
    if (confirmedService) {
      onBookService(confirmedService);
    }
  };

  return (
    <section id="servicios" className="py-24 bg-background relative">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl text-foreground mb-4">
            {t('services.title')}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {t('services.subtitle')}
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-coral via-fuchsia to-magenta mx-auto rounded-full mt-6" />
        </motion.div>

        {/* Decision Tree + Info Panel */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-5xl mx-auto"
        >
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Decision tree - 60% */}
            <div className="w-full lg:w-[60%]">
              <DecisionTreeFlow
                onPreviewService={setPreviewService}
                onSelectService={handleSelectService}
                selectedService={confirmedService}
                actionLabel={t('services.book')}
                onAction={handleBook}
                language={language as 'es' | 'en'}
              />
            </div>

            {/* Info panel - 40% (desktop only) */}
            <div className="hidden lg:block w-full lg:w-[40%]">
              <AnimatePresence mode="wait">
                {panelService ? (
                  <motion.div
                    key={panelService.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="lg:sticky lg:top-24"
                  >
                    <ServiceInfoPanel
                      service={panelService}
                      className="h-fit"
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="h-full min-h-[200px] flex flex-col items-center justify-center border border-dashed border-border rounded-2xl bg-muted/30"
                  >
                    <p className="text-muted-foreground text-sm text-center px-4">
                      {language === 'es'
                        ? 'Selecciona un servicio para ver más información'
                        : 'Select a service to see more information'}
                    </p>
                    <motion.img
                      src={IsotipoImg}
                      alt="Isotipo clínica"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.65 }}
                      transition={{ duration: 0.6, delay: 0.2 }}
                      className="mt-6 w-[130px] h-auto"
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ServicesSection;
