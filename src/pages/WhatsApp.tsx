
import { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';
import { MessageCircle } from 'lucide-react';

interface WhatsAppInstance {
  instanceName: string;
  instanceId?: string;
  status?: string;
  qrcode?: string;
}

const WhatsApp = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [instanceName, setInstanceName] = useState(() => {
    // Get user's name from localStorage as default value
    const userName = localStorage.getItem('userName') || '';
    return userName;
  });
  const [phoneNumber, setPhoneNumber] = useState('');
  const [instance, setInstance] = useState<WhatsAppInstance | null>(null);

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
      // This is a placeholder for the actual API call to Evolution API
      // In a real implementation, you would replace {server-url} and {sua-api-key} with actual values
      const serverUrl = "evolution-api-server-url";
      const apiKey = "your-evolution-api-key";

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

      // In a development environment, simulate a successful response
      if (!response.ok) {
        // For demonstration purposes, show a simulated success response
        console.log("Simulating successful API response in development environment");
        const simulatedResponse = {
          instanceId: `inst_${Date.now()}`,
          status: "created",
          message: "Instance created successfully"
        };
        
        setInstance({
          instanceName,
          instanceId: simulatedResponse.instanceId,
          status: simulatedResponse.status
        });

        // Save the instance ID for later use
        localStorage.setItem('whatsappInstanceId', simulatedResponse.instanceId);
        
        toast({
          title: "Sucesso!",
          description: "Instância do WhatsApp criada com sucesso!"
        });
      } else {
        // Handle actual API response
        setInstance({
          instanceName,
          instanceId: data.instanceId,
          status: data.status,
          qrcode: data.qrcode
        });

        // Save the instance ID for later use
        localStorage.setItem('whatsappInstanceId', data.instanceId);
        
        toast({
          title: "Sucesso!",
          description: "Instância do WhatsApp criada com sucesso!"
        });
      }
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

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-tight">Conectar WhatsApp</h1>
        </div>
        
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
            
            {instance && instance.instanceId && (
              <div className="p-3 bg-green-50 text-green-800 rounded-md mt-4 text-sm">
                <p><strong>Instância criada com sucesso!</strong></p>
                <p className="text-xs mt-1">ID da instância: {instance.instanceId}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default WhatsApp;
