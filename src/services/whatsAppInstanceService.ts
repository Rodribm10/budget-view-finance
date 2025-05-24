
import { supabase } from "@/integrations/supabase/client";

/**
 * Atualiza a instância WhatsApp do usuário no banco de dados
 */
export async function updateUserWhatsAppInstance(
  userEmail: string, 
  instanceName: string, 
  status: 'conectado' | 'desconectado'
): Promise<void> {
  try {
    console.log(`Atualizando instância no banco: ${userEmail} -> ${instanceName} (${status})`);
    
    const { error } = await supabase
      .from('usuarios')
      .update({ 
        instancia_zap: instanceName,
        status_instancia: status
      })
      .eq('email', userEmail.trim().toLowerCase());
    
    if (error) {
      console.error('Erro ao atualizar instância WhatsApp:', error);
      throw error;
    }
    
    console.log(`Instância WhatsApp atualizada com sucesso: ${instanceName} - ${status}`);
  } catch (error) {
    console.error('Erro ao atualizar instância WhatsApp no banco:', error);
    throw error;
  }
}

/**
 * Busca a instância WhatsApp do usuário
 */
export async function getUserWhatsAppInstance(userEmail: string): Promise<{
  instancia_zap: string | null;
  status_instancia: string | null;
  whatsapp: string | null;
} | null> {
  try {
    console.log('Buscando instância para o email:', userEmail);
    
    const { data, error } = await supabase
      .from('usuarios')
      .select('instancia_zap, status_instancia, whatsapp')
      .eq('email', userEmail.trim().toLowerCase())
      .maybeSingle();
    
    if (error) {
      console.error('Erro ao buscar instância WhatsApp:', error);
      throw error;
    }
    
    console.log('Dados da instância encontrados no banco:', data);
    
    // Se não encontrou dados, retorna null
    if (!data) {
      console.log('Nenhum usuário encontrado com o email:', userEmail);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Erro ao buscar instância WhatsApp:', error);
    throw error;
  }
}

/**
 * Verifica se o usuário já possui uma instância ativa
 */
export async function checkUserHasInstance(userEmail: string): Promise<boolean> {
  try {
    const instanceData = await getUserWhatsAppInstance(userEmail);
    const hasInstance = !!(instanceData && instanceData.instancia_zap && instanceData.instancia_zap.trim() !== '');
    console.log(`Usuário ${userEmail} tem instância:`, hasInstance, instanceData);
    return hasInstance;
  } catch (error) {
    console.error('Erro ao verificar se usuário tem instância:', error);
    return false;
  }
}

/**
 * Remove a instância WhatsApp do usuário
 */
export async function removeUserWhatsAppInstance(userEmail: string): Promise<void> {
  try {
    console.log(`Removendo instância do usuário: ${userEmail}`);
    
    const { error } = await supabase
      .from('usuarios')
      .update({ 
        instancia_zap: null,
        status_instancia: 'desconectado'
      })
      .eq('email', userEmail.trim().toLowerCase());
    
    if (error) {
      console.error('Erro ao remover instância WhatsApp:', error);
      throw error;
    }
    
    console.log('Instância WhatsApp removida com sucesso');
  } catch (error) {
    console.error('Erro ao remover instância WhatsApp do banco:', error);
    throw error;
  }
}

/**
 * Busca dados completos do usuário para debug
 */
export async function getUserDebugInfo(userEmail: string): Promise<any> {
  try {
    console.log('Buscando informações completas do usuário para debug:', userEmail);
    
    const { data, error } = await supabase
      .from('usuarios')
      .select('*')
      .eq('email', userEmail.trim().toLowerCase())
      .maybeSingle();
    
    if (error) {
      console.error('Erro ao buscar informações completas do usuário:', error);
      throw error;
    }
    
    console.log('Informações completas do usuário encontradas:', data);
    return data;
  } catch (error) {
    console.error('Erro ao buscar informações completas do usuário:', error);
    throw error;
  }
}
