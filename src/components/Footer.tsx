import { useLanguage } from '@/contexts/LanguageContext';
import { Instagram, Phone, Mail, MapPin, Clock } from 'lucide-react';
import logo from '@/assets/logo.png';

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-chocolate text-cream py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Logo & About */}
          <div className="lg:col-span-2">
            <img src={logo} alt="Clínica Esperanza" className="h-20 w-auto mb-4 brightness-0 invert opacity-90" />
            <p className="text-cream/70 text-sm max-w-md">
              Dra. Ekaterina Malaspina Riazanova — Ginecología y Obstetricia con calidez, profesionalismo y tecnología de punta.
            </p>
            <a
              href="https://instagram.com/dra_ekaterina_gine"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-4 text-coral-light hover:text-coral transition-colors"
            >
              <Instagram className="w-5 h-5" />
              <span>@dra_ekaterina_gine</span>
            </a>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-display text-xl text-cream mb-4">{t('footer.contact')}</h3>
            <ul className="space-y-3 text-cream/70 text-sm">
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-coral-light" />
                <span>+506 XXXX-XXXX</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-coral-light" />
                <span>info@clinicaesperanza.cr</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-coral-light mt-0.5" />
                <span>San José, Costa Rica</span>
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
                  <p>Lunes - Viernes</p>
                  <p>8:00 AM - 5:00 PM</p>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-coral-light mt-0.5" />
                <div>
                  <p>Sábados</p>
                  <p>8:00 AM - 12:00 PM</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-cream/10">
          <p className="text-center text-cream/50 text-sm">
            © 2025 Dra. Ekaterina Malaspina Riazanova — Clínica Esperanza. {t('footer.rights')}.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
