import { Clock, Globe, DollarSign } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { formatPrice, type Service } from '@/data/services';

interface ServiceSummaryProps {
  service: Service;
}

const ServiceSummary = ({ service }: ServiceSummaryProps) => {
  const { language, t } = useLanguage();
  const serviceName = language === 'es' ? service.nameEs : service.nameEn;

  return (
    <div className="space-y-4">
      <div>
        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
          {language === 'es' ? 'Servicio seleccionado' : 'Selected service'}
        </p>
        <h3 className="font-display text-lg text-foreground leading-tight">
          {serviceName}
        </h3>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="w-4 h-4 flex-shrink-0" />
          <span>{service.duration}</span>
        </div>

        <div className="flex items-center gap-2 text-sm font-semibold text-primary">
          <DollarSign className="w-4 h-4 flex-shrink-0" />
          <span>{formatPrice(service.price)}</span>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Globe className="w-4 h-4 flex-shrink-0" />
          <span>America/Costa_Rica</span>
        </div>
      </div>
    </div>
  );
};

export default ServiceSummary;
