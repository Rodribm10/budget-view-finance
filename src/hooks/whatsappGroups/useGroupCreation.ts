
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { createWhatsAppGroup } from '@/services/whatsAppGroupCreationService';

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
      // 1. Primeiro criar o grupo via Evolution API para obter o remote_jid e dados completos
      console.log("🔔 [GRUPO] Criando grupo via Evolution API");
      
      const grupoEvolutionData = await createWhatsAppGroup(userEmail, nomeGrupo.trim());
      console.log('✅ [GRUPO] Grupo criado via Evolution API:', grupoEvolutionData);

      // 2. Webhook para enviar dados completos do grupo criado para N8N
      console.log("🔔 [GRUPO] Enviando webhook para N8N com dados completos do grupo");
      
      const webhookCriarGrupo = 'https://webhookn8n.innova1001.com.br/webhook/criargrupofinance';
      const webhookData = {
        email: userEmail,
        whatsapp: userInstance?.whatsapp || '',
        nomeGrupo: nomeGrupo.trim(),
        instancia: userInstance?.instancia_zap || '',
        timestamp: new Date().toISOString(),
        // Dados completos do grupo criado via Evolution API
        grupoEvolution: grupoEvolutionData,
        remote_jid: grupoEvolutionData.id || null,
        group_id: grupoEvolutionData.id || null,
        subject: grupoEvolutionData.subject || nomeGrupo.trim(),
        description: grupoEvolutionData.description || null,
        participants: grupoEvolutionData.participants || []
      };
      
      console.log('🔔 Enviando dados completos para webhook criar grupo:', webhookData);
      
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
        throw new Error(`Erro ao enviar dados do grupo para N8N: ${responseCriar.status}`);
      }
      
      console.log('✅ [GRUPO] Webhook criar grupo enviado com sucesso');

      // 3. Webhook para ativar workflow
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

      // 4. Webhook para configurar hook da Evolution API
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
        description: `Grupo "${nomeGrupo}" criado e configurado com sucesso!`,
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
        description: `Não foi possível criar o grupo: ${errorMsg}`,
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
