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
  const [isAutenticado, setIsAutenticado] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const verificarAutenticacao = async () => {
      try {
        // Verificar se temos um userId armazenado
        const userId = localStorage.getItem('userId');
        const autenticadoStorage = localStorage.getItem('autenticado') === 'true';
        
        // Verificar se temos uma sessão válida com o Supabase
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Erro ao verificar sessão:', sessionError);
          setIsAutenticado(false);
          localStorage.setItem('autenticado', 'false');
          setIsLoading(false);
          return;
        }
        
        if (!sessionData.session) {
          // Se não temos userId ou sessão, não está autenticado
          if (!userId || !autenticadoStorage) {
            setIsAutenticado(false);
            localStorage.setItem('autenticado', 'false');
            setIsLoading(false);
            return;
          }
          
          // Tentar atualizar a sessão
          const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession();
          
          if (refreshError || !refreshData.session) {
            console.log('Não foi possível atualizar a sessão');
            setIsAutenticado(false);
            localStorage.setItem('autenticado', 'false');
            setIsLoading(false);
            return;
          }
          
          console.log('Sessão atualizada com sucesso');
          setIsAutenticado(true);
          localStorage.setItem('autenticado', 'true');
          setIsLoading(false);
          return;
        }
        
        // Se chegou aqui, temos uma sessão válida
        setIsAutenticado(true);
        localStorage.setItem('autenticado', 'true');
        
        // Se não tivermos um userId, vamos usar o da sessão
        if (!userId && sessionData.session.user.id) {
          localStorage.setItem('userId', sessionData.session.user.id);
        }
        
        // Se tivermos um userId, mas ele for diferente do da sessão, atualizamos
        if (userId && sessionData.session.user.id && userId !== sessionData.session.user.id) {
          localStorage.setItem('userId', sessionData.session.user.id);
        }
      } catch (error) {
        console.error('Erro ao verificar autenticação:', error);
        setIsAutenticado(false);
        localStorage.setItem('autenticado', 'false');
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
      }
    });
    
    // Limpar listener ao desmontar o componente
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
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Rota inicial redireciona para dashboard ou autenticação */}
              <Route 
                path="/" 
                element={
                  isAutenticado ? (
                    <Navigate to="/transacoes" replace />
                  ) : (
                    <Navigate to="/auth" replace />
                  )
                } 
              />
              
              {/* Rota de autenticação - redireciona para dashboard se já estiver autenticado */}
              <Route 
                path="/auth" 
                element={
                  isAutenticado ? (
                    <Navigate to="/transacoes" replace />
                  ) : (
                    <Auth />
                  )
                } 
              />
              
              {/* Rotas protegidas que exigem autenticação */}
              <Route path="/transacoes" element={
                <ProtectedRoute>
                  <Transacoes />
                </ProtectedRoute>
              } />
              <Route path="/categorias" element={
                <ProtectedRoute>
                  <Categorias />
                </ProtectedRoute>
              } />
              <Route path="/calendario" element={
                <ProtectedRoute>
                  <Calendario />
                </ProtectedRoute>
              } />
              
              {/* Rota para o dashboard, para manter compatibilidade */}
              <Route 
                path="/dashboard" 
                element={
                  <Navigate to="/transacoes" replace />
                }
              />
              
              {/* Rota 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </React.StrictMode>
  );
};

export default App;
