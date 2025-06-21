
import { supabase } from '@/integrations/supabase/client';

/**
 * Busca os dados da instância de um usuário na tabela 'usuarios'.
 * Retorna o primeiro registro encontrado ou null se não houver.
 * 
 * @param userEmail O e-mail do usuário para buscar.
 * @returns Um objeto com os dados da instância ou null.
 */
export const getUserWhatsAppInstance = async (userEmail: string) => {
  if (!userEmail) {
    console.error('[SERVICE_ERROR] getUserWhatsAppInstance chamado sem userEmail.');
    return null;
  }

  console.log(`[SERVICE] Buscando instância no DB para: ${userEmail}`);

  // A query correta para buscar os dados
  const { data, error } = await supabase
    .from('usuarios') // Nome da sua tabela
    .select('instancia_zap, status_instancia, whatsapp') // Seleciona apenas as colunas que precisamos
    .eq('email', userEmail) // Filtra pelo e-mail do usuário logado
    .maybeSingle(); // Retorna um único objeto (ou null) em vez de um array

  if (error) {
    console.error('[SERVICE_ERROR] Erro ao buscar instância no Supabase:', error);
    throw new Error(error.message);
  }

  console.log('[SERVICE] Dados retornados do DB:', data);
  return data;
};

// Re-export das outras funções para manter compatibilidade
export const updateUserWhatsAppInstance = async (userEmail: string, instanceData: any) => {
  const { error } = await supabase
    .from('usuarios')
    .update({
      instancia_zap: instanceData.instanceName,
      status_instancia: instanceData.status
    })
    .eq('email', userEmail);

  if (error) {
    console.error('[SERVICE_ERROR] Erro ao atualizar instância:', error);
    throw error;
  }
};

export const removeUserWhatsAppInstance = async (userEmail: string) => {
  const { error } = await supabase
    .from('usuarios')
    .update({
      instancia_zap: null,
      status_instancia: 'desconectado'
    })
    .eq('email', userEmail);

  if (error) {
    console.error('[SERVICE_ERROR] Erro ao remover instância:', error);
    throw error;
  }
};

export const getUserDebugInfo = async (userEmail: string) => {
  return await getUserWhatsAppInstance(userEmail);
};

export const activateUserWorkflow = async (userEmail: string) => {
  console.log('[SERVICE] Ativando workflow para:', userEmail);
  // Implementação do workflow se necessário
};

export const checkUserHasInstance = async (userEmail: string) => {
  const data = await getUserWhatsAppInstance(userEmail);
  return !!(data && data.instancia_zap && data.status_instancia === 'conectado');
};
