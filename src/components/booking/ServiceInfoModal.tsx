import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { formatPrice, serviceInfoEs, serviceInfoEn, type Service } from '@/data/services';
import { Button } from '@/components/ui/button';

interface ServiceInfoModalProps {
  isOpen: boolean;
  service: Service | null;
  onClose: () => void;
  onContinue: () => void;
}

const ServiceInfoModal = ({ isOpen, service, onClose, onContinue }: ServiceInfoModalProps) => {
  const { language, t } = useLanguage();

  if (!service) return null;

  const serviceName = language === 'es' ? service.nameEs : service.nameEn;
  const infoKey = service.infoKey;
  const info = infoKey ? (language === 'es' ? serviceInfoEs[infoKey] : serviceInfoEn[infoKey]) : null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-end justify-center bg-foreground/50"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-background w-full rounded-t-2xl max-h-[90vh] flex flex-col shadow-elevated"
          >
            {/* Header */}
            <div className="sticky top-0 bg-background border-b border-border px-6 py-4 flex items-center justify-between rounded-t-2xl">
              <h2 className="font-display text-lg text-foreground">
                {t('serviceInfo.title')}
              </h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-secondary rounded-full transition-colors"
                aria-label={language === 'es' ? 'Cerrar' : 'Close'}
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            {/* Content */}
            <div className="px-6 py-6 overflow-y-auto flex-1">
              {/* Service name */}
              <h3 className="font-display text-xl text-foreground mb-4">
                {serviceName}
              </h3>

              {/* Duration and price */}
              <div className="flex flex-wrap items-center gap-3 mb-6 pb-6 border-b border-border">
                <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground bg-secondary px-3 py-1.5 rounded-full">
                  <Clock className="w-4 h-4" />
                  {service.duration}
                </span>
                <span className="inline-flex items-center gap-1 text-sm font-semibold text-primary bg-primary/10 px-3 py-1.5 rounded-full">
                  {formatPrice(service.price)}
                </span>
              </div>

              {/* Detailed info */}
              {info && (
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-foreground">
                    {t('serviceInfo.title')}
                  </h4>
                  <div className="text-sm text-muted-foreground space-y-2">
                    {info.split('\n').map((line, i) => (
                      <p key={i} className="whitespace-pre-wrap leading-relaxed">
                        {line}
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Continue button */}
            <div className="sticky bottom-0 bg-background border-t border-border px-6 py-4">
              <Button
                onClick={onContinue}
                className="w-full h-12 rounded-full btn-gradient font-medium"
                size="lg"
              >
                {t('serviceInfo.continue')}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ServiceInfoModal;
