
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
  // We use local state here to avoid re-renders of the whole app
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  // We still update the global store for other components to use
  const setLoggedIn = authStore((state) => state.setLoggedIn);
  const setUser = authStore((state) => state.setUser);
  
  useEffect(() => {
    // onAuthStateChange fires once on initial load with the current session,
    // and then every time the auth state changes.
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
    // Redirect to the login page if there is no session
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }
  
  // Render the protected content if a session exists
  return <>{children}</>;
};

export default ProtectedRoute;
