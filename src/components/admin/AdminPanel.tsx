
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Shield } from 'lucide-react';
import { useAdminSettings } from '@/hooks/useAdminSettings';

const AdminPanel = () => {
  const { isAdmin, hideWhatsAppButton, loading, toggleWhatsAppButton } = useAdminSettings();

  if (!isAdmin || loading) {
    return null;
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-red-600" />
          Painel Administrativo
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="hide-whatsapp" className="text-sm font-medium">
            Esconder botão "Conectar WhatsApp" para todos os usuários
          </Label>
          <Switch
            id="hide-whatsapp"
            checked={hideWhatsAppButton}
            onCheckedChange={toggleWhatsAppButton}
          />
        </div>
        <p className="text-xs text-gray-500">
          Quando ativado, o botão "Conectar WhatsApp" ficará oculto para todos os usuários do sistema.
        </p>
      </CardContent>
    </Card>
  );
};

export default AdminPanel;
