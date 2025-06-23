
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Sidebar,
  SidebarProvider,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarHeader,
  SidebarFooter,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";
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
  Bell
} from 'lucide-react';
import OnboardingTour from '@/components/onboarding/OnboardingTour';
import HelpIcon from '@/components/help/HelpIcon';
import UserProfileButton from '@/components/dashboard/UserProfileButton';
import { useOnboardingTour } from '@/hooks/useOnboardingTour';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface NewModernLayoutProps {
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
      <span className="font-medium whitespace-pre text-blue-700 dark:text-white">
        Finance Home
      </span>
    </Link>
  );
};

export default function NewModernLayout({ children }: NewModernLayoutProps) {
  const location = useLocation();
  
  const {
    isOpen: tourOpen,
    currentStep,
    nextStep,
    skipTour,
    closeTour
  } = useOnboardingTour();

  const mainItems = [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: Home,
    },
    {
      title: "Transações",
      url: "/transacoes",
      icon: Receipt,
    },
    {
      title: "Cartões de Crédito",
      url: "/cartoes",
      icon: CreditCard,
    },
    {
      title: "Categorias",
      url: "/categorias",
      icon: ListFilter,
    },
    {
      title: "Metas",
      url: "/metas",
      icon: Target,
    },
    {
      title: "Calendário",
      url: "/calendario",
      icon: Calendar,
    },
    {
      title: "Avisos de Contas",
      url: "/avisos-contas",
      icon: Bell,
    },
    {
      title: "Assinatura",
      url: "/assinatura",
      icon: Crown,
    }
  ];

  const whatsappItems = [
    {
      title: "Conectar WhatsApp",
      url: "/whatsapp",
      icon: MessageSquareText,
    },
    {
      title: "Grupos",
      url: "/grupos-whatsapp",
      icon: Users,
    }
  ];

  const configItems = [
    {
      title: "Configurações",
      url: "/configuracoes",
      icon: Settings,
    }
  ];

  return (
    <div className="min-h-screen bg-background flex w-full">
      <SidebarProvider defaultOpen={false}>
        <Sidebar>
          <SidebarHeader>
            <Logo />
          </SidebarHeader>
          
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Principal</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {mainItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton 
                        asChild 
                        tooltip={item.title}
                        isActive={location.pathname === item.url}
                      >
                        <Link to={item.url}>
                          <item.icon />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel>WhatsApp</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {whatsappItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton 
                        asChild 
                        tooltip={item.title}
                        isActive={location.pathname === item.url}
                      >
                        <Link to={item.url}>
                          <item.icon />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter>
            <SidebarGroup>
              <SidebarMenu>
                {configItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                      asChild 
                      tooltip={item.title}
                      isActive={location.pathname === item.url}
                    >
                      <Link to={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroup>
          </SidebarFooter>
        </Sidebar>

        <SidebarInset className="flex-1">
          <div className="sticky top-0 z-50 flex h-16 shrink-0 items-center gap-2 border-b px-4 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
            <div className="flex items-center gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <SidebarTrigger className="-ml-1 hover:bg-blue-50 rounded-lg p-2" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Abrir/Fechar Menu</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <span className="text-sm font-medium text-gray-600">Menu</span>
            </div>
            
            <div className="ml-auto">
              <UserProfileButton />
            </div>
          </div>
          <main className="flex-1 overflow-y-auto">
            <div className="container mx-auto px-4 py-6">
              {children}
            </div>
          </main>
        </SidebarInset>
      </SidebarProvider>

      <HelpIcon />

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
