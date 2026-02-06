import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import logo from '@/assets/logo.png';

const BookingNavbar = () => {
  const { language, setLanguage, t } = useLanguage();

  return (
    <nav className="border-b border-border bg-background/95 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Back Link + Logo */}
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm font-medium">{t('booking.backHome')}</span>
            </Link>
            <div className="h-6 w-px bg-border hidden sm:block" />
            <Link to="/" className="hidden sm:flex items-center">
              <img src={logo} alt="Clínica Esperanza" className="h-10 w-auto" />
            </Link>
          </div>

          {/* Language Toggle */}
          <div className="flex items-center rounded-full bg-secondary p-1">
            <button
              onClick={() => setLanguage('es')}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                language === 'es'
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground/50 hover:text-muted-foreground'
              }`}
            >
              ES
            </button>
            <button
              onClick={() => setLanguage('en')}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                language === 'en'
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground/50 hover:text-muted-foreground'
              }`}
            >
              EN
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default BookingNavbar;
