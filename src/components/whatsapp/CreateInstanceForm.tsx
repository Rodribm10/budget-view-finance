
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Plus, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { restartInstance } from '@/services/whatsAppService';
import { WhatsAppInstance } from '@/types/whatsAppTypes';
import { updateUserWhatsAppInstance } from '@/services/whatsAppInstance/userOperations';
import { createEvolutionWebhook } from '@/services/whatsApp/webhookService';

interface CreateInstanceFormProps {
  onInstanceCreated: (instance: WhatsAppInstance) => void;
  initialInstanceName?: string;
}

const CreateInstanceForm = ({ onInstanceCreated, initialInstanceName = '' }: CreateInstanceFormProps) => {
  const { toast } = useToast();
  const [isCreating, setIsCreating] = useState(false);
  const [userEmail, setUserEmail] = useState(initialInstanceName);
  const [ddd, setDdd] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  const handleCreateInstance = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userEmail.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, informe seu email",
        variant: "destructive",
      });
      return;
    }

    if (!ddd.trim() || ddd.length !== 2) {
      toast({
        title: "Erro", 
        description: "Por favor, informe um DDD válido (2 dígitos)",
        variant: "destructive",
      });
      return;
    }

    if (!phoneNumber.trim() || phoneNumber.length < 8) {
      toast({
        title: "Erro",
        description: "Por favor, informe um número de telefone válido",
        variant: "destructive",
      });
      return;
    }

    setIsCreating(true);

    try {
      // ⚠️ PADRONIZAÇÃO CRÍTICA: Converter email para lowercase
      const normalizedEmail = userEmail.trim().toLowerCase();
      
      // Construir o número completo: +55 + DDD + número
      const fullPhoneNumber = `55${ddd}${phoneNumber}`;
      
      console.log(`🚀 Criando instância para: ${normalizedEmail} com número: ${fullPhoneNumber}`);

      // Criar a instância no Evolution API
      const response = await restartInstance(normalizedEmail, fullPhoneNumber);
      
      if (response && response.instance) {
        const instanceData: WhatsAppInstance = {
          instanceId: `${normalizedEmail}-${Date.now()}`,
          instanceName: normalizedEmail,
          phoneNumber: fullPhoneNumber,
          connectionState: response.instance.state || 'closed',
          qrcode: response.qrcode || null,
          status: response.instance.state === 'open' ? 'connected' : 'disconnected',
          lastSeen: new Date().toISOString(),
          presence: 'offline',
          userId: normalizedEmail
        };

        console.log('✅ Instância criada:', instanceData);

        // Atualizar no banco de dados local com o número de telefone
        await updateUserWhatsAppInstance(normalizedEmail, normalizedEmail, 'conectado', fullPhoneNumber);
        
        // Criar webhook na Evolution API
        await createEvolutionWebhook(normalizedEmail);

        toast({
          title: "Sucesso!",
          description: "Instância criada com sucesso. Use o QR Code para conectar.",
        });

        onInstanceCreated(instanceData);

      } else {
        throw new Error('Resposta inválida da API');
      }

    } catch (error) {
      console.error('❌ Erro ao criar instância:', error);
      
      let errorMessage = 'Erro desconhecido ao criar instância';
      if (error instanceof Error) {
        errorMessage = error.message;
      }

      toast({
        title: "Erro ao criar instância",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Conectar WhatsApp
        </CardTitle>
        <CardDescription>
          Conecte uma nova instância do WhatsApp para enviar mensagens automáticas
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleCreateInstance} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="userEmail">Email do usuário</Label>
            <Input
              id="userEmail"
              type="email"
              placeholder="seu.email@exemplo.com"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              disabled={isCreating}
              required
            />
            <p className="text-sm text-muted-foreground">
              Este será o identificador único da sua instância
            </p>
          </div>

          <div className="space-y-2">
            <Label>Número do WhatsApp</Label>
            <div className="flex items-center gap-2">
              {/* Código do país fixo */}
              <div className="flex items-center">
                <Input
                  value="+55"
                  disabled
                  className="w-16 bg-gray-100 text-center font-medium"
                />
              </div>
              
              {/* Campo DDD */}
              <div className="flex-shrink-0">
                <Input
                  placeholder="(XX)"
                  value={ddd}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '').slice(0, 2);
                    setDdd(value);
                  }}
                  disabled={isCreating}
                  className="w-16 text-center"
                  maxLength={2}
                  required
                />
              </div>
              
              {/* Campo número */}
              <div className="flex-1">
                <Input
                  placeholder="9XXXX-XXXX"
                  value={phoneNumber}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '').slice(0, 9);
                    setPhoneNumber(value);
                  }}
                  disabled={isCreating}
                  maxLength={9}
                  required
                />
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Digite seu DDD e o número do seu celular
            </p>
          </div>

          <Button type="submit" disabled={isCreating} className="w-full">
            {isCreating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Criando instância...
              </>
            ) : (
              <>
                <Plus className="mr-2 h-4 w-4" />
                Conectar WhatsApp
              </>
            )}
          </Button>

          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Após criar a instância, você precisará escanear o QR Code com o WhatsApp 
              do seu celular para estabelecer a conexão.
            </AlertDescription>
          </Alert>
        </form>
      </CardContent>
    </Card>
  );
};

export default CreateInstanceForm;
