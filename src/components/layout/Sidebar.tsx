
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Home, CalendarDays, DollarSign, PieChart } from 'lucide-react';

const navItems = [
  { 
    name: 'Dashboard', 
    path: '/', 
    icon: <Home className="mr-2 h-5 w-5" /> 
  },
  { 
    name: 'Transações', 
    path: '/transacoes', 
    icon: <DollarSign className="mr-2 h-5 w-5" /> 
  },
  { 
    name: 'Categorias', 
    path: '/categorias', 
    icon: <PieChart className="mr-2 h-5 w-5" /> 
  },
  { 
    name: 'Calendário', 
    path: '/calendario', 
    icon: <CalendarDays className="mr-2 h-5 w-5" /> 
  },
];

interface SidebarProps {
  className?: string;
}

const Sidebar = ({ className }: SidebarProps) => {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div
      className={cn(
        "flex flex-col h-screen bg-sidebar border-r border-border transition-all duration-300 ease-in-out",
        collapsed ? "w-[60px]" : "w-[250px]",
        className
      )}
    >
      <div className="flex items-center justify-between p-4">
        {!collapsed && (
          <h1 className="font-bold text-xl text-primary">FinDash</h1>
        )}
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setCollapsed(!collapsed)}
          className="ml-auto"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      <nav className="flex-1 py-4 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className={cn(
              "flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors",
              location.pathname === item.path
                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                : "text-sidebar-foreground hover:bg-sidebar-accent/50",
              collapsed ? "justify-center" : "justify-start"
            )}
          >
            <span className={collapsed ? "mr-0" : "mr-2"}>{item.icon}</span>
            {!collapsed && <span>{item.name}</span>}
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
