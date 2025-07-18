
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import { ModernSidebar, SidebarBody } from '@/components/ui/modern-sidebar';
import { VerticalLimelightNav } from '@/components/ui/limelight-nav';
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
  const location = useLocation();
  const isMobile = useIsMobile();
  
  const {
    isOpen: tourOpen,
    currentStep,
    nextStep,
    skipTour,
    closeTour
  } = useOnboardingTour();

  // No mobile, o sidebar deve estar fechado por padrão
  useEffect(() => {
    if (isMobile) {
      setOpen(false);
    }
  }, [isMobile]);

  const mainLinks = [
    {
      id: "dashboard",
      label: "Dashboard",
      href: "/",
      icon: <Home />,
    },
    {
      id: "transacoes",
      label: "Transações",
      href: "/transacoes",
      icon: <Receipt />,
    },
    {
      id: "cartoes",
      label: "Cartões de Crédito",
      href: "/cartoes",
      icon: <CreditCard />,
    },
    {
      id: "categorias",
      label: "Categorias",
      href: "/categorias",
      icon: <ListFilter />,
    },
    {
      id: "metas",
      label: "Metas",
      href: "/metas",
      icon: <Target />,
    },
    {
      id: "calendario",
      label: "Calendário",
      href: "/calendario",
      icon: <Calendar />,
    },
    {
      id: "assinatura",
      label: "Assinatura",
      href: "/assinatura",
      icon: <Crown />,
    }
  ];

  const whatsappLinks = [
    {
      id: "whatsapp",
      label: "Conectar WhatsApp",
      href: "/whatsapp",
      icon: <MessageSquareText data-tour="whatsapp-menu" />,
    },
    {
      id: "grupos",
      label: "Grupos",
      href: "/grupos-whatsapp",
      icon: <Users data-tour="grupos-menu" />,
    }
  ];

  const configLinks = [
    {
      id: "configuracoes",
      label: "Configurações",
      href: "/configuracoes",
      icon: <Settings />,
    }
  ];

  // Determine active index based on current route
  const getActiveIndex = () => {
    const allLinks = [...mainLinks, ...whatsappLinks, ...configLinks];
    const activeIndex = allLinks.findIndex(link => link.href === location.pathname);
    return activeIndex >= 0 ? activeIndex : 0;
  };

  return (
    <div className="min-h-screen bg-background flex w-full">
      <ModernSidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-start gap-4 h-full">
          <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto h-full">
            {open ? <Logo /> : <LogoIcon />}
            
            <div className="mt-8 flex flex-col gap-6 flex-1 pb-4">
              {/* Main Navigation */}
              <div>
                <VerticalLimelightNav
                  items={mainLinks}
                  defaultActiveIndex={getActiveIndex() < mainLinks.length ? getActiveIndex() : 0}
                  showLabels={open}
                  className="space-y-1"
                  iconContainerClassName={!open ? "justify-center" : ""}
                />
              </div>

              {/* WhatsApp Section */}
              <div className="flex-1">
                {open && (
                  <motion.h2 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mb-3 px-3 text-xs font-semibold tracking-tight text-gray-500 uppercase"
                  >
                    WhatsApp
                  </motion.h2>
                )}
                <VerticalLimelightNav
                  items={whatsappLinks}
                  defaultActiveIndex={getActiveIndex() >= mainLinks.length && getActiveIndex() < mainLinks.length + whatsappLinks.length ? getActiveIndex() - mainLinks.length : -1}
                  showLabels={open}
                  className="space-y-1"
                  iconContainerClassName={!open ? "justify-center" : ""}
                />
              </div>

              {/* Config Section */}
              <div className="mt-auto">
                {open && (
                  <motion.h2 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mb-3 px-3 text-xs font-semibold tracking-tight text-gray-500 uppercase"
                  >
                    Configurações
                  </motion.h2>
                )}
                <VerticalLimelightNav
                  items={configLinks}
                  defaultActiveIndex={getActiveIndex() >= mainLinks.length + whatsappLinks.length ? getActiveIndex() - mainLinks.length - whatsappLinks.length : -1}
                  showLabels={open}
                  className="space-y-1"
                  iconContainerClassName={!open ? "justify-center" : ""}
                />
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
