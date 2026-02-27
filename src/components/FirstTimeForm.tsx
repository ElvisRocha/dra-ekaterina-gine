import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PhoneInput } from '@/components/ui/PhoneInput';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from '@/hooks/use-toast';

interface FirstTimeFormProps {
  isOpen: boolean;
  onComplete: () => void;
  initialData: {
    firstName: string;
    lastName: string;
    email: string;
    idNumber: string;
    phone: string;
    contactId: string;
  };
}

interface FormErrors {
  [key: string]: string | undefined;
}

const FirstTimeForm = ({ isOpen, onComplete, initialData }: FirstTimeFormProps) => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    firstName: initialData.firstName,
    lastName: initialData.lastName,
    age: '',
    idNumber: initialData.idNumber,
    phone: initialData.phone,
    dob: '',
    email: initialData.email,
    hasDisease: false,
    diseaseDetails: '',
    takesMedication: false,
    medicationDetails: '',
    hadSurgery: false,
    surgeryDetails: '',
    firstPeriodAge: '',
    lastPeriodDate: '',
    usesContraceptive: false,
    contraceptiveDetails: '',
    hasBeenPregnant: false,
    pregnancyCount: '',
    vaginalBirths: '',
    cesareans: '',
    abortions: '',
    otherPregnancies: '',
    hadPapSmear: false,
    lastPapSmear: '',
    familyHistory: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync initialData to formData when dialog opens
  useEffect(() => {
    if (isOpen) {
      setFormData(prev => ({
        ...prev,
        firstName: initialData.firstName,
        lastName: initialData.lastName,
        email: initialData.email,
        idNumber: initialData.idNumber,
        phone: initialData.phone,
      }));
      setErrors({});
    }
  }, [isOpen, initialData.firstName, initialData.lastName, initialData.email, initialData.idNumber, initialData.phone]);

  const updateField = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field when user types
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const validate = (): FormErrors => {
    const newErrors: FormErrors = {};
    const required = t('form.required');

    // Always-required fields
    if (!formData.age.trim()) newErrors.age = required;
    if (!formData.dob.trim()) newErrors.dob = required;
    if (!formData.firstPeriodAge.trim()) newErrors.firstPeriodAge = required;
    if (!formData.lastPeriodDate.trim()) newErrors.lastPeriodDate = required;
    if (!formData.familyHistory.trim()) newErrors.familyHistory = required;

    // Conditional: toggle detail fields
    if (formData.hasDisease && !formData.diseaseDetails.trim()) {
      newErrors.diseaseDetails = required;
    }
    if (formData.takesMedication && !formData.medicationDetails.trim()) {
      newErrors.medicationDetails = required;
    }
    if (formData.hadSurgery && !formData.surgeryDetails.trim()) {
      newErrors.surgeryDetails = required;
    }
    if (formData.usesContraceptive && !formData.contraceptiveDetails.trim()) {
      newErrors.contraceptiveDetails = required;
    }

    // Pregnancy section
    if (formData.hasBeenPregnant) {
      if (!formData.pregnancyCount.trim()) {
        newErrors.pregnancyCount = required;
      }
      // At least one of vaginalBirths, cesareans, abortions must have info
      const hasVaginal = formData.vaginalBirths.trim() !== '';
      const hasCesareans = formData.cesareans.trim() !== '';
      const hasAbortions = formData.abortions.trim() !== '';
      if (!hasVaginal && !hasCesareans && !hasAbortions) {
        newErrors.pregnancyBreakdown = t('form.pregnancyBreakdown');
      }
    }

    // Pap smear
    if (formData.hadPapSmear && !formData.lastPapSmear.trim()) {
      newErrors.lastPapSmear = required;
    }

    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Auto-default empty pregnancy fields to '0'
    const finalData = { ...formData };
    if (finalData.hasBeenPregnant) {
      if (!finalData.vaginalBirths.trim()) finalData.vaginalBirths = '0';
      if (!finalData.cesareans.trim()) finalData.cesareans = '0';
      if (!finalData.abortions.trim()) finalData.abortions = '0';
    }

    const patientData = {
      ...finalData,
      contactId: initialData.contactId,
      timestamp: new Date().toISOString(),
    };

    setIsSubmitting(true);

    try {
      const webhookUrl = import.meta.env.VITE_N8N_NUEVA_PACIENTE_WEBHOOK_URL;
      if (webhookUrl) {
        await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(patientData),
        });
      }
    } catch (error) {
      console.error('Error enviando datos al webhook de n8n:', error);
      // Continúa de todas formas — la paciente no debería verse bloqueada
    } finally {
      setIsSubmitting(false);
    }

    toast({
      title: t('form.success'),
      className: 'bg-primary text-primary-foreground',
    });

    onComplete();
  };

  const errorClass = (field: string) =>
    errors[field] ? 'border-red-500 focus:ring-red-500' : '';

  const renderError = (field: string) =>
    errors[field] ? (
      <p className="text-xs text-red-500 mt-1">{errors[field]}</p>
    ) : null;

  const renderToggleField = (
    label: string,
    value: boolean,
    onChange: (val: boolean) => void,
    detailsValue?: string,
    onDetailsChange?: (val: string) => void,
    detailsPlaceholder?: string,
    detailsErrorKey?: string
  ) => (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label className="text-sm">{label}</Label>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">{t('form.no')}</span>
          <Switch checked={value} onCheckedChange={onChange} />
          <span className="text-xs text-muted-foreground">{t('form.yes')}</span>
        </div>
      </div>
      {value && onDetailsChange && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
        >
          <Input
            value={detailsValue}
            onChange={(e) => onDetailsChange(e.target.value)}
            placeholder={detailsPlaceholder}
            className={`mt-2 ${detailsErrorKey ? errorClass(detailsErrorKey) : ''}`}
          />
          {detailsErrorKey && renderError(detailsErrorKey)}
        </motion.div>
      )}
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="max-w-2xl max-h-[90vh] p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="font-display text-xl text-foreground flex items-center gap-2">
            <span>📋</span>
            {t('form.title')}
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-120px)] px-6">
          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            {/* Basic Info - Row 1: Nombre | Apellidos */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName" className="flex items-center gap-1">
                  {t('form.firstName') || 'Nombre'}
                  <Lock className="h-3 w-3 text-muted-foreground" />
                </Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  disabled
                  className="mt-1 bg-muted text-muted-foreground cursor-not-allowed"
                  title={t('form.lockedField')}
                />
              </div>
              <div>
                <Label htmlFor="lastName" className="flex items-center gap-1">
                  {t('form.lastName') || 'Apellidos'}
                  <Lock className="h-3 w-3 text-muted-foreground" />
                </Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  disabled
                  className="mt-1 bg-muted text-muted-foreground cursor-not-allowed"
                  title={t('form.lockedField')}
                />
              </div>
            </div>

            {/* Row 1b: Número de Identificación */}
            <div>
              <Label htmlFor="idNumber" className="flex items-center gap-1">
                {t('booking.id')}
                <Lock className="h-3 w-3 text-muted-foreground" />
              </Label>
              <Input
                id="idNumber"
                value={formData.idNumber}
                disabled
                className="mt-1 bg-muted text-muted-foreground cursor-not-allowed"
                title={t('form.lockedField')}
              />
            </div>

            {/* Row 2: Teléfono | Edad */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="phone" className="flex items-center gap-1">
                  {t('booking.phone')}
                  <Lock className="h-3 w-3 text-muted-foreground" />
                </Label>
                <PhoneInput
                  id="phone"
                  value={formData.phone}
                  onChange={() => {}}
                  disabled
                  className="mt-1 bg-muted text-muted-foreground cursor-not-allowed"
                />
              </div>
              <div>
                <Label htmlFor="age" className="flex items-center gap-1">
                  {t('form.age')} *
                  <span className="h-3 w-3" />
                </Label>
                <Input
                  id="age"
                  type="number"
                  value={formData.age}
                  onChange={(e) => updateField('age', e.target.value)}
                  className={`mt-1 ${errorClass('age')}`}
                />
                {renderError('age')}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="dob">{t('form.dob')} *</Label>
                <Input
                  id="dob"
                  type="date"
                  value={formData.dob}
                  onChange={(e) => updateField('dob', e.target.value)}
                  className={`mt-1 ${errorClass('dob')}`}
                />
                {renderError('dob')}
              </div>
              <div>
                <Label htmlFor="email" className="flex items-center gap-1">
                  {t('form.email')}
                  <Lock className="h-3 w-3 text-muted-foreground" />
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  disabled
                  className="mt-1 bg-muted text-muted-foreground cursor-not-allowed"
                  title={t('form.lockedField')}
                />
              </div>
            </div>

            <div className="border-t border-border pt-4 space-y-4">
              {/* Medical History */}
              {renderToggleField(
                t('form.disease'),
                formData.hasDisease,
                (val) => updateField('hasDisease', val),
                formData.diseaseDetails,
                (val) => updateField('diseaseDetails', val),
                t('form.which'),
                'diseaseDetails'
              )}

              {renderToggleField(
                t('form.medication'),
                formData.takesMedication,
                (val) => updateField('takesMedication', val),
                formData.medicationDetails,
                (val) => updateField('medicationDetails', val),
                t('form.which'),
                'medicationDetails'
              )}

              {renderToggleField(
                t('form.surgery'),
                formData.hadSurgery,
                (val) => updateField('hadSurgery', val),
                formData.surgeryDetails,
                (val) => updateField('surgeryDetails', val),
                t('form.surgeryWhat'),
                'surgeryDetails'
              )}
            </div>

            <div className="border-t border-border pt-4 space-y-4">
              {/* Menstrual History */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstPeriodAge">{t('form.firstPeriod')} *</Label>
                  <Input
                    id="firstPeriodAge"
                    type="number"
                    value={formData.firstPeriodAge}
                    onChange={(e) => updateField('firstPeriodAge', e.target.value)}
                    className={`mt-1 ${errorClass('firstPeriodAge')}`}
                  />
                  {renderError('firstPeriodAge')}
                </div>
                <div>
                  <Label htmlFor="lastPeriodDate">{t('form.lastPeriod')} *</Label>
                  <Input
                    id="lastPeriodDate"
                    type="date"
                    value={formData.lastPeriodDate}
                    onChange={(e) => updateField('lastPeriodDate', e.target.value)}
                    className={`mt-1 ${errorClass('lastPeriodDate')}`}
                  />
                  {renderError('lastPeriodDate')}
                </div>
              </div>

              {renderToggleField(
                t('form.contraceptive'),
                formData.usesContraceptive,
                (val) => updateField('usesContraceptive', val),
                formData.contraceptiveDetails,
                (val) => updateField('contraceptiveDetails', val),
                t('form.whichMethod'),
                'contraceptiveDetails'
              )}
            </div>

            <div className="border-t border-border pt-4 space-y-4">
              {/* Pregnancy History */}
              {renderToggleField(
                t('form.pregnant'),
                formData.hasBeenPregnant,
                (val) => updateField('hasBeenPregnant', val)
              )}

              {formData.hasBeenPregnant && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  className="space-y-2"
                >
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    <div>
                      <Label className="text-xs">{t('form.howManyTimes')} *</Label>
                      <Input
                        type="number"
                        value={formData.pregnancyCount}
                        onChange={(e) => updateField('pregnancyCount', e.target.value)}
                        className={`mt-1 ${errorClass('pregnancyCount')}`}
                      />
                      {renderError('pregnancyCount')}
                    </div>
                    <div>
                      <Label className="text-xs">{t('form.vaginalBirths')}</Label>
                      <Input
                        type="number"
                        value={formData.vaginalBirths}
                        onChange={(e) => updateField('vaginalBirths', e.target.value)}
                        className={`mt-1 ${errors.pregnancyBreakdown ? 'border-red-500 focus:ring-red-500' : ''}`}
                      />
                    </div>
                    <div>
                      <Label className="text-xs">{t('form.cesareans')}</Label>
                      <Input
                        type="number"
                        value={formData.cesareans}
                        onChange={(e) => updateField('cesareans', e.target.value)}
                        className={`mt-1 ${errors.pregnancyBreakdown ? 'border-red-500 focus:ring-red-500' : ''}`}
                      />
                    </div>
                    <div>
                      <Label className="text-xs">{t('form.abortions')}</Label>
                      <Input
                        type="number"
                        value={formData.abortions}
                        onChange={(e) => updateField('abortions', e.target.value)}
                        className={`mt-1 ${errors.pregnancyBreakdown ? 'border-red-500 focus:ring-red-500' : ''}`}
                      />
                    </div>
                    <div>
                      <Label className="text-xs">{t('form.others')}</Label>
                      <Input
                        value={formData.otherPregnancies}
                        onChange={(e) => updateField('otherPregnancies', e.target.value)}
                        className="mt-1"
                      />
                    </div>
                  </div>
                  {errors.pregnancyBreakdown && (
                    <p className="text-xs text-red-500">{errors.pregnancyBreakdown}</p>
                  )}
                </motion.div>
              )}
            </div>

            <div className="border-t border-border pt-4 space-y-4">
              {/* Pap Smear History */}
              {renderToggleField(
                t('form.pap'),
                formData.hadPapSmear,
                (val) => updateField('hadPapSmear', val)
              )}

              {formData.hadPapSmear && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                >
                  <Label htmlFor="lastPapSmear">{t('form.lastPap')} *</Label>
                  <Input
                    id="lastPapSmear"
                    type="date"
                    value={formData.lastPapSmear}
                    onChange={(e) => updateField('lastPapSmear', e.target.value)}
                    className={`mt-1 ${errorClass('lastPapSmear')}`}
                  />
                  {renderError('lastPapSmear')}
                </motion.div>
              )}
            </div>

            <div className="border-t border-border pt-4">
              <Label htmlFor="familyHistory">{t('form.familyHistory')} *</Label>
              <Textarea
                id="familyHistory"
                value={formData.familyHistory}
                onChange={(e) => updateField('familyHistory', e.target.value)}
                className={`mt-1 ${errorClass('familyHistory')}`}
                rows={3}
              />
              {renderError('familyHistory')}
            </div>

            <div className="pt-4 pb-6">
              <Button type="submit" className="w-full btn-gradient" disabled={isSubmitting}>
                <span>{isSubmitting ? '⏳ Enviando...' : t('form.submit')}</span>
              </Button>
            </div>
          </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default FirstTimeForm;
