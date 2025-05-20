
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { Toaster } from "@/components/ui/sonner";
import Auth from './pages/Auth';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { authStore } from './stores/authStore';

// Lazy-loaded components
const Dashboard = lazy(() => import('./pages/Index'));
const Transacoes = lazy(() => import('./pages/Transacoes'));
const Categorias = lazy(() => import('./pages/Categorias'));
const Metas = lazy(() => import('./pages/Metas'));
const Calendario = lazy(() => import('./pages/Calendario'));
const WhatsApp = lazy(() => import('./pages/WhatsApp'));
const GruposWhatsApp = lazy(() => import('./pages/GruposWhatsApp'));
const NotFound = lazy(() => import('./pages/NotFound'));
const CartoesCredito = lazy(() => import('./pages/CartoesCredito'));

function App() {
  const isLoggedIn = authStore((state) => state.isLoggedIn);

  return (
    <Router>
      <Toaster />
      
      <Routes>
        <Route path="/auth" element={isLoggedIn ? <Navigate to="/" /> : <Auth />} />
        <Route path="/" element={<ProtectedRoute><Suspense fallback={<div>Carregando...</div>}><Dashboard /></Suspense></ProtectedRoute>} />
        <Route path="/transacoes" element={<ProtectedRoute><Suspense fallback={<div>Carregando...</div>}><Transacoes /></Suspense></ProtectedRoute>} />
        <Route path="/cartoes" element={<ProtectedRoute><Suspense fallback={<div>Carregando...</div>}><CartoesCredito /></Suspense></ProtectedRoute>} />
        <Route path="/categorias" element={<ProtectedRoute><Suspense fallback={<div>Carregando...</div>}><Categorias /></Suspense></ProtectedRoute>} />
        <Route path="/metas" element={<ProtectedRoute><Suspense fallback={<div>Carregando...</div>}><Metas /></Suspense></ProtectedRoute>} />
        <Route path="/calendario" element={<ProtectedRoute><Suspense fallback={<div>Carregando...</div>}><Calendario /></Suspense></ProtectedRoute>} />
        <Route path="/whatsapp" element={<ProtectedRoute><Suspense fallback={<div>Carregando...</div>}><WhatsApp /></Suspense></ProtectedRoute>} />
        <Route path="/grupos-whatsapp" element={<ProtectedRoute><Suspense fallback={<div>Carregando...</div>}><GruposWhatsApp /></Suspense></ProtectedRoute>} />
        <Route path="*" element={<Suspense fallback={<div>Carregando...</div>}><NotFound /></Suspense>} />
      </Routes>
    </Router>
  );
}

export default App;
