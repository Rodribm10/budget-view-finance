
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
    
    console.log(`Instância WhatsApp atualizada: ${instanceName} - ${status}`);
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
      .maybeSingle(); // Use maybeSingle em vez de single para evitar erro quando não encontrar
    
    if (error) {
      console.error('Erro ao buscar instância WhatsApp:', error);
      return null;
    }
    
    console.log('Dados da instância encontrados:', data);
    return data;
  } catch (error) {
    console.error('Erro ao buscar instância WhatsApp:', error);
    return null;
  }
}
