
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import { 
  Home, 
  ListFilter, 
  Receipt, 
  Target, 
  Calendar, 
  CreditCard,
  MessageSquareText,
  Users,
  Menu,
  X,
  Settings,
  Crown
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const getNavLinkClass = (isActive: boolean) => {
  return cn(
    "group flex items-center rounded-md px-3 py-2 text-sm font-medium transition-all duration-200 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-blue-700 hover:scale-105 hover:shadow-sm",
    isActive ? "bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 shadow-sm" : "text-muted-foreground"
  );
};

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const isMobile = useIsMobile();
  const location = useLocation();

  return (
    <aside className={cn(
      "flex h-full w-64 flex-col border-r bg-background shadow-sm",
      isMobile ? 'fixed left-0 top-0 z-50 w-full transition-all duration-300' : 'relative'
    )}>
      <div className="flex items-center justify-between px-4 py-2">
        <Link to="/" className="flex items-center space-x-2 font-semibold text-blue-700 hover:text-blue-800 transition-colors">
          <span className="text-lg">Finance Home</span>
        </Link>
        {isMobile && (
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        )}
      </div>
      
      <div className="scrollbar-thin h-full space-y-4 py-4 overflow-y-auto">
        <div className="px-3 py-2">
          <div className="space-y-1">
            <NavLink 
              to="/" 
              className={({ isActive }) => getNavLinkClass(isActive)}
              onClick={isMobile ? onClose : undefined}
            >
              <Home className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
              <span>Dashboard</span>
            </NavLink>
            <NavLink 
              to="/assinatura" 
              className={({ isActive }) => getNavLinkClass(isActive)}
              onClick={isMobile ? onClose : undefined}
            >
              <Crown className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
              <span>Assinatura</span>
            </NavLink>
            <NavLink 
              to="/transacoes" 
              className={({ isActive }) => getNavLinkClass(isActive)}
              onClick={isMobile ? onClose : undefined}
            >
              <Receipt className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
              <span>Transações</span>
            </NavLink>
            <NavLink 
              to="/cartoes" 
              className={({ isActive }) => getNavLinkClass(isActive)}
              onClick={isMobile ? onClose : undefined}
            >
              <CreditCard className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
              <span>Cartões de Crédito</span>
            </NavLink>
            <NavLink 
              to="/categorias" 
              className={({ isActive }) => getNavLinkClass(isActive)}
              onClick={isMobile ? onClose : undefined}
            >
              <ListFilter className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
              <span>Categorias</span>
            </NavLink>
            <NavLink 
              to="/metas" 
              className={({ isActive }) => getNavLinkClass(isActive)}
              onClick={isMobile ? onClose : undefined}
            >
              <Target className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
              <span>Metas</span>
            </NavLink>
            <NavLink 
              to="/calendario" 
              className={({ isActive }) => getNavLinkClass(isActive)}
              onClick={isMobile ? onClose : undefined}
            >
              <Calendar className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
              <span>Calendário</span>
            </NavLink>
          </div>
        </div>
        
        <div className="px-3 py-2">
          <h2 className="mb-2 px-3 text-sm font-semibold tracking-tight text-gray-600">
            WhatsApp
          </h2>
          <div className="space-y-1">
            <NavLink 
              to="/whatsapp"
              className={({ isActive }) => getNavLinkClass(isActive)}
              onClick={isMobile ? onClose : undefined}
              data-tour="whatsapp-menu"
            >
              <MessageSquareText className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
              <span>Conectar WhatsApp</span>
            </NavLink>
            <NavLink 
              to="/grupos-whatsapp"
              className={({ isActive }) => getNavLinkClass(isActive)}
              onClick={isMobile ? onClose : undefined}
              data-tour="grupos-menu"
            >
              <Users className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
              <span>Grupos</span>
            </NavLink>
          </div>
        </div>
        <div className="px-3 py-2">
          <h2 className="mb-2 px-3 text-sm font-semibold tracking-tight text-gray-600">
            Configurações
          </h2>
          <div className="space-y-1">
            <NavLink 
              to="/configuracoes"
              className={({ isActive }) => getNavLinkClass(isActive)}
              onClick={isMobile ? onClose : undefined}
            >
              <Settings className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
              <span>Configurações</span>
            </NavLink>
          </div>
        </div>
      </div>
    </aside>
  );
}
