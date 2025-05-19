import React, { useEffect, useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Transacoes from "./pages/Transacoes";
import Categorias from "./pages/Categorias";
import Calendario from "./pages/Calendario";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import { supabase } from "@/integrations/supabase/client";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        // Get stored authentication status
        const storedAuth = localStorage.getItem('autenticado') === 'true';
        
        if (storedAuth) {
          console.log('Using stored authentication: authenticated');
          setIsAuthenticated(true);
          setIsLoading(false);
          return;
        }
        
        // If no stored status, check session
        const { data: sessionData } = await supabase.auth.getSession();
        
        if (sessionData?.session) {
          console.log('Session found in App.tsx');
          setIsAuthenticated(true);
          localStorage.setItem('autenticado', 'true');
          localStorage.setItem('userId', sessionData.session.user.id);
        } else {
          // For RLS disabled mode, we default to authenticated
          console.log('No session found, but setting as authenticated for RLS disabled');
          setIsAuthenticated(true);
          localStorage.setItem('autenticado', 'true');
          localStorage.setItem('userId', 'default');
        }
      } catch (error) {
        console.error('Error checking authentication in App.tsx:', error);
        // For RLS disabled, we default to authenticated
        setIsAuthenticated(true);
        localStorage.setItem('autenticado', 'true');
        localStorage.setItem('userId', 'default');
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuthentication();
    
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth event in App.tsx:', event);
      
      // For RLS disabled mode, we keep authenticated state regardless
      setIsAuthenticated(true);
      localStorage.setItem('autenticado', 'true');
      localStorage.setItem('userId', session?.user?.id || 'default');
    });
    
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Carregando...</p>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Routes>
            {/* Root path redirects to dashboard */}
            <Route 
              path="/" 
              element={<Navigate to="/dashboard" replace />} 
            />
            
            {/* Dashboard route using Index component */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Index />
                </ProtectedRoute>
              } 
            />
            
            {/* Auth page is still available, but we should never need to redirect here */}
            <Route path="/auth" element={<Auth />} />
            
            {/* Protected routes - with RLS disabled, they're always accessible */}
            <Route 
              path="/transacoes" 
              element={
                <ProtectedRoute>
                  <Transacoes />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/categorias" 
              element={
                <ProtectedRoute>
                  <Categorias />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/calendario" 
              element={
                <ProtectedRoute>
                  <Calendario />
                </ProtectedRoute>
              } 
            />
            
            {/* 404 route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </TooltipProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
