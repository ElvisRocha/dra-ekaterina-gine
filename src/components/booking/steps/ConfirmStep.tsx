import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { es, enUS } from 'date-fns/locale';
import { Calendar, Clock, User, Globe, DollarSign, Phone, CreditCard } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { formatPrice, type Service } from '@/data/services';
import { formatTime12h } from '@/utils/availability';

interface ConfirmStepProps {
  service: Service;
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

const ConfirmStep = ({
  service,
  patientData,
  selectedDate,
  selectedTime,
  onConfirm,
  onBack,
  isLoading = false,
}: ConfirmStepProps) => {
  const { t, language } = useLanguage();
  const locale = language === 'es' ? es : enUS;

  const serviceName = language === 'es' ? service.nameEs : service.nameEn;
  
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
        {/* Service Card */}
        <div className="bg-card rounded-xl border border-border p-5 space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <span className="text-lg">🌷</span>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-foreground">{serviceName}</h3>
              <div className="flex flex-wrap gap-3 mt-2 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {service.duration}
                </span>
                <span className="flex items-center gap-1 font-semibold text-primary">
                  <DollarSign className="w-4 h-4" />
                  {formatPrice(service.price)}
                </span>
              </div>
            </div>
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
          className="flex-1 h-12 rounded-full"
          disabled={isLoading}
        >
          {t('booking.back')}
        </Button>
        <Button
          onClick={onConfirm}
          className="flex-1 h-12 btn-gradient rounded-full"
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              {language === 'es' ? 'Confirmando...' : 'Confirming...'}
            </span>
          ) : (
            t('booking.confirm')
          )}
        </Button>
      </div>
    </motion.div>
  );
};

export default ConfirmStep;
