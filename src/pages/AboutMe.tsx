import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Palette, Scissors, Mountain, Activity } from 'lucide-react';
import { LanguageProvider, useLanguage } from '@/contexts/LanguageContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';

// ─── Photo Placeholder ────────────────────────────────────────────────────────
const PhotoPlaceholder = ({ className = '' }: { className?: string }) => (
  <div
    className={`flex flex-col items-center justify-center bg-secondary/30 border-2 border-dashed border-primary/30 rounded-2xl ${className}`}
  >
    <span className="text-3xl mb-2" role="img" aria-label="foto">
      📷
    </span>
    <span className="text-sm text-muted-foreground font-medium">Foto</span>
  </div>
);

// ─── Section Title with Gradient Separator ────────────────────────────────────
const SectionTitle = ({ title }: { title: string }) => (
  <div className="text-center mb-12">
    <h2 className="font-display text-3xl md:text-4xl text-foreground mb-4">{title}</h2>
    <div className="w-24 h-1 bg-gradient-to-r from-coral via-fuchsia to-magenta mx-auto rounded-full" />
  </div>
);

// ─── Data ─────────────────────────────────────────────────────────────────────
const hobbies = [
  { Icon: Palette, label: 'Pintura / Arte' },
  { Icon: Scissors, label: 'Tejer / Artesanía' },
  { Icon: Mountain, label: 'Naturaleza / Senderismo' },
  { Icon: Activity, label: 'Pilates / Ejercicio' },
] as const;

const storyBlocks = [
  {
    title: 'Los inicios',
    paragraphs: [
      'Nací en Moscú, Rusia. Desde niña soñaba con ser doctora, pintora, y bailarina de ballet. El hecho de que mi mamá fuera partera, influyó profundamente en mi decisión de estudiar medicina, ya que muchas veces fui a la maternidad donde ella trabajaba y sentía una gran admiración y también curiosidad por su labor. Así mismo la certeza de querer ser madre desde joven orientó mi vocación hacia la obstetricia.',
    ],
    photoRight: true,
    hasPhoto: true,
  },
  {
    title: 'Formación médica',
    paragraphs: [
      'Estudié Medicina en la Universidad Central de Venezuela, en Caracas, donde obtuve el título de Médico Cirujano en el año 2005. Este logro tuvo un significado muy especial, ya que fui a mi graduación acompañada por mis 2 hijos mayores, de 5 y 6 años, así es, primero obtuve el título de "madre" antes del de médico, y esa experiencia transformó para siempre mi forma de entender y acompañar a cada paciente.',
      'Posteriormente, después de una pausa académica y el nacimiento de mi tercer y último hijo, realicé mis estudios de Ginecología y Obstetricia, en el Hospital Rafael Ángel Ranuarez Balza, en Venezuela donde consolidé mi formación profesional, obteniendo el Título de Especialista en Ginecología y Obstetricia en el año 2015.',
    ],
    photoRight: false,
    hasPhoto: true,
  },
  {
    title: 'Costa Rica: un nuevo hogar',
    paragraphs: [
      'Desde el año 2017, resido en Costa Rica, país que me recibió con mi familia, y en el que revalidé mis títulos profesionales, lo que me ha permitido ejercer con responsabilidad y compromiso bajo los estándares médicos establecidos por el Colegio de Médicos y Cirujanos de Costa Rica.',
      'Durante unos 7 años formé parte del equipo del Hospital de San Carlos, principalmente a cargo de la consulta de Embarazos de Alto Riesgo, brindando atención a pacientes con necesidades obstétricas complejas, una experiencia que fortaleció mi compromiso con una medicina responsable, humana y basada en evidencia científica.',
    ],
    photoRight: true,
    hasPhoto: true,
  },
  {
    title: 'Práctica actual',
    paragraphs: [
      'Actualmente me dedico de forma exclusiva a mi consulta privada en la Clínica Esperanza, en Ciudad Quesada, donde atiendo a mujeres en todas las etapas de su vida: desde la adolescencia hasta después de la menopausia, incluyendo control ginecológico, planificación familiar, control prenatal y prevención del cáncer ginecológico.',
      'Mi práctica se basa en una atención cercana, ética y sustentada en evidencia científica. Creo profundamente en la importancia de acompañar a cada paciente con empatía, respeto y claridad, brindando información que les permita tomar decisiones informadas sobre su salud. Mantengo una formación continua mediante la participación en cursos, diplomados y congresos para ofrecer tratamientos actualizados y seguros.',
      'Además, promuevo activamente la educación en salud femenina a través de mis redes sociales, donde comparto contenido de manera periódica, fomentando el acceso a la información clara y confiable.',
    ],
    photoRight: false,
    hasPhoto: false,
  },
];

