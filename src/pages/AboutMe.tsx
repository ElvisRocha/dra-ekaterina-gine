import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Palette, Scissors, Mountain, Activity, Stethoscope } from 'lucide-react';
import { LanguageProvider, useLanguage } from '@/contexts/LanguageContext';
import IsotipoImg from '@/assets/Isotipo.png';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';

// ─── Section Title with Gradient Separator ────────────────────────────────────
const SectionTitle = ({ title }: { title: string }) => (
  <div className="text-center mb-12">
    <h2 className="font-display text-3xl md:text-4xl text-foreground mb-4">{title}</h2>
    <div className="w-24 h-1 bg-gradient-to-r from-coral via-fuchsia to-magenta mx-auto rounded-full" />
  </div>
);

// ─── Page Content ─────────────────────────────────────────────────────────────
const AboutMeContent = () => {
  const navigate = useNavigate();
  const { language, t } = useLanguage();

  const handleBookClick = () => navigate('/BookAppointment');

  const hobbies = [
    { Icon: Palette, label: t('about.hobby1') },
    { Icon: Scissors, label: t('about.hobby2') },
    { Icon: Mountain, label: t('about.hobby3') },
    { Icon: Activity, label: t('about.hobby4') },
  ];

  const storyBlocks = [
    {
      title: t('about.story1.title'),
      paragraphs: [t('about.story1.p1')],
      photoRight: true,
      hasPhoto: true,
      photoUrl: 'https://res.cloudinary.com/dcvipikha/image/upload/c_fill,g_faces,f_auto,q_auto/v1772223650/universidad_xhvkx4.jpg',
    },
    {
      title: t('about.story2.title'),
      paragraphs: [t('about.story2.p1'), t('about.story2.p2')],
      photoRight: false,
      hasPhoto: true,
      photoUrl: 'https://res.cloudinary.com/dcvipikha/image/upload/c_fill,g_faces,f_auto,q_auto/v1772223651/grado-foto_b74mv2.jpg',
    },
    {
      title: t('about.story3.title'),
      paragraphs: [t('about.story3.p1'), t('about.story3.p2')],
      photoRight: true,
      hasPhoto: true,
      photoUrl: 'https://res.cloudinary.com/dcvipikha/image/upload/c_fill,g_faces,f_auto,q_auto/v1772223651/hijos_m9hrkm.jpg',
    },
    {
      title: t('about.story4.title'),
      paragraphs: [t('about.story4.p1'), t('about.story4.p2'), t('about.story4.p3')],
      photoRight: false,
      hasPhoto: false,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar onBookClick={handleBookClick} />

      {/* HERO */}
      <section className="pt-32 pb-20 px-4 section-gradient">
        <div className="container mx-auto max-w-5xl">
          <div className="flex flex-col md:flex-row items-center gap-10 md:gap-16">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="flex-shrink-0"
            >
              <div className="w-52 h-52 md:w-64 md:h-64 rounded-full overflow-hidden shadow-lg border-4 border-white">
                <img src="https://res.cloudinary.com/dcvipikha/image/upload/f_auto,q_auto/v1771953299/ekaterina_yxeoxk.jpg" alt="Dra. Ekaterina Malaspina" className="w-full h-full object-cover" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-center md:text-left"
            >
              <p className="text-sm font-medium text-primary uppercase tracking-widest mb-3">
                {t('about.specialty')}
              </p>
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-foreground mb-4 leading-tight">
                Dra. Ekaterina<br />Malaspina Riazanova
              </h1>
              <div className="w-20 h-1 bg-gradient-to-r from-coral via-fuchsia to-magenta rounded-full mb-6 mx-auto md:mx-0" />
              <blockquote className="text-muted-foreground text-base md:text-lg italic leading-relaxed max-w-xl border-l-4 border-primary/30 pl-5">
                {t('about.quote')}
              </blockquote>
            </motion.div>
          </div>
        </div>
      </section>

      {/* MI HISTORIA */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <SectionTitle title={t('about.storyTitle')} />
          </motion.div>

          <div className="space-y-20">
            {storyBlocks.map((block, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
              >
                {block.hasPhoto ? (
                  <div
                    className={`flex flex-col gap-8 items-center ${
                      block.photoRight ? 'md:flex-row-reverse' : 'md:flex-row'
                    }`}
                  >
                    <div className="w-full md:w-1/2">
                      <img
                        src={block.photoUrl}
                        alt={block.title}
                        className="w-full h-auto rounded-2xl shadow-md"
                      />
                    </div>
                    <div className="w-full md:w-1/2 space-y-4">
                      <h3 className="font-display text-2xl md:text-3xl text-primary">{block.title}</h3>
                      {block.paragraphs.map((p, j) => (
                        <p key={j} className="text-muted-foreground leading-relaxed">{p}</p>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="max-w-3xl mx-auto space-y-4">
                    <h3 className="font-display text-2xl md:text-3xl text-primary">{block.title}</h3>
                    {block.paragraphs.map((p, j) => (
                      <p key={j} className="text-muted-foreground leading-relaxed">{p}</p>
                    ))}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FUERA DEL CONSULTORIO */}
      <section className="py-20 px-4 section-blush">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <SectionTitle title={t('about.outsideTitle')} />
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-center text-muted-foreground text-lg leading-relaxed mb-12 max-w-2xl mx-auto"
          >
            {t('about.outsideDesc')}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12"
          >
            {hobbies.map(({ Icon, label }, i) => (
              <div
                key={i}
                className="flex flex-col items-center gap-3 p-6 bg-background rounded-2xl shadow-sm border border-border"
              >
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                  <Icon className="w-7 h-7 text-primary" />
                </div>
                <p className="text-sm font-medium text-foreground text-center">{label}</p>
              </div>
            ))}
          </motion.div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          LLAMADO A LA ACCIÓN
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="py-24 bg-gradient-to-br from-magenta via-fuchsia to-coral relative overflow-hidden">
        {/* Decorative pattern overlay */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iYSIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVHJhbnNmb3JtPSJyb3RhdGUoNDUpIj48cGF0aCBkPSJNLTEwIDMwaDYwdi0xaC02MHoiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4xKSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNhKSIvPjwvc3ZnPg==')] opacity-30" />
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-white/10 rounded-full blur-3xl" />

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            {/* Isotipo with decorative lines */}
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="h-px w-16 bg-gradient-to-r from-transparent to-white/50" />
              <img src={IsotipoImg} alt="" className="h-40 w-auto brightness-0 invert opacity-90" />
              <div className="h-px w-16 bg-gradient-to-l from-transparent to-white/50" />
            </div>
            <h2 className="font-display text-3xl md:text-4xl text-primary-foreground mb-8 leading-tight">
              {t('about.ctaHeading')}
            </h2>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Button
                onClick={handleBookClick}
                size="lg"
                className="bg-white text-magenta hover:bg-white/90 text-lg px-10 py-6 rounded-full shadow-elevated font-semibold"
              >
                <span className="flex items-center gap-2">
                  <Stethoscope className="!size-5 text-magenta" />
                  {language === 'es' ? 'Agendar cita' : 'Book Appointment'}
                </span>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

// ─── Page Wrapper ─────────────────────────────────────────────────────────────
const AboutMe = () => (
  <LanguageProvider>
    <AboutMeContent />
  </LanguageProvider>
);

export default AboutMe;
