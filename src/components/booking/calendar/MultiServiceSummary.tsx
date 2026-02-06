import { Clock, Globe, DollarSign } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { formatPrice, type Service } from '@/data/services';

interface MultiServiceSummaryProps {
  services: Service[];
}

// Helper to parse duration strings and sum them
const parseDuration = (duration: string): number => {
  const match = duration.match(/(\d+)/);
  return match ? parseInt(match[1], 10) : 30;
};

const formatTotalDuration = (minutes: number, language: string): string => {
  if (minutes < 60) {
    return `${minutes} min`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return remainingMinutes > 0 
    ? `${hours}h ${remainingMinutes}min` 
    : `${hours}h`;
};

const MultiServiceSummary = ({ services }: MultiServiceSummaryProps) => {
  const { language } = useLanguage();
  
  // Calculate totals
  const totalPrice = services.reduce((sum, s) => sum + s.price, 0);
  const totalMinutes = services.reduce((sum, s) => sum + parseDuration(s.duration), 0);
  const totalDuration = formatTotalDuration(totalMinutes, language);

  return (
    <div className="space-y-4">
      <div>
        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
          {language === 'es' 
            ? `${services.length} servicio${services.length > 1 ? 's' : ''} seleccionado${services.length > 1 ? 's' : ''}` 
            : `${services.length} service${services.length > 1 ? 's' : ''} selected`}
        </p>
        <div className="space-y-1.5 mt-2">
          {services.map((service) => (
            <p key={service.id} className="text-sm text-foreground leading-tight truncate">
              • {language === 'es' ? service.nameEs : service.nameEn}
            </p>
          ))}
        </div>
      </div>

      <div className="space-y-3 pt-3 border-t border-border">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="w-4 h-4 flex-shrink-0" />
          <span>{totalDuration}</span>
        </div>

        <div className="flex items-center gap-2 text-sm font-semibold text-primary">
          <DollarSign className="w-4 h-4 flex-shrink-0" />
          <span>{formatPrice(totalPrice)}</span>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Globe className="w-4 h-4 flex-shrink-0" />
          <span>America/Costa_Rica</span>
        </div>
      </div>
    </div>
  );
};

export default MultiServiceSummary;
