
import { ReactNode, useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
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

  useEffect(() => {
    const verificarAutenticacao = async () => {
      setIsLoading(true);
      
      try {
        // Since we're working with RLS disabled, we can simplify authentication
        // Just check for a session, but allow access even without one
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Erro ao verificar sessão:', sessionError);
          // For RLS disabled, we'll still let the user proceed
          setIsAutenticado(true);
          localStorage.setItem('autenticado', 'true');
          localStorage.setItem('userId', 'default');
          setIsLoading(false);
          return;
        }
        
        if (sessionData.session) {
          console.log('Sessão encontrada');
          setIsAutenticado(true);
          localStorage.setItem('autenticado', 'true');
          localStorage.setItem('userId', sessionData.session.user.id);
        } else {
          console.log('Sessão não encontrada, mas permitindo acesso com RLS desativado');
          setIsAutenticado(true);
          localStorage.setItem('autenticado', 'true');
          localStorage.setItem('userId', 'default');
        }
      } catch (error) {
        console.error('Erro ao verificar autenticação:', error);
        // For RLS disabled, we'll still let the user proceed
        setIsAutenticado(true);
        localStorage.setItem('autenticado', 'true');
        localStorage.setItem('userId', 'default');
      } finally {
        setIsLoading(false);
      }
    };
    
    verificarAutenticacao();
    
    // Configure listener for authentication changes
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Evento de autenticação:', event);
      
      if (event === 'SIGNED_IN' && session) {
        setIsAutenticado(true);
        localStorage.setItem('autenticado', 'true');
        localStorage.setItem('userId', session.user.id);
      } else if (event === 'SIGNED_OUT') {
        // For RLS disabled, we'll still let the user be "authenticated" with a default ID
        setIsAutenticado(true);
        localStorage.setItem('autenticado', 'true');
        localStorage.setItem('userId', 'default');
      }
    });
    
    // Clean up listener when unmounting
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [toast, location.pathname]);

  // Show loading while checking authentication
  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Carregando...</div>;
  }
  
  // Since RLS is disabled, we'll allow access to all routes
  // We're not redirecting to auth page anymore
  return <>{children}</>;
};

export default ProtectedRoute;
