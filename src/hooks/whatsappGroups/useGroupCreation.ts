
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { findOrCreateWhatsAppGroup } from '@/services/whatsAppGroupsService';
import { createWhatsAppGroup, updateGroupRemoteJid } from '@/services/whatsAppGroupCreationService';
import { createEvolutionWebhook } from '@/services/whatsApp/webhookService';

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

    if (!userInstance || !userInstance.instancia_zap || userInstance.status_instancia !== 'conectado') {
      toast({
        title: 'Erro',
        description: 'Instância WhatsApp não está conectada',
        variant: 'destructive',
      });
      return;
    }

    setCadastrando(true);
    try {
      console.log("Iniciando processo de cadastro de grupo...");
      
      // 1. Cadastrar grupo no banco de dados local
      const grupo = await findOrCreateWhatsAppGroup(nomeGrupo.trim());
      
      if (!grupo) {
        throw new Error('Não foi possível cadastrar o grupo no banco de dados');
      }

      // 2. Criar grupo no WhatsApp via API com o nome escolhido pelo usuário
      try {
        const groupResponse = await createWhatsAppGroup(userEmail, nomeGrupo.trim());
        
        console.log('Resposta da criação do grupo:', groupResponse);
        
        // 3. Atualizar remote_jid no banco de dados
        if (groupResponse.id) {
          await updateGroupRemoteJid(grupo.id, groupResponse.id);
          
          // 4. Enviar webhook para N8N configurar webhook da Evolution API
          try {
            console.log(`🔔 Enviando email para N8N configurar webhook: ${userEmail}`);
            await createEvolutionWebhook(userEmail);
            console.log('✅ Email enviado com sucesso para N8N');
          } catch (webhookError) {
            console.error('❌ Erro ao enviar email para N8N:', webhookError);
            // Não falha o processo todo se o webhook falhar
            toast({
              title: 'Atenção',
              description: 'Grupo criado com sucesso, mas houve um problema ao configurar a automação. Entre em contato com o suporte.',
              variant: 'destructive',
            });
          }
          
          toast({
            title: 'Sucesso!',
            description: `Grupo "${nomeGrupo}" criado com sucesso no seu WhatsApp!`,
            variant: 'default',
          });
        } else {
          toast({
            title: 'Atenção',
            description: 'Grupo cadastrado no sistema, mas não foi possível criar no WhatsApp',
            variant: 'destructive',
          });
        }
        
      } catch (apiError) {
        console.error('Erro ao criar grupo via API:', apiError);
        toast({
          title: 'Atenção',
          description: 'Grupo cadastrado no sistema, mas houve erro ao criar no WhatsApp. Verifique sua conexão.',
          variant: 'destructive',
        });
      }
      
      // Atualizar a lista de grupos
      onSuccess();
      
    } catch (error) {
      console.error('Erro ao cadastrar grupo:', error);
      let errorMsg = 'Erro desconhecido';
      if (error instanceof Error) {
        errorMsg = error.message;
      }
      
      toast({
        title: 'Erro',
        description: `Não foi possível registrar o grupo: ${errorMsg}`,
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
