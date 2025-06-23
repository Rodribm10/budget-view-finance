
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import { ModernSidebar, SidebarBody, SidebarLink } from '@/components/ui/modern-sidebar';
import OnboardingTour from '@/components/onboarding/OnboardingTour';
import HelpIcon from '@/components/help/HelpIcon';
import { useOnboardingTour } from '@/hooks/useOnboardingTour';
import { 
  Home, 
  Receipt, 
  CreditCard,
  ListFilter,
  Target,
  Calendar,
  Crown,
  MessageSquareText,
  Users,
  Settings
} from 'lucide-react';
import { motion } from 'framer-motion';

interface ModernLayoutProps {
  children: React.ReactNode;
}

const Logo = () => {
  return (
    <Link
      to="/"
      className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black"
    >
      <img 
        src="/lovable-uploads/7149adf3-440a-491e-83c2-d964a3348cc9.png" 
        alt="Finance Home Logo" 
        className="h-8 w-8 shrink-0"
      />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-medium whitespace-pre text-blue-700 dark:text-white"
      >
        Finance Home
      </motion.span>
    </Link>
  );
};

const LogoIcon = () => {
  return (
    <Link
      to="/"
      className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black"
    >
      <img 
        src="/lovable-uploads/7149adf3-440a-491e-83c2-d964a3348cc9.png" 
        alt="Finance Home Logo" 
        className="h-8 w-8 shrink-0"
      />
    </Link>
  );
};

export default function ModernLayout({ children }: ModernLayoutProps) {
  const [open, setOpen] = useState(false);
  const isMobile = useIsMobile();
  
  const {
    isOpen: tourOpen,
    currentStep,
    nextStep,
    skipTour,
    closeTour
  } = useOnboardingTour();

  const links = [
    {
      label: "Dashboard",
      href: "/",
      icon: <Home className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />,
    },
    {
      label: "Transações",
      href: "/transacoes",
      icon: <Receipt className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />,
    },
    {
      label: "Cartões de Crédito",
      href: "/cartoes",
      icon: <CreditCard className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />,
    },
    {
      label: "Categorias",
      href: "/categorias",
      icon: <ListFilter className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />,
    },
    {
      label: "Metas",
      href: "/metas",
      icon: <Target className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />,
    },
    {
      label: "Calendário",
      href: "/calendario",
      icon: <Calendar className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />,
    },
    {
      label: "Assinatura",
      href: "/assinatura",
      icon: <Crown className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />,
    }
  ];

  const whatsappLinks = [
    {
      label: "Conectar WhatsApp",
      href: "/whatsapp",
      icon: <MessageSquareText className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" data-tour="whatsapp-menu" />,
    },
    {
      label: "Grupos",
      href: "/grupos-whatsapp",
      icon: <Users className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" data-tour="grupos-menu" />,
    }
  ];

  const configLinks = [
    {
      label: "Configurações",
      href: "/configuracoes",
      icon: <Settings className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />,
    }
  ];

  return (
    <div className="min-h-screen bg-background flex w-full">
      <ModernSidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-start gap-4 h-full">
          <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto h-full">
            {open ? <Logo /> : <LogoIcon />}
            
            <div className="mt-8 flex flex-col gap-2">
              {links.map((link, idx) => (
                <SidebarLink key={idx} link={link} />
              ))}
            </div>

            <div className="mt-8">
              {open && (
                <motion.h2 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mb-2 px-2 text-sm font-semibold tracking-tight text-gray-600"
                >
                  WhatsApp
                </motion.h2>
              )}
              <div className="flex flex-col gap-2">
                {whatsappLinks.map((link, idx) => (
                  <SidebarLink key={`whatsapp-${idx}`} link={link} />
                ))}
              </div>
            </div>

            <div className="mt-auto">
              {open && (
                <motion.h2 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mb-2 px-2 text-sm font-semibold tracking-tight text-gray-600"
                >
                  Configurações
                </motion.h2>
              )}
              <div className="flex flex-col gap-2 pb-4">
                {configLinks.map((link, idx) => (
                  <SidebarLink key={`config-${idx}`} link={link} />
                ))}
              </div>
            </div>
          </div>
        </SidebarBody>
      </ModernSidebar>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto">
          <div className="container mx-auto px-4 py-6">
            {children}
          </div>
        </main>
      </div>

      {/* Help Icon */}
      <HelpIcon />

      {/* Tour de Onboarding */}
      <OnboardingTour
        isOpen={tourOpen}
        currentStep={currentStep}
        onNext={nextStep}
        onSkip={skipTour}
        onClose={closeTour}
      />
    </div>
  );
}
