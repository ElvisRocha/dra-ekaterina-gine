import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

type Language = 'es' | 'en';

interface Translations {
  [key: string]: {
    es: string;
    en: string;
  };
}

const translations: Translations = {
  // Navbar
  'nav.book': { es: 'Agendar Cita', en: 'Book Appointment' },
  
  // Hero
  'hero.headline': { 
    es: 'Tu salud íntima merece la mejor atención. Agenda tu cita hoy.', 
    en: 'Your intimate health deserves the best care. Book your appointment today.' 
  },
  'hero.subtitle': { 
    es: 'Dra. Ekaterina Malaspina Riazanova — Ginecología y Obstetricia con calidez, profesionalismo y tecnología de punta.', 
    en: 'Dr. Ekaterina Malaspina Riazanova — Gynecology and Obstetrics with warmth, professionalism, and cutting-edge technology.' 
  },
  'hero.cta': { es: 'Reservar mi cita', en: 'Book my appointment' },
  
  // Why choose us
  'why.title': { es: '¿Por qué elegirnos?', en: 'Why choose us?' },
  'why.personalized.title': { es: 'Atención personalizada y cálida', en: 'Personalized and warm care' },
  'why.personalized.desc': { 
    es: 'Cada paciente es única. Te escuchamos y acompañamos en cada paso de tu salud.', 
    en: 'Every patient is unique. We listen and accompany you at every step of your health journey.' 
  },
  'why.technology.title': { es: 'Tecnología de ultrasonido 2D/3D/4D', en: '2D/3D/4D Ultrasound Technology' },
  'why.technology.desc': { 
    es: 'Equipos de última generación para diagnósticos precisos y experiencias memorables.', 
    en: 'State-of-the-art equipment for precise diagnoses and memorable experiences.' 
  },
  'why.experience.title': { es: 'Amplia experiencia en anticoncepción', en: 'Extensive contraception experience' },
  'why.experience.desc': { 
    es: 'Asesoría completa en métodos anticonceptivos adaptados a tus necesidades.', 
    en: 'Complete advice on contraceptive methods tailored to your needs.' 
  },
  'why.integral.title': { es: 'Enfoque integral en la salud de la mujer', en: 'Comprehensive women\'s health approach' },
  'why.integral.desc': { 
    es: 'Cuidamos de ti en todas las etapas de tu vida reproductiva.', 
    en: 'We take care of you at every stage of your reproductive life.' 
  },
  'why.cta': { es: 'Agenda tu consulta', en: 'Schedule your consultation' },
  
  // Services
  'services.title': { es: 'Nuestros Servicios', en: 'Our Services' },
  'services.subtitle': { 
    es: 'Servicios ginecológicos y obstétricos completos para cada etapa de tu vida', 
    en: 'Complete gynecological and obstetric services for every stage of your life' 
  },
  'services.duration': { es: 'Duración', en: 'Duration' },
  'services.price': { es: 'Precio', en: 'Price' },
  'services.book': { es: 'Agendar', en: 'Book' },
  'services.more': { es: 'Más información', en: 'More info' },
  'services.minutes': { es: 'min', en: 'min' },
  
  // Service categories
  'cat.consultas': { es: 'Consultas', en: 'Consultations' },
  'cat.ultrasonidos': { es: 'Ultrasonidos', en: 'Ultrasounds' },
  'cat.dispositivos': { es: 'Colocación de Dispositivos', en: 'Device Placement' },
  'cat.colposcopia': { es: 'Colposcopia', en: 'Colposcopy' },
  
  // Testimonials
  'testimonials.title': { es: 'Confían en nosotras', en: 'They trust us' },
  'testimonials.badge': { es: 'Ginecología y Obstetricia certificada', en: 'Certified Gynecology and Obstetrics' },
  'testimonials.follow': { es: 'Síguenos en Instagram', en: 'Follow us on Instagram' },
  
  // Final CTA
  'cta.headline': { es: 'Tu bienestar no puede esperar. Reserva tu cita ahora.', en: 'Your well-being can\'t wait. Book your appointment now.' },
  'cta.button': { es: 'Agendar mi cita', en: 'Book my appointment' },
  
  // Footer
  'footer.contact': { es: 'Contacto', en: 'Contact' },
  'footer.hours': { es: 'Horario de Atención', en: 'Office Hours' },
  'footer.rights': { es: 'Todos los derechos reservados', en: 'All rights reserved' },
  
  // Booking Page
  'booking.title': { es: 'Agendar Cita', en: 'Book Appointment' },
  'booking.step1': { es: 'Servicio', en: 'Service' },
  'booking.step2': { es: 'Datos', en: 'Details' },
  'booking.step3': { es: 'Confirmar', en: 'Confirm' },
  'booking.step3Date': { es: 'Fecha', en: 'Date' },
  'booking.step4': { es: 'Confirmar', en: 'Confirm' },
  'booking.backHome': { es: 'Volver', en: 'Back' },
  'booking.selectService': { es: 'Selecciona un servicio', en: 'Select a service' },
  'booking.next': { es: 'Siguiente', en: 'Next' },
  'booking.back': { es: 'Atrás', en: 'Back' },
  'booking.confirm': { es: 'Confirmar Cita', en: 'Confirm Appointment' },
  'booking.fullName': { es: 'Nombre Completo', en: 'Full Name' },
  'booking.id': { es: 'Número de Identificación', en: 'ID Number' },
  'booking.phone': { es: 'Teléfono', en: 'Phone' },
  'booking.summary': { es: 'Resumen de tu cita', en: 'Appointment Summary' },
  'booking.service': { es: 'Servicio', en: 'Service' },
  'booking.patient': { es: 'Paciente', en: 'Patient' },
  'booking.success': { es: '¡Su cita ha sido agendada correctamente!', en: 'Your appointment has been successfully booked!' },
  
  // Calendar / Date selection
  'calendar.selectDay': { es: 'Selecciona un día para ver los horarios disponibles', en: 'Select a day to see available times' },
  'calendar.timezone': { es: 'Zona horaria', en: 'Timezone' },
  'calendar.duration': { es: 'Duración', en: 'Duration' },
  
  // Confirmation
  'confirm.dateTime': { es: 'Fecha y hora', en: 'Date and Time' },
  'confirm.at': { es: 'a las', en: 'at' },
  
  // Service info panel
  'serviceInfo.viewInfo': { es: 'Ver información del servicio', en: 'View service information' },
  
  // Confirmation popup
  'confirm.greeting.morning': { es: '¡Buenos días!', en: 'Good morning!' },
  'confirm.greeting.afternoon': { es: '¡Buenas tardes!', en: 'Good afternoon!' },
  'confirm.greeting.evening': { es: '¡Buenas noches!', en: 'Good evening!' },
  'confirm.thanks': { es: 'Gracias por confirmar su asistencia.', en: 'Thank you for confirming your attendance.' },
  'confirm.punctuality': { es: 'Agradecemos su puntualidad. 😊', en: 'We appreciate your punctuality. 😊' },
  'confirm.arrive': { es: 'Solicitamos presentarse 10 minutos antes para su cita.', en: 'Please arrive 10 minutes before your appointment.' },
  'confirm.important': { es: '🔅 Importante tomar en cuenta:', en: '🔅 Important to keep in mind:' },
  'confirm.late': { 
    es: '🔎 Después de 15 minutos de atraso, la Dra no podrá atenderle y se deberá reprogramar la cita.', 
    en: '🔎 After 15 minutes late, Dr. will not be able to see you and the appointment will need to be rescheduled.' 
  },
  'confirm.understanding': { es: 'Agradecemos su comprensión.', en: 'We appreciate your understanding.' },
  'confirm.waiting': { es: '💫 Les esperamos. 💫', en: '💫 We look forward to seeing you. 💫' },
  'confirm.signature': { es: 'Dra. Ekaterina Malaspina.', en: 'Dr. Ekaterina Malaspina.' },
  'confirm.clinic': { es: '🌷 Clínica Esperanza. 🌷', en: '🌷 Clínica Esperanza. 🌷' },
  'confirm.close': { es: 'Cerrar', en: 'Close' },
  
  // New patient modal
  'newpatient.title': { es: 'Primera vez con nosotros', en: 'First time with us' },
  'newpatient.message': { 
    es: 'Es su primera vez con nosotros. Necesitamos algunos datos médicos adicionales. ¿Desea completarlos ahora o prefiere llenarlos en la clínica con ayuda de la secretaria?', 
    en: 'This is your first time with us. We need some additional medical information. Would you like to complete it now or prefer to fill it out at the clinic with the secretary\'s help?' 
  },
  'newpatient.now': { es: 'Completar ahora', en: 'Complete now' },
  'newpatient.clinic': { es: 'Llenar en la clínica', en: 'Fill out at the clinic' },
  'newpatient.clinicConfirm': { 
    es: 'Perfecto, podrá completar sus datos al llegar a la clínica.', 
    en: 'Perfect, you can complete your information when you arrive at the clinic.' 
  },
  
  // Patient form
  'form.title': { es: 'Formulario de Primera Vez', en: 'First Time Form' },
  'form.age': { es: 'Edad (años)', en: 'Age (years)' },
  'form.dob': { es: 'Fecha de nacimiento', en: 'Date of birth' },
  'form.email': { es: 'Correo electrónico', en: 'Email' },
  'form.disease': { es: '¿Padece alguna enfermedad?', en: 'Do you have any diseases?' },
  'form.which': { es: '¿Cuál/es?', en: 'Which one(s)?' },
  'form.medication': { es: '¿Toma algún medicamento actualmente?', en: 'Are you currently taking any medication?' },
  'form.surgery': { es: '¿La han operado de algo?', en: 'Have you had any surgeries?' },
  'form.surgeryWhat': { es: '¿De qué?', en: 'What for?' },
  'form.firstPeriod': { es: 'Edad de la primera menstruación (años)', en: 'Age of first period (years)' },
  'form.lastPeriod': { es: 'Fecha de la última menstruación', en: 'Date of last period' },
  'form.contraceptive': { es: '¿Usa algún método anticonceptivo?', en: 'Do you use any contraceptive method?' },
  'form.whichMethod': { es: '¿Cuál?', en: 'Which one?' },
  'form.pregnant': { es: '¿Ha estado embarazada alguna vez?', en: 'Have you ever been pregnant?' },
  'form.howManyTimes': { es: 'Cuántas veces', en: 'How many times' },
  'form.vaginalBirths': { es: 'Partos Vaginales', en: 'Vaginal Births' },
  'form.cesareans': { es: 'Cesáreas', en: 'Cesarean Sections' },
  'form.abortions': { es: 'Abortos', en: 'Miscarriages/Abortions' },
  'form.others': { es: 'Otros (especifique)', en: 'Others (specify)' },
  'form.pap': { es: '¿Se ha hecho citología (Papanicolaou) alguna vez?', en: 'Have you ever had a Pap smear?' },
  'form.lastPap': { es: '¿Cuándo fue la última citología?', en: 'When was your last Pap smear?' },
  'form.familyHistory': { es: '¿Qué enfermedades importantes hay en su familia?', en: 'What important diseases run in your family?' },
  'form.yes': { es: 'Sí', en: 'Yes' },
  'form.no': { es: 'No', en: 'No' },
  'form.submit': { es: 'Guardar datos', en: 'Save information' },
  'form.success': { es: '¡Datos guardados correctamente! Gracias por completar su información.', en: 'Information saved successfully! Thank you for completing your details.' },
  'form.lockedField': { es: 'Este dato fue proporcionado al agendar su cita', en: 'This information was provided when booking your appointment' },
  
  // Notes
  'notes.vph': { 
    es: 'La prueba de VPH vale ₡50.000, no se realiza sola, sino en conjunto con consulta u otra cosa.', 
    en: 'The HPV test costs ₡50,000, it is not performed alone, but in conjunction with a consultation or another service.' 
  },
  'notes.diu': { 
    es: 'Retiro de DIU + Colocación de otro: no se cobra el retiro, solo el costo del DIU.', 
    en: 'IUD removal + Placement of another: removal is not charged, only the cost of the IUD.' 
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  toggleLanguage: () => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('es');

  const t = useCallback((key: string): string => {
    const translation = translations[key];
    if (!translation) {
      console.warn(`Translation missing for key: ${key}`);
      return key;
    }
    return translation[language];
  }, [language]);

  const toggleLanguage = useCallback(() => {
    setLanguage(prev => prev === 'es' ? 'en' : 'es');
  }, []);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