// ─── Page Content ─────────────────────────────────────────────────────────────
const AboutMeContent = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();

  const handleBookClick = () => navigate('/BookAppointment');

  return (
    <div className="min-h-screen bg-background">
      <Navbar onBookClick={handleBookClick} />

      {/* ══════════════════════════════════════════════════════════════════════
          HERO — Encabezado de la doctora
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="pt-32 pb-20 px-4 section-gradient">
        <div className="container mx-auto max-w-5xl">
          <div className="flex flex-col md:flex-row items-center gap-10 md:gap-16">

            {/* Circular photo placeholder */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="flex-shrink-0"
            >
              <div className="w-52 h-52 md:w-64 md:h-64 rounded-full bg-secondary/30 border-2 border-dashed border-primary/30 flex flex-col items-center justify-center">
                <span className="text-4xl mb-1" role="img" aria-label="foto">📷</span>
                <span className="text-sm text-muted-foreground font-medium">Foto</span>
              </div>
            </motion.div>

            {/* Name, specialty & quote */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-center md:text-left"
            >
              <p className="text-sm font-medium text-primary uppercase tracking-widest mb-3">
                Ginecóloga y Obstetra
              </p>
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-foreground mb-4 leading-tight">
                Dra. Ekaterina<br />Malaspina Riazanova
              </h1>
              <div className="w-20 h-1 bg-gradient-to-r from-coral via-fuchsia to-magenta rounded-full mb-6 mx-auto md:mx-0" />
              <blockquote className="text-muted-foreground text-base md:text-lg italic leading-relaxed max-w-xl border-l-4 border-primary/30 pl-5">
                "Mi objetivo es que mi consulta sea un espacio seguro, donde cada mujer pueda aclarar sus dudas sin temor a ser juzgada, sintiéndose acompañada, comprendida y orientada en cada etapa de su vida."
              </blockquote>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          SU HISTORIA — Bloques narrativos
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <SectionTitle title="Su historia" />
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
                  /* Two-column layout: photo always first in DOM (top on mobile),
                     reversed visually on desktop via flex-row / flex-row-reverse */
                  <div
                    className={`flex flex-col gap-8 items-center ${
                      block.photoRight ? 'md:flex-row-reverse' : 'md:flex-row'
                    }`}
                  >
                    {/* Photo placeholder — first in DOM → appears on top in mobile */}
                    <div className="w-full md:w-1/2">
                      <PhotoPlaceholder className="w-full h-56 md:h-72" />
                    </div>

                    {/* Text */}
                    <div className="w-full md:w-1/2 space-y-4">
                      <h3 className="font-display text-2xl md:text-3xl text-primary">{block.title}</h3>
                      {block.paragraphs.map((p, j) => (
                        <p key={j} className="text-muted-foreground leading-relaxed">{p}</p>
                      ))}
                    </div>
                  </div>
                ) : (
                  /* Full-width text block (no photo) */
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

      {/* ══════════════════════════════════════════════════════════════════════
          FUERA DEL CONSULTORIO
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="py-20 px-4 section-blush">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <SectionTitle title="Fuera del consultorio" />
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-center text-muted-foreground text-lg leading-relaxed mb-12 max-w-2xl mx-auto"
          >
            Fuera del consultorio disfruto pintar, tejer y conectar con la naturaleza. Me encanta recorrer Costa Rica, descubrir nuevos lugares, escuchar el mar, caminar por el bosque, la montaña y practicar ejercicio, especialmente Pilates. Estas actividades me permiten expresar mi creatividad y encontrar el equilibrio personal que considero fundamental para el bienestar integral.
          </motion.p>

          {/* Hobby icons — 2×2 on mobile, 4 columns on desktop */}
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

          {/* Panoramic photo placeholder */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <PhotoPlaceholder className="w-full h-48 md:h-64" />
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          LLAMADO A LA ACCIÓN
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="py-20 px-4 bg-primary">
        <div className="container mx-auto max-w-2xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-3xl md:text-4xl text-primary-foreground mb-8 leading-tight">
              ¿Lista para comenzar tu cuidado con una especialista que te acompaña en cada etapa?
            </h2>
            <Button
              onClick={handleBookClick}
              className="btn-gradient rounded-full text-base px-8 py-3 h-auto"
            >
              {language === 'es' ? 'Agendar cita' : 'Book Appointment'}
            </Button>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

// ─── Page Wrapper (with LanguageProvider) ─────────────────────────────────────
const AboutMe = () => (
  <LanguageProvider>
    <AboutMeContent />
  </LanguageProvider>
);

export default AboutMe;
