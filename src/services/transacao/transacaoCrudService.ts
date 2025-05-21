
import { supabase } from "@/integrations/supabase/client";
import { Transaction } from "@/types/financialTypes";
import { getUserEmail } from "./baseService";

/**
 * Delete a specific transaction
 * @param id ID of the transaction to be deleted
 */
export async function deleteTransacao(id: string): Promise<void> {
  console.log(`Excluindo transação com ID: ${id}`);
  
  try {
    const { error } = await supabase
      .from('transacoes')
      .delete()
      .eq('id', parseInt(id)); // Convert string to number with parseInt
      
    if (error) {
      console.error('Erro ao excluir transação:', error);
      throw new Error('Não foi possível excluir a transação');
    }
    
    console.log('Transação excluída com sucesso');
  } catch (error) {
    console.error('Erro ao excluir transação:', error);
    throw error;
  }
}

/**
 * Update an existing transaction
 * @param transaction Transaction with updated data
 * @returns Updated transaction
 */
export async function updateTransacao(transaction: Transaction): Promise<Transaction> {
  console.log(`Atualizando transação com ID: ${transaction.id}`, transaction);
  
  const normalizedEmail = getUserEmail();
  
  if (!normalizedEmail) {
    throw new Error('Usuário não autenticado');
  }
  
  const transacaoData = {
    login: normalizedEmail,
    valor: transaction.tipo === 'receita' ? Math.abs(transaction.valor) : Math.abs(transaction.valor) * -1,
    quando: transaction.quando,
    detalhes: transaction.detalhes,
    estabelecimento: transaction.estabelecimento,
    tipo: transaction.tipo,
    categoria: transaction.categoria
  };
  
  try {
    const { data, error } = await supabase
      .from('transacoes')
      .update(transacaoData)
      .eq('id', parseInt(transaction.id)) // Convert string to number with parseInt
      .select('*')
      .single();
      
    if (error) {
      console.error('Erro ao atualizar transação:', error);
      throw new Error('Não foi possível atualizar a transação');
    }
    
    console.log('Transação atualizada com sucesso:', data);
    
    // Transform to the expected format
    return {
      id: data.id.toString(),
      user: data.user || '',
      login: data.login || normalizedEmail,
      created_at: data.created_at,
      valor: data.tipo === 'receita' ? Math.abs(data.valor || 0) : -Math.abs(data.valor || 0),
      quando: data.quando || new Date().toISOString(),
      detalhes: data.detalhes || '',
      estabelecimento: data.estabelecimento || '',
      tipo: data.tipo?.toLowerCase() || 'despesa',
      categoria: data.categoria || 'Outros',
      grupo_id: data.grupo_id || null
    };
  } catch (error) {
    console.error('Erro ao atualizar transação:', error);
    throw error;
  }
}
