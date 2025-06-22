
import { ReactNode, useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import LoadingState from '../whatsapp/LoadingState';
import { authStore } from '@/stores/authStore';
import { supabase } from '@/integrations/supabase/client';
import { Session } from '@supabase/supabase-js';
import { useProfileCompletion } from '@/hooks/useProfileCompletion';

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  const setLoggedIn = authStore((state) => state.setLoggedIn);
  const setUser = authStore((state) => state.setUser);
  const isProfileComplete = authStore((state) => state.isProfileComplete);
  
  // Hook para verificar completude do perfil
  const { isChecking } = useProfileCompletion(session?.user?.email || '');
  
  useEffect(() => {
    // Verificar sessão inicial
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('🔐 [PROTECTED_ROUTE] Sessão inicial:', session?.user?.email);
      setSession(session);
      setLoggedIn(!!session);
      setUser(session?.user ? { id: session.user.id } : null);

      if (session?.user?.email) {
        localStorage.setItem('userEmail', session.user.email);
        console.log('👤 [PROTECTED_ROUTE] Email salvo no localStorage:', session.user.email);
        
        // Disparar evento customizado para notificar outros componentes sobre o login
        window.dispatchEvent(new CustomEvent('userLoggedIn', { 
          detail: { email: session.user.email } 
        }));
      } else {
        localStorage.removeItem('userEmail');
      }
      
      setIsLoading(false);
    });

    // Listener para mudanças de auth
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        console.log('🔄 [PROTECTED_ROUTE] Mudança de auth:', _event, session?.user?.email);
        setSession(session);
        setLoggedIn(!!session);
        setUser(session?.user ? { id: session.user.id } : null);

        if (session?.user?.email) {
          localStorage.setItem('userEmail', session.user.email);
          console.log('👤 [PROTECTED_ROUTE] Email atualizado no localStorage:', session.user.email);
          
          // Disparar evento customizado para notificar sobre o login
          if (_event === 'SIGNED_IN') {
            console.log('🎉 [PROTECTED_ROUTE] Login detectado, disparando evento');
            window.dispatchEvent(new CustomEvent('userLoggedIn', { 
              detail: { email: session.user.email } 
            }));
          }
        } else {
          localStorage.removeItem('userEmail');
        }

        setIsLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [setLoggedIn, setUser]);

  // Mostrar loading enquanto verifica auth ou perfil
  if (isLoading || isChecking) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingState message="Verificando autenticação..." />
      </div>
    );
  }
  
  // Se não tem sessão, redirecionar para login
  if (!session) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }
  
  // Se tem sessão mas perfil não está completo, redirecionar para completar perfil
  if (session && !isProfileComplete) {
    console.log('🚨 [PROTECTED_ROUTE] Redirecionando para complete-profile - perfil incompleto');
    return <Navigate to="/complete-profile" replace />;
  }
  
  // Se tudo ok, renderizar conteúdo protegido
  return <>{children}</>;
};

export default ProtectedRoute;
