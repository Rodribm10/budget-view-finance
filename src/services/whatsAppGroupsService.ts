// Service dedicated to WhatsApp groups database operations
import { supabase } from "@/integrations/supabase/client";
import { WhatsAppGroup } from "@/types/financialTypes";

/**
 * Updates the workflow_id for a specific WhatsApp group
 * @param groupId The ID of the group to update
 * @param workflowId The workflow ID to associate with the group
 */
export async function updateWorkflowId(groupId: number, workflowId: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('grupos_whatsapp')
      .update({ workflow_id: workflowId })
      .eq('id', groupId);
    
    if (error) {
      console.error('Erro ao atualizar workflow_id:', error);
      throw error;
    }
    
    console.log(`Workflow ID ${workflowId} atualizado com sucesso para o grupo ${groupId}`);
  } catch (error) {
    console.error('Erro ao atualizar workflow_id no banco de dados:', error);
    throw error;
  }
}

/**
 * Gets an existing or creates a new WhatsApp group for a user
 * @param nomeGrupo Optional name for the group
 * @returns The created or existing WhatsApp group
 */
export async function findOrCreateWhatsAppGroup(nomeGrupo?: string): Promise<WhatsAppGroup | null> {
  try {
    // Obter o email do usuário do localStorage
    const userEmail = localStorage.getItem('userEmail');
    
    if (!userEmail) {
      console.error('Email do usuário não encontrado no localStorage');
      return null;
    }
    
    // Normalizar o email (minúsculo e sem espaços)
    const normalizedEmail = userEmail.trim().toLowerCase();
    
    // Verificar se já existe um grupo pendente para este usuário
    const { data: existingGroups } = await supabase
      .from('grupos_whatsapp')
      .select('*')
      .eq('login', normalizedEmail)
      .eq('remote_jid', '')
      .eq('status', 'pendente');
    
    let groupToUse: WhatsAppGroup | null = null;
    
    if (existingGroups && existingGroups.length > 0) {
      console.log('Grupo pendente já existe para este usuário:', existingGroups[0]);
      groupToUse = existingGroups[0];
      
      // Atualizar nome do grupo se foi fornecido
      if (nomeGrupo && nomeGrupo.trim() !== '' && nomeGrupo !== groupToUse.nome_grupo) {
        console.log('Atualizando nome do grupo existente para:', nomeGrupo);
        const { error } = await supabase
          .from('grupos_whatsapp')
          .update({ nome_grupo: nomeGrupo.trim() })
          .eq('id', groupToUse.id);
          
        if (error) {
          console.error('Erro ao atualizar nome do grupo:', error);
        } else {
          groupToUse.nome_grupo = nomeGrupo.trim();
        }
      }
      
      // Se já existe um workflow_id, não precisamos criar novamente
      if (groupToUse.workflow_id) {
        console.log('Workflow já existe para este grupo:', groupToUse.workflow_id);
        return groupToUse;
      }
    } else {
      // Criar registro na tabela grupos_whatsapp se não existir
      console.log('Criando novo grupo para o usuário:', normalizedEmail);
      const { data, error } = await supabase
        .from('grupos_whatsapp')
        .insert({
          user_id: localStorage.getItem('userId') || '',
          remote_jid: '',
          login: normalizedEmail,
          status: 'pendente',
          nome_grupo: nomeGrupo?.trim() || null
        })
        .select();
      
      if (error) {
        console.error('Erro ao cadastrar grupo do WhatsApp:', error);
        throw new Error('Não foi possível cadastrar o grupo de WhatsApp');
      }
      
      if (!data || data.length === 0) {
        console.error('Nenhum dado retornado após inserção');
        return null;
      }
      
      console.log('Grupo WhatsApp cadastrado com sucesso:', data);
      groupToUse = data[0];
    }
    
    return groupToUse;
  } catch (error) {
    console.error('Erro ao encontrar ou criar grupo do WhatsApp:', error);
    throw error;
  }
}

/**
 * Deletes a WhatsApp group from the database
 * @param groupId The ID of the group to delete
 */
export async function deleteWhatsAppGroup(groupId: number): Promise<void> {
  try {
    const { error } = await supabase
      .from('grupos_whatsapp')
      .delete()
      .eq('id', groupId);
    
    if (error) {
      console.error('Erro ao deletar grupo:', error);
      throw error;
    }
    
    console.log(`Grupo ${groupId} deletado com sucesso`);
  } catch (error) {
    console.error('Erro ao deletar grupo do WhatsApp:', error);
    throw error;
  }
}

/**
 * Lists all WhatsApp groups for the current user
 * @returns Array of WhatsApp groups
 */
export async function listWhatsAppGroups(): Promise<WhatsAppGroup[]> {
  try {
    // Obter o email do usuário do localStorage
    const userEmail = localStorage.getItem('userEmail');
    
    if (!userEmail) {
      console.error('Email do usuário não encontrado no localStorage');
      return [];
    }
    
    // Normalizar o email (minúsculo e sem espaços)
    const normalizedEmail = userEmail.trim().toLowerCase();
    
    // Buscar grupos associados ao email do usuário
    const { data, error } = await supabase
      .from('grupos_whatsapp')
      .select('*')
      .eq('login', normalizedEmail)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Erro ao listar grupos do WhatsApp:', error);
      throw new Error('Não foi possível listar os grupos de WhatsApp');
    }
    
    console.log('Grupos WhatsApp encontrados:', data);
    return data || [];
  } catch (error) {
    console.error('Erro ao listar grupos do WhatsApp:', error);
    return [];
  }
}
