
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';
import { AudioMessage, storeAudioMessageForRodrigo } from '@/services/audioMessageService';
import { WhatsAppInstance } from '@/types/whatsAppTypes';

interface MessageWebhookProps {
  instance?: WhatsAppInstance;
}

const MessageWebhook: React.FC<MessageWebhookProps> = ({ instance }) => {
  const { toast } = useToast();
  const [webhookUrl, setWebhookUrl] = useState<string>('');

  const handleSetWebhook = async () => {
    if (!instance) {
      toast({
        title: "Erro",
        description: "Selecione uma instância primeiro",
        variant: "destructive",
      });
      return;
    }

    try {
      // Here you would set the webhook URL for the Evolution API
      // This is a placeholder for the actual implementation
      toast({
        title: "Webhook Configurado",
        description: `Webhook configurado para ${instance.instanceName}`,
      });
      
      // Simulate receiving an audio message (for testing purposes)
      const testAudioMessage: AudioMessage = {
        sender_id: '120363420212322973@g.us',
        sender_name: 'Teste',
        instance_id: instance.instanceId,
        audio_url: 'https://example.com/audio.mp3',
        duration: 30,
        metadata: {
          test: true
        }
      };
      
      await storeAudioMessageForRodrigo(testAudioMessage);
    } catch (error) {
      console.error('Error setting webhook:', error);
      toast({
        title: "Erro",
        description: "Erro ao configurar webhook",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Configurar Webhook para Mensagens</CardTitle>
        <CardDescription>
          Configure um webhook para receber mensagens da Evolution API.
          Os áudios enviados para o grupo do Rodrigo serão armazenados automaticamente.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="webhook-url">URL do Webhook</Label>
            <Input 
              id="webhook-url"
              placeholder="https://seu-servidor.com/webhook"
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
            />
          </div>
          {instance ? (
            <p className="text-sm text-muted-foreground">
              Configurando para: <strong>{instance.instanceName}</strong>
            </p>
          ) : (
            <p className="text-sm text-yellow-600">
              Selecione uma instância primeiro.
            </p>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleSetWebhook}
          disabled={!instance || !webhookUrl}
        >
          Configurar Webhook
        </Button>
      </CardFooter>
    </Card>
  );
};

export default MessageWebhook;
