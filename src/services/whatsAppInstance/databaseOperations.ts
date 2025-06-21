
import { supabase } from '@/integrations/supabase/client';

/**
 * Database operations for WhatsApp instances
 */

/**
 * Gets user WhatsApp instance information from database
 */
export async function getUserWhatsAppInstance(userEmail: string): Promise<any> {
  try {
    const normalizedEmail = userEmail.toLowerCase().trim();
    console.log(`Buscando instância para usuário: ${normalizedEmail}`);
    
    const { data, error } = await supabase
      .from('usuarios')
      .select('instancia_zap, status_instancia, whatsapp, webhook, n8n_workflow_id')
      .eq('email', normalizedEmail)
      .single();
    
    if (error) {
      console.error('Erro ao buscar instância do usuário:', error);
      throw error;
    }
    
    console.log('Dados da instância encontrados:', data);
    return data;
  } catch (error) {
    console.error('Erro na operação de busca:', error);
    throw error;
  }
}

/**
 * Updates user WhatsApp instance information in database
 */
export async function updateUserWhatsAppInstance(
  userEmail: string, 
  instanceData: {
    instanceName?: string;
    status?: string;
    phoneNumber?: string;
    webhook?: string;
    workflowId?: string;
  }
): Promise<void> {
  try {
    const normalizedEmail = userEmail.toLowerCase().trim();
    console.log(`Atualizando instância para usuário: ${normalizedEmail}`, instanceData);
    
    const updateData: any = {};
    
    if (instanceData.instanceName !== undefined) {
      updateData.instancia_zap = instanceData.instanceName;
    }
    if (instanceData.status !== undefined) {
      updateData.status_instancia = instanceData.status;
    }
    if (instanceData.phoneNumber !== undefined) {
      updateData.whatsapp = instanceData.phoneNumber;
    }
    if (instanceData.webhook !== undefined) {
      updateData.webhook = instanceData.webhook;
    }
    if (instanceData.workflowId !== undefined) {
      updateData.n8n_workflow_id = instanceData.workflowId;
    }
    
    const { error } = await supabase
      .from('usuarios')
      .update(updateData)
      .eq('email', normalizedEmail);
    
    if (error) {
      console.error('Erro ao atualizar instância:', error);
      throw error;
    }
    
    console.log('✅ Instância atualizada com sucesso');
  } catch (error) {
    console.error('❌ Erro ao atualizar instância:', error);
    throw error;
  }
}

/**
 * Removes user WhatsApp instance from database
 */
export async function removeUserWhatsAppInstance(userEmail: string): Promise<void> {
  try {
    const normalizedEmail = userEmail.toLowerCase().trim();
    console.log(`Removendo instância para usuário: ${normalizedEmail}`);
    
    const { error } = await supabase
      .from('usuarios')
      .update({
        instancia_zap: null,
        status_instancia: 'desconectado',
        whatsapp: null
      })
      .eq('email', normalizedEmail);
    
    if (error) {
      console.error('Erro ao remover instância:', error);
      throw error;
    }
    
    console.log('✅ Instância removida com sucesso');
  } catch (error) {
    console.error('❌ Erro ao remover instância:', error);
    throw error;
  }
}

/**
 * Gets debug information for a user
 */
export async function getUserDebugInfo(userEmail: string): Promise<any> {
  try {
    const normalizedEmail = userEmail.toLowerCase().trim();
    console.log(`Buscando informações de debug para: ${normalizedEmail}`);
    
    const { data, error } = await supabase
      .from('usuarios')
      .select('*')
      .eq('email', normalizedEmail)
      .single();
    
    if (error) {
      console.error('Erro ao buscar debug info:', error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Erro na busca de debug info:', error);
    throw error;
  }
}
