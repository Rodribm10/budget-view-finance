
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
  Settings,
  LogOut,
  User
} from 'lucide-react';
import { motion } from 'framer-motion';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

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
  const { toast } = useToast();
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState<string>('');
  
  const {
    isOpen: tourOpen,
    currentStep,
    nextStep,
    skipTour,
    closeTour
  } = useOnboardingTour();

  useEffect(() => {
    // Buscar dados do usuário logado
    const getUserData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.email) {
        setUserEmail(user.email);
      }
    };
    
    getUserData();
  }, []);

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      // Limpar localStorage
      localStorage.removeItem('userEmail');
      
      toast({
        title: "Logout realizado",
        description: "Você foi desconectado com sucesso"
      });
      
      navigate('/auth');
    } catch (error) {
      console.error('Erro no logout:', error);
      toast({
        title: "Erro no logout",
        description: "Ocorreu um erro ao sair da conta",
        variant: "destructive"
      });
    }
  };

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
                />
                
                {/* User Profile */}
                <div className="mt-4 px-3">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button className="w-full rounded-full py-0 ps-0 h-10 justify-start" variant="outline">
                        <div className="me-2 flex aspect-square h-full p-1.5">
                          <div className="h-full w-full rounded-full bg-blue-600 flex items-center justify-center">
                            <User className="h-4 w-4 text-white" />
                          </div>
                        </div>
                        {open && (
                          <span className="text-sm truncate">
                            {userEmail || 'Usuário'}
                          </span>
                        )}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuItem 
                        onClick={handleLogout}
                        className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <LogOut className="h-4 w-4" />
                        Sair
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
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
