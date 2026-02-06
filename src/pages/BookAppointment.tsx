import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { LanguageProvider, useLanguage } from '@/contexts/LanguageContext';
import { services, type Service } from '@/data/services';
import { useToast } from '@/hooks/use-toast';

import BookingNavbar from '@/components/booking/BookingNavbar';
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
  const { language } = useLanguage();
  const { toast } = useToast();
  
  // Step state
  const [currentStep, setCurrentStep] = useState(1);
  
  // Form data - now supports multiple services
  const [selectedServices, setSelectedServices] = useState<Service[]>([]);
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
      if (service && !selectedServices.some(s => s.id === service.id)) {
        setSelectedServices([service]);
      }
    }
  }, [searchParams]);

  const handleToggleService = (service: Service) => {
    setSelectedServices(prev => {
      const exists = prev.some(s => s.id === service.id);
      if (exists) {
        return prev.filter(s => s.id !== service.id);
      }
      return [...prev, service];
    });
    // Reset date/time when services change
    setSelectedDate(null);
    setSelectedTime(null);
  };

  const handleRemoveService = (serviceId: string) => {
    setSelectedServices(prev => prev.filter(s => s.id !== serviceId));
  };

  const handleConfirm = async () => {
    if (selectedServices.length === 0 || !selectedDate || !selectedTime) return;

    setIsLoading(true);

    // Calculate totals
    const totalPrice = selectedServices.reduce((sum, s) => sum + s.price, 0);

    // Build appointment data object
    const appointmentData = {
      services: selectedServices.map(s => ({
        id: s.id,
        name: language === 'es' ? s.nameEs : s.nameEn,
        category: s.category,
        duration: s.duration,
        price: s.price,
      })),
      totalPrice,
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

  const handleFirstTimeFormBack = () => {
    setShowFirstTimeForm(false);
    setShowNewPatientModal(true);
  };

  const handleFirstTimeFormClose = () => {
    setShowFirstTimeForm(false);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <BookingNavbar />
      
      <div className="flex-1">
        {/* Step Indicator */}
        <div className="border-b border-border bg-background">
          <div className="container mx-auto">
            <StepIndicator currentStep={currentStep} />
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-8">
          <div className="flex gap-8">
            {/* Main Stepper Content */}
            <div className="flex-1 max-w-3xl mx-auto">
              <AnimatePresence mode="wait">
                {currentStep === 1 && (
                  <ServiceStep
                    key="service"
                    selectedServices={selectedServices}
                    onToggleService={handleToggleService}
                    onRemoveService={handleRemoveService}
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
                
                {currentStep === 3 && selectedServices.length > 0 && (
                  <DateTimeStep
                    key="datetime"
                    services={selectedServices}
                    selectedDate={selectedDate}
                    selectedTime={selectedTime}
                    onSelectDate={setSelectedDate}
                    onSelectTime={setSelectedTime}
                    onNext={() => setCurrentStep(4)}
                    onBack={() => setCurrentStep(2)}
                  />
                )}
                
                {currentStep === 4 && selectedServices.length > 0 && selectedDate && selectedTime && (
                  <ConfirmStep
                    key="confirm"
                    services={selectedServices}
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
      </div>

      {/* Minimal Footer */}
      <footer className="border-t border-border py-4 mt-auto">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          © 2025 Dra. Ekaterina Malaspina Riazanova — Clínica Esperanza
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
        onBack={handleFirstTimeFormBack}
        onClose={handleFirstTimeFormClose}
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
