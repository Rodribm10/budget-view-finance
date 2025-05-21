
import { ReactNode, useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useToast } from "@/components/ui/use-toast";
import LoadingState from '../whatsapp/LoadingState';
import { authStore } from '@/stores/authStore';

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const location = useLocation();
  const setLoggedIn = authStore((state) => state.setLoggedIn);
  
  // Use a single state variable to track authentication status
  const [authStatus, setAuthStatus] = useState<'loading' | 'authenticated' | 'unauthenticated'>('loading');

  useEffect(() => {
    const checkAuthentication = () => {
      try {
        // Check if we have stored authentication status
        const storedAuth = localStorage.getItem('autenticado') === 'true';
        const userId = localStorage.getItem('userId');
        
        if (storedAuth && userId) {
          console.log('Usando autenticação armazenada: autenticado');
          setAuthStatus('authenticated');
          setLoggedIn(true);
        } else {
          console.log('Nenhuma sessão encontrada, redirecionando para login');
          setAuthStatus('unauthenticated');
          setLoggedIn(false);
          
          // Only show toast once when transitioning to unauthenticated
          toast({
            title: "Autenticação necessária",
            description: "Por favor, faça login para acessar esta página"
          });
        }
      } catch (error) {
        console.error('Erro ao verificar autenticação:', error);
        setAuthStatus('unauthenticated');
        setLoggedIn(false);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuthentication();
  }, [toast, setLoggedIn]); // Only check once on mount, with stable dependencies

  // Se estiver carregando, mostrar estado de carregamento
  if (isLoading || authStatus === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingState message="Verificando autenticação..." />
      </div>
    );
  }
  
  // Se não estiver autenticado, redirecionar para a página de login - use replace para evitar histórico
  if (authStatus === 'unauthenticated') {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }
  
  // Se estiver autenticado, renderizar o conteúdo protegido
  return <>{children}</>;
};

export default ProtectedRoute;
