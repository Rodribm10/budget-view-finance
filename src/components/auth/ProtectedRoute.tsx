
import { ReactNode, useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import LoadingState from '../whatsapp/LoadingState';
import { useAuthStore } from '@/stores/authStore';
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

  const setLoggedIn = useAuthStore((state) => state.setLoggedIn);
  const setUser = useAuthStore((state) => state.setUser);
  const setAuthSession = useAuthStore((state) => state.setSession);
  const isProfileComplete = useAuthStore((state) => state.isProfileComplete);
  
  // Hook para verificar completude do perfil
  const { isChecking } = useProfileCompletion(session?.user?.email || '');
  
  useEffect(() => {
    let mounted = true;

    // Verificar sessão inicial
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('🔐 [PROTECTED_ROUTE] Erro ao obter sessão:', error);
        }
        
        if (mounted) {
          console.log('🔐 [PROTECTED_ROUTE] Sessão inicial:', session?.user?.email || 'Nenhuma sessão');
          setSession(session);
          setLoggedIn(!!session);
          setUser(session?.user ? { id: session.user.id } : null);
          setAuthSession(session);
          
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
        }
      } catch (error) {
        console.error('🔐 [PROTECTED_ROUTE] Erro inesperado ao obter sessão:', error);
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    getInitialSession();

    // Listener para mudanças de auth com debounce
    let timeoutId: NodeJS.Timeout;
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('🔄 [PROTECTED_ROUTE] Mudança de auth:', event, session?.user?.email || 'Sem sessão');
        
        // Debounce para evitar múltiplas atualizações
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          if (mounted) {
            setSession(session);
            setLoggedIn(!!session);
            setUser(session?.user ? { id: session.user.id } : null);
            setAuthSession(session);
            
            if (session?.user?.email) {
              localStorage.setItem('userEmail', session.user.email);
              console.log('👤 [PROTECTED_ROUTE] Email atualizado no localStorage:', session.user.email);
              
              // Disparar evento customizado para notificar sobre o login
              if (event === 'SIGNED_IN') {
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
        }, 100); // Debounce de 100ms
      }
    );

    return () => {
      mounted = false;
      clearTimeout(timeoutId);
      subscription.unsubscribe();
    };
  }, [setLoggedIn, setUser, setAuthSession]);

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
