
import { supabase } from "@/integrations/supabase/client";

interface CreateGroupResponse {
  id: string;
  subject: string;
  description?: string;
  participants?: string[];
}

/**
 * Cria um grupo WhatsApp via API da Evolution usando o nome escolhido pelo usuário
 */
export async function createWhatsAppGroup(
  userEmail: string,
  groupName: string
): Promise<CreateGroupResponse> {
  try {
    console.log('🚀 Iniciando criação de grupo via API Evolution');
    console.log('📧 Email do usuário:', userEmail);
    console.log('🏷️ Nome do grupo:', groupName);
    
    // Usar a edge function para fazer a requisição segura
    const { data, error } = await supabase.functions.invoke('whatsapp-api', {
      body: {
        endpoint: `/group/create/${encodeURIComponent(userEmail)}`,
        method: 'POST',
        body: {
          subject: groupName,
          description: "Finance Home seu controle sem complicação",
          participants: ["5561992444275"]
        }
      }
    });
    
    if (error) {
      console.error('❌ Erro na edge function:', error);
      throw new Error(`Falha ao criar grupo: ${error.message}`);
    }
    
    if (data.error) {
      console.error('❌ Erro da API Evolution:', data.error);
      throw new Error(`Falha ao criar grupo: ${data.error}`);
    }
    
    console.log('✅ Grupo criado com sucesso:', data);
    return data;
  } catch (error) {
    console.error('❌ Erro ao criar grupo WhatsApp:', error);
    throw error;
  }
}

/**
 * Atualiza o remote_jid do grupo no banco de dados
 */
export async function updateGroupRemoteJid(
  groupId: number,
  remoteJid: string
): Promise<void> {
  try {
    console.log('💾 Atualizando remote_jid no banco de dados');
    console.log('🆔 Group ID:', groupId);
    console.log('📱 Remote JID:', remoteJid);
    
    const { error } = await supabase
      .from('grupos_whatsapp')
      .update({ remote_jid: remoteJid })
      .eq('id', groupId);
    
    if (error) {
      console.error('❌ Erro ao atualizar remote_jid:', error);
      throw error;
    }
    
    console.log('✅ Remote JID atualizado com sucesso');
  } catch (error) {
    console.error('❌ Erro ao atualizar remote_jid no banco:', error);
    throw error;
  }
}
