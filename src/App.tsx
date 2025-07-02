import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuthStore } from "@/stores/authStore";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Layout from "@/components/layout/Layout";
import ResetPassword from '@/pages/ResetPassword';

// Pages
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Landing from "./pages/Landing";
import Transacoes from "./pages/Transacoes";
import CartoesCredito from "./pages/CartoesCredito";
import Configuracoes from "./pages/Configuracoes";
import Metas from "./pages/Metas";
import Calendario from "./pages/Calendario";
import WhatsApp from "./pages/WhatsApp";
import GruposWhatsApp from "./pages/GruposWhatsApp";
import EmailConfirmation from "./pages/EmailConfirmation";
import CompleteProfile from "./pages/CompleteProfile";
import NotFound from "./pages/NotFound";
import Categorias from "./pages/Categorias";
import AdminFAQ from "./pages/AdminFAQ";
import Assinatura from "./pages/Assinatura";
import AvisosContas from "./pages/AvisosContas";

const queryClient = new QueryClient();

function App() {
  const { setUser, setSession } = useAuthStore();

  useEffect(() => {
    // Verificar sessão inicial
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    // Escutar mudanças de autenticação
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [setUser, setSession]);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <BrowserRouter>
          <Routes>
            {/* Rotas públicas */}
            <Route path="/" element={<Landing />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/email-confirmation" element={<EmailConfirmation />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            
            {/* Rotas protegidas */}
            <Route path="/" element={<ProtectedRoute><Layout><Outlet /></Layout></ProtectedRoute>}>
              <Route path="/dashboard" element={<Index />} />
              <Route path="/transacoes" element={<Transacoes />} />
              <Route path="/cartoes" element={<CartoesCredito />} />
              <Route path="/configuracoes" element={<Configuracoes />} />
              <Route path="/metas" element={<Metas />} />
              <Route path="/calendario" element={<Calendario />} />
              <Route path="/whatsapp" element={<WhatsApp />} />
              <Route path="/grupos-whatsapp" element={<GruposWhatsApp />} />
              <Route path="/complete-profile" element={<CompleteProfile />} />
              <Route path="/categorias" element={<Categorias />} />
              <Route path="/admin/faq" element={<AdminFAQ />} />
              <Route path="/assinatura" element={<Assinatura />} />
              <Route path="/avisos-contas" element={<AvisosContas />} />
            </Route>

            {/* Rota 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
