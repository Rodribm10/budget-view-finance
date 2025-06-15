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
import { supabase } from '@/integrations/supabase/client';

const Header = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [userName, setUserName] = useState('Usuário');

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserName(session?.user?.email || 'Usuário');
    });
    
    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      console.error('Error logging out:', error);
      toast({
        title: "Erro no logout",
        description: "Não foi possível desconectar. Tente novamente.",
        variant: 'destructive'
      });
    } else {
      toast({
        title: "Logout realizado",
        description: "Você foi desconectado com sucesso"
      });
      navigate('/auth', { replace: true });
    }
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
