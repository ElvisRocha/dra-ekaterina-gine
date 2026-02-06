import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface PatientData {
  fullName: string;
  identification: string;
  phone: string;
}

interface PatientDataStepProps {
  patientData: PatientData;
  onUpdatePatientData: (data: PatientData) => void;
  onNext: () => void;
  onBack: () => void;
}

const PatientDataStep = ({ patientData, onUpdatePatientData, onNext, onBack }: PatientDataStepProps) => {
  const { t, language } = useLanguage();

  const isValid = patientData.fullName.trim() && patientData.identification.trim() && patientData.phone.trim();

  const handleChange = (field: keyof PatientData, value: string) => {
    onUpdatePatientData({ ...patientData, [field]: value });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <h2 className="font-display text-2xl text-foreground mb-2">
          {language === 'es' ? 'Tus datos' : 'Your details'}
        </h2>
        <p className="text-muted-foreground text-sm">
          {language === 'es' 
            ? 'Ingresa tu información de contacto' 
            : 'Enter your contact information'}
        </p>
      </div>

      <div className="space-y-5 max-w-md mx-auto">
        <div className="space-y-2">
          <Label htmlFor="fullName">{t('booking.fullName')} *</Label>
          <Input
            id="fullName"
            type="text"
            value={patientData.fullName}
            onChange={(e) => handleChange('fullName', e.target.value)}
            placeholder={language === 'es' ? 'Nombre completo' : 'Full name'}
            className="h-12"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="identification">{t('booking.id')} *</Label>
          <Input
            id="identification"
            type="text"
            value={patientData.identification}
            onChange={(e) => handleChange('identification', e.target.value)}
            placeholder={language === 'es' ? 'Cédula o pasaporte' : 'ID or passport'}
            className="h-12"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">{t('booking.phone')} *</Label>
          <Input
            id="phone"
            type="tel"
            value={patientData.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            placeholder="+506 8888-8888"
            className="h-12"
          />
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex gap-3 pt-4">
        <Button
          variant="outline"
          onClick={onBack}
          className="flex-1"
          size="lg"
        >
          {t('booking.back')}
        </Button>
        <Button
          onClick={onNext}
          disabled={!isValid}
          className="flex-1 btn-gradient"
          size="lg"
        >
          {t('booking.next')}
        </Button>
      </div>
    </motion.div>
  );
};

export default PatientDataStep;
