import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Instagram, Facebook } from 'lucide-react';
import TikTokIcon from '@/components/icons/TikTokIcon';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import logo from '@/assets/logo.png';

interface NavLink {
  to?: string;
  sectionId?: string;
  labelEs: string;
  labelEn: string;
}

interface NavbarProps {
  onBookClick: () => void;
}

const Navbar = ({ onBookClick }: NavbarProps) => {
  const { language, setLanguage, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const navLinks: NavLink[] = [
    { to: '/', labelEs: 'Inicio', labelEn: 'Home' },
    { sectionId: 'servicios', labelEs: 'Servicios', labelEn: 'Services' },
    { to: '/galeria', labelEs: 'Galería', labelEn: 'Gallery' },
    { to: '/contacto', labelEs: 'Contacto', labelEn: 'Contact' },
  ];

  const isActive = (path: string) => location.pathname === path;

  const scrollToSection = (sectionId: string) => {
    if (location.pathname === '/') {
      const element = document.getElementById(sectionId);
      if (element) {
        const headerOffset = 80;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
      }
    } else {
      navigate('/', { state: { scrollTo: sectionId } });
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <img src={logo} alt="Clínica Esperanza" className="h-14 w-auto" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {/* Nav Links */}
            <div className="flex items-center gap-1">
              {navLinks.map((link) =>
                link.to ? (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      isActive(link.to)
                        ? 'text-primary'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {language === 'es' ? link.labelEs : link.labelEn}
                  </Link>
                ) : (
                  <button
                    key={link.sectionId}
                    onClick={() => scrollToSection(link.sectionId!)}
                    className="px-4 py-2 rounded-full text-sm font-medium transition-all text-muted-foreground hover:text-foreground"
                  >
                    {language === 'es' ? link.labelEs : link.labelEn}
                  </button>
                )
              )}
            </div>

            {/* Divider */}
            <div className="h-6 w-px bg-border" />

            {/* Language Toggle */}
            <div className="flex items-center rounded-full bg-secondary p-1">
              <button
                onClick={() => setLanguage('es')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  language === 'es'
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground/50 hover:text-muted-foreground'
                }`}
              >
                ES
              </button>
              <button
                onClick={() => setLanguage('en')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  language === 'en'
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground/50 hover:text-muted-foreground'
                }`}
              >
                EN
              </button>
            </div>

            {/* Social Media */}
            <div className="flex items-center gap-3">
              <a
                href="https://www.instagram.com/dra_ekaterina_gine"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://www.facebook.com/dra.ekaterina.malaspina.riazanova"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://www.tiktok.com/@dra.ekaterina.gine"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="TikTok"
              >
                <TikTokIcon className="w-5 h-5" />
              </a>
            </div>

            {/* Divider */}
            <div className="h-6 w-px bg-border" />

            {/* CTA Button */}
            <Button
              onClick={onBookClick}
              className="btn-gradient rounded-full"
            >
              <span>{t('nav.book')}</span>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-foreground"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-background border-t border-border"
          >
            <div className="container mx-auto px-4 py-6 space-y-4">
              {/* Nav Links */}
              <div className="flex flex-col space-y-2">
                {navLinks.map((link) =>
                  link.to ? (
                    <Link
                      key={link.to}
                      to={link.to}
                      onClick={() => setIsOpen(false)}
                      className={`px-4 py-3 rounded-lg text-center font-medium transition-all ${
                        isActive(link.to)
                          ? 'bg-primary/10 text-primary'
                          : 'text-muted-foreground hover:bg-secondary'
                      }`}
                    >
                      {language === 'es' ? link.labelEs : link.labelEn}
                    </Link>
                  ) : (
                    <button
                      key={link.sectionId}
                      onClick={() => {
                        scrollToSection(link.sectionId!);
                        setIsOpen(false);
                      }}
                      className="px-4 py-3 rounded-lg text-center font-medium transition-all text-muted-foreground hover:bg-secondary"
                    >
                      {language === 'es' ? link.labelEs : link.labelEn}
                    </button>
                  )
                )}
              </div>

              <div className="border-t border-border pt-4" />

              {/* Language Toggle */}
              <div className="flex items-center justify-center gap-2 rounded-full bg-secondary p-1">
                <button
                  onClick={() => setLanguage('es')}
                  className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                    language === 'es'
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground/50 hover:text-muted-foreground'
                  }`}
                >
                  ES
                </button>
                <button
                  onClick={() => setLanguage('en')}
                  className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                    language === 'en'
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground/50 hover:text-muted-foreground'
                  }`}
                >
                  EN
                </button>
              </div>

              {/* Social Media */}
              <div className="flex items-center justify-center gap-4 py-2">
                <a
                  href="https://www.instagram.com/dra_ekaterina_gine"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram className="w-5 h-5" />
                </a>
                <a
                  href="https://www.facebook.com/dra.ekaterina.malaspina.riazanova"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook className="w-5 h-5" />
                </a>
                <a
                  href="https://www.tiktok.com/@dra.ekaterina.gine"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                  aria-label="TikTok"
                >
                  <TikTokIcon className="w-5 h-5" />
                </a>
              </div>

              {/* CTA Button */}
              <Button
                onClick={() => {
                  onBookClick();
                  setIsOpen(false);
                }}
                className="w-full btn-gradient rounded-full"
              >
                <span>{t('nav.book')}</span>
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
