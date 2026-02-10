import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { LanguageProvider, useLanguage } from '@/contexts/LanguageContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';

// TODO: Replace these placeholder images with real clinic photos
const galleryImages = [
  { id: 1, src: 'https://res.cloudinary.com/da1sq9diw/image/upload/f_auto,q_auto/v1770732824/atencion_en_camilla.jpg', loading: "lazy",  category: 'office', alt: 'Consultorio médico' },
  { id: 2, src: 'https://res.cloudinary.com/da1sq9diw/image/upload/f_auto,q_auto/v1770732824/doctoras.jpg', loading: "lazy", category: 'equipment', alt: 'Equipo médico' },
  { id: 3, src: 'https://res.cloudinary.com/da1sq9diw/image/upload/f_auto,q_auto/v1770732824/doctora_con_utero.jpg', loading: "lazy", category: 'ultrasounds', alt: 'Doctora Ekaterina' },
  { id: 4, src: 'https://res.cloudinary.com/da1sq9diw/image/upload/w_550,h_450,c_fill,g_face,f_auto,q_auto/v1770732824/doctora_ekaterina.jpg', loading: "lazy", category: 'patients', alt: 'Doctora Ekaterina' },
  { id: 5, src: 'https://res.cloudinary.com/da1sq9diw/image/upload/f_auto,q_auto/v1770732824/puerta_consultorio.jpg', loading: "lazy", category: 'office', alt: 'Consultorio' },
  { id: 6, src: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=600&h=400&fit=crop', loading: "lazy", category: 'equipment', alt: 'Equipos de diagnóstico' },
  { id: 7, src: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&h=400&fit=crop', loading: "lazy", category: 'ultrasounds', alt: 'Ecografía 4D' },
  { id: 8, src: 'https://images.unsplash.com/photo-1609220136736-443140cffec6?w=600&h=400&fit=crop', loading: "lazy", category: 'patients', alt: 'Futura mamá' },
  { id: 9, src: 'https://res.cloudinary.com/da1sq9diw/image/upload/f_auto,q_auto/v1770732824/consultorio_medico.jpg', loading: "lazy", category: 'office', alt: 'Consultorio' },
  { id: 10, src: 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=600&h=400&fit=crop', loading: "lazy", category: 'equipment', alt: 'Sala de procedimientos' },
  { id: 11, src: 'https://images.unsplash.com/photo-1530026405186-ed1f139313f8?w=600&h=400&fit=crop', loading: "lazy", category: 'ultrasounds', alt: 'Monitoreo fetal' },
  { id: 12, src: 'https://images.unsplash.com/photo-1584515933487-779824d29309?w=600&h=400&fit=crop', loading: "lazy", category: 'patients', alt: 'Cuidado prenatal' },
];

type Category = 'all' | 'office' | 'equipment' | 'ultrasounds' | 'patients';

const GalleryContent = () => {
  const navigate = useNavigate();
  const { language, t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<Category>('all');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const categories: { key: Category; labelEs: string; labelEn: string }[] = [
    { key: 'all', labelEs: 'Todas las Fotos', labelEn: 'All Photos' },
    { key: 'office', labelEs: 'Consultorio', labelEn: 'Office' },
    { key: 'equipment', labelEs: 'Equipo Médico', labelEn: 'Medical Equipment' },
    { key: 'ultrasounds', labelEs: 'Ultrasonidos', labelEn: 'Ultrasounds' },
    { key: 'patients', labelEs: 'Pacientes Felices', labelEn: 'Happy Patients' },
  ];

  const filteredImages = selectedCategory === 'all' 
    ? galleryImages 
    : galleryImages.filter(img => img.category === selectedCategory);

  const handleBookClick = () => {
    navigate('/BookAppointment');
  };

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
  };

  const goToPrevious = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex(lightboxIndex === 0 ? filteredImages.length - 1 : lightboxIndex - 1);
    }
  };

  const goToNext = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex(lightboxIndex === filteredImages.length - 1 ? 0 : lightboxIndex + 1);
    }
  };

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
            {language === 'es' ? 'Galería' : 'Gallery'}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground text-lg max-w-2xl mx-auto"
          >
            {language === 'es' 
              ? 'Conoce nuestras instalaciones y el cuidado que brindamos a cada paciente' 
              : 'Get to know our facilities and the care we provide to every patient'}
          </motion.p>
        </div>
      </section>

      {/* Category Filters */}
      <section className="pb-8 px-4">
        <div className="container mx-auto">
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setSelectedCategory(cat.key)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === cat.key
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-muted-foreground hover:bg-secondary/80 hover:text-foreground'
                }`}
              >
                {language === 'es' ? cat.labelEs : cat.labelEn}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Image Grid */}
      <section className="pb-16 px-4">
        <div className="container mx-auto">
          <motion.div 
            layout
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
          >
            <AnimatePresence mode="popLayout">
              {filteredImages.map((image, index) => (
                <motion.div
                  key={image.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  className="relative overflow-hidden rounded-xl cursor-pointer group aspect-[4/3]"
                  onClick={() => openLightbox(index)}
                >
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/30 transition-colors duration-300" />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="pb-20 px-4">
        <div className="container mx-auto text-center">
          <div className="bg-secondary/50 rounded-2xl py-12 px-6">
            <h2 className="font-display text-2xl md:text-3xl text-foreground mb-6">
              {language === 'es' ? '¿Lista para tu cita?' : 'Ready for your appointment?'}
            </h2>
            <Button 
              onClick={handleBookClick}
              size="lg"
              className="btn-gradient rounded-full"
            >
              <span>{t('nav.book')}</span>
            </Button>
          </div>
        </div>
      </section>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-foreground/90 flex items-center justify-center p-4"
            onClick={closeLightbox}
          >
            {/* Close button */}
            <button 
              className="absolute top-4 right-4 text-background hover:text-background/80 transition-colors z-10"
              onClick={closeLightbox}
            >
              <X className="w-8 h-8" />
            </button>

            {/* Navigation buttons */}
            <button 
              className="absolute left-4 text-background hover:text-background/80 transition-colors z-10"
              onClick={(e) => { e.stopPropagation(); goToPrevious(); }}
            >
              <ChevronLeft className="w-10 h-10" />
            </button>
            <button 
              className="absolute right-4 text-background hover:text-background/80 transition-colors z-10"
              onClick={(e) => { e.stopPropagation(); goToNext(); }}
            >
              <ChevronRight className="w-10 h-10" />
            </button>

            {/* Image */}
            <motion.img
              key={lightboxIndex}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              src={filteredImages[lightboxIndex].src}
              alt={filteredImages[lightboxIndex].alt}
              className="max-w-full max-h-[85vh] object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />

            {/* Image counter */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-background text-sm">
              {lightboxIndex + 1} / {filteredImages.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
};

const Gallery = () => {
  return (
    <LanguageProvider>
      <GalleryContent />
    </LanguageProvider>
  );
};

export default Gallery;
