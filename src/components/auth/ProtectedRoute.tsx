
import { ReactNode, useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useToast } from "@/components/ui/use-toast";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const [isAutenticado, setIsAutenticado] = useState<boolean | null>(null);
  const { toast } = useToast();
  const location = useLocation();

  useEffect(() => {
    // Verifica se o usuário está autenticado
    const autenticado = localStorage.getItem('autenticado') === 'true';
    const userId = localStorage.getItem('userId');
    setIsAutenticado(autenticado && !!userId);
    
    if (!autenticado || !userId) {
      toast({
        title: "Acesso restrito",
        description: "Faça login para acessar esta página",
        variant: "destructive"
      });
    }
  }, [toast, location.pathname]);

  // Mostra um carregamento enquanto verifica a autenticação
  if (isAutenticado === null) {
    return <div className="flex items-center justify-center min-h-screen">Carregando...</div>;
  }
  
  // Redireciona para a tela de login se não estiver autenticado
  if (!isAutenticado) {
    return <Navigate to="/auth" replace />;
  }

  // Renderiza o conteúdo protegido se estiver autenticado
  return <>{children}</>;
};

export default ProtectedRoute;
