import { motion, AnimatePresence } from 'framer-motion';
import { Clock, DollarSign, ChevronDown, ChevronUp, X, ShoppingBag } from 'lucide-react';
import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { formatPrice, type Service } from '@/data/services';
import { cn } from '@/lib/utils';

interface MultiServiceInfoPanelProps {
  services: Service[];
  onRemoveService?: (serviceId: string) => void;
  className?: string;
  isMobile?: boolean;
}

// Helper to parse duration strings and sum them
const parseDuration = (duration: string): number => {
  // Extract first number from duration string like "45 min (1ª vez) / 30 min" -> 45
  const match = duration.match(/(\d+)/);
  return match ? parseInt(match[1], 10) : 30;
};

const formatTotalDuration = (minutes: number, language: string): string => {
  if (minutes < 60) {
    return `${minutes} min`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  if (language === 'es') {
    return remainingMinutes > 0 
      ? `${hours}h ${remainingMinutes}min` 
      : `${hours}h`;
  }
  return remainingMinutes > 0 
    ? `${hours}h ${remainingMinutes}min` 
    : `${hours}h`;
};

const MultiServiceInfoPanel = ({ 
  services, 
  onRemoveService, 
  className, 
  isMobile = false 
}: MultiServiceInfoPanelProps) => {
  const { language } = useLanguage();
  const [isExpanded, setIsExpanded] = useState(false);

  if (services.length === 0) {
    return (
      <div className={cn('flex flex-col items-center justify-center py-8 text-center', className)}>
        <ShoppingBag className="w-12 h-12 text-muted-foreground/30 mb-3" />
        <p className="text-sm text-muted-foreground">
          {language === 'es' 
            ? 'Selecciona uno o más servicios' 
            : 'Select one or more services'}
        </p>
      </div>
    );
  }

  // Calculate totals
  const totalPrice = services.reduce((sum, s) => sum + s.price, 0);
  const totalMinutes = services.reduce((sum, s) => sum + parseDuration(s.duration), 0);
  const totalDuration = formatTotalDuration(totalMinutes, language);

  const content = (
    <div className="space-y-4">
      {/* Summary Header */}
      <div className="pb-3 border-b border-border">
        <h4 className="text-sm font-semibold text-foreground mb-3">
          {language === 'es' 
            ? `${services.length} servicio${services.length > 1 ? 's' : ''} seleccionado${services.length > 1 ? 's' : ''}` 
            : `${services.length} service${services.length > 1 ? 's' : ''} selected`}
        </h4>
        <div className="flex flex-wrap gap-3">
          <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground bg-background/50 px-3 py-1.5 rounded-full">
            <Clock className="w-4 h-4" />
            {totalDuration}
          </span>
          <span className="inline-flex items-center gap-1.5 text-sm font-bold text-primary bg-primary/10 px-3 py-1.5 rounded-full">
            <DollarSign className="w-4 h-4" />
            {formatPrice(totalPrice)}
          </span>
        </div>
      </div>

      {/* Services List */}
      <div className="space-y-2">
        {services.map((service) => {
          const serviceName = language === 'es' ? service.nameEs : service.nameEn;
          return (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="flex items-start gap-2 p-2 rounded-lg bg-background/50 group"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {serviceName}
                </p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{service.duration}</span>
                  <span>•</span>
                  <span className="text-primary font-medium">{formatPrice(service.price)}</span>
                </div>
              </div>
              {onRemoveService && (
                <button
                  onClick={() => onRemoveService(service.id)}
                  className="p-1 rounded-full hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors opacity-0 group-hover:opacity-100"
                  aria-label={language === 'es' ? 'Quitar servicio' : 'Remove service'}
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );

  // Mobile accordion version
  if (isMobile) {
    return (
      <div className={cn('bg-blush rounded-xl border border-border overflow-hidden', className)}>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full px-4 py-3 flex items-center justify-between text-left"
        >
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-foreground">
              {language === 'es' 
                ? `${services.length} servicio${services.length > 1 ? 's' : ''}` 
                : `${services.length} service${services.length > 1 ? 's' : ''}`}
            </span>
            <span className="text-sm font-bold text-primary">
              {formatPrice(totalPrice)}
            </span>
          </div>
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
              <div className="px-4 pb-4">
                {content}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // Desktop panel version
  return (
    <div className={cn('h-full', className)}>
      {content}
    </div>
  );
};

export default MultiServiceInfoPanel;
