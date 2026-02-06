import { motion, AnimatePresence } from 'framer-motion';
import { Clock, DollarSign, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { formatPrice, serviceInfoEs, serviceInfoEn, type Service } from '@/data/services';
import { cn } from '@/lib/utils';

interface ServiceInfoPanelProps {
  service: Service | null;
  className?: string;
  isMobile?: boolean;
}

const ServiceInfoPanel = ({ service, className, isMobile = false }: ServiceInfoPanelProps) => {
  const { language, t } = useLanguage();
  const [isExpanded, setIsExpanded] = useState(false);

  if (!service) return null;

  const serviceName = language === 'es' ? service.nameEs : service.nameEn;
  const infoKey = service.infoKey;
  const info = infoKey ? (language === 'es' ? serviceInfoEs[infoKey] : serviceInfoEn[infoKey]) : null;

  // Mobile accordion version
  if (isMobile) {
    return (
      <div className={cn('bg-blush rounded-xl border border-border overflow-hidden', className)}>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full px-4 py-3 flex items-center justify-between text-left"
        >
          <span className="text-sm font-medium text-foreground">
            {t('serviceInfo.viewInfo')}
          </span>
          {isExpanded ? (
            <ChevronUp className="w-4 h-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          )}
        </button>
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="px-4 pb-4 space-y-4">
                <ServiceContent service={service} serviceName={serviceName} info={info} language={language} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // Desktop panel version
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className={cn(
        'bg-blush rounded-2xl border border-border p-6 overflow-y-auto',
        className
      )}
    >
      <ServiceContent service={service} serviceName={serviceName} info={info} language={language} />
    </motion.div>
  );
};

interface ServiceContentProps {
  service: Service;
  serviceName: string;
  info: string | null;
  language: string;
}

const ServiceContent = ({ service, serviceName, info, language }: ServiceContentProps) => (
  <>
    {/* Header */}
    <div className="mb-6">
      <h3 className="font-display text-xl text-foreground mb-3">{serviceName}</h3>
      <div className="flex flex-wrap gap-3">
        <span className="inline-flex items-center gap-1 text-sm text-muted-foreground bg-background/50 px-3 py-1 rounded-full">
          <Clock className="w-4 h-4" />
          {service.duration}
        </span>
        <span className="inline-flex items-center gap-1 text-sm font-semibold text-primary bg-background/50 px-3 py-1 rounded-full">
          <DollarSign className="w-4 h-4" />
          {formatPrice(service.price)}
        </span>
      </div>
    </div>

    {/* Educational Content */}
    {info && (
      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-foreground">
          {language === 'es' ? 'Información del servicio' : 'Service Information'}
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
  </>
);

export default ServiceInfoPanel;
