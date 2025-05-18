
import { useState } from 'react';
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
    return localStorage.getItem('userName') || 'Usuário';
  });

  const handleLogout = () => {
    // Limpar informações de sessão
    localStorage.removeItem('autenticado');
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    
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
