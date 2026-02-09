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
  'footer.madeBy': { es: 'Hecho por', en: 'Made by' },
  
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
  'serviceInfo.title': { es: 'Información del servicio', en: 'Service information' },
  'serviceInfo.continue': { es: 'Continuar', en: 'Continue' },
  
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
  'form.required': { es: 'Este campo es obligatorio', en: 'This field is required' },
  'form.invalidEmail': { es: 'Ingrese un correo electrónico válido', en: 'Enter a valid email address' },
  'form.pregnancyBreakdown': { es: 'Al menos uno de estos campos debe tener información', en: 'At least one of these fields must have information' },
  
  // Notes
  'notes.vph': {
    es: 'La prueba de VPH vale ₡50.000, no se realiza sola, sino en conjunto con consulta u otra cosa.',
    en: 'The HPV test costs ₡50,000, it is not performed alone, but in conjunction with a consultation or another service.'
  },
  'notes.diu': {
    es: 'Retiro de DIU + Colocación de otro: no se cobra el retiro, solo el costo del DIU.',
    en: 'IUD removal + Placement of another: removal is not charged, only the cost of the IUD.'
  },

  // FAQ
  'faq.title': {
    es: '¿Tienes dudas? Estamos aquí para ayudarte',
    en: 'Have questions? We\'re here to help',
  },
  'faq.subtitle': {
    es: 'Resolvemos las preguntas más frecuentes sobre nuestros servicios ginecológicos y obstétricos',
    en: 'We answer the most frequently asked questions about our gynecological and obstetric services',
  },
  'faq.q1': {
    es: '¿Cuándo debo realizar mi primera consulta ginecológica?',
    en: 'When should I have my first gynecological consultation?',
  },
  'faq.a1': {
    es: 'Se recomienda la primera visita ginecológica al inicio de la vida sexual activa o a partir de los 21 años. Las consultas anuales son fundamentales para la prevención y detección temprana de cualquier anomalía. En nuestra clínica ofrecemos un ambiente cálido y profesional para que te sientas cómoda en cada visita.',
    en: 'The first gynecological visit is recommended at the start of sexual activity or from age 21. Annual consultations are essential for prevention and early detection of any abnormalities. At our clinic, we offer a warm and professional environment so you feel comfortable at every visit.',
  },
  'faq.q2': {
    es: '¿Qué incluye una consulta ginecológica completa?',
    en: 'What does a complete gynecological consultation include?',
  },
  'faq.a2': {
    es: 'Nuestra consulta incluye: evaluación del historial médico, examen físico general, exploración ginecológica, Papanicolaou (si corresponde), ultrasonido si es necesario, y orientación personalizada sobre anticoncepción, salud sexual y bienestar femenino. Utilizamos tecnología 3D/4D para diagnósticos más precisos.',
    en: 'Our consultation includes: medical history evaluation, general physical exam, gynecological examination, Pap smear (if applicable), ultrasound if necessary, and personalized guidance on contraception, sexual health, and women\'s wellness. We use 3D/4D technology for more precise diagnoses.',
  },
  'faq.q3': {
    es: '¿Con qué frecuencia debo hacerme un ultrasonido ginecológico?',
    en: 'How often should I get a gynecological ultrasound?',
  },
  'faq.a3': {
    es: 'La frecuencia depende de tu edad, historial médico y síntomas. Generalmente se recomienda anualmente como parte del chequeo preventivo, o según indicación médica si presentas síntomas específicos. Contamos con equipos de última generación para diagnósticos precisos.',
    en: 'The frequency depends on your age, medical history, and symptoms. It is generally recommended annually as part of a preventive checkup, or as medically indicated if you have specific symptoms. We have state-of-the-art equipment for precise diagnoses.',
  },
  'faq.q4': {
    es: '¿Qué diferencia hay entre un ultrasonido 3D y 4D?',
    en: 'What is the difference between a 3D and 4D ultrasound?',
  },
  'faq.a4': {
    es: 'El ultrasonido 3D ofrece imágenes tridimensionales estáticas del bebé, mientras que el 4D muestra imágenes en movimiento en tiempo real. Ambos permiten visualizar con mayor detalle estructuras anatómicas y detectar posibles anomalías. Son especialmente emotivos para los futuros padres al ver a su bebé con mayor claridad.',
    en: 'The 3D ultrasound provides static three-dimensional images of the baby, while the 4D shows moving images in real time. Both allow more detailed visualization of anatomical structures and detection of possible abnormalities. They are especially emotional for expecting parents as they see their baby more clearly.',
  },
  'faq.q5': {
    es: '¿Cuándo debo empezar mi control prenatal?',
    en: 'When should I start my prenatal care?',
  },
  'faq.a5': {
    es: 'Lo ideal es iniciar el control prenatal tan pronto sepas que estás embarazada, preferiblemente antes de las 12 semanas de gestación. El seguimiento temprano permite detectar y prevenir complicaciones, asegurando la salud tanto de la madre como del bebé.',
    en: 'Ideally, prenatal care should start as soon as you know you are pregnant, preferably before 12 weeks of gestation. Early monitoring helps detect and prevent complications, ensuring the health of both mother and baby.',
  },
  'faq.q6': {
    es: '¿Qué métodos anticonceptivos ofrecen y cuál es el mejor para mí?',
    en: 'What contraceptive methods do you offer, and which is best for me?',
  },
  'faq.a6': {
    es: 'Ofrecemos asesoría completa sobre todos los métodos anticonceptivos disponibles: pastillas, inyecciones, DIU (incluyendo colocación de dispositivos), implantes, y métodos de barrera. La elección del mejor método depende de tu edad, historial médico, estilo de vida y planes futuros. Juntas encontraremos la opción ideal para ti.',
    en: 'We offer complete advice on all available contraceptive methods: pills, injections, IUDs (including device placement), implants, and barrier methods. Choosing the best method depends on your age, medical history, lifestyle, and future plans. Together, we will find the ideal option for you.',
  },
  'faq.q7': {
    es: '¿Realizan procedimientos de colposcopia? ¿Cuándo es necesaria?',
    en: 'Do you perform colposcopy procedures? When is it necessary?',
  },
  'faq.a7': {
    es: 'Sí, realizamos colposcopias cuando los resultados del Papanicolaou muestran células anormales o si hay hallazgos sospechosos durante el examen. Es un procedimiento seguro, rápido y fundamental para la prevención del cáncer cervical. Contamos con equipamiento especializado para garantizar tu comodidad.',
    en: 'Yes, we perform colposcopies when Pap smear results show abnormal cells or if there are suspicious findings during the exam. It is a safe, quick procedure essential for cervical cancer prevention. We have specialized equipment to ensure your comfort.',
  },
  'faq.q8': {
    es: '¿Qué debo llevar a mi primera cita?',
    en: 'What should I bring to my first appointment?',
  },
  'faq.a8': {
    es: 'Te recomendamos traer: resultados de exámenes previos (si los tienes), lista de medicamentos que tomas actualmente, información sobre tu historial médico familiar, y cualquier duda o síntoma que quieras consultar. Si es control prenatal, trae también tu test de embarazo positivo.',
    en: 'We recommend bringing: previous exam results (if you have them), a list of medications you currently take, information about your family medical history, and any questions or symptoms you want to discuss. If it is prenatal care, also bring your positive pregnancy test.',
  },
  'faq.q9': {
    es: '¿Aceptan seguros médicos o solo pago privado?',
    en: 'Do you accept medical insurance or only private payment?',
  },
  'faq.a9': {
    es: 'Trabajamos tanto con seguros médicos como con pagos privados. Contáctanos para verificar si tu seguro está dentro de nuestra red de proveedores. Ofrecemos diferentes opciones de pago para tu comodidad.',
    en: 'We work with both medical insurance and private payments. Contact us to verify if your insurance is within our provider network. We offer different payment options for your convenience.',
  },
  'faq.q10': {
    es: '¿Cómo puedo prepararme para un ultrasonido pélvico?',
    en: 'How can I prepare for a pelvic ultrasound?',
  },
  'faq.a10': {
    es: 'Para ultrasonidos pélvicos transabdominales es necesario acudir con la vejiga llena (tomar 4-6 vasos de agua 1 hora antes). Para ultrasonidos transvaginales no se requiere preparación especial. Te indicaremos las instrucciones específicas al agendar tu cita.',
    en: 'For transabdominal pelvic ultrasounds, you need to come with a full bladder (drink 4-6 glasses of water 1 hour before). For transvaginal ultrasounds, no special preparation is required. We will provide specific instructions when you schedule your appointment.',
  },
  'faq.ctaTitle': {
    es: '¿No encontraste respuesta a tu pregunta?',
    en: 'Didn\'t find the answer to your question?',
  },
  'faq.ctaDescription': {
    es: 'Estamos aquí para resolver todas tus dudas. Agenda tu cita y conversemos personalmente sobre tu salud y bienestar.',
    en: 'We\'re here to answer all your questions. Book your appointment and let\'s talk personally about your health and well-being.',
  },
  'faq.ctaButton': {
    es: 'Agendar mi consulta',
    en: 'Book my consultation',
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
