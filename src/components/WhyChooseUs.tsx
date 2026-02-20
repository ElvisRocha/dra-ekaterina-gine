import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import consultaIcon from '@/assets/consulta.png';
import ecografiaIcon from '@/assets/ecografia.png';
import dispositivoIcon from '@/assets/dispositivo.png';
import ecoUteroIcon from '@/assets/matrioshka.png';

interface WhyChooseUsProps {
  onBookClick: () => void;
}

const WhyChooseUs = ({ onBookClick }: WhyChooseUsProps) => {
  const { t, language } = useLanguage();

  const features = [
    {
      imgSrc: consultaIcon,
      altEs: 'Icono de consulta personalizada',
      altEn: 'Personalized consultation icon',
      titleKey: 'why.personalized.title',
      descKey: 'why.personalized.desc',
    },
    {
      imgSrc: ecografiaIcon,
      altEs: 'Icono de ecografía',
      altEn: 'Ultrasound icon',
      titleKey: 'why.technology.title',
      descKey: 'why.technology.desc',
    },
    {
      imgSrc: dispositivoIcon,
      altEs: 'Icono de dispositivo anticonceptivo',
      altEn: 'Contraceptive device icon',
      titleKey: 'why.experience.title',
      descKey: 'why.experience.desc',
    },
    {
      imgSrc: ecoUteroIcon,
      altEs: 'Icono de salud integral femenina',
      altEn: 'Comprehensive women\'s health icon',
      titleKey: 'why.integral.title',
      descKey: 'why.integral.desc',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' as const },
    },
  };

  return (
    <section className="py-24 bg-soft-gradient relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-coral/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-magenta/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl text-foreground mb-4">
            {t('why.title')}
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-coral via-fuchsia to-magenta mx-auto rounded-full" />
        </motion.div>

        {/* Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="card-elevated group cursor-default"
            >
              <div className="flex flex-col items-center text-center">
                {/* Icon Container */}
                <div className="relative mb-6">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-coral/20 to-magenta/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <img
                      src={feature.imgSrc}
                      alt={language === 'es' ? feature.altEs : feature.altEn}
                      width={72}
                      height={72}
                      loading="lazy"
                      className="object-contain"
                    />
                  </div>
                  <div className="absolute -inset-2 bg-gradient-to-br from-coral/10 to-magenta/10 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                {/* Content */}
                <h3 className="font-display text-xl text-foreground mb-3">
                  {t(feature.titleKey)}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {t(feature.descKey)}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center"
        >
          <Button
            onClick={onBookClick}
            className="btn-gradient rounded-full"
          >
            <span>{t('why.cta')}</span>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
