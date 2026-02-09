import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  serviceInfoEs, 
  serviceInfoEn,
  type Service 
} from '@/data/services';
import { Clock, ChevronRight, Info, X } from 'lucide-react';

interface ServicesSectionProps {
  onBookService: (service: Service) => void;
}

const ServicesSection = ({ onBookService }: ServicesSectionProps) => {
  const { t, language } = useLanguage();
  const [selectedInfo, setSelectedInfo] = useState<string | null>(null);

  const categories = [
    { key: 'consultas' as const, icon: '👩‍⚕️' },
    { key: 'ultrasonidos' as const, icon: '🔬' },
    { key: 'dispositivos' as const, icon: '💊' },
    { key: 'colposcopia' as const, icon: '🔎' },
  ];

  const getServiceInfo = (infoKey: string | undefined) => {
    if (!infoKey) return null;
    return language === 'es' ? serviceInfoEs[infoKey] : serviceInfoEn[infoKey];
  };

  return (
    <section id="services" className="py-24 bg-background relative">
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

        {/* Services Accordion */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-4xl mx-auto"
        >
          <Accordion type="single" collapsible className="space-y-4">
            {categories.map((category) => {
              const categoryServices = getCategoryServices(category.key);
              return (
                <AccordionItem
                  key={category.key}
                  value={category.key}
                  className="border border-border rounded-2xl overflow-hidden bg-card shadow-soft"
                >
                  <AccordionTrigger className="px-6 py-5 hover:no-underline hover:bg-secondary/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <span className="text-2xl">{category.icon}</span>
                      <span className="font-display text-xl text-foreground">
                        {t(`cat.${category.key}`)}
                      </span>
                      <span className="text-sm text-muted-foreground bg-secondary px-3 py-1 rounded-full">
                        {categoryServices.length}
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-6">
                    <div className="grid gap-3 mt-2">
                      {categoryServices.map((service) => (
                        <div
                          key={service.id}
                          className="service-card group"
                        >
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex-1">
                              <h4 className="font-medium text-foreground mb-2">
                                {language === 'es' ? service.nameEs : service.nameEn}
                              </h4>
                              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <Clock className="w-4 h-4" />
                                  {service.duration}
                                </span>
                                <span className="flex items-center gap-1 font-semibold text-primary">
                                  {formatPrice(service.price)}
                                  {service.priceNote && (
                                    <span className="text-xs text-muted-foreground ml-1">
                                      ({language === 'es' ? service.priceNote.es : service.priceNote.en})
                                    </span>
                                  )}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {service.infoKey && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setSelectedInfo(service.infoKey!)}
                                  className="text-muted-foreground hover:bg-coral hover:text-white active:bg-coral-dark active:text-white"
                                >
                                  <Info className="w-4 h-4 mr-1" />
                                  {t('services.more')}
                                </Button>
                              )}
                              <Button
                                onClick={() => onBookService(service)}
                                size="sm"
                                className="bg-primary hover:bg-primary/90 text-primary-foreground"
                              >
                                {t('services.book')}
                                <ChevronRight className="w-4 h-4 ml-1" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>

          {/* Important Notes */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-8 p-6 bg-secondary/50 rounded-2xl border border-border"
          >
            <h4 className="font-display text-lg text-foreground mb-3 flex items-center gap-2">
              <span>📋</span>
              {language === 'es' ? 'Notas importantes' : 'Important notes'}
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-coral mt-0.5">•</span>
                <span>{t('notes.vph')}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-coral mt-0.5">•</span>
                <span>{t('notes.diu')}</span>
              </li>
            </ul>
          </motion.div>
        </motion.div>
      </div>

      {/* Service Info Modal */}
      <AnimatePresence>
        {selectedInfo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/50"
            onClick={() => setSelectedInfo(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-background rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-elevated"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display text-xl text-foreground">
                  {language === 'es' ? 'Información del servicio' : 'Service Information'}
                </h3>
                <button
                  onClick={() => setSelectedInfo(null)}
                  className="p-2 hover:bg-secondary rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="prose prose-sm max-w-none text-muted-foreground">
                {getServiceInfo(selectedInfo)?.split('\n').map((line, i) => (
                  <p key={i} className="mb-2 whitespace-pre-wrap">
                    {line}
                  </p>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default ServicesSection;
