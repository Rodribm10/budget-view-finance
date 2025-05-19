
import { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';
import { MessageCircle, QrCode, RefreshCw } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface WhatsAppInstance {
  instanceName: string;
  instanceId?: string;
  status?: string;
  qrcode?: string;
}

const WhatsApp = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [loadingQR, setLoadingQR] = useState(false);
  const [instanceName, setInstanceName] = useState(() => {
    // Get user's name from localStorage as default value
    const userName = localStorage.getItem('userName') || '';
    return userName;
  });
  const [phoneNumber, setPhoneNumber] = useState('');
  const [instance, setInstance] = useState<WhatsAppInstance | null>(() => {
    // Check if we have a stored instance
    const storedInstanceId = localStorage.getItem('whatsappInstanceId');
    const storedInstanceName = localStorage.getItem('whatsappInstanceName');
    
    if (storedInstanceId && storedInstanceName) {
      return {
        instanceName: storedInstanceName,
        instanceId: storedInstanceId
      };
    }
    return null;
  });
  const [qrCodeData, setQrCodeData] = useState<string | null>(null);
  const [qrError, setQrError] = useState<string | null>(null);

  const createInstance = async () => {
    // Validate form fields
    if (!instanceName.trim()) {
      toast({
        title: "Erro",
        description: "O nome da instância é obrigatório",
        variant: "destructive",
      });
      return;
    }

    if (!phoneNumber.trim() || !/^[0-9]{10,15}$/.test(phoneNumber)) {
      toast({
        title: "Erro",
        description: "Insira um número válido com DDD e país (ex: 559999999999)",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // Using the provided URL and API key for Evolution API
      const serverUrl = "evolutionapi2.innova1001.com.br";
      const apiKey = "beeb77fbd7f48f91db2cd539a573c130";

      const response = await fetch(`https://${serverUrl}/instance/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': apiKey
        },
        body: JSON.stringify({
          instanceName: instanceName,
          number: phoneNumber,
          qrcode: true,
          integration: "WHATSAPP-BAILEYS"
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erro ao criar instância');
      }

      // Handle successful response
      const newInstance = {
        instanceName,
        instanceId: data.instanceId,
        status: data.status,
        qrcode: data.qrcode
      };
      
      setInstance(newInstance);

      // Save the instance details for later use
      localStorage.setItem('whatsappInstanceId', data.instanceId);
      localStorage.setItem('whatsappInstanceName', instanceName);
      
      toast({
        title: "Sucesso!",
        description: "Instância do WhatsApp criada com sucesso!"
      });
      
      // If there's a QR code in the response, set it
      if (data.qrcode) {
        setQrCodeData(data.qrcode);
      }
    } catch (error) {
      console.error("Error creating WhatsApp instance:", error);
      toast({
        title: "Erro na criação da instância",
        description: "Ocorreu um erro ao conectar com a API. Tente novamente mais tarde.",
        variant: "destructive",
      });
      setQrError("Falha ao obter QR Code. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const fetchQrCode = async () => {
    if (!instance?.instanceId) {
      toast({
        title: "Erro",
        description: "Nenhuma instância disponível. Crie uma instância primeiro.",
        variant: "destructive",
      });
      return;
    }

    setLoadingQR(true);
    setQrError(null);

    try {
      const serverUrl = "evolutionapi2.innova1001.com.br";
      const apiKey = "beeb77fbd7f48f91db2cd539a573c130";

      const response = await fetch(`https://${serverUrl}/instance/qrcode/${instance.instanceId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'apikey': apiKey
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erro ao obter QR Code');
      }

      if (data && data.qrcode) {
        setQrCodeData(data.qrcode);
      } else {
        setQrError("QR Code não disponível. A instância pode já estar conectada.");
      }
    } catch (error) {
      console.error("Error fetching QR code:", error);
      setQrError("Falha ao obter QR Code. Tente novamente.");
      toast({
        title: "Erro ao obter QR Code",
        description: "Não foi possível obter o QR Code. Tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setLoadingQR(false);
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-tight">Conectar WhatsApp</h1>
        </div>
        
        {!instance?.instanceId ? (
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <div className="flex items-center mb-2">
                <MessageCircle className="h-6 w-6 mr-2 text-green-600" />
                <CardTitle>Vincular WhatsApp ao App</CardTitle>
              </div>
              <CardDescription>
                Preencha os campos abaixo para conectar sua conta WhatsApp
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="instanceName">Nome da Instância</Label>
                <Input
                  id="instanceName"
                  value={instanceName}
                  onChange={(e) => setInstanceName(e.target.value)}
                  placeholder="Digite um nome para a instância"
                  required
                />
                <p className="text-xs text-muted-foreground">O nome será usado para identificar esta conexão</p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Número do WhatsApp</Label>
                <Input
                  id="phoneNumber"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="559999999999"
                  required
                />
                <p className="text-xs text-muted-foreground">Digite o número com DDD e código do país</p>
              </div>
              
              <Button 
                className="w-full mt-4" 
                onClick={createInstance}
                disabled={loading}
              >
                {loading ? "Criando..." : "Criar Instância"}
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <div className="flex items-center mb-2">
                <QrCode className="h-6 w-6 mr-2 text-green-600" />
                <CardTitle>WhatsApp - {instance.instanceName}</CardTitle>
              </div>
              <CardDescription>
                Escaneie o QR Code com seu WhatsApp para finalizar a conexão
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3 bg-green-50 text-green-800 rounded-md text-sm">
                <p><strong>Instância criada com sucesso!</strong></p>
                <p className="text-xs mt-1">ID da instância: {instance.instanceId}</p>
              </div>
              
              {!qrCodeData && !qrError && !loadingQR && (
                <Button 
                  className="w-full" 
                  onClick={fetchQrCode}
                  disabled={loadingQR}
                >
                  Ver QR Code
                </Button>
              )}
              
              {loadingQR && (
                <div className="text-center py-8">
                  <p>Carregando QR Code...</p>
                </div>
              )}
              
              {qrCodeData && (
                <div className="flex flex-col items-center space-y-4">
                  <div className="border p-4 bg-white rounded-md">
                    <img 
                      src={qrCodeData}
                      alt="QR Code WhatsApp" 
                      className="w-full h-auto max-w-[250px]" 
                    />
                  </div>
                  <p className="text-sm text-center">
                    Escaneie este QR Code com seu WhatsApp para finalizar a conexão.
                  </p>
                  <Button
                    variant="outline"
                    onClick={fetchQrCode}
                    disabled={loadingQR}
                    className="flex items-center"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Atualizar QR Code
                  </Button>
                </div>
              )}
              
              {qrError && (
                <div className="space-y-4">
                  <Alert variant="destructive">
                    <AlertDescription>{qrError}</AlertDescription>
                  </Alert>
                  <Button 
                    onClick={fetchQrCode}
                    disabled={loadingQR}
                    className="w-full"
                  >
                    Tentar Novamente
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default WhatsApp;
