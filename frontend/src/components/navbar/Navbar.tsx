import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, MessageSquare, Globe, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useLanguage } from '@/contexts/LanguageContext';
import { t, languages, Language } from '@/lib/i18n';
import { cn } from '@/lib/utils';

interface NavbarProps {
  onOpenChatbot: () => void;
}

export function Navbar({ onOpenChatbot }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { lang, setLang, dir } = useLanguage();
  const location = useLocation();

  const navLinks = [
    { href: '/', label: t('nav.home', lang) },
    { href: '/about', label: t('nav.about', lang) },
    { href: '/programs', label: t('nav.programs', lang) },
    { href: '/research', label: t('nav.research', lang) },
    { href: '/student-life', label: t('nav.studentLife', lang) },
    { href: '/contact', label: t('nav.contact', lang) },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full glass shadow-navbar">
      <div className="container mx-auto px-4">
        <div className="flex h-16 md:h-20 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 shrink-0">
            <img
              src="/logo_um5.png"
              alt="UM5"
              className="h-10 md:h-12 w-auto"
              onError={(e) => {
                e.currentTarget.src = '/placeholder.svg';
              }}
            />
            <img
              src="/logo_fsr.png"
              alt="FSR"
              className="h-10 md:h-12 w-auto"
              onError={(e) => {
                e.currentTarget.src = '/placeholder.svg';
              }}
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={cn(
                  'px-4 py-2 rounded-lg text-sm font-medium transition-colors relative',
                  isActive(link.href)
                    ? 'text-primary bg-secondary'
                    : 'text-foreground/80 hover:text-primary hover:bg-secondary/50'
                )}
              >
                {link.label}
                {isActive(link.href) && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-accent rounded-full" />
                )}
              </Link>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2 md:gap-3">
            {/* Language Switcher */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-1.5">
                  <Globe className="h-4 w-4" />
                  <span className="hidden sm:inline">{languages[lang].nativeName}</span>
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align={dir === 'rtl' ? 'start' : 'end'}>
                {(Object.keys(languages) as Language[]).map((langKey) => (
                  <DropdownMenuItem
                    key={langKey}
                    onClick={() => setLang(langKey)}
                    className={cn(
                      'cursor-pointer',
                      lang === langKey && 'bg-secondary'
                    )}
                  >
                    {languages[langKey].nativeName}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Chatbot Button */}
            <Button
              onClick={onOpenChatbot}
              size="sm"
              className="hidden sm:flex gap-2"
            >
              <MessageSquare className="h-4 w-4" />
              {t('nav.chatbot', lang)}
            </Button>

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <nav className="lg:hidden pb-4 animate-fade-in">
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    'px-4 py-3 rounded-lg text-sm font-medium transition-colors',
                    isActive(link.href)
                      ? 'text-primary bg-secondary'
                      : 'text-foreground/80 hover:text-primary hover:bg-secondary/50'
                  )}
                >
                  {link.label}
                </Link>
              ))}
              <Button
                onClick={() => {
                  setIsOpen(false);
                  onOpenChatbot();
                }}
                className="mt-2 w-full gap-2"
              >
                <MessageSquare className="h-4 w-4" />
                {t('nav.chatbot', lang)}
              </Button>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
