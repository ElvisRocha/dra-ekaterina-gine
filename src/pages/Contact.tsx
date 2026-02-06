import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { MapPin, Phone, Mail, Clock, Send, MessageCircle } from 'lucide-react';
import { LanguageProvider, useLanguage } from '@/contexts/LanguageContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';

const ContactContent = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleBookClick = () => {
    navigate('/BookAppointment');
  };

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // TODO: Integrate with n8n webhook for form submission
    // Example:
    // await fetch('https://your-n8n-url/webhook/contact-form', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(formData),
    // });

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    toast({
      title: language === 'es' 
        ? '¡Mensaje enviado correctamente!' 
        : 'Message sent successfully!',
      description: language === 'es'
        ? 'Nos pondremos en contacto pronto.'
        : "We'll get in touch soon.",
      className: 'bg-primary text-primary-foreground',
    });

    setFormData({ fullName: '', email: '', phone: '', subject: '', message: '' });
    setIsSubmitting(false);
  };

  // TODO: Replace with real clinic phone number
  const whatsappNumber = '506XXXXXXXX';
  const whatsappLink = `https://wa.me/${whatsappNumber}`;

  return (
    <div className="min-h-screen bg-background">
      <Navbar onBookClick={handleBookClick} />
      
      {/* Header Section */}
      <section className="pt-32 pb-12 px-4">
        <div className="container mx-auto text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display text-4xl md:text-5xl text-foreground mb-4"
          >
            {language === 'es' ? 'Contáctanos' : 'Contact Us'}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground text-lg max-w-2xl mx-auto"
          >
            {language === 'es' 
              ? '¿Tienes preguntas? ¡Nos encantaría saber de ti!' 
              : 'Have questions? We would love to hear from you!'}
          </motion.p>
        </div>
      </section>

      {/* Main Content */}
      <section className="pb-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-card rounded-2xl p-6 md:p-8 shadow-sm border border-border h-full flex flex-col"
            >
              <h2 className="font-display text-2xl text-foreground mb-6">
                {language === 'es' ? 'Envíanos un Mensaje' : 'Send us a Message'}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-5 flex-1 flex flex-col">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">
                      {language === 'es' ? 'Nombre Completo' : 'Full Name'} *
                    </Label>
                    <Input
                      id="fullName"
                      value={formData.fullName}
                      onChange={(e) => updateField('fullName', e.target.value)}
                      placeholder={language === 'es' ? 'Tu nombre' : 'Your name'}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">
                      {language === 'es' ? 'Correo Electrónico' : 'Email'} *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => updateField('email', e.target.value)}
                      placeholder="tu@email.com"
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">
                      {language === 'es' ? 'Teléfono (opcional)' : 'Phone (optional)'}
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => updateField('phone', e.target.value)}
                      placeholder="+506 8888-8888"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subject">
                      {language === 'es' ? 'Asunto' : 'Subject'} *
                    </Label>
                    <Input
                      id="subject"
                      value={formData.subject}
                      onChange={(e) => updateField('subject', e.target.value)}
                      placeholder={language === 'es' ? 'Asunto del mensaje' : 'Message subject'}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">
                    {language === 'es' ? 'Mensaje' : 'Message'} *
                  </Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => updateField('message', e.target.value)}
                    placeholder={language === 'es' ? 'Cuéntanos cómo podemos ayudarte...' : 'Tell us how we can help you...'}
                    rows={5}
                    required
                  />
                </div>

                <p className="text-sm text-muted-foreground">
                  {language === 'es' 
                    ? 'Te contactaremos lo antes posible' 
                    : 'We will contact you as soon as possible'}
                </p>

                <Button 
                  type="submit" 
                  className="w-full btn-gradient rounded-full mt-auto"
                  disabled={isSubmitting}
                >
                  <Send className="w-4 h-4 mr-2" />
                  <span>
                    {isSubmitting 
                      ? (language === 'es' ? 'Enviando...' : 'Sending...') 
                      : (language === 'es' ? 'Enviar Mensaje' : 'Send Message')}
                  </span>
                </Button>
              </form>
            </motion.div>

            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-card rounded-2xl p-6 md:p-8 shadow-sm border border-border h-full flex flex-col"
            >
              <h2 className="font-display text-2xl text-foreground mb-6">
                {language === 'es' ? 'Información de Contacto' : 'Contact Information'}
              </h2>

              <div className="space-y-6">
                {/* Address */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground mb-1">
                      {language === 'es' ? 'Dirección' : 'Address'}
                    </h3>
                    {/* TODO: Replace with real clinic address */}
                    <p className="text-muted-foreground text-sm">
                      [Dirección de la clínica]<br />
                      San José, Costa Rica
                    </p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground mb-1">
                      {language === 'es' ? 'Teléfono' : 'Phone'}
                    </h3>
                    {/* TODO: Replace with real phone number */}
                    <a 
                      href="tel:+506XXXXXXXX" 
                      className="text-primary hover:underline text-sm"
                    >
                      +506 XXXX-XXXX
                    </a>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground mb-1">
                      {language === 'es' ? 'Correo' : 'Email'}
                    </h3>
                    {/* TODO: Replace with real email */}
                    <a 
                      href="mailto:contacto@clinicaesperanza.com" 
                      className="text-primary hover:underline text-sm"
                    >
                      contacto@clinicaesperanza.com
                    </a>
                  </div>
                </div>

                {/* Hours */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground mb-1">
                      {language === 'es' ? 'Horario de Atención' : 'Office Hours'}
                    </h3>
                    {/* TODO: Confirm actual office hours */}
                    <p className="text-muted-foreground text-sm">
                      {language === 'es' 
                        ? 'Lunes a Viernes: 8:00 AM - 6:00 PM' 
                        : 'Monday to Friday: 8:00 AM - 6:00 PM'}<br />
                      <span className="text-xs">({language === 'es' ? 'Hora de Costa Rica' : 'Costa Rica Time'})</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* WhatsApp CTA */}
              <div className="mt-auto pt-6 border-t border-border">
                <p className="text-sm text-muted-foreground mb-4 text-center">
                  {language === 'es' 
                    ? '¿Necesitas una respuesta rápida? ¡Escríbenos por WhatsApp!' 
                    : 'Need a quick response? Message us on WhatsApp!'}
                </p>
                <a 
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3 px-4 btn-gradient rounded-full font-medium transition-colors"
                >
                  <MessageCircle className="w-5 h-5" />
                  {language === 'es' ? 'Chatear por WhatsApp' : 'Chat on WhatsApp'}
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="pb-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-secondary/30 rounded-2xl p-8 md:p-12 text-center"
          >
            {/* TODO: Integrate Google Maps embed with real clinic location */}
            <div className="bg-muted rounded-xl h-64 md:h-80 flex items-center justify-center mb-6">
              <div className="text-center">
                <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  {language === 'es' ? 'Mapa de ubicación' : 'Location Map'}
                </p>
              </div>
            </div>
            <Button 
              variant="outline"
              className="rounded-full"
              onClick={() => {
                // TODO: Replace with actual Google Maps directions link
                window.open('https://maps.google.com', '_blank');
              }}
            >
              <MapPin className="w-4 h-4 mr-2" />
              {language === 'es' ? 'Cómo Llegar' : 'Get Directions'}
            </Button>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

const Contact = () => {
  return (
    <LanguageProvider>
      <ContactContent />
    </LanguageProvider>
  );
};

export default Contact;
