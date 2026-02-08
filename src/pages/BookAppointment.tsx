import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { LanguageProvider, useLanguage } from '@/contexts/LanguageContext';
import { services, type Service } from '@/data/services';
import { useToast } from '@/hooks/use-toast';

import Navbar from '@/components/Navbar';
import StepIndicator from '@/components/booking/StepIndicator';
import ServiceStep from '@/components/booking/steps/ServiceStep';
import PatientDataStep from '@/components/booking/steps/PatientDataStep';
import DateTimeStep from '@/components/booking/steps/DateTimeStep';
import ConfirmStep from '@/components/booking/steps/ConfirmStep';
import ConfirmationPopup from '@/components/ConfirmationPopup';
import NewPatientModal from '@/components/NewPatientModal';
import FirstTimeForm from '@/components/FirstTimeForm';

interface PatientData {
  fullName: string;
  identification: string;
  phone: string;
}

const BookAppointmentContent = () => {
  const [searchParams] = useSearchParams();
  const { language, t } = useLanguage();
  const { toast } = useToast();
  
  // Step state
  const [currentStep, setCurrentStep] = useState(1);
  
  // Form data
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [patientData, setPatientData] = useState<PatientData>({
    fullName: '',
    identification: '',
    phone: '',
  });
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  
  // Post-confirmation state
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showNewPatientModal, setShowNewPatientModal] = useState(false);
  const [showFirstTimeForm, setShowFirstTimeForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Pre-select service from URL param
  useEffect(() => {
    const serviceId = searchParams.get('service');
    if (serviceId) {
      const service = services.find(s => s.id === serviceId);
      if (service) {
        setSelectedService(service);
        // Optionally skip to step 2
        // setCurrentStep(2);
      }
    }
  }, [searchParams]);

  const handleSelectService = (service: Service) => {
    setSelectedService(service);
    // Reset date/time when service changes
    setSelectedDate(null);
    setSelectedTime(null);
  };

  const handleConfirm = async () => {
    if (!selectedService || !selectedDate || !selectedTime) return;

    setIsLoading(true);

    // Build appointment data object
    const appointmentData = {
      service: {
        id: selectedService.id,
        name: language === 'es' ? selectedService.nameEs : selectedService.nameEn,
        category: selectedService.category,
        duration: selectedService.duration,
        price: selectedService.price,
      },
      patient: {
        fullName: patientData.fullName,
        identification: patientData.identification,
        phone: patientData.phone,
      },
      appointment: {
        date: format(selectedDate, 'yyyy-MM-dd'),
        time: selectedTime,
        timezone: 'America/Costa_Rica',
      },
      language,
      createdAt: new Date().toISOString(),
    };

    // TODO: Send to n8n webhook
    // await fetch('https://tu-n8n-url/webhook/book-appointment', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(appointmentData)
    // });

    console.log('Appointment data:', appointmentData);

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));

    setIsLoading(false);

    // Show success toast
    toast({
      title: language === 'es' ? '¡Cita agendada!' : 'Appointment booked!',
      description: language === 'es' 
        ? '¡Su cita ha sido agendada correctamente!' 
        : 'Your appointment has been successfully booked!',
    });

    // Show confirmation popup
    setShowConfirmation(true);
  };

  const handleCloseConfirmation = () => {
    setShowConfirmation(false);
    
    // Check if patient exists (mock)
    // TODO: Replace with n8n webhook call
    // const response = await fetch('https://tu-n8n-url/webhook/check-patient', {
    //   method: 'POST',
    //   body: JSON.stringify({ identificacion: patientData.identification })
    // });
    // const { exists } = await response.json();
    const exists = false; // Mock: change to true to simulate existing patient

    if (!exists) {
      setShowNewPatientModal(true);
    }
  };

  const handleCompleteNow = () => {
    setShowNewPatientModal(false);
    setShowFirstTimeForm(true);
  };

  const handleFillAtClinic = () => {
    setShowNewPatientModal(false);
    toast({
      description: language === 'es' 
        ? 'Perfecto, podrá completar sus datos al llegar a la clínica.' 
        : 'Perfect, you can complete your information when you arrive at the clinic.',
    });
  };

  const handleFirstTimeFormComplete = () => {
    setShowFirstTimeForm(false);
    toast({
      title: language === 'es' ? '¡Datos guardados!' : 'Information saved!',
      description: language === 'es' 
        ? '¡Datos guardados correctamente! Gracias por completar su información.' 
        : 'Information saved successfully! Thank you for completing your details.',
    });
  };

  const handleBookClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar onBookClick={handleBookClick} />

      <div className="flex-1 pt-20">
        {/* Step Indicator */}
        <div className="border-b border-border bg-background">
          <div className="container mx-auto">
            <StepIndicator currentStep={currentStep} />
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-8">
          {/* Main Stepper Content */}
          <div className="max-w-5xl mx-auto">
            <AnimatePresence mode="wait">
              {currentStep === 1 && (
                <ServiceStep
                  key="service"
                  selectedService={selectedService}
                  onSelectService={handleSelectService}
                  onNext={() => setCurrentStep(2)}
                />
              )}
              
              {currentStep === 2 && (
                <PatientDataStep
                  key="patient"
                  patientData={patientData}
                  onUpdatePatientData={setPatientData}
                  onNext={() => setCurrentStep(3)}
                  onBack={() => setCurrentStep(1)}
                />
              )}
              
              {currentStep === 3 && selectedService && (
                <DateTimeStep
                  key="datetime"
                  service={selectedService}
                  selectedDate={selectedDate}
                  selectedTime={selectedTime}
                  onSelectDate={setSelectedDate}
                  onSelectTime={setSelectedTime}
                  onNext={() => setCurrentStep(4)}
                  onBack={() => setCurrentStep(2)}
                />
              )}
              
              {currentStep === 4 && selectedService && selectedDate && selectedTime && (
                <ConfirmStep
                  key="confirm"
                  service={selectedService}
                  patientData={patientData}
                  selectedDate={selectedDate}
                  selectedTime={selectedTime}
                  onConfirm={handleConfirm}
                  onBack={() => setCurrentStep(3)}
                  isLoading={isLoading}
                />
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Minimal Footer */}
      <footer className="border-t border-gray-300 py-4 mt-auto">
        <div className="container mx-auto px-4 flex flex-col md:flex-row md:justify-between md:items-center gap-2 text-sm text-muted-foreground">
          <p className="text-center md:text-left">
            © 2025 Dra. Ekaterina Malaspina Riazanova — Clínica Esperanza. {t('footer.rights')}.
          </p>
          <p className="text-center md:text-right">
            {t('footer.madeBy')}{' '}
            <a
              href="https://www.smartflow-automations.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground hover:underline transition-colors"
            >
              SmartFlow Automations
            </a>
          </p>
        </div>
      </footer>

      {/* Modals */}
      <ConfirmationPopup
        isOpen={showConfirmation}
        onClose={handleCloseConfirmation}
      />

      <NewPatientModal
        isOpen={showNewPatientModal}
        onChoice={(fillNow) => {
          if (fillNow) {
            handleCompleteNow();
          } else {
            handleFillAtClinic();
          }
        }}
      />

      <FirstTimeForm
        isOpen={showFirstTimeForm}
        onComplete={handleFirstTimeFormComplete}
        initialData={{
          fullName: patientData.fullName,
          idNumber: patientData.identification,
          phone: patientData.phone,
        }}
      />
    </div>
  );
};

const BookAppointment = () => {
  return (
    <LanguageProvider>
      <BookAppointmentContent />
    </LanguageProvider>
  );
};

export default BookAppointment;
