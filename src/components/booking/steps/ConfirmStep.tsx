import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { es, enUS } from 'date-fns/locale';
import { Calendar, Clock, User, Globe, DollarSign, Phone, CreditCard } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { formatPrice, type Service } from '@/data/services';
import { formatTime12h } from '@/utils/availability';

interface ConfirmStepProps {
  services: Service[];
  patientData: {
    fullName: string;
    identification: string;
    phone: string;
  };
  selectedDate: Date;
  selectedTime: string;
  onConfirm: () => void;
  onBack: () => void;
  isLoading?: boolean;
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

const ConfirmStep = ({
  services,
  patientData,
  selectedDate,
  selectedTime,
  onConfirm,
  onBack,
  isLoading = false,
}: ConfirmStepProps) => {
  const { t, language } = useLanguage();
  const locale = language === 'es' ? es : enUS;

  // Calculate totals
  const totalPrice = services.reduce((sum, s) => sum + s.price, 0);
  const totalMinutes = services.reduce((sum, s) => sum + parseDuration(s.duration), 0);
  const totalDuration = formatTotalDuration(totalMinutes, language);
  
  const formattedDate = format(
    selectedDate,
    language === 'es' ? "EEEE d 'de' MMMM, yyyy" : "EEEE, MMMM d, yyyy",
    { locale }
  );

  const formattedTime = formatTime12h(selectedTime);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <h2 className="font-display text-2xl text-foreground mb-2">
          {t('booking.summary')}
        </h2>
        <p className="text-muted-foreground text-sm">
          {language === 'es' 
            ? 'Revisa los detalles de tu cita' 
            : 'Review your appointment details'}
        </p>
      </div>

      <div className="max-w-lg mx-auto space-y-4">
        {/* Services Card */}
        <div className="bg-card rounded-xl border border-border p-5 space-y-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-sm">🌷</span>
            </div>
            <h3 className="font-semibold text-foreground">
              {language === 'es' 
                ? `${services.length} servicio${services.length > 1 ? 's' : ''}` 
                : `${services.length} service${services.length > 1 ? 's' : ''}`}
            </h3>
          </div>
          
          {/* Services list */}
          <div className="space-y-2">
            {services.map((service) => {
              const serviceName = language === 'es' ? service.nameEs : service.nameEn;
              return (
                <div 
                  key={service.id} 
                  className="flex items-center justify-between py-2 border-b border-border last:border-0"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {serviceName}
                    </p>
                    <p className="text-xs text-muted-foreground">{service.duration}</p>
                  </div>
                  <span className="text-sm font-medium text-primary">
                    {formatPrice(service.price)}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Totals */}
          <div className="pt-3 border-t border-border flex flex-wrap gap-4 justify-between">
            <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              {language === 'es' ? 'Duración total:' : 'Total duration:'} {totalDuration}
            </span>
            <span className="flex items-center gap-1.5 text-sm font-bold text-primary">
              <DollarSign className="w-4 h-4" />
              {language === 'es' ? 'Total:' : 'Total:'} {formatPrice(totalPrice)}
            </span>
          </div>
        </div>

        {/* Date & Time Card */}
        <div className="bg-card rounded-xl border border-border p-5 space-y-3">
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">
                {t('confirm.dateTime')}
              </p>
              <p className="font-medium text-foreground capitalize">
                {formattedDate}
              </p>
              <p className="text-primary font-semibold">
                {formattedTime}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 pt-2 border-t border-border">
            <Globe className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">America/Costa_Rica</span>
          </div>
        </div>

        {/* Patient Card */}
        <div className="bg-card rounded-xl border border-border p-5 space-y-3">
          <div className="flex items-center gap-3">
            <User className="w-5 h-5 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">
                {t('booking.patient')}
              </p>
              <p className="font-medium text-foreground">{patientData.fullName}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <CreditCard className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">{patientData.identification}</span>
          </div>
          <div className="flex items-center gap-3">
            <Phone className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">{patientData.phone}</span>
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex gap-3 pt-4 max-w-lg mx-auto">
        <Button
          variant="outline"
          onClick={onBack}
          className="flex-1 h-12 rounded-full btn-outline-gradient"
          disabled={isLoading}
        >
          <span>{t('booking.back')}</span>
        </Button>
        <Button
          onClick={onConfirm}
          className="flex-1 h-12 btn-gradient rounded-full"
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              <span>{language === 'es' ? 'Confirmando...' : 'Confirming...'}</span>
            </span>
          ) : (
            <span>{t('booking.confirm')}</span>
          )}
        </Button>
      </div>
    </motion.div>
  );
};

export default ConfirmStep;
