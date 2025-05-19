
import { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';
import { MessageCircle, QrCode, RefreshCw, Smartphone } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';

interface WhatsAppInstance {
  instanceName: string;
  instanceId: string;
  phoneNumber: string;
  status?: string;
  qrcode?: string;
  connectionState?: 'open' | 'closed' | 'connecting';
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
  const [instances, setInstances] = useState<WhatsAppInstance[]>([]);
  const [activeInstance, setActiveInstance] = useState<WhatsAppInstance | null>(null);
  const [qrCodeData, setQrCodeData] = useState<string | null>(null);
  const [qrError, setQrError] = useState<string | null>(null);
  const [qrDialogOpen, setQrDialogOpen] = useState(false);
  const [statusCheckInterval, setStatusCheckInterval] = useState<NodeJS.Timeout | null>(null);

  // Load saved instances from localStorage on component mount
  useEffect(() => {
    const savedInstances = localStorage.getItem('whatsappInstances');
    if (savedInstances) {
      try {
        setInstances(JSON.parse(savedInstances));
      } catch (error) {
        console.error("Error parsing saved instances:", error);
      }
    }
  }, []);

  // Save instances to localStorage whenever they change
  useEffect(() => {
    if (instances.length > 0) {
      localStorage.setItem('whatsappInstances', JSON.stringify(instances));
    }
  }, [instances]);

  // Set up periodic status checks
  useEffect(() => {
    // Check status initially
    if (instances.length > 0) {
      checkAllInstancesStatus();
    }

    // Set up interval for periodic checks (every 60 seconds)
    const interval = setInterval(() => {
      if (instances.length > 0) {
        checkAllInstancesStatus();
      }
    }, 60000); // 60 seconds

    setStatusCheckInterval(interval);

    // Clean up interval when component unmounts
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [instances.length]);

  // Function to check connection status for all instances
  const checkAllInstancesStatus = async () => {
    const updatedInstances = await Promise.all(
      instances.map(async (instance) => {
        try {
          const state = await fetchConnectionState(instance.instanceName);
          return { ...instance, connectionState: state };
        } catch (error) {
          console.error(`Error checking status for ${instance.instanceName}:`, error);
          return { ...instance, connectionState: 'closed' };
        }
      })
    );
    setInstances(updatedInstances);
  };

  // Function to fetch connection state for an instance
  const fetchConnectionState = async (instanceName: string): Promise<'open' | 'closed' | 'connecting'> => {
    try {
      const serverUrl = "evolutionapi2.innova1001.com.br";
      const apiKey = "beeb77fbd7f48f91db2cd539a573c130";

      const response = await fetch(`https://${serverUrl}/instance/connectionState/${encodeURIComponent(instanceName)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'apikey': apiKey
        }
      });

      if (!response.ok) {
        return 'closed';
      }

      const data = await response.json();
      return data.instance?.state || 'closed';
    } catch (error) {
      console.error("Error fetching connection state:", error);
      return 'closed';
    }
  };

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

      // Create new instance object
      const newInstance: WhatsAppInstance = {
        instanceName,
        instanceId: data.instance.instanceId,
        phoneNumber,
        status: data.instance.status,
        qrcode: data.qrcode,
        connectionState: 'connecting'
      };
      
      // Add new instance to the list
      setInstances(prevInstances => [...prevInstances, newInstance]);
      
      toast({
        title: "Sucesso!",
        description: "Instância do WhatsApp criada com sucesso!"
      });
      
      // Reset form fields
      setInstanceName(localStorage.getItem('userName') || '');
      setPhoneNumber('');
      
      // If there's a QR code in the response, show it
      if (data.qrcode) {
        setActiveInstance(newInstance);
        setQrCodeData(data.qrcode.base64);
        setQrDialogOpen(true);
      }

      // Trigger a status check for all instances
      checkAllInstancesStatus();
    } catch (error) {
      console.error("Error creating WhatsApp instance:", error);
      toast({
        title: "Erro na criação da instância",
        description: "Ocorreu um erro ao conectar com a API. Tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchQrCode = async (instance: WhatsAppInstance) => {
    setActiveInstance(instance);
    setLoadingQR(true);
    setQrError(null);
    setQrDialogOpen(true);

    try {
      const serverUrl = "evolutionapi2.innova1001.com.br";
      const apiKey = "beeb77fbd7f48f91db2cd539a573c130";

      // Updated endpoint to use instance name instead of instanceId
      const response = await fetch(`https://${serverUrl}/instance/connect/${encodeURIComponent(instance.instanceName)}`, {
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

      // Using the "code" field from the response as the QR code data
      if (data && data.code) {
        // Save the base64 image data directly - it already contains the data:image prefix
        setQrCodeData(data.base64);
      } else {
        setQrError("QR Code não disponível. A instância pode já estar conectada ou houve um erro na API.");
      }
    } catch (error) {
      console.error("Error fetching QR code:", error);
      setQrError("Falha ao obter QR Code. Verifique a conexão ou tente novamente mais tarde.");
      toast({
        title: "Erro ao obter QR Code",
        description: "Não foi possível obter o QR Code. Tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setLoadingQR(false);
    }
  };

  const deleteInstance = (instanceId: string) => {
    setInstances(prevInstances => prevInstances.filter(instance => instance.instanceId !== instanceId));
    // If we're viewing QR code for this instance, close the dialog
    if (activeInstance?.instanceId === instanceId) {
      setQrDialogOpen(false);
    }
    // Update localStorage
    const updatedInstances = instances.filter(instance => instance.instanceId !== instanceId);
    localStorage.setItem('whatsappInstances', JSON.stringify(updatedInstances));
    
    toast({
      title: "Instância removida",
      description: "A instância do WhatsApp foi removida com sucesso.",
    });
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-tight">Conectar WhatsApp</h1>
        </div>
        
        {/* Form to create a new instance */}
        <Card>
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
        
        {/* List of created instances */}
        {instances.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Instâncias Criadas</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {instances.map((instance) => (
                <Card key={instance.instanceId} className="h-full">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{instance.instanceName}</CardTitle>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="space-y-2">
                      <div className="flex items-center text-sm">
                        <Smartphone className="h-4 w-4 mr-2 text-gray-500" />
                        <span>{instance.phoneNumber}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        {instance.connectionState === 'open' ? (
                          <Badge variant="success" className="flex items-center gap-1">
                            <span className="inline-block w-2 h-2 rounded-full bg-green-500"></span>
                            Status: Conectado
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="flex items-center gap-1 text-red-500 border-red-300">
                            <span className="inline-block w-2 h-2 rounded-full bg-red-500"></span>
                            Status: Desconectado
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => fetchQrCode(instance)}
                      className="flex items-center"
                    >
                      <QrCode className="h-4 w-4 mr-2" />
                      Ver QR Code
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      onClick={() => deleteInstance(instance.instanceId)}
                    >
                      Remover
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        )}
        
        {/* QR Code Dialog */}
        <Dialog open={qrDialogOpen} onOpenChange={setQrDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Conectar WhatsApp - {activeInstance?.instanceName}</DialogTitle>
              <DialogDescription>
                Escaneie o QR Code com seu WhatsApp para finalizar a conexão
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col items-center space-y-4 py-4">
              {loadingQR && (
                <div className="text-center py-8">
                  <p>Carregando QR Code...</p>
                </div>
              )}
              
              {qrCodeData && !loadingQR && (
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
                </div>
              )}
              
              {qrError && !loadingQR && (
                <Alert variant="destructive" className="mb-4">
                  <AlertDescription>{qrError}</AlertDescription>
                </Alert>
              )}
              
              <div className="flex space-x-2">
                {activeInstance && (
                  <Button 
                    variant="outline" 
                    onClick={() => fetchQrCode(activeInstance)} 
                    disabled={loadingQR}
                    className="flex items-center"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Atualizar QR Code
                  </Button>
                )}
                <Button variant="ghost" onClick={() => setQrDialogOpen(false)}>
                  Fechar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default WhatsApp;
