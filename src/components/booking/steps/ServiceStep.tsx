import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { 
  formatPrice, 
  getCategoryServices, 
  type Service 
} from '@/data/services';
import { Clock, DollarSign } from 'lucide-react';
import { cn } from '@/lib/utils';
import MultiServiceInfoPanel from '../MultiServiceInfoPanel';

interface ServiceStepProps {
  selectedServices: Service[];
  onToggleService: (service: Service) => void;
  onRemoveService: (serviceId: string) => void;
  onNext: () => void;
}

const ServiceStep = ({ selectedServices, onToggleService, onRemoveService, onNext }: ServiceStepProps) => {
  const { t, language } = useLanguage();

  const categories = [
    { key: 'consultas' as const, icon: '👩‍⚕️' },
    { key: 'ultrasonidos' as const, icon: '🔬' },
    { key: 'dispositivos' as const, icon: '💊' },
    { key: 'colposcopia' as const, icon: '🔎' },
  ];

  const isServiceSelected = (serviceId: string) => 
    selectedServices.some(s => s.id === serviceId);

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
            ? 'Puedes seleccionar uno o varios servicios' 
            : 'You can select one or multiple services'}
        </p>
      </div>

      {/* Main card container with services and info panel inside - 60/40 split */}
      <div className="bg-card rounded-2xl border border-border overflow-hidden">
        <div className="flex flex-col xl:grid xl:grid-cols-[60%_40%]">
          {/* Services accordion section - 60% */}
          <div className="p-4 xl:p-6">
            <Accordion type="single" collapsible className="space-y-3">
              {categories.map((category) => {
                const categoryServices = getCategoryServices(category.key);
                const selectedInCategory = categoryServices.filter(s => isServiceSelected(s.id)).length;
                
                return (
                  <AccordionItem
                    key={category.key}
                    value={category.key}
                    className="border border-border rounded-xl overflow-hidden bg-background"
                  >
                    <AccordionTrigger className="px-4 py-4 hover:no-underline hover:bg-secondary/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{category.icon}</span>
                        <span className="font-medium text-foreground">
                          {t(`cat.${category.key}`)}
                        </span>
                        <span className="text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">
                          {categoryServices.length}
                        </span>
                        {selectedInCategory > 0 && (
                          <span className="text-xs text-primary-foreground bg-primary px-2 py-0.5 rounded-full">
                            {selectedInCategory} ✓
                          </span>
                        )}
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-4">
                      <div className="space-y-2 mt-2">
                        {categoryServices.map((service) => {
                          const isSelected = isServiceSelected(service.id);
                          return (
                            <button
                              key={service.id}
                              onClick={() => onToggleService(service)}
                              className={cn(
                                'w-full p-4 rounded-lg border text-left transition-all',
                                isSelected
                                  ? 'border-primary bg-primary/5 ring-1 ring-primary'
                                  : 'border-border hover:border-primary/50 hover:bg-secondary/30'
                              )}
                            >
                              <div className="flex items-start gap-3">
                                <Checkbox 
                                  checked={isSelected}
                                  className="mt-0.5 pointer-events-none"
                                />
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
                                      <DollarSign className="w-3 h-3" />
                                      {formatPrice(service.price)}
                                    </span>
                                  </div>
                                </div>
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

          {/* Multi-Service Info Panel - inside the card (Desktop) - 40% */}
          <div className="hidden xl:block border-l border-border bg-blush/50 p-6">
            <MultiServiceInfoPanel
              services={selectedServices}
              onRemoveService={onRemoveService}
            />
          </div>
        </div>

        {/* Multi-Service Info Panel - inside the card (Mobile) */}
        {selectedServices.length > 0 && (
          <div className="xl:hidden border-t border-border">
            <MultiServiceInfoPanel
              services={selectedServices}
              onRemoveService={onRemoveService}
              isMobile
              className="rounded-none border-0"
            />
          </div>
        )}
      </div>

      {/* Next Button */}
      <div className="pt-4">
        <Button
          onClick={onNext}
          disabled={selectedServices.length === 0}
          className="w-full h-12 btn-gradient rounded-full"
        >
          <span>{t('booking.next')}</span>
        </Button>
      </div>
    </motion.div>
  );
};

export default ServiceStep;
