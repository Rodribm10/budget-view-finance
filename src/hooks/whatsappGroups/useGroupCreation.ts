
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { createWhatsAppGroup } from '@/services/whatsAppGroupCreationService';
import { findOrCreateWhatsAppGroup } from '@/services/whatsAppGroupsService';
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
      // 1. Criar grupo via Evolution API
      console.log("🚀 Criando grupo via Evolution API");
      const grupoEvolution = await createWhatsAppGroup(userEmail, nomeGrupo.trim());
      console.log('✅ Grupo criado via Evolution:', grupoEvolution);

      // 2. Salvar/atualizar dados na tabela grupos_whatsapp
      console.log("💾 Salvando grupo na tabela grupos_whatsapp");
      
      // Primeiro, criar ou encontrar o registro do grupo
      const grupo = await findOrCreateWhatsAppGroup(nomeGrupo.trim());
      
      if (grupo) {
        // Atualizar o registro com o remote_jid retornado pela Evolution
        const { error: updateGrupoError } = await supabase
          .from('grupos_whatsapp')
          .update({ 
            remote_jid: grupoEvolution.id || '',
            status: 'ativo',
            nome_grupo: nomeGrupo.trim()
          })
          .eq('id', grupo.id);

        if (updateGrupoError) {
          console.error('❌ Erro ao atualizar grupo:', updateGrupoError);
        } else {
          console.log('✅ Grupo atualizado na tabela grupos_whatsapp');
        }
      }

      // 3. Atualizar remote_jid na tabela usuarios
      console.log("💾 Atualizando remote_jid na tabela usuarios");
      const { error: updateUsuarioError } = await supabase
        .from('usuarios')
        .update({ remote_jid: grupoEvolution.id || '' })
        .eq('email', userEmail.trim().toLowerCase());

      if (updateUsuarioError) {
        console.error('❌ Erro ao atualizar remote_jid do usuário:', updateUsuarioError);
      } else {
        console.log('✅ Remote JID atualizado na tabela usuarios');
      }

      // 4. Webhook para N8N com todos os dados
      console.log("🔔 [GRUPO] Enviando webhook para N8N com dados completos");
      
      const webhookCriarGrupo = 'https://webhookn8n.innova1001.com.br/webhook/criargrupofinance';
      const webhookData = {
        email: userEmail,
        whatsapp: userInstance?.whatsapp || '',
        nomeGrupo: nomeGrupo.trim(),
        instancia: userInstance?.instancia_zap || '',
        timestamp: new Date().toISOString(),
        // Dados retornados pela Evolution API
        evolutionData: grupoEvolution
      };
      
      console.log('🔔 Enviando dados completos para webhook:', webhookData);
      
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

      // 5. Webhook para ativar workflow
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

      // 6. Webhook para configurar hook da Evolution API
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
