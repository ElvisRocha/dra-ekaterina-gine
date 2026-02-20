import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { LanguageProvider, useLanguage } from '@/contexts/LanguageContext';
import { services, type Service } from '@/data/services';
import { initialTreeState, findServicePath, type QuestionNode } from '@/data/decisionTree';

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
  const navigate = useNavigate();
  
  // Step state
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  // Tree state — lives here so it survives step changes (ServiceStep unmounts/remounts)
  const [treeHistory, setTreeHistory] = useState<QuestionNode[]>(initialTreeState.history);
  const [treeChoiceKey, setTreeChoiceKey] = useState<string | null>(null);

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

  // Pre-select service from URL param and skip to step 2
  useEffect(() => {
    const serviceId = searchParams.get('service');
    if (serviceId) {
      const service = services.find(s => s.id === serviceId);
      if (service) {
        setSelectedService(service);
        // Restore the tree to the node that contains this service so
        // going "Atrás" from step 2 shows the correct state
        const path = findServicePath(serviceId);
        if (path) {
          setTreeHistory(path.history);
          setTreeChoiceKey(path.choiceKey);
        }
        setCompletedSteps(prev => {
          const newCompleted = new Set(prev);
          newCompleted.add(1);
          return Array.from(newCompleted);
        });
        setCurrentStep(2);
      }
    }
  }, [searchParams]);

  const handleSelectService = (service: Service | null) => {
    if (!service) {
      setSelectedService(null);
      return;
    }
    const serviceChanged = selectedService?.id !== service.id;
    setSelectedService(service);
    if (serviceChanged) {
      // Reset date/time when service changes
      setSelectedDate(null);
      setSelectedTime(null);
      // Remove steps 3+ from completed since date/time are reset
      setCompletedSteps(prev => prev.filter(s => s < 3));
    }
  };

  // Mark current step as completed and advance to next step
  const goToStep = (nextStep: number) => {
    setCompletedSteps(prev => {
      const newCompleted = new Set(prev);
      newCompleted.add(currentStep);
      return Array.from(newCompleted);
    });
    setCurrentStep(nextStep);
  };

  // Handle stepper click navigation
  const handleStepClick = (stepNumber: number) => {
    if (stepNumber === currentStep) return;
    const maxCompleted = completedSteps.length > 0 ? Math.max(...completedSteps) : 0;
    if (stepNumber <= maxCompleted + 1) {
      setCurrentStep(stepNumber);
    }
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

    // Show confirmation popup (no toast)
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
    // const { isFirstTimeUser } = await response.json();
    const isFirstTimeUser = true; // Mock: change to false to simulate existing patient

    if (isFirstTimeUser) {
      setShowNewPatientModal(true);
    } else {
      // Existing patient → redirect to landing page
      navigate('/');
    }
  };

  const handleCompleteNow = () => {
    setShowNewPatientModal(false);
    setShowFirstTimeForm(true);
  };

  const handleFillAtClinic = () => {
    setShowNewPatientModal(false);
    // Redirect to landing page
    navigate('/');
  };

  const handleFirstTimeFormComplete = () => {
    setShowFirstTimeForm(false);
    // Redirect to landing page
    navigate('/');
  };

  const handleBookClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar onBookClick={handleBookClick} />

      <div className="flex-1 pt-20">
        {/* Step Indicator */}
        <div className="bg-background">
          <div className="container mx-auto">
            <StepIndicator
              currentStep={currentStep}
              completedSteps={completedSteps}
              onStepClick={handleStepClick}
            />
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
                  onNext={() => goToStep(2)}
                  treeHistory={treeHistory}
                  onTreeHistoryChange={setTreeHistory}
                  treeChoiceKey={treeChoiceKey}
                  onTreeChoiceKeyChange={setTreeChoiceKey}
                />
              )}
              
              {currentStep === 2 && (
                <PatientDataStep
                  key="patient"
                  patientData={patientData}
                  onUpdatePatientData={setPatientData}
                  onNext={() => goToStep(3)}
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
                  onNext={() => goToStep(4)}
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
            © {new Date().getFullYear()} Dra. Ekaterina Malaspina Riazanova — Clínica Esperanza. {t('footer.rights')}.
          </p>
          <p className="text-center md:text-right">
            {t('footer.madeBy')}{' '}
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-heart inline-block h-3 w-3 align-middle animate-pulse"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path></svg>{' '}
            {t('footer.madeByBy')}{' '}
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
