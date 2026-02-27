import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PhoneInput } from '@/components/ui/PhoneInput';
import { Label } from '@/components/ui/label';

interface PatientData {
  firstName: string;
  lastName: string;
  email: string;
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

  const phoneDigits = patientData.phone.replace(/^\+506/, '').replace(/\D/g, '');
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(patientData.email.trim());
  const isValid =
    patientData.firstName.trim() &&
    patientData.lastName.trim() &&
    emailValid &&
    patientData.identification.trim() &&
    phoneDigits.length === 8;

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
        {/* Nombre | Apellidos */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">
              {language === 'es' ? 'Nombre' : 'First name'} *
            </Label>
            <Input
              id="firstName"
              type="text"
              value={patientData.firstName}
              onChange={(e) => handleChange('firstName', e.target.value)}
              placeholder={language === 'es' ? 'Ana' : 'Ana'}
              className="h-12"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">
              {language === 'es' ? 'Apellidos' : 'Last name'} *
            </Label>
            <Input
              id="lastName"
              type="text"
              value={patientData.lastName}
              onChange={(e) => handleChange('lastName', e.target.value)}
              placeholder={language === 'es' ? 'García López' : 'García López'}
              className="h-12"
            />
          </div>
        </div>

        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email">
            {language === 'es' ? 'Correo electrónico' : 'Email'} *
          </Label>
          <Input
            id="email"
            type="email"
            value={patientData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            placeholder="correo@ejemplo.com"
            className="h-12"
          />
        </div>

        {/* Cédula */}
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

        {/* Teléfono */}
        <div className="space-y-2">
          <Label htmlFor="phone">{t('booking.phone')} *</Label>
          <PhoneInput
            id="phone"
            value={patientData.phone}
            onChange={(value) => handleChange('phone', value)}
            className="h-12"
          />
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
      </div>
    </motion.div>
  );
};

export default PatientDataStep;
