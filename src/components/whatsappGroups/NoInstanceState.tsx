
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

interface NoInstanceStateProps {
  userInstance: {
    instancia_zap: string | null;
    status_instancia: string | null;
    whatsapp: string | null;
  } | null;
}

const NoInstanceState = ({ userInstance }: NoInstanceStateProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Cadastrar novo grupo</CardTitle>
        <CardDescription>
          Para criar um grupo é necessário ter uma instância do WhatsApp conectada
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {userInstance && userInstance.instancia_zap && userInstance.status_instancia !== 'conectado' ? (
              <>
                Sua instância WhatsApp <strong>{userInstance.instancia_zap}</strong> está <strong>desconectada</strong>. 
                Acesse o menu "Conectar WhatsApp" e escaneie o QR Code para conectar sua instância.
                <br />
                <span className="text-sm text-gray-600 mt-2 block">
                  Status atual: {userInstance.status_instancia}
                </span>
              </>
            ) : (
              <>
                Para criar um grupo é necessário ter sua instância do WhatsApp conectada. 
                Acesse o menu "Conectar WhatsApp" e realize a conexão primeiro.
              </>
            )}
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
};

export default NoInstanceState;
