
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export const useGroupCreation = (userEmail: string, onSuccess: () => void) => {
  const { toast } = useToast();
  const [cadastrando, setCadastrando] = useState<boolean>(false);

  const handleCadastrarGrupo = async (nomeGrupo: string, userInstance: any) => {
    if (!userEmail) {
      toast({
        title: 'Erro',
        description: 'Você precisa estar logado para cadastrar um grupo',
        variant: 'destructive',
      });
      return;
    }

    if (!nomeGrupo.trim()) {
      toast({
        title: 'Atenção',
        description: 'Digite um nome para o grupo',
        variant: 'destructive',
      });
      return;
    }

    //if (!userInstance || !userInstance.instancia_zap || userInstance.status_instancia !== 'conectado') {
    //  toast({
    //    title: 'Erro',
    //    description: 'Instância WhatsApp não está conectada',
    //    variant: 'destructive',
    //  });
    //  return;
    //}

    setCadastrando(true);
    try {
      console.log("🔔 [GRUPO] Enviando webhook para criar grupo via N8N");
      
      // Enviar webhook para N8N criar o grupo
      const webhookUrl = 'https://webhookn8n.innova1001.com.br/webhook/criargrupofinance';
      
      const webhookData = {
        email: userEmail,
        whatsapp: userInstance.whatsapp || '',
        nomeGrupo: nomeGrupo.trim(),
        instancia: userInstance.instancia_zap,
        timestamp: new Date().toISOString()
      };
      
      console.log('🔔 Enviando dados para webhook criar grupo:', webhookData);
      
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(webhookData)
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`❌ Erro ao enviar webhook criar grupo: ${response.status} - ${errorText}`);
        throw new Error(`Erro ao criar grupo via N8N: ${response.status}`);
      }
      
      console.log('✅ [GRUPO] Webhook enviado com sucesso para N8N criar grupo');
      
      toast({
        title: 'Sucesso!',
        description: `Solicitação para criar grupo "${nomeGrupo}" enviada com sucesso!`,
        variant: 'default',
      });
      
      // Atualizar a lista de grupos
      onSuccess();
      
    } catch (error) {
      console.error('❌ Erro ao enviar webhook para criar grupo:', error);
      let errorMsg = 'Erro desconhecido';
      if (error instanceof Error) {
        errorMsg = error.message;
      }
      
      toast({
        title: 'Erro',
        description: `Não foi possível solicitar criação do grupo: ${errorMsg}`,
        variant: 'destructive',
      });
    } finally {
      setCadastrando(false);
    }
  };

  return {
    cadastrando,
    handleCadastrarGrupo
  };
};
