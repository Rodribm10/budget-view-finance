
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { MessageCircle, AlertCircle } from 'lucide-react';

interface ExistingInstanceDisplayProps {
  existingInstanceData: {
    instancia_zap: string;
    status_instancia: string;
  };
}

const ExistingInstanceDisplay = ({ existingInstanceData }: ExistingInstanceDisplayProps) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center mb-2">
          <MessageCircle className="h-6 w-6 mr-2 text-green-600" />
          <CardTitle>WhatsApp já Conectado</CardTitle>
        </div>
        <CardDescription>
          Você já possui uma instância WhatsApp vinculada ao seu email
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Apenas uma instância WhatsApp por usuário é permitida. 
            Sua instância atual: <strong>{existingInstanceData.instancia_zap}</strong>
          </AlertDescription>
        </Alert>
        
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded">
          <p className="text-green-800 text-sm">
            <strong>✓ Instância ativa:</strong> {existingInstanceData.instancia_zap}
          </p>
          <p className="text-green-700 text-sm mt-1">
            <strong>Status:</strong> {existingInstanceData.status_instancia || 'conectado'}
          </p>
          <p className="text-green-700 text-sm mt-1">
            Para gerenciar sua instância, utilize os botões na lista de instâncias abaixo.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExistingInstanceDisplay;
