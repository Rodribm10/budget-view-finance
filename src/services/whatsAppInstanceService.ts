
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
    console.log('🔍 getUserWhatsAppInstance - Email recebido:', userEmail);
    
    const normalizedEmail = userEmail.trim().toLowerCase();
    console.log('📧 Email normalizado para consulta:', normalizedEmail);
    
    // TESTE DIRETO: Vamos fazer uma consulta mais específica
    console.log('🔎 FAZENDO CONSULTA DIRETA NO BANCO...');
    const { data, error, count } = await supabase
      .from('usuarios')
      .select('email, instancia_zap, status_instancia, whatsapp', { count: 'exact' })
      .eq('email', normalizedEmail);
    
    console.log('📊 RESULTADO DA CONSULTA DIRETA:');
    console.log('- Total de registros encontrados:', count);
    console.log('- Dados retornados:', JSON.stringify(data, null, 2));
    console.log('- Erro na consulta:', error);
    
    if (error) {
      console.error('❌ Erro na consulta Supabase:', error);
      throw error;
    }
    
    if (!data || data.length === 0) {
      console.log('⚠️ NENHUM REGISTRO ENCONTRADO para o email:', normalizedEmail);
      
      // Fazer uma consulta geral para ver todos os emails no banco
      console.log('🔍 CONSULTANDO TODOS OS EMAILS NO BANCO:');
      const { data: allEmails, error: allError } = await supabase
        .from('usuarios')
        .select('email, instancia_zap, status_instancia');
        
      if (!allError && allEmails) {
        console.log('📋 TODOS OS EMAILS ENCONTRADOS NO BANCO:');
        allEmails.forEach((user, index) => {
          console.log(`${index + 1}. Email no banco: "${user.email}" | Instancia: "${user.instancia_zap}" | Status: "${user.status_instancia}"`);
        });
      }
      
      return null;
    }
    
    const userData = data[0];
    console.log('✅ USUÁRIO ENCONTRADO! Dados extraídos:');
    console.log(`- Email do banco: "${userData.email}"`);
    console.log(`- instancia_zap: "${userData.instancia_zap}" (tipo: ${typeof userData.instancia_zap})`);
    console.log(`- status_instancia: "${userData.status_instancia}" (tipo: ${typeof userData.status_instancia})`);
    console.log(`- whatsapp: "${userData.whatsapp}" (tipo: ${typeof userData.whatsapp})`);
    
    return {
      instancia_zap: userData.instancia_zap,
      status_instancia: userData.status_instancia,
      whatsapp: userData.whatsapp
    };
  } catch (error) {
    console.error('💥 Erro crítico ao buscar instância WhatsApp:', error);
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
    console.log('🔍 Buscando informações COMPLETAS do usuário para debug:', userEmail);
    
    const normalizedEmail = userEmail.trim().toLowerCase();
    console.log('📧 Email normalizado para debug:', normalizedEmail);
    
    const { data, error } = await supabase
      .from('usuarios')
      .select('*')
      .eq('email', normalizedEmail);
    
    if (error) {
      console.error('❌ Erro ao buscar informações completas do usuário:', error);
      throw error;
    }
    
    console.log('📊 DADOS COMPLETOS DO USUÁRIO:', JSON.stringify(data, null, 2));
    return data && data.length > 0 ? data[0] : null;
  } catch (error) {
    console.error('💥 Erro ao buscar informações completas do usuário:', error);
    throw error;
  }
}
