
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  Home,
  CreditCard,
  Settings,
  Target,
  Calendar,
  MessageSquare,
  Users,
  Receipt,
  BarChart3,
  Bell,
  HelpCircle,
  Crown,
  FileUp
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Transações', href: '/transacoes', icon: Receipt },
  { name: 'Importar Extrato', href: '/importar-extrato', icon: FileUp },
  { name: 'Cartões de Crédito', href: '/cartoes', icon: CreditCard },
  { name: 'Metas', href: '/metas', icon: Target },
  { name: 'Calendário', href: '/calendario', icon: Calendar },
  { name: 'Avisos de Contas', href: '/avisos-contas', icon: Bell },
  { name: 'WhatsApp', href: '/whatsapp', icon: MessageSquare },
  { name: 'Grupos WhatsApp', href: '/grupos-whatsapp', icon: Users },
  { name: 'Categorias', href: '/categorias', icon: BarChart3 },
  { name: 'Assinatura', href: '/assinatura', icon: Crown },
  { name: 'Configurações', href: '/configuracoes', icon: Settings },
];

const Sidebar = () => {
  const location = useLocation();

  return (
    <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
      <div className="flex-1 flex flex-col min-h-0 bg-gray-800">
        <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
          <div className="flex items-center flex-shrink-0 px-4">
            <img 
              src="/lovable-uploads/7149adf3-440a-491e-83c2-d964a3348cc9.png" 
              alt="Finance Home Logo" 
              className="h-8 w-8"
            />
            <span className="ml-2 text-xl font-bold text-white">Finance Home</span>
          </div>
          <nav className="mt-5 flex-1 px-2 space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    'group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors',
                    isActive
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  )}
                >
                  <Icon className="mr-3 h-5 w-5 flex-shrink-0" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
