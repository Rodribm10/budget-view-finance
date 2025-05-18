
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

  useEffect(() => {
    // Verifica se o usuário está autenticado
    const autenticado = localStorage.getItem('autenticado') === 'true';
    const userId = localStorage.getItem('userId');
    setIsAutenticado(autenticado && !!userId);
  }, []);

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
              
              {/* Rota de autenticação - redireciona para transações se já estiver autenticado */}
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
