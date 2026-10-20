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
  useSidebar,
} from "@/components/ui/sidebar";
import {
  LayoutGrid,
  ArrowLeftRight,
  CreditCard,
  Tags,
  Target,
  CalendarDays,
  Crown,
  Users,
  Settings,
  BellRing,
  FileUp,
  Menu,
  type LucideIcon,
} from 'lucide-react';
import OnboardingTour from '@/components/onboarding/OnboardingTour';
import HelpIcon from '@/components/help/HelpIcon';
import UserProfileButton from '@/components/dashboard/UserProfileButton';
import { useOnboardingTour } from '@/hooks/useOnboardingTour';
import { cn } from '@/lib/utils';

interface NewModernLayoutProps {
  children: React.ReactNode;
}

type Item = { title: string; url: string; icon: LucideIcon; tour?: string };

const PRINCIPAL: Item[] = [
  { title: "Visão geral", url: "/dashboard", icon: LayoutGrid },
  { title: "Transações", url: "/transacoes", icon: ArrowLeftRight },
  { title: "Cartões", url: "/cartoes", icon: CreditCard },
  { title: "Metas", url: "/metas", icon: Target },
  { title: "Calendário", url: "/calendario", icon: CalendarDays },
  { title: "Contas a pagar", url: "/avisos-contas", icon: BellRing },
];

const ORGANIZAR: Item[] = [
  { title: "Categorias", url: "/categorias", icon: Tags },
  { title: "Importar extrato", url: "/importar-extrato", icon: FileUp },
  { title: "Grupos do WhatsApp", url: "/grupos-whatsapp", icon: Users, tour: 'grupos-menu' },
];

const CONTA: Item[] = [
  { title: "Assinatura", url: "/assinatura", icon: Crown },
  { title: "Configurações", url: "/configuracoes", icon: Settings },
];

// Barra de baixo no celular: as 4 telas de todo dia + o menu completo.
const ABAS: Item[] = [PRINCIPAL[0], PRINCIPAL[1], PRINCIPAL[2], PRINCIPAL[3]];

const Marca = () => (
  <Link to="/dashboard" className="flex items-center gap-2.5 px-2 py-1.5">
    <img
      src="/lovable-uploads/7149adf3-440a-491e-83c2-d964a3348cc9.png"
      alt=""
      className="h-7 w-7 shrink-0 rounded-md"
    />
    <span className="whitespace-nowrap text-[15px] font-semibold tracking-tight text-foreground group-data-[collapsible=icon]:hidden">
      Finance Home
    </span>
  </Link>
);

const Grupo = ({ titulo, itens }: { titulo?: string; itens: Item[] }) => {
  const { pathname } = useLocation();
  const { isMobile, setOpenMobile } = useSidebar();
  return (
    <SidebarGroup>
      {titulo && <SidebarGroupLabel className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground/80">{titulo}</SidebarGroupLabel>}
      <SidebarGroupContent>
        <SidebarMenu>
          {itens.map((item) => (
            <SidebarMenuItem key={item.url}>
              <SidebarMenuButton
                asChild
                tooltip={item.title}
                isActive={pathname === item.url}
                className="h-9 font-medium text-sidebar-foreground data-[active=true]:bg-accent data-[active=true]:text-accent-foreground"
              >
                <Link to={item.url} data-tour={item.tour} onClick={() => isMobile && setOpenMobile(false)}>
                  <item.icon className="h-[18px] w-[18px]" />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};

const AppSidebar = () => (
  <Sidebar collapsible="icon" className="border-r border-sidebar-border">
    <SidebarHeader className="pt-4">
      <Marca />
    </SidebarHeader>
    <SidebarContent>
      <Grupo itens={PRINCIPAL} />
      <Grupo titulo="Organizar" itens={ORGANIZAR} />
    </SidebarContent>
    <SidebarFooter className="pb-4">
      <Grupo itens={CONTA} />
    </SidebarFooter>
  </Sidebar>
);

const Topo = () => (
  <header className="sticky top-0 z-40 flex h-14 shrink-0 items-center gap-2 border-b bg-background/90 px-4 backdrop-blur-sm md:px-6">
    <SidebarTrigger className="-ml-1 hidden text-muted-foreground md:inline-flex" />
    <div className="md:hidden">
      <Marca />
    </div>
    <div className="ml-auto">
      <UserProfileButton />
    </div>
  </header>
);

const AbasCelular = () => {
  const { pathname } = useLocation();
  const { toggleSidebar } = useSidebar();
  const classe = (ativo: boolean) =>
    cn(
      "flex min-h-[52px] flex-1 flex-col items-center justify-center gap-1 text-[11px] font-medium transition-colors",
      ativo ? "text-primary" : "text-muted-foreground",
    );
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 flex border-t bg-card pb-[env(safe-area-inset-bottom)] md:hidden">
      {ABAS.map((item) => (
        <Link key={item.url} to={item.url} className={classe(pathname === item.url)}>
          <item.icon className="h-5 w-5" />
          {item.title}
        </Link>
      ))}
      <button type="button" onClick={toggleSidebar} className={classe(false)}>
        <Menu className="h-5 w-5" />
        Mais
      </button>
    </nav>
  );
};

export default function NewModernLayout({ children }: NewModernLayoutProps) {
  const {
    isOpen: tourOpen,
    currentStep,
    nextStep,
    skipTour,
    closeTour
  } = useOnboardingTour();

  return (
    <div className="flex min-h-screen w-full bg-background">
      <SidebarProvider defaultOpen>
        <AppSidebar />
        <SidebarInset className="min-w-0 flex-1 bg-background">
          <Topo />
          <main className="flex-1 pb-24 md:pb-10">
            <div className="mx-auto w-full max-w-6xl px-4 py-5 md:px-8 md:py-8">
              {children}
            </div>
          </main>
        </SidebarInset>
        <AbasCelular />
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
