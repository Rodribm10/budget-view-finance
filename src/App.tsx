
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { Toaster } from "@/components/ui/sonner";
import Auth from './pages/Auth';
import Landing from './pages/Landing';
import EmailConfirmation from './pages/EmailConfirmation';
import CompleteProfile from './pages/CompleteProfile';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { authStore } from './stores/authStore';

// Lazy-loaded components
const Dashboard = lazy(() => import('./pages/Index'));
const Transacoes = lazy(() => import('./pages/Transacoes'));
const Categorias = lazy(() => import('./pages/Categorias'));
const Metas = lazy(() => import('./pages/Metas'));
const Calendario = lazy(() => import('./pages/Calendario'));
const Assinatura = lazy(() => import('./pages/Assinatura'));
const WhatsApp = lazy(() => import('./pages/WhatsApp'));
const GruposWhatsApp = lazy(() => import('./pages/GruposWhatsApp'));
const NotFound = lazy(() => import('./pages/NotFound'));
const CartoesCredito = lazy(() => import('./pages/CartoesCredito'));
const Configuracoes = lazy(() => import('./pages/Configuracoes'));
const AdminFAQ = lazy(() => import('./pages/AdminFAQ'));

function App() {
  const isLoggedIn = authStore((state) => state.isLoggedIn);
  
  return (
    <Router>
      <Toaster />
      
      <Routes>
        {/* Landing page - só mostra se não estiver logado */}
        <Route 
          path="/" 
          element={isLoggedIn ? (
            <ProtectedRoute>
              <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Carregando...</div>}>
                <Dashboard />
              </Suspense>
            </ProtectedRoute>
          ) : <Landing />} 
        />
        
        {/* Auth route */}
        <Route 
          path="/auth" 
          element={isLoggedIn ? <Navigate to="/" replace /> : <Auth />} 
        />
        
        {/* Email confirmation route */}
        <Route 
          path="/email-confirmation" 
          element={<EmailConfirmation />} 
        />
        
        {/* Complete profile route - deve ser acessível para usuários logados */}
        <Route 
          path="/complete-profile" 
          element={<CompleteProfile />} 
        />
        
        {/* Protected routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Carregando...</div>}>
              <Dashboard />
            </Suspense>
          </ProtectedRoute>
        } />
        
        <Route path="/transacoes" element={
          <ProtectedRoute>
            <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Carregando...</div>}>
              <Transacoes />
            </Suspense>
          </ProtectedRoute>
        } />
        
        <Route path="/cartoes" element={<ProtectedRoute><Suspense fallback={<div>Carregando...</div>}><CartoesCredito /></Suspense></ProtectedRoute>} />
        <Route path="/categorias" element={<ProtectedRoute><Suspense fallback={<div>Carregando...</div>}><Categorias /></Suspense></ProtectedRoute>} />
        <Route path="/metas" element={<ProtectedRoute><Suspense fallback={<div>Carregando...</div>}><Metas /></Suspense></ProtectedRoute>} />
        <Route path="/calendario" element={<ProtectedRoute><Suspense fallback={<div>Carregando...</div>}><Calendario /></Suspense></ProtectedRoute>} />
        <Route path="/assinatura" element={<ProtectedRoute><Suspense fallback={<div>Carregando...</div>}><Assinatura /></Suspense></ProtectedRoute>} />
        <Route path="/whatsapp" element={<ProtectedRoute><Suspense fallback={<div>Carregando...</div>}><WhatsApp /></Suspense></ProtectedRoute>} />
        <Route path="/grupos-whatsapp" element={<ProtectedRoute><Suspense fallback={<div>Carregando...</div>}><GruposWhatsApp /></Suspense></ProtectedRoute>} />
        <Route path="/admin-faq" element={<ProtectedRoute><Suspense fallback={<div>Carregando...</div>}><AdminFAQ /></Suspense></ProtectedRoute>} />
        <Route path="/configuracoes" element={
          <ProtectedRoute>
            <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Carregando...</div>}>
              <Configuracoes />
            </Suspense>
          </ProtectedRoute>
        } />
        
        {/* Not found route */}
        <Route path="*" element={
          <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Carregando...</div>}>
            <NotFound />
          </Suspense>
        } />
      </Routes>
    </Router>
  );
}

export default App;
