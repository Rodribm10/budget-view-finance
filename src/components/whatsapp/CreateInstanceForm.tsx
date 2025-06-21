import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { MessageCircle, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { createWhatsAppInstance } from '@/services/whatsAppService';
import { updateUserWhatsAppInstance, getUserWhatsAppInstance, activateUserWorkflow } from '@/services/whatsAppInstanceService';
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
  const [ddd, setDdd] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [hasExistingInstance, setHasExistingInstance] = useState(false);
  const [checkingExistingInstance, setCheckingExistingInstance] = useState(true);
  const currentUserId = localStorage.getItem('userId') || '';
  const userEmail = (localStorage.getItem('userEmail') || '').toLowerCase();
  
  const instanceName = userEmail;

  // Verificar se o usuário já tem uma instância - verificação mais rigorosa
  useEffect(() => {
    const checkExistingInstance = async () => {
      if (!userEmail) {
        setCheckingExistingInstance(false);
        return;
      }

      try {
        console.log('🔍 Verificando se usuário já tem instância:', userEmail);
        const existingInstance = await getUserWhatsAppInstance(userEmail);
        
        console.log('📋 Dados da instância encontrados:', existingInstance);
        
        // Verificação mais rigorosa - deve ter instancia_zap E não pode estar vazio
        const hasValidInstance = !!(
          existingInstance && 
          existingInstance.instancia_zap && 
          existingInstance.instancia_zap.trim() !== ''
        );
        
        console.log('✅ Usuário possui instância válida:', hasValidInstance);
        setHasExistingInstance(hasValidInstance);
        
      } catch (error) {
        console.error('❌ Erro ao verificar instância existente:', error);
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

    // Validar DDD (2 dígitos)
    if (!ddd.trim() || !/^[0-9]{2}$/.test(ddd)) {
      toast({
        title: "Erro",
        description: "Insira um DDD válido com 2 dígitos (ex: 11, 21, 31)",
        variant: "destructive",
      });
      return;
    }

    // Validar número (8 ou 9 dígitos)
    if (!phoneNumber.trim() || !/^[0-9]{8,9}$/.test(phoneNumber)) {
      toast({
        title: "Erro",
        description: "Insira um número válido com 8 ou 9 dígitos (ex: 987654321)",
        variant: "destructive",
      });
      return;
    }

    // Montar número completo: +55 + DDD + número
    const fullPhoneNumber = `55${ddd}${phoneNumber}`;

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
      console.log(`🚀 Iniciando criação de instância com nome ${instanceName} e número ${fullPhoneNumber}`);
      
      // 1. Criar instância na API
      console.log('📡 Passo 1: Criando instância na API...');
      const data = await createWhatsAppInstance(instanceName, fullPhoneNumber);
      console.log('✅ Resposta da API de criação de instância:', data);

      // 2. Atualizar o banco de dados com status "conectado"
      console.log('💾 Passo 2: Atualizando banco de dados...');
      await updateUserWhatsAppInstance(userEmail, {
        instanceName,
        status: 'conectado'
      });
      console.log('✅ Instância registrada no banco de dados com status "conectado"');

      // 3. Ativar o workflow do usuário no n8n
      console.log('🔄 Passo 3: Ativando workflow do usuário no n8n...');
      try {
        await activateUserWorkflow(userEmail);
        console.log('✅ Workflow ativado com sucesso no n8n');
      } catch (workflowError) {
        console.error('⚠️ Erro ao ativar workflow, mas instância foi criada:', workflowError);
        toast({
          title: "Aviso",
          description: "Instância criada, mas houve um problema ao ativar a automação. Entre em contato com o suporte.",
          variant: "destructive",
        });
      }

      // 4. Criar objeto da instância
      const newInstance: WhatsAppInstance = {
        instanceName,
        instanceId: instanceName,
        phoneNumber: fullPhoneNumber,
        userId: currentUserId,
        status: data.instance?.status || 'created',
        qrcode: data.qrcode?.base64 || null,
        connectionState: 'closed'
      };
      
      console.log('✅ Nova instância criada:', newInstance);
      
      // 5. Atualizar estado para evitar nova criação
      setHasExistingInstance(true);
      
      // 6. Notificar componente pai
      onInstanceCreated(newInstance);
      
      toast({
        title: "Sucesso!",
        description: "Instância do WhatsApp criada e ativada com sucesso!"
      });
      
      // Reset form fields
      setDdd('');
      setPhoneNumber('');
      
    } catch (error) {
      console.error("💥 Erro ao criar instância WhatsApp:", error);
      
      // Se houve erro na API, tentar reverter no banco de dados
      try {
        await updateUserWhatsAppInstance(userEmail, {
          instanceName: '',
          status: 'desconectado'
        });
        console.log('🔄 Instância removida do banco devido ao erro na API');
      } catch (dbError) {
        console.error('❌ Erro ao reverter instância no banco:', dbError);
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
              Para gerenciar sua instância, utilize os botões na lista de instâncias abaixo.
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
          <Label>Número do WhatsApp</Label>
          
          {/* Código do país fixo */}
          <div className="flex items-center space-x-2">
            <div className="flex items-center">
              <span className="text-sm font-medium text-gray-700 bg-gray-100 px-3 py-2 rounded-l border border-r-0 border-gray-300">
                +55
              </span>
            </div>
            
            {/* Campo DDD */}
            <div className="w-20">
              <Input
                id="ddd"
                value={ddd}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '').slice(0, 2);
                  setDdd(value);
                }}
                placeholder="11"
                maxLength={2}
                className="text-center"
              />
            </div>
            
            {/* Campo número */}
            <div className="flex-1">
              <Input
                id="phoneNumber"
                value={phoneNumber}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '').slice(0, 9);
                  setPhoneNumber(value);
                }}
                placeholder="987654321"
                maxLength={9}
              />
            </div>
          </div>
          
          <p className="text-xs text-muted-foreground">
            Digite seu DDD e o número do seu celular
          </p>
        </div>
        
        <Button 
          className="w-full mt-4" 
          onClick={handleCreateInstance}
          disabled={loading || !userEmail || !ddd.trim() || !phoneNumber.trim()}
        >
          {loading ? "Criando..." : "Criar Instância"}
        </Button>
        
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded">
          <h4 className="font-medium text-blue-800 mb-2">Importante:</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Apenas uma instância por usuário é permitida</li>
            <li>• O nome da instância será seu email de login</li>
            <li>• Após criar, você precisará escanear o QR Code para conectar</li>
            <li>• Sua automação financeira será ativada automaticamente</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default CreateInstanceForm;
