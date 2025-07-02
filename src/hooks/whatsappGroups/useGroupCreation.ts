
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

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

    setCadastrando(true);
    
    try {
      // Buscar o número de WhatsApp do usuário na tabela usuarios
      console.log('🔍 Buscando WhatsApp do usuário na tabela usuarios...');
      const { data: userData, error: userError } = await supabase
        .from('usuarios')
        .select('whatsapp')
        .eq('email', userEmail.toLowerCase().trim())
        .single();

      if (userError) {
        console.error('❌ Erro ao buscar dados do usuário:', userError);
        throw new Error('Erro ao buscar dados do usuário');
      }

      if (!userData?.whatsapp) {
        console.error('❌ WhatsApp não encontrado para o usuário');
        throw new Error('Número de WhatsApp não encontrado. Verifique seu cadastro.');
      }

      console.log('✅ WhatsApp encontrado:', userData.whatsapp);

      // 1. Webhook para criar grupo via N8N
      console.log("🔔 [GRUPO] Enviando webhook para criar grupo via N8N");
      
      const webhookCriarGrupo = 'https://webhookn8n.innova1001.com.br/webhook/criargrupofinance';
      const webhookData = {
        email: userEmail,
        whatsapp: userData.whatsapp, // Usar o WhatsApp da tabela usuarios
        nomeGrupo: nomeGrupo.trim(),
        instancia: userData.whatsapp, // Usar o WhatsApp como instância também
        timestamp: new Date().toISOString()
      };
      
      console.log('🔔 Enviando dados para webhook criar grupo:', webhookData);
      
      const responseCriar = await fetch(webhookCriarGrupo, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(webhookData)
      });
      
      if (!responseCriar.ok) {
        const errorText = await responseCriar.text();
        console.error(`❌ Erro ao enviar webhook criar grupo: ${responseCriar.status} - ${errorText}`);
        throw new Error(`Erro ao criar grupo via N8N: ${responseCriar.status}`);
      }
      
      console.log('✅ [GRUPO] Webhook criar grupo enviado com sucesso');

      // 2. Webhook para ativar workflow
      console.log("🔔 [GRUPO] Enviando webhook ativar workflow");
      
      const webhookAtivarWorkflow = 'https://webhookn8n.innova1001.com.br/webhook/ativarworkflow';
      const webhookAtivarData = {
        email: userEmail,
        timestamp: new Date().toISOString(),
        action: 'activate_workflow'
      };
      
      console.log('🔔 Enviando dados para webhook ativar workflow:', webhookAtivarData);
      
      try {
        const responseAtivar = await fetch(webhookAtivarWorkflow, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(webhookAtivarData)
        });
        
        if (!responseAtivar.ok) {
          const errorText = await responseAtivar.text();
          console.error(`❌ Erro ao enviar webhook ativar workflow: ${responseAtivar.status} - ${errorText}`);
        } else {
          console.log('✅ [GRUPO] Webhook ativar workflow enviado com sucesso');
        }
      } catch (error) {
        console.error('❌ Erro ao enviar webhook ativar workflow:', error);
      }

      // 3. Webhook para configurar hook da Evolution API
      console.log("🔔 [GRUPO] Enviando webhook configurar hook");
      
      const webhookHook = 'https://webhookn8n.innova1001.com.br/webhook/hook';
      const webhookHookData = {
        email: userEmail,
        timestamp: new Date().toISOString()
      };
      
      console.log('🔔 Enviando dados para webhook hook:', webhookHookData);
      
      try {
        const responseHook = await fetch(webhookHook, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(webhookHookData)
        });
        
        if (!responseHook.ok) {
          const errorText = await responseHook.text();
          console.error(`❌ Erro ao enviar webhook hook: ${responseHook.status} - ${errorText}`);
        } else {
          console.log('✅ [GRUPO] Webhook hook enviado com sucesso');
        }
      } catch (error) {
        console.error('❌ Erro ao enviar webhook hook:', error);
      }
      
      toast({
        title: 'Sucesso!',
        description: `Solicitação para criar grupo "${nomeGrupo}" enviada com sucesso!`,
        variant: 'default',
      });
      
      // Atualizar a lista de grupos
      onSuccess();
      
    } catch (error) {
      console.error('❌ Erro ao processar cadastro do grupo:', error);
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
