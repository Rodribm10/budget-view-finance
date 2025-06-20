
import { supabase } from "@/integrations/supabase/client";

/**
 * Updates user WhatsApp instance information in the database
 */
export async function updateUserWhatsAppInstance(
  userEmail: string,
  instanceName: string,
  status: string
): Promise<void> {
  try {
    // ⚠️ PADRONIZAÇÃO CRÍTICA: Converter email para lowercase
    const normalizedEmail = userEmail.trim().toLowerCase();
    const normalizedInstanceName = instanceName.trim().toLowerCase();
    
    console.log(`Atualizando instância WhatsApp para usuário: ${normalizedEmail}`);
    
    // Verificar se já existe um registro para este usuário
    const { data: existingUser, error: fetchError } = await supabase
      .from('usuarios')
      .select('*')
      .eq('email', normalizedEmail)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 = no rows returned
      console.error('Erro ao buscar usuário:', fetchError);
      throw fetchError;
    }

    if (existingUser) {
      // Atualizar registro existente
      const { error: updateError } = await supabase
        .from('usuarios')
        .update({
          instancia_zap: normalizedInstanceName,
          status_instancia: status
        })
        .eq('email', normalizedEmail);

      if (updateError) {
        console.error('Erro ao atualizar instância WhatsApp:', updateError);
        throw updateError;
      }

      console.log(`✅ Instância WhatsApp atualizada para ${normalizedEmail}: ${normalizedInstanceName} (${status})`);
    } else {
      // Criar novo registro
      const { error: insertError } = await supabase
        .from('usuarios')
        .insert({
          email: normalizedEmail,
          instancia_zap: normalizedInstanceName,
          status_instancia: status
        });

      if (insertError) {
        console.error('Erro ao criar registro de instância WhatsApp:', insertError);
        throw insertError;
      }

      console.log(`✅ Novo registro de instância WhatsApp criado para ${normalizedEmail}: ${normalizedInstanceName} (${status})`);
    }
  } catch (error) {
    console.error('Erro ao atualizar instância WhatsApp do usuário:', error);
    throw error;
  }
}

/**
 * Gets user WhatsApp instance information from the database
 */
export async function getUserWhatsAppInstance(userEmail: string): Promise<{
  instancia_zap: string | null;
  status_instancia: string | null;
  whatsapp: string | null;
} | null> {
  try {
    // ⚠️ PADRONIZAÇÃO CRÍTICA: Converter email para lowercase
    const normalizedEmail = userEmail.trim().toLowerCase();
    
    console.log(`Buscando instância WhatsApp para usuário: ${normalizedEmail}`);
    
    const { data, error } = await supabase
      .from('usuarios')
      .select('instancia_zap, status_instancia, whatsapp')
      .eq('email', normalizedEmail)
      .single();

    if (error) {
      if (error.code === 'PGRST116') { // No rows returned
        console.log(`Nenhuma instância encontrada para ${normalizedEmail}`);
        return null;
      }
      console.error('Erro ao buscar instância WhatsApp:', error);
      throw error;
    }

    console.log(`✅ Instância encontrada para ${normalizedEmail}:`, data);
    return data;
  } catch (error) {
    console.error('Erro ao buscar instância WhatsApp do usuário:', error);
    throw error;
  }
}

/**
 * Removes user WhatsApp instance information from the database
 */
export async function removeUserWhatsAppInstance(userEmail: string): Promise<void> {
  try {
    // ⚠️ PADRONIZAÇÃO CRÍTICA: Converter email para lowercase
    const normalizedEmail = userEmail.trim().toLowerCase();
    
    console.log(`Removendo instância WhatsApp para usuário: ${normalizedEmail}`);
    
    const { error } = await supabase
      .from('usuarios')
      .update({
        instancia_zap: null,
        status_instancia: null,
        whatsapp: null
      })
      .eq('email', normalizedEmail);

    if (error) {
      console.error('Erro ao remover instância WhatsApp:', error);
      throw error;
    }

    console.log(`✅ Instância WhatsApp removida para ${normalizedEmail}`);
  } catch (error) {
    console.error('Erro ao remover instância WhatsApp do usuário:', error);
    throw error;
  }
}

/**
 * Checks if user has a WhatsApp instance
 */
export async function checkUserHasInstance(userEmail: string): Promise<boolean> {
  try {
    // ⚠️ PADRONIZAÇÃO CRÍTICA: Converter email para lowercase
    const normalizedEmail = userEmail.trim().toLowerCase();
    
    const instanceData = await getUserWhatsAppInstance(normalizedEmail);
    
    return !!(instanceData && instanceData.instancia_zap && instanceData.instancia_zap.trim() !== '');
  } catch (error) {
    console.error('Erro ao verificar se usuário tem instância:', error);
    return false;
  }
}

/**
 * Gets debug information for user WhatsApp instance
 */
export async function getUserDebugInfo(userEmail: string): Promise<any> {
  try {
    // ⚠️ PADRONIZAÇÃO CRÍTICA: Converter email para lowercase
    const normalizedEmail = userEmail.trim().toLowerCase();
    
    console.log(`Buscando informações de debug para: ${normalizedEmail}`);
    
    const { data, error } = await supabase
      .from('usuarios')
      .select('*')
      .eq('email', normalizedEmail)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return { message: 'Usuário não encontrado', email: normalizedEmail };
      }
      throw error;
    }

    return {
      ...data,
      email_normalizado: normalizedEmail,
      debug_timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('Erro ao buscar informações de debug:', error);
    throw error;
  }
}
