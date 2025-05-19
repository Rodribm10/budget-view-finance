
import { ReactNode, useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const location = useLocation();

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        setIsLoading(true);
        
        // Check if we have stored authentication status
        const storedAuth = localStorage.getItem('autenticado') === 'true';
        
        if (storedAuth) {
          console.log('Using stored authentication status: authenticated');
          setIsAuthenticated(true);
          setIsLoading(false);
          return;
        }
        
        // If no stored status, check for a session
        const { data: sessionData } = await supabase.auth.getSession();
        
        if (sessionData?.session) {
          console.log('Session found, setting as authenticated');
          setIsAuthenticated(true);
          localStorage.setItem('autenticado', 'true');
          localStorage.setItem('userId', sessionData.session.user.id);
        } else {
          // For RLS disabled mode, we set a default authentication
          console.log('No session found, but setting as authenticated for RLS disabled mode');
          setIsAuthenticated(true);
          localStorage.setItem('autenticado', 'true');
          localStorage.setItem('userId', 'default');
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
        // For RLS disabled, default to authenticated
        setIsAuthenticated(true);
        localStorage.setItem('autenticado', 'true');
        localStorage.setItem('userId', 'default');
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuthentication();
  }, []);

  // Show loading state
  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Carregando...</div>;
  }
  
  // With RLS disabled, we simply return the children without redirecting
  return <>{children}</>;
};

export default ProtectedRoute;
