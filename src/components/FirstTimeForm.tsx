import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';

interface FirstTimeFormProps {
  isOpen: boolean;
  onComplete: () => void;
  initialData: {
    fullName: string;
    idNumber: string;
    phone: string;
  };
}

const FirstTimeForm = ({ isOpen, onComplete, initialData }: FirstTimeFormProps) => {
  const { t, language } = useLanguage();
  const [formData, setFormData] = useState({
    fullName: initialData.fullName,
    age: '',
    idNumber: initialData.idNumber,
    phone: initialData.phone,
    dob: '',
    email: '',
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

  // Sync initialData to formData when dialog opens
  useEffect(() => {
    if (isOpen) {
      setFormData(prev => ({
        ...prev,
        fullName: initialData.fullName,
        idNumber: initialData.idNumber,
        phone: initialData.phone,
      }));
    }
  }, [isOpen, initialData.fullName, initialData.idNumber, initialData.phone]);

  const updateField = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Collect all data (for future n8n integration)
    const patientData = {
      ...formData,
      timestamp: new Date().toISOString(),
    };

    console.log('First Time Patient Data:', patientData);
    // TODO: Send to n8n/GHL webhook
    // const response = await fetch('https://tu-n8n-url/webhook/new-patient', {
    //   method: 'POST',
    //   body: JSON.stringify(patientData)
    // });

    toast({
      title: t('form.success'),
      className: 'bg-primary text-primary-foreground',
    });

    onComplete();
  };

  const renderToggleField = (
    label: string,
    value: boolean,
    onChange: (val: boolean) => void,
    detailsValue?: string,
    onDetailsChange?: (val: string) => void,
    detailsPlaceholder?: string
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
            className="mt-2"
          />
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
            {/* Basic Info - Row 1: Nombre Completo | Número de Identificación */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="fullName" className="flex items-center gap-1">
                  {t('booking.fullName')}
                  <Lock className="h-3 w-3 text-muted-foreground" />
                </Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  disabled
                  className="mt-1 bg-muted text-muted-foreground cursor-not-allowed"
                  title={t('form.lockedField')}
                />
              </div>
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
            </div>

            {/* Row 2: Teléfono | Edad */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="phone" className="flex items-center gap-1">
                  {t('booking.phone')}
                  <Lock className="h-3 w-3 text-muted-foreground" />
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  disabled
                  className="mt-1 bg-muted text-muted-foreground cursor-not-allowed"
                  title={t('form.lockedField')}
                />
              </div>
              <div>
                <Label htmlFor="age" className="flex items-center gap-1">
                  {t('form.age')}
                  <span className="h-3 w-3" /> {/* Spacer to match lock icon height */}
                </Label>
                <Input
                  id="age"
                  type="number"
                  value={formData.age}
                  onChange={(e) => updateField('age', e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="dob">{t('form.dob')}</Label>
                <Input
                  id="dob"
                  type="date"
                  value={formData.dob}
                  onChange={(e) => updateField('dob', e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="email">{t('form.email')}</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateField('email', e.target.value)}
                  className="mt-1"
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
                t('form.which')
              )}

              {renderToggleField(
                t('form.medication'),
                formData.takesMedication,
                (val) => updateField('takesMedication', val),
                formData.medicationDetails,
                (val) => updateField('medicationDetails', val),
                t('form.which')
              )}

              {renderToggleField(
                t('form.surgery'),
                formData.hadSurgery,
                (val) => updateField('hadSurgery', val),
                formData.surgeryDetails,
                (val) => updateField('surgeryDetails', val),
                t('form.surgeryWhat')
              )}
            </div>

            <div className="border-t border-border pt-4 space-y-4">
              {/* Menstrual History */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstPeriodAge">{t('form.firstPeriod')}</Label>
                  <Input
                    id="firstPeriodAge"
                    type="number"
                    value={formData.firstPeriodAge}
                    onChange={(e) => updateField('firstPeriodAge', e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="lastPeriodDate">{t('form.lastPeriod')}</Label>
                  <Input
                    id="lastPeriodDate"
                    type="date"
                    value={formData.lastPeriodDate}
                    onChange={(e) => updateField('lastPeriodDate', e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>

              {renderToggleField(
                t('form.contraceptive'),
                formData.usesContraceptive,
                (val) => updateField('usesContraceptive', val),
                formData.contraceptiveDetails,
                (val) => updateField('contraceptiveDetails', val),
                t('form.whichMethod')
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
                  className="grid grid-cols-2 md:grid-cols-5 gap-3"
                >
                  <div>
                    <Label className="text-xs">{t('form.howManyTimes')}</Label>
                    <Input
                      type="number"
                      value={formData.pregnancyCount}
                      onChange={(e) => updateField('pregnancyCount', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">{t('form.vaginalBirths')}</Label>
                    <Input
                      type="number"
                      value={formData.vaginalBirths}
                      onChange={(e) => updateField('vaginalBirths', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">{t('form.cesareans')}</Label>
                    <Input
                      type="number"
                      value={formData.cesareans}
                      onChange={(e) => updateField('cesareans', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">{t('form.abortions')}</Label>
                    <Input
                      type="number"
                      value={formData.abortions}
                      onChange={(e) => updateField('abortions', e.target.value)}
                      className="mt-1"
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
                  <Label htmlFor="lastPapSmear">{t('form.lastPap')}</Label>
                  <Input
                    id="lastPapSmear"
                    value={formData.lastPapSmear}
                    onChange={(e) => updateField('lastPapSmear', e.target.value)}
                    placeholder={language === 'es' ? 'Fecha o descripción' : 'Date or description'}
                    className="mt-1"
                  />
                </motion.div>
              )}
            </div>

            <div className="border-t border-border pt-4">
              <Label htmlFor="familyHistory">{t('form.familyHistory')}</Label>
              <Textarea
                id="familyHistory"
                value={formData.familyHistory}
                onChange={(e) => updateField('familyHistory', e.target.value)}
                className="mt-1"
                rows={3}
              />
            </div>

            <div className="pt-4 pb-6">
              <Button type="submit" className="w-full btn-gradient">
                <span>{t('form.submit')}</span>
              </Button>
            </div>
          </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default FirstTimeForm;
