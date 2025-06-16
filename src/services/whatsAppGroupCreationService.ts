
import { supabase } from "@/integrations/supabase/client";

interface CreateGroupResponse {
  id: string;
  subject: string;
  description?: string;
  participants?: string[];
}

/**
 * Cria um grupo WhatsApp via API da Evolution usando o padrão correto
 */
export async function createWhatsAppGroup(
  userEmail: string
): Promise<CreateGroupResponse> {
  try {
    // Extrair nome do usuário do email (parte antes do @)
    const userName = userEmail.split('@')[0];
    const groupSubject = `finance${userName}`;
    
    const url = `https://evolutionapi2.innova1001.com.br/group/create/${userEmail}`;
    
    const requestBody = {
      subject: groupSubject,
      description: "Finance Home seu controle sem complicação",
      participants: ["5561992444275"]
    };
    
    console.log('Criando grupo WhatsApp:', { url, requestBody });
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': 'beeb77fbd7f48f91db2cd539a573c130'
      },
      body: JSON.stringify(requestBody)
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Erro na resposta da API:', response.status, errorText);
      throw new Error(`Falha ao criar grupo: ${response.status} - ${errorText}`);
    }
    
    const data = await response.json();
    console.log('Grupo criado com sucesso:', data);
    
    return data;
  } catch (error) {
    console.error('Erro ao criar grupo WhatsApp:', error);
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
    const { error } = await supabase
      .from('grupos_whatsapp')
      .update({ remote_jid: remoteJid })
      .eq('id', groupId);
    
    if (error) {
      console.error('Erro ao atualizar remote_jid:', error);
      throw error;
    }
    
    console.log(`Remote JID atualizado para o grupo ${groupId}: ${remoteJid}`);
  } catch (error) {
    console.error('Erro ao atualizar remote_jid no banco:', error);
    throw error;
  }
}
