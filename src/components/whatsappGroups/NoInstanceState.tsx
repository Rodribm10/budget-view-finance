
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { MessageCircle, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface NoInstanceStateProps {
  userInstance: {
    instancia_zap: string | null;
    status_instancia: string | null;
    whatsapp: string | null;
  } | null;
}

const NoInstanceState = ({ userInstance }: NoInstanceStateProps) => {
  const navigate = useNavigate();

  const handleGoToWhatsApp = () => {
    navigate('/whatsapp');
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center mb-2">
          <AlertTriangle className="h-6 w-6 mr-2 text-orange-600" />
          <CardTitle>WhatsApp não conectado</CardTitle>
        </div>
        <CardDescription>
          Para criar grupos, você precisa ter uma instância WhatsApp conectada
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert variant="destructive">
          <MessageCircle className="h-4 w-4" />
          <AlertDescription>
            {userInstance ? (
              userInstance.status_instancia === 'desconectado' ? (
                <>
                  Sua instância WhatsApp está <strong>desconectada</strong>. 
                  Você precisa reconectar para criar grupos.
                </>
              ) : (
                <>
                  Instância encontrada, mas status: <strong>{userInstance.status_instancia || 'desconhecido'}</strong>. 
                  Para criar grupos, o status deve ser "conectado".
                </>
              )
            ) : (
              'Nenhuma instância WhatsApp encontrada. Você precisa criar e conectar uma instância primeiro.'
            )}
          </AlertDescription>
        </Alert>

        {userInstance && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Status da sua instância:</h4>
            <div className="space-y-1 text-sm text-gray-600">
              <p><strong>Instância:</strong> {userInstance.instancia_zap || 'Não configurada'}</p>
              <p><strong>Status:</strong> {userInstance.status_instancia || 'Desconhecido'}</p>
              <p><strong>WhatsApp:</strong> {userInstance.whatsapp || 'Não configurado'}</p>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3">
          <Button onClick={handleGoToWhatsApp} className="flex-1">
            <MessageCircle className="h-4 w-4 mr-2" />
            {userInstance ? 'Reconectar WhatsApp' : 'Conectar WhatsApp'}
          </Button>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">Como resolver:</h4>
          <ol className="list-decimal list-inside space-y-1 text-sm text-blue-800">
            <li>Vá para a página "Conectar WhatsApp"</li>
            <li>{userInstance ? 'Reconecte sua instância existente' : 'Crie uma nova instância WhatsApp'}</li>
            <li>Escaneie o QR Code com seu celular</li>
            <li>Volte aqui para criar grupos</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  );
};

export default NoInstanceState;
