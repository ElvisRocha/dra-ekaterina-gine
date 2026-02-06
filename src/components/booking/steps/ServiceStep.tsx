import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
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
import { Clock, DollarSign, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ServiceStepProps {
  selectedService: Service | null;
  onSelectService: (service: Service) => void;
  onNext: () => void;
}

const ServiceStep = ({ selectedService, onSelectService, onNext }: ServiceStepProps) => {
  const { t, language } = useLanguage();

  const categories = [
    { key: 'consultas' as const, icon: '👩‍⚕️' },
    { key: 'ultrasonidos' as const, icon: '🔬' },
    { key: 'dispositivos' as const, icon: '💊' },
    { key: 'colposcopia' as const, icon: '🔎' },
  ];

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

      <Accordion type="single" collapsible className="space-y-3">
        {categories.map((category) => {
          const categoryServices = getCategoryServices(category.key);
          return (
            <AccordionItem
              key={category.key}
              value={category.key}
              className="border border-border rounded-xl overflow-hidden bg-card"
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
                                <DollarSign className="w-3 h-3" />
                                {formatPrice(service.price)}
                              </span>
                            </div>
                          </div>
                          {isSelected && (
                            <div className="flex-shrink-0 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                              <Check className="w-3 h-3 text-primary-foreground" />
                            </div>
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

      {/* Next Button */}
      <div className="pt-4">
        <Button
          onClick={onNext}
          disabled={!selectedService}
          className="w-full h-12 btn-gradient rounded-full"
        >
          {t('booking.next')}
        </Button>
      </div>
    </motion.div>
  );
};

export default ServiceStep;
