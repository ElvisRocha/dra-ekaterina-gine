import { useLanguage } from '@/contexts/LanguageContext';
import { Instagram, Facebook, Phone, Mail, MapPin, Clock } from 'lucide-react';
import TikTokIcon from '@/components/icons/TikTokIcon';
import logo from '@/assets/logo.png';

const Footer = () => {
  const { t, language } = useLanguage();

  return (
    <footer className="border-t border-gray-200 bg-chocolate text-cream py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Logo & About */}
          <div className="lg:col-span-2">
            <img src={logo} alt="Clínica Esperanza" className="h-20 w-auto mb-4 brightness-0 invert opacity-90" />
            <p className="text-cream/70 text-sm max-w-md">
              Dra. Ekaterina Malaspina Riazanova — Ginecología y Obstetricia con calidez, profesionalismo y tecnología de punta.
            </p>
            <div className="flex items-center gap-4 mt-4">
              <a
                href="https://www.instagram.com/dra_ekaterina_gine"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-coral-light hover:text-coral transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://www.facebook.com/dra.ekaterina.malaspina.riazanova"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-coral-light hover:text-coral transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://www.tiktok.com/@dra.ekaterina.gine"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-coral-light hover:text-coral transition-colors"
                aria-label="TikTok"
              >
                <TikTokIcon className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-display text-xl text-cream mb-4">{t('footer.contact')}</h3>
            <ul className="space-y-3 text-cream/70 text-sm">
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-coral-light" />
                <span>+506 8709-4181</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-coral-light" />
                <span>ekamalaspina@hotmail.com</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-coral-light mt-0.5" />
                <span>Av. 41, Provincia de Alajuela, Cd Quesada, Barrio San Roque, 21001</span>
              </li>
            </ul>
          </div>

          {/* Hours */}
          <div>
            <h3 className="font-display text-xl text-cream mb-4">{t('footer.hours')}</h3>
            <ul className="space-y-3 text-cream/70 text-sm">
              <li className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-coral-light mt-0.5" />
                <div>
                  <p>{language === 'es' ? 'Lunes y Miércoles' : 'Mon & Wed'}</p>
                  <p>8:00 AM - 5:00 PM</p>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-coral-light mt-0.5" />
                <div>
                  <p>{language === 'es' ? 'Martes y Jueves' : 'Tue & Thu'}</p>
                  <p>12:00 PM - 5:00 PM</p>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-coral-light mt-0.5" />
                <div>
                  <p>{language === 'es' ? 'Viernes' : 'Friday'}</p>
                  <p>8:00 AM - 2:00 PM</p>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-coral-light mt-0.5" />
                <div>
                  <p>{language === 'es' ? 'Sábado' : 'Saturday'}</p>
                  <p>10:00 AM - 3:00 PM</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar — uses box-shadow instead of border to avoid sub-pixel rendering artifacts */}
        <div className="pt-8 flex flex-col md:flex-row md:justify-between md:items-center gap-2" style={{ boxShadow: 'inset 0 1px 0 0 rgba(255,255,255,0.1)' }}>
          <p className="text-center md:text-left text-cream/50 text-sm">
            © {new Date().getFullYear()} Dra. Ekaterina Malaspina Riazanova — Clínica Esperanza. {t('footer.rights')}.
          </p>
          <p className="text-center md:text-right text-cream/50 text-sm">
            {t('footer.madeBy')}{' '}
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-heart inline-block h-3 w-3 align-middle animate-pulse"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path></svg>{' '}
            {t('footer.madeByBy')}{' '}
            <a
              href="https://www.smartflow-automations.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-cream/50 hover:text-cream/80 hover:underline transition-colors"
            >
              SmartFlow Automations
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
