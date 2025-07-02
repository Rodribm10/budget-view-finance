
import AdminPanel from '@/components/admin/AdminPanel';
import { useAdminSettings } from '@/hooks/useAdminSettings';
import { Navigate } from 'react-router-dom';

const Admin = () => {
  const { isAdmin, loading } = useAdminSettings();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Administração</h1>
      </div>

      <AdminPanel />
    </div>
  );
};

export default Admin;
