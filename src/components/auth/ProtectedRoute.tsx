
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
  const [shouldShowToast, setShouldShowToast] = useState(false);
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
          setShouldShowToast(true); // Mark that we should show toast, but don't do it here
        }
      } catch (error) {
        console.error('Erro ao verificar autenticação:', error);
        setIsAuthenticated(false);
        setShouldShowToast(true);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuthentication();
  }, []); // Execute only on mount

  // Show toast in a separate useEffect to avoid re-render loops
  useEffect(() => {
    if (shouldShowToast) {
      toast({
        title: "Autenticação necessária",
        description: "Por favor, faça login para acessar esta página"
      });
      setShouldShowToast(false); // Reset the flag after showing toast
    }
  }, [shouldShowToast, toast]);

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
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }
  
  // Se estiver autenticado, renderizar o conteúdo protegido
  return <>{children}</>;
};

export default ProtectedRoute;
