
import { ReactNode, useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const location = useLocation();

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        setIsLoading(true);
        
        // Check if we have stored authentication status
        const storedAuth = localStorage.getItem('autenticado') === 'true';
        const userId = localStorage.getItem('userId');
        
        if (storedAuth && userId) {
          console.log('Usando autenticação armazenada: autenticado');
          setIsAuthenticated(true);
        } else {
          console.log('Nenhuma sessão encontrada, redirecionando para login');
          setIsAuthenticated(false);
          
          // Toast message is moved here inside useEffect, not during render
          toast({
            title: "Autenticação necessária",
            description: "Por favor, faça login para acessar esta página"
          });
        }
      } catch (error) {
        console.error('Erro ao verificar autenticação:', error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuthentication();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);  // Remove toast from dependencies to prevent re-renders

  // Mostrar estado de carregamento
  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Carregando...</div>;
  }
  
  // Se não estiver autenticado, redirecionar para a página de login
  if (isAuthenticated === false) {
    // Remove the toast from here as it's causing infinite re-renders
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }
  
  // Se estiver autenticado, renderizar o conteúdo protegido
  return <>{children}</>;
};

export default ProtectedRoute;
