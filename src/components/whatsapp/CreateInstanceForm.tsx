
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { MessageCircle, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { createWhatsAppInstance } from '@/services/whatsAppService';
import { updateUserWhatsAppInstance, getUserWhatsAppInstance } from '@/services/whatsAppInstanceService';
import { WhatsAppInstance } from '@/types/whatsAppTypes';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface CreateInstanceFormProps {
  onInstanceCreated: (instance: WhatsAppInstance) => void;
  initialInstanceName?: string;
}

const CreateInstanceForm = ({ 
  onInstanceCreated, 
  initialInstanceName = '' 
}: CreateInstanceFormProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [hasExistingInstance, setHasExistingInstance] = useState(false);
  const [checkingExistingInstance, setCheckingExistingInstance] = useState(true);
  const currentUserId = localStorage.getItem('userId') || '';
  const userEmail = localStorage.getItem('userEmail') || '';
  
  // Nome da instância será sempre o email do usuário
  const instanceName = userEmail;

  // Verificar se o usuário já tem uma instância
  useEffect(() => {
    const checkExistingInstance = async () => {
      if (!userEmail) {
        setCheckingExistingInstance(false);
        return;
      }

      try {
        console.log('Verificando se usuário já tem instância:', userEmail);
        const existingInstance = await getUserWhatsAppInstance(userEmail);
        
        if (existingInstance && existingInstance.instancia_zap) {
          console.log('Usuário já possui instância:', existingInstance.instancia_zap);
          setHasExistingInstance(true);
        } else {
          console.log('Usuário não possui instância');
          setHasExistingInstance(false);
        }
      } catch (error) {
        console.error('Erro ao verificar instância existente:', error);
        setHasExistingInstance(false);
      } finally {
        setCheckingExistingInstance(false);
      }
    };

    checkExistingInstance();
  }, [userEmail]);

  const handleCreateInstance = async () => {
    // Validate form fields
    if (!userEmail) {
      toast({
        title: "Erro",
        description: "Email do usuário não encontrado. Faça login novamente.",
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

    // Ensure user is logged in
    if (!currentUserId) {
      toast({
        title: "Erro de autenticação",
        description: "Você precisa estar logado para criar uma instância",
        variant: "destructive",
      });
      return;
    }

    // Verificar novamente se já existe instância antes de criar
    if (hasExistingInstance) {
      toast({
        title: "Erro",
        description: "Você já possui uma instância WhatsApp. Apenas uma instância por usuário é permitida.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      console.log(`Criando instância com nome ${instanceName} e número ${phoneNumber}`);
      
      // 1. Primeiro atualizar o banco de dados com a instância
      await updateUserWhatsAppInstance(userEmail, instanceName, 'desconectado');
      console.log('Instância registrada no banco de dados');

      // 2. Criar instância na API
      const data = await createWhatsAppInstance(instanceName, phoneNumber);
      console.log('Resposta da API de criação de instância:', data);

      // 3. Criar objeto da instância
      const newInstance: WhatsAppInstance = {
        instanceName,
        instanceId: instanceName,
        phoneNumber,
        userId: currentUserId,
        status: data.instance?.status || 'created',
        qrcode: data.qrcode?.base64 || null,
        connectionState: 'closed'
      };
      
      console.log('Nova instância criada:', newInstance);
      
      // 4. Atualizar estado para evitar nova criação
      setHasExistingInstance(true);
      
      // 5. Notificar componente pai
      onInstanceCreated(newInstance);
      
      toast({
        title: "Sucesso!",
        description: "Instância do WhatsApp criada com sucesso!"
      });
      
      // Reset form fields
      setPhoneNumber('');
      
    } catch (error) {
      console.error("Erro ao criar instância WhatsApp:", error);
      
      // Se houve erro na API, remover do banco de dados
      try {
        await updateUserWhatsAppInstance(userEmail, '', 'desconectado');
        console.log('Instância removida do banco devido ao erro na API');
      } catch (dbError) {
        console.error('Erro ao remover instância do banco:', dbError);
      }
      
      toast({
        title: "Erro na criação da instância",
        description: "Ocorreu um erro ao conectar com a API. Tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (checkingExistingInstance) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p>Verificando instâncias existentes...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (hasExistingInstance) {
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
              Sua instância atual: <strong>{instanceName}</strong>
            </AlertDescription>
          </Alert>
          
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded">
            <p className="text-green-800 text-sm">
              <strong>✓ Instância ativa:</strong> {instanceName}
            </p>
            <p className="text-green-700 text-sm mt-1">
              Para gerenciar sua instância, utilize os botões na lista de instâncias acima.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
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
            disabled
            className="bg-gray-100"
          />
          <p className="text-xs text-muted-foreground">
            O nome da instância será automaticamente seu email de login
          </p>
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
          onClick={handleCreateInstance}
          disabled={loading || !userEmail || !phoneNumber.trim()}
        >
          {loading ? "Criando..." : "Criar Instância"}
        </Button>
        
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded">
          <h4 className="font-medium text-blue-800 mb-2">Importante:</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Apenas uma instância por usuário é permitida</li>
            <li>• O nome da instância será seu email de login</li>
            <li>• Após criar, você precisará escanear o QR Code para conectar</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default CreateInstanceForm;
