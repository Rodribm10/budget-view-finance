
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

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Index />} />
        <Route path="/transacoes" element={<Transacoes />} />
        <Route path="/categorias" element={<Categorias />} />
        <Route path="/calendario" element={<Calendario />} />
        <Route path="/metas" element={<Metas />} />
        <Route path="/login" element={<Auth />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;
