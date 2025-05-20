
import { ReactNode, useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useToast } from "@/components/ui/use-toast";
import LoadingState from '../whatsapp/LoadingState';

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const location = useLocation();

  useEffect(() => {
    // Check authentication status only once on mount
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
        }
      } catch (error) {
        console.error('Erro ao verificar autenticação:', error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuthentication();
  }, []); // Execute only on mount

  // Se estiver carregando, mostrar estado de carregamento
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingState message="Verificando autenticação..." />
      </div>
    );
  }
  
  // Se não estiver autenticado, redirecionar para a página de login
  if (!isAuthenticated) {
    // Use toast here - it's safer after render and won't cause infinite re-renders
    toast({
      title: "Autenticação necessária",
      description: "Por favor, faça login para acessar esta página"
    });
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }
  
  // Se estiver autenticado, renderizar o conteúdo protegido
  return <>{children}</>;
};

export default ProtectedRoute;
