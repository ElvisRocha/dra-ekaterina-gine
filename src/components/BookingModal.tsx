import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PhoneInput } from '@/components/ui/PhoneInput';
import { Label } from '@/components/ui/label';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { 
  services, 
  formatPrice, 
  getCategoryServices, 
  serviceInfoEs, 
  serviceInfoEn,
  type Service 
} from '@/data/services';
import { toast } from '@/hooks/use-toast';
import { Check, Clock, ChevronLeft, ChevronRight, User, Phone, CreditCard, Info } from 'lucide-react';
import ConfirmationPopup from './ConfirmationPopup';
import NewPatientModal from './NewPatientModal';
import FirstTimeForm from './FirstTimeForm';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedService?: Service | null;
}

const BookingModal = ({ isOpen, onClose, preselectedService }: BookingModalProps) => {
  const { t, language } = useLanguage();
  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState<Service | null>(preselectedService || null);
  const [expandedInfo, setExpandedInfo] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    fullName: '',
    idNumber: '',
    phone: '',
  });
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showNewPatientModal, setShowNewPatientModal] = useState(false);
  const [showFirstTimeForm, setShowFirstTimeForm] = useState(false);

  const categories = [
    { key: 'consultas' as const, icon: '👩‍⚕️' },
    { key: 'ultrasonidos' as const, icon: '🔬' },
    { key: 'dispositivos' as const, icon: '💊' },
    { key: 'colposcopia' as const, icon: '🔎' },
  ];

  const getServiceInfo = (infoKey: string | undefined) => {
    if (!infoKey) return null;
    return language === 'es' ? serviceInfoEs[infoKey] : serviceInfoEn[infoKey];
  };

  const handleNext = () => {
    if (step === 1 && !selectedService) {
      toast({
        title: language === 'es' ? 'Selecciona un servicio' : 'Select a service',
        variant: 'destructive',
      });
      return;
    }
    if (step === 2) {
      const phoneDigits = formData.phone.replace(/^\+506/, '').replace(/\D/g, '');
      if (!formData.fullName || !formData.idNumber || !formData.phone || phoneDigits.length !== 8) {
        toast({
          title: language === 'es' ? 'Completa todos los campos' : 'Complete all fields',
          variant: 'destructive',
        });
        return;
      }
    }
    setStep(step + 1);
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleConfirm = () => {
    // Collect all data in JSON format (for future n8n integration)
    const appointmentData = {
      service: selectedService,
      patient: formData,
      timestamp: new Date().toISOString(),
    };
    
    console.log('Appointment Data:', appointmentData);
    // TODO: Send to n8n webhook
    // const response = await fetch('https://tu-n8n-url/webhook/create-appointment', {
    //   method: 'POST',
    //   body: JSON.stringify(appointmentData)
    // });

    toast({
      title: t('booking.success'),
      className: 'bg-primary text-primary-foreground',
    });

    setShowConfirmation(true);
  };

  const handleConfirmationClose = () => {
    setShowConfirmation(false);
    
    // TODO: Replace with actual n8n endpoint call
    // const response = await fetch('https://tu-n8n-url/webhook/check-patient', {
    //   method: 'POST',
    //   body: JSON.stringify({ identificacion: formData.idNumber })
    // });
    // const { exists } = await response.json();
    const exists = false; // Mock: change to true to simulate existing patient

    if (!exists) {
      setShowNewPatientModal(true);
    } else {
      resetAndClose();
    }
  };

  const handleNewPatientChoice = (fillNow: boolean) => {
    setShowNewPatientModal(false);
    if (fillNow) {
      setShowFirstTimeForm(true);
    } else {
      toast({
        title: t('newpatient.clinicConfirm'),
      });
      resetAndClose();
    }
  };

  const handleFirstTimeFormComplete = () => {
    setShowFirstTimeForm(false);
    resetAndClose();
  };

  const resetAndClose = () => {
    setStep(1);
    setSelectedService(null);
    setFormData({ fullName: '', idNumber: '', phone: '' });
    onClose();
  };

  const handleClose = () => {
    if (!showConfirmation && !showNewPatientModal && !showFirstTimeForm) {
      resetAndClose();
    }
  };

  // Set preselected service when prop changes
  if (preselectedService && !selectedService) {
    setSelectedService(preselectedService);
    if (step === 1) setStep(2);
  }

  return (
    <>
      <Dialog open={isOpen && !showConfirmation && !showNewPatientModal && !showFirstTimeForm} onOpenChange={handleClose}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl text-foreground flex items-center gap-2">
              <span>🌷</span>
              {t('booking.title')}
            </DialogTitle>
          </DialogHeader>

          {/* Progress Steps */}
          <div className="flex items-center justify-center gap-2 py-4">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                    step === s
                      ? 'bg-primary text-primary-foreground'
                      : step > s
                      ? 'bg-coral text-white'
                      : 'bg-secondary text-muted-foreground'
                  }`}
                >
                  {step > s ? <Check className="w-5 h-5" /> : s}
                </div>
                {s < 3 && (
                  <div
                    className={`w-12 h-1 mx-1 rounded-full transition-all ${
                      step > s ? 'bg-coral' : 'bg-secondary'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-center gap-8 text-sm text-muted-foreground mb-6">
            <span className={step === 1 ? 'text-primary font-medium' : ''}>{t('booking.step1')}</span>
            <span className={step === 2 ? 'text-primary font-medium' : ''}>{t('booking.step2')}</span>
            <span className={step === 3 ? 'text-primary font-medium' : ''}>{t('booking.step3')}</span>
          </div>

          <AnimatePresence mode="wait">
            {/* Step 1: Service Selection */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h3 className="font-medium text-foreground mb-4">{t('booking.selectService')}</h3>
                <Accordion type="single" collapsible className="space-y-2">
                  {categories.map((category) => {
                    const categoryServices = getCategoryServices(category.key);
                    return (
                      <AccordionItem
                        key={category.key}
                        value={category.key}
                        className="border border-border rounded-lg overflow-hidden"
                      >
                        <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-secondary/50">
                          <div className="flex items-center gap-3">
                            <span className="text-xl">{category.icon}</span>
                            <span className="font-medium">{t(`cat.${category.key}`)}</span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-4 pb-4">
                          <div className="space-y-2">
                            {categoryServices.map((service) => (
                              <div key={service.id}>
                                <div
                                  onClick={() => {
                                    setSelectedService(service);
                                    setExpandedInfo(null);
                                  }}
                                  className={`p-3 rounded-lg cursor-pointer transition-all ${
                                    selectedService?.id === service.id
                                      ? 'bg-primary/10 border-2 border-primary'
                                      : 'bg-secondary/50 border-2 border-transparent hover:border-primary/30'
                                  }`}
                                >
                                  <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                      <p className="font-medium text-foreground text-sm">
                                        {language === 'es' ? service.nameEs : service.nameEn}
                                      </p>
                                      <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                                        <span className="flex items-center gap-1">
                                          <Clock className="w-3 h-3" />
                                          {service.duration}
                                        </span>
                                        <span className="flex items-center gap-1 font-semibold text-primary">
                                          {formatPrice(service.price)}
                                        </span>
                                      </div>
                                    </div>
                                    {selectedService?.id === service.id && (
                                      <Check className="w-5 h-5 text-primary" />
                                    )}
                                  </div>
                                </div>
                                {selectedService?.id === service.id && service.infoKey && (
                                  <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    className="mt-2 p-3 bg-secondary/30 rounded-lg text-xs text-muted-foreground overflow-hidden"
                                  >
                                    <button
                                      onClick={() => setExpandedInfo(expandedInfo === service.id ? null : service.id)}
                                      className="flex items-center gap-1 text-primary hover:underline mb-2"
                                    >
                                      <Info className="w-3 h-3" />
                                      {language === 'es' ? 'Ver información' : 'View information'}
                                    </button>
                                    {expandedInfo === service.id && (
                                      <div className="whitespace-pre-wrap text-xs">
                                        {getServiceInfo(service.infoKey)?.split('\n').slice(0, 5).join('\n')}...
                                      </div>
                                    )}
                                  </motion.div>
                                )}
                              </div>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    );
                  })}
                </Accordion>
              </motion.div>
            )}

            {/* Step 2: Patient Data */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div>
                  <Label htmlFor="fullName" className="flex items-center gap-2 mb-2">
                    <User className="w-4 h-4 text-muted-foreground" />
                    {t('booking.fullName')}
                  </Label>
                  <Input
                    id="fullName"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder={language === 'es' ? 'Nombre completo' : 'Full name'}
                    className="h-12"
                  />
                </div>
                <div>
                  <Label htmlFor="idNumber" className="flex items-center gap-2 mb-2">
                    <CreditCard className="w-4 h-4 text-muted-foreground" />
                    {t('booking.id')}
                  </Label>
                  <Input
                    id="idNumber"
                    value={formData.idNumber}
                    onChange={(e) => setFormData({ ...formData, idNumber: e.target.value })}
                    placeholder={language === 'es' ? 'Cédula o pasaporte' : 'ID or passport'}
                    className="h-12"
                  />
                </div>
                <div>
                  <Label htmlFor="phone" className="flex items-center gap-2 mb-2">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    {t('booking.phone')}
                  </Label>
                  <PhoneInput
                    id="phone"
                    value={formData.phone}
                    onChange={(value) => setFormData({ ...formData, phone: value })}
                    className="h-12"
                  />
                </div>
              </motion.div>
            )}

            {/* Step 3: Confirmation */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h3 className="font-medium text-foreground mb-4">{t('booking.summary')}</h3>
                <div className="bg-secondary/50 rounded-xl p-5 space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">{t('booking.service')}</p>
                    <p className="font-medium text-foreground">
                      {language === 'es' ? selectedService?.nameEs : selectedService?.nameEn}
                    </p>
                    <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {selectedService?.duration}
                      </span>
                      <span className="flex items-center gap-1 font-semibold text-primary">
                        {selectedService && formatPrice(selectedService.price)}
                      </span>
                    </div>
                  </div>
                  <div className="border-t border-border pt-4">
                    <p className="text-sm text-muted-foreground mb-1">{t('booking.patient')}</p>
                    <p className="font-medium text-foreground">{formData.fullName}</p>
                    <p className="text-sm text-muted-foreground">{formData.idNumber}</p>
                    <p className="text-sm text-muted-foreground">
                      {formData.phone.startsWith('+506') && formData.phone.length > 4
                        ? `+506 ${formData.phone.slice(4, 8)}-${formData.phone.slice(8)}`
                        : formData.phone}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-6 pt-4 border-t border-border">
            {step > 1 ? (
              <Button variant="outline" onClick={handleBack}>
                <ChevronLeft className="w-4 h-4 mr-1" />
                {t('booking.back')}
              </Button>
            ) : (
              <div />
            )}
            {step < 3 ? (
              <Button onClick={handleNext} className="btn-gradient">
                <span>{t('booking.next')}</span>
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            ) : (
              <Button onClick={handleConfirm} className="btn-gradient">
                <span>{t('booking.confirm')}</span>
                <Check className="w-4 h-4 ml-1" />
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <ConfirmationPopup
        isOpen={showConfirmation}
        onClose={handleConfirmationClose}
      />

      <NewPatientModal
        isOpen={showNewPatientModal}
        onChoice={handleNewPatientChoice}
      />

      <FirstTimeForm
        isOpen={showFirstTimeForm}
        onComplete={handleFirstTimeFormComplete}
        initialData={{
          fullName: formData.fullName,
          idNumber: formData.idNumber,
          phone: formData.phone,
        }}
      />
    </>
  );
};

export default BookingModal;
