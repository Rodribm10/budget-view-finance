
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { LogOut, User } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [userName, setUserName] = useState(() => {
    // Obter o nome do usuário do localStorage ou usar seu email como fallback
    return localStorage.getItem('userName') || localStorage.getItem('userEmail') || 'Usuário';
  });

  // Atualize o nome se mudar no localStorage
  useEffect(() => {
    const handleStorageChange = () => {
      setUserName(localStorage.getItem('userName') || localStorage.getItem('userEmail') || 'Usuário');
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const handleLogout = () => {
    // Limpar informações de sessão
    localStorage.removeItem('autenticado');
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    
    toast({
      title: "Logout realizado",
      description: "Você foi desconectado com sucesso"
    });
    
    // Redirecionar para a página de login
    navigate('/auth');
  };

  return (
    <div className="flex justify-end items-center p-4 border-b">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="flex items-center gap-2">
            <User size={18} />
            <span>{userName}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Minha conta</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout} className="text-red-500 cursor-pointer">
            <LogOut className="mr-2 h-4 w-4" />
            <span>Sair</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default Header;
