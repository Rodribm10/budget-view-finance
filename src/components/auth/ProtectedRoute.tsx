
import { ReactNode, useEffect, useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const [isAutenticado, setIsAutenticado] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const verificarAutenticacao = async () => {
      setIsLoading(true);
      
      try {
        // Verificar se temos uma sessão válida com o Supabase primeiro
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Erro ao verificar sessão:', sessionError);
          setIsAutenticado(false);
          localStorage.setItem('autenticado', 'false');
          localStorage.removeItem('userId');
          
          toast({
            title: "Erro de autenticação",
            description: "Não foi possível validar sua sessão",
            variant: "destructive"
          });
          
          setIsLoading(false);
          return;
        }
        
        if (!sessionData.session) {
          console.log('Sessão não encontrada, tentando atualizar...');
          
          // Tentar atualizar a sessão
          const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession();
          
          if (refreshError || !refreshData.session) {
            console.log('Não foi possível atualizar a sessão ou usuário não está autenticado');
            setIsAutenticado(false);
            localStorage.setItem('autenticado', 'false');
            localStorage.removeItem('userId');
            
            toast({
              title: "Sessão expirada",
              description: "Sua sessão expirou. Por favor, faça login novamente",
              variant: "destructive"
            });
            
            setIsLoading(false);
            return;
          }
          
          console.log('Sessão atualizada com sucesso');
          setIsAutenticado(true);
          localStorage.setItem('autenticado', 'true');
          
          // Garantir que o userId esteja atualizado
          localStorage.setItem('userId', refreshData.session.user.id);
          
          setIsLoading(false);
          return;
        }
        
        // Se chegou aqui, temos uma sessão válida
        setIsAutenticado(true);
        localStorage.setItem('autenticado', 'true');
        localStorage.setItem('userId', sessionData.session.user.id);
      } catch (error) {
        console.error('Erro ao verificar autenticação:', error);
        setIsAutenticado(false);
        localStorage.setItem('autenticado', 'false');
        localStorage.removeItem('userId');
        
        toast({
          title: "Erro inesperado",
          description: "Ocorreu um erro ao verificar sua autenticação",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    verificarAutenticacao();
    
    // Configurar listener para mudanças de autenticação
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Evento de autenticação:', event);
      
      if (event === 'SIGNED_IN' && session) {
        setIsAutenticado(true);
        localStorage.setItem('autenticado', 'true');
        localStorage.setItem('userId', session.user.id);
      } else if (event === 'SIGNED_OUT') {
        setIsAutenticado(false);
        localStorage.setItem('autenticado', 'false');
        localStorage.removeItem('userId');
        navigate('/auth');
      } else if (event === 'TOKEN_REFRESHED' && session) {
        setIsAutenticado(true);
        localStorage.setItem('autenticado', 'true');
        localStorage.setItem('userId', session.user.id);
      }
    });
    
    // Limpar listener ao desmontar o componente
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [toast, navigate, location.pathname]);

  // Mostra um carregamento enquanto verifica a autenticação
  if (isLoading) {
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
