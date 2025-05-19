
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { MessageCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { createWhatsAppInstance } from '@/services/whatsAppService';
import { WhatsAppInstance } from '@/types/whatsAppTypes';

interface CreateInstanceFormProps {
  onInstanceCreated: (instance: WhatsAppInstance) => void;
}

const CreateInstanceForm = ({ onInstanceCreated }: CreateInstanceFormProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [instanceName, setInstanceName] = useState(() => {
    // Get user's name from localStorage as default value
    return localStorage.getItem('userName') || '';
  });
  const [phoneNumber, setPhoneNumber] = useState('');
  const currentUserId = localStorage.getItem('userId') || '';

  const handleCreateInstance = async () => {
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

    // Ensure user is logged in
    if (!currentUserId) {
      toast({
        title: "Erro de autenticação",
        description: "Você precisa estar logado para criar uma instância",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const data = await createWhatsAppInstance(instanceName, phoneNumber);
      
      console.log('API response for create instance:', data);

      // Create new instance object with user ID
      const newInstance: WhatsAppInstance = {
        instanceName,
        instanceId: data.instance?.instanceId || Date.now().toString(), // Fallback if instanceId not provided
        phoneNumber,
        userId: currentUserId, // Associate with current user
        status: data.instance?.status || 'created',
        qrcode: data.qrcode?.base64 || null,
        connectionState: 'closed' // Default to closed/disconnected
      };
      
      console.log('New instance created:', newInstance);
      
      // Notify parent component about the new instance
      onInstanceCreated(newInstance);
      
      toast({
        title: "Sucesso!",
        description: "Instância do WhatsApp criada com sucesso!"
      });
      
      // Reset form fields
      setInstanceName(localStorage.getItem('userName') || '');
      setPhoneNumber('');
      
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
          onClick={handleCreateInstance}
          disabled={loading}
        >
          {loading ? "Criando..." : "Criar Instância"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default CreateInstanceForm;
