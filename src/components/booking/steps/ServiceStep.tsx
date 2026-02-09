import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  services,
  formatPrice,
  getCategoryServices,
  type Service
} from '@/data/services';
import { Clock, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import ServiceInfoPanel from '@/components/booking/ServiceInfoPanel';
import ServiceInfoModal from '@/components/booking/ServiceInfoModal';
import IsotipoImg from '@/assets/Isotipo.png';
import { useIsMobile } from '@/hooks/use-mobile';

interface ServiceStepProps {
  selectedService: Service | null;
  onSelectService: (service: Service) => void;
  onNext: () => void;
}

const ServiceStep = ({ selectedService, onSelectService, onNext }: ServiceStepProps) => {
  const { t, language } = useLanguage();
  const isMobile = useIsMobile();
  const [expandedCategory, setExpandedCategory] = useState<string>(
    selectedService?.category ?? ''
  );
  const [showMobileInfoModal, setShowMobileInfoModal] = useState(false);
  const hasAutoExpanded = useRef(false);

  // Auto-expand category when service is pre-selected (e.g., from URL params)
  useEffect(() => {
    if (selectedService && !hasAutoExpanded.current) {
      setExpandedCategory(selectedService.category);
      hasAutoExpanded.current = true;
    }
  }, [selectedService]);

  const categories = [
    { key: 'consultas' as const, icon: '👩‍⚕️' },
    { key: 'ultrasonidos' as const, icon: '🔬' },
    { key: 'dispositivos' as const, icon: '💊' },
    { key: 'colposcopia' as const, icon: '🔎' },
  ];

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
            ? 'Elige el servicio que necesitas'
            : 'Choose the service you need'}
        </p>
      </div>

      {/* Card principal contenedora con layout 60-40 */}
      <Card className="p-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Services list - 60% */}
          <div className="w-full lg:w-[60%]">
            <Accordion type="single" collapsible value={expandedCategory} onValueChange={setExpandedCategory} className="space-y-3">
              {categories.map((category) => {
                const categoryServices = getCategoryServices(category.key);
                return (
                  <AccordionItem
                    key={category.key}
                    value={category.key}
                    className="border border-border rounded-xl overflow-hidden bg-card"
                  >
                    <AccordionTrigger className="px-4 py-4 hover:no-underline hover:bg-secondary/50 transition-colors">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <span className="text-xl flex-shrink-0">{category.icon}</span>
                        <span className="font-medium text-foreground flex-1 min-w-0 text-left">
                          {t(`cat.${category.key}`)}
                        </span>
                        <span className="text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded-full flex-shrink-0">
                          {categoryServices.length}
                        </span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-4">
                      <div className="space-y-2 mt-2">
                        {categoryServices.map((service) => {
                          const isSelected = selectedService?.id === service.id;
                          return (
                            <button
                              key={service.id}
                              onClick={() => onSelectService(service)}
                              className={cn(
                                'w-full p-4 rounded-lg border text-left transition-all',
                                isSelected
                                  ? 'border-primary bg-primary/5 ring-1 ring-primary'
                                  : 'border-border hover:border-primary/50 hover:bg-secondary/30'
                              )}
                            >
                              <div className="flex items-start justify-between gap-3">
                                <div className="flex-1 min-w-0">
                                  <h4 className="font-medium text-foreground text-sm mb-1">
                                    {language === 'es' ? service.nameEs : service.nameEn}
                                  </h4>
                                  <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                                    <span className="flex items-center gap-1">
                                      <Clock className="w-3 h-3" />
                                      {service.duration}
                                    </span>
                                    <span className="flex items-center gap-1 font-semibold text-primary">
                                      {formatPrice(service.price)}
                                    </span>
                                  </div>
                                </div>
                                {isSelected && (
                                  <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.2 }}
                                    className="flex-shrink-0"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleNextClick();
                                    }}
                                  >
                                    <span
                                      className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-colors"
                                    >
                                      {t('booking.next')}
                                      <ChevronRight className="w-3.5 h-3.5" />
                                    </span>
                                  </motion.div>
                                )}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          </div>

          {/* Service Info Panel - 40% (desktop only) */}
          <div className="hidden lg:block w-full lg:w-[40%]">
            <AnimatePresence mode="wait">
              {selectedService ? (
                <motion.div
                  key={selectedService.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="lg:sticky lg:top-24"
                >
                  <ServiceInfoPanel
                    service={selectedService}
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
