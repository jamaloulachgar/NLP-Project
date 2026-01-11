import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Facebook, Twitter, Linkedin, Youtube } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { t } from '@/lib/i18n';

export function Footer() {
  const { lang, dir } = useLanguage();

  const quickLinks = [
    { href: '/', label: t('nav.home', lang) },
    { href: '/about', label: t('nav.about', lang) },
    { href: '/programs', label: t('nav.programs', lang) },
    { href: '/research', label: t('nav.research', lang) },
  ];

  const resourceLinks = [
    { href: '/student-life', label: t('nav.studentLife', lang) },
    { href: '/contact', label: t('nav.contact', lang) },
    { href: '#', label: t('service.library', lang) },
    { href: '#', label: t('service.calendar', lang) },
  ];

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
    { icon: Youtube, href: '#', label: 'YouTube' },
  ];

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand & Contact */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img
                src="/logo_um5.png"
                alt="UM5"
                className="h-12 w-auto brightness-0 invert"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              <img
                src="/logo_fsr.png"
                alt="FSR"
                className="h-12 w-auto brightness-0 invert"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
            <div className="space-y-3 text-primary-foreground/80 text-sm">
              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 mt-1 shrink-0" />
                <span>{t('footer.address', lang)}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 shrink-0" />
                <span dir="ltr">{t('footer.phone', lang)}</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 shrink-0" />
                <span>{t('footer.email', lang)}</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">{t('footer.quickLinks', lang)}</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold mb-4">{t('footer.resources', lang)}</h3>
            <ul className="space-y-2">
              {resourceLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.href}
                    className="text-sm text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social & Map Placeholder */}
          <div>
            <h3 className="font-semibold mb-4">{t('footer.followUs', lang)}</h3>
            <div className="flex gap-3 mb-6">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="w-10 h-10 rounded-full bg-primary-foreground/10 hover:bg-primary-foreground/20 flex items-center justify-center transition-colors"
                >
                  <social.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
            {/* Map Placeholder */}
            <div className="w-full h-24 rounded-lg bg-primary-foreground/10 flex items-center justify-center text-xs text-primary-foreground/50">
              <MapPin className="h-6 w-6 opacity-50" />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-primary-foreground/10">
        <div className="container mx-auto px-4 py-4 flex flex-col sm:flex-row justify-between items-center gap-2 text-sm text-primary-foreground/60">
          <p>{t('footer.rights', lang)}</p>
          <p className="flex items-center gap-1.5">
            <span className="inline-block w-2 h-2 rounded-full bg-accent animate-pulse" />
            {t('footer.demo', lang)}
          </p>
        </div>
      </div>
    </footer>
  );
}
