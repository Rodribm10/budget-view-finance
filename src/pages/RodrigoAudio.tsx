
import React, { useEffect, useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AudioMessage, getRodrigoAudioMessages } from '@/services/audioMessageService';
import { format } from 'date-fns';

const RodrigoAudio = () => {
  const [audioMessages, setAudioMessages] = useState<AudioMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchAudioMessages = async () => {
    setIsLoading(true);
    try {
      const messages = await getRodrigoAudioMessages();
      setAudioMessages(messages);
    } catch (error) {
      console.error('Error fetching Rodrigo audio messages:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAudioMessages();
  }, []);

  return (
    <Layout>
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Áudios do Rodrigo</h1>
          <Button 
            onClick={fetchAudioMessages}
            disabled={isLoading}
          >
            {isLoading ? 'Carregando...' : 'Atualizar'}
          </Button>
        </div>

        {audioMessages.length === 0 ? (
          <Card>
            <CardContent className="py-6">
              <div className="text-center text-muted-foreground">
                <p>Nenhuma mensagem de áudio encontrada para Rodrigo.</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {audioMessages.map((message) => (
              <Card key={message.id}>
                <CardHeader>
                  <CardTitle className="text-lg">
                    {message.sender_name || 'Usuário Desconhecido'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      Data: {message.created_at ? format(new Date(message.created_at), 'dd/MM/yyyy HH:mm') : 'N/A'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Duração: {message.duration ? `${message.duration}s` : 'N/A'}
                    </p>
                    {message.audio_url && (
                      <audio controls className="w-full">
                        <source src={message.audio_url} type="audio/mpeg" />
                        Seu navegador não suporta áudio
                      </audio>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default RodrigoAudio;
