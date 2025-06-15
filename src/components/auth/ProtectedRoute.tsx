
import { ReactNode, useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import LoadingState from '../whatsapp/LoadingState';
import { authStore } from '@/stores/authStore';
import { supabase } from '@/integrations/supabase/client';
import { Session } from '@supabase/supabase-js';

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();
  const setLoggedIn = authStore((state) => state.setLoggedIn);
  const setUser = authStore((state) => state.setUser);
  
  useEffect(() => {
    // Checa a sessão ao carregar o componente
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setIsLoading(false);
    });
    
    // Escuta por mudanças no estado de autenticação (login/logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setLoggedIn(!!session);
        setUser(session?.user ? { id: session.user.id } : null);
        setIsLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [setLoggedIn, setUser]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingState message="Verificando autenticação..." />
      </div>
    );
  }
  
  if (!session) {
    // Redireciona para a página de login se não houver sessão
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }
  
  // Renderiza o conteúdo protegido se houver sessão
  return <>{children}</>;
};

export default ProtectedRoute;
