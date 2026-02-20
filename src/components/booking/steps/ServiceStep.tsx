import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { type Service } from '@/data/services';
import { Card } from '@/components/ui/card';
import ServiceInfoPanel from '@/components/booking/ServiceInfoPanel';
import ServiceInfoModal from '@/components/booking/ServiceInfoModal';
import DecisionTreeFlow from '@/components/booking/DecisionTreeFlow';
import IsotipoImg from '@/assets/Isotipo.png';
import { useIsMobile } from '@/hooks/use-mobile';

interface ServiceStepProps {
  selectedService: Service | null;
  onSelectService: (service: Service | null) => void;
  onNext: () => void;
}

const ServiceStep = ({ selectedService, onSelectService, onNext }: ServiceStepProps) => {
  const { t, language } = useLanguage();
  const isMobile = useIsMobile();
  const [previewService, setPreviewService] = useState<Service | null>(null);
  const [showMobileInfoModal, setShowMobileInfoModal] = useState(false);

  const panelService = previewService ?? selectedService;

  const handleNextClick = () => {
    if (!selectedService) return;
    if (isMobile) {
      setShowMobileInfoModal(true);
    } else {
      onNext();
    }
  };

  const handleMobileModalContinue = () => {
    setShowMobileInfoModal(false);
    onNext();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <h2 className="font-display text-2xl text-foreground mb-2">
          {t('booking.selectService')}
        </h2>
        <p className="text-muted-foreground text-sm">
          {language === 'es'
            ? 'Responde las preguntas para encontrar el servicio ideal para ti'
            : 'Answer the questions to find the ideal service for you'}
        </p>
      </div>

      {/* Card principal contenedora con layout 60-40 */}
      <Card className="p-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Decision tree - 60% */}
          <div className="w-full lg:w-[60%]">
            <DecisionTreeFlow
              onPreviewService={setPreviewService}
              onSelectService={onSelectService}
              selectedService={selectedService}
              actionLabel={t('booking.next')}
              onAction={handleNextClick}
              language={language as 'es' | 'en'}
            />
          </div>

          {/* Service Info Panel - 40% (desktop only) */}
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
      </Card>

      {/* Mobile service info modal */}
      <ServiceInfoModal
        isOpen={showMobileInfoModal}
        service={selectedService}
        onClose={() => setShowMobileInfoModal(false)}
        onContinue={handleMobileModalContinue}
      />
    </motion.div>
  );
};

export default ServiceStep;
