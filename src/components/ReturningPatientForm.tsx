import { useState } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from '@/hooks/use-toast';

interface ReturningPatientFormProps {
  isOpen: boolean;
  onComplete: () => void;
  contactId: string;
}

interface FormData {
  doExercise: boolean;
  smokes: boolean;
  hadVPHTest: boolean;
  lastCytology: string;
  alteredCytology: boolean;
  lastPeriod: string;
}

const ReturningPatientForm = ({ isOpen, onComplete, contactId }: ReturningPatientFormProps) => {
  const { language } = useLanguage();

  const [formData, setFormData] = useState<FormData>({
    doExercise: false,
    smokes: false,
    hadVPHTest: false,
    lastCytology: '',
    alteredCytology: false,
    lastPeriod: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const t = (es: string, en: string) => language === 'es' ? es : en;

  const updateField = <K extends keyof FormData>(field: K, value: FormData[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => { const next = { ...prev }; delete next[field]; return next; });
    }
  };

  const validate = (): Partial<Record<keyof FormData, string>> => {
    const required = t('Campo requerido', 'Required field');
    const newErrors: Partial<Record<keyof FormData, string>> = {};
    if (!formData.lastCytology.trim()) newErrors.lastCytology = required;
    if (!formData.lastPeriod.trim()) newErrors.lastPeriod = required;
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);

    const payload = {
      contactId,
      doExercise: formData.doExercise,
      smokes: formData.smokes,
      hadVPHTest: formData.hadVPHTest,
      lastCytology: formData.lastCytology,
      alteredCytology: formData.alteredCytology,
      lastPeriod: formData.lastPeriod,
      timestamp: new Date().toISOString(),
    };

    try {
      const webhookUrl = import.meta.env.VITE_N8N_SEGUIMIENTO_PACIENTE_WEBHOOK_URL;
      if (webhookUrl) {
        await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }
    } catch (error) {
      console.error('Error enviando datos de seguimiento:', error);
    } finally {
      setIsSubmitting(false);
    }

    toast({
      title: t('¡Datos guardados!', 'Data saved!'),
      className: 'bg-primary text-primary-foreground',
    });

    onComplete();
  };

  const renderToggle = (
    label: string,
    field: keyof FormData,
    value: boolean
  ) => (
    <div className="flex items-center justify-between">
      <Label className="text-sm">{label}</Label>
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground">{t('No', 'No')}</span>
        <Switch
          checked={value}
          onCheckedChange={(val) => updateField(field, val as FormData[typeof field])}
        />
        <span className="text-xs text-muted-foreground">{t('Sí', 'Yes')}</span>
      </div>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="max-w-md max-h-[90vh] p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="font-display text-xl text-foreground flex items-center gap-2">
            <span>📋</span>
            {t('Actualizar mis datos', 'Update my information')}
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-120px)] px-6">
          <form onSubmit={handleSubmit} className="space-y-5 py-4">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-5"
            >
              {/* Ejercicio */}
              {renderToggle(
                t('¿Haces ejercicio?', 'Do you exercise?'),
                'doExercise',
                formData.doExercise
              )}

              {/* Fuma */}
              {renderToggle(
                t('¿Fumas?', 'Do you smoke?'),
                'smokes',
                formData.smokes
              )}

              {/* Prueba VPH */}
              {renderToggle(
                t('¿Ya te hiciste la prueba de VPH?', 'Have you had an HPV test?'),
                'hadVPHTest',
                formData.hadVPHTest
              )}

              {/* Última citología */}
              <div className="space-y-2">
                <Label htmlFor="lastCytology">
                  {t('¿Cuándo fue tu última citología?', 'When was your last Pap smear?')} *
                </Label>
                <Input
                  id="lastCytology"
                  type="date"
                  value={formData.lastCytology}
                  onChange={(e) => updateField('lastCytology', e.target.value)}
                  className={errors.lastCytology ? 'border-red-500 focus:ring-red-500' : ''}
                />
                {errors.lastCytology && (
                  <p className="text-xs text-red-500">{errors.lastCytology}</p>
                )}
              </div>

              {/* Citología alterada */}
              {renderToggle(
                t('¿Alguna citología salió alterada?', 'Has any Pap smear come back abnormal?'),
                'alteredCytology',
                formData.alteredCytology
              )}

              {/* Última menstruación */}
              <div className="space-y-2">
                <Label htmlFor="lastPeriod">
                  {t('¿Cuándo fue tu última menstruación?', 'When was your last period?')} *
                </Label>
                <Input
                  id="lastPeriod"
                  type="date"
                  value={formData.lastPeriod}
                  onChange={(e) => updateField('lastPeriod', e.target.value)}
                  className={errors.lastPeriod ? 'border-red-500 focus:ring-red-500' : ''}
                />
                {errors.lastPeriod && (
                  <p className="text-xs text-red-500">{errors.lastPeriod}</p>
                )}
              </div>
            </motion.div>

            <div className="pt-2 pb-6">
              <Button type="submit" className="w-full btn-gradient" disabled={isSubmitting}>
                {isSubmitting
                  ? t('Guardando...', 'Saving...')
                  : t('Guardar datos', 'Save information')}
              </Button>
            </div>
          </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default ReturningPatientForm;
