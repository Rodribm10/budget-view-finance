
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Index from '@/pages/Index';
import Transacoes from '@/pages/Transacoes';
import Categorias from '@/pages/Categorias';
import Calendario from '@/pages/Calendario';
import NotFound from '@/pages/NotFound';
import Auth from '@/pages/Auth';
import Metas from '@/pages/Metas';
import { Toaster } from '@/components/ui/toaster';
import './App.css';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Index />
          </ProtectedRoute>
        } />
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
        <Route path="/metas" element={
          <ProtectedRoute>
            <Metas />
          </ProtectedRoute>
        } />
        <Route path="/login" element={<Auth />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;
