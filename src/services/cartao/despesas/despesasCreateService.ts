
import { supabase } from "@/integrations/supabase/client";
import { DespesaCartao } from "@/types/cartaoTypes";

/**
 * Creates a new expense for a credit card
 * @param cartao_id Card ID (kept for backwards compatibility)
 * @param cartao_codigo Card code
 * @param valor Expense value
 * @param data_despesa Expense date
 * @param descricao Expense description
 * @returns Created expense or null if failed
 */
export async function criarDespesa(
  cartao_id: string,
  cartao_codigo: string,
  valor: number,
  data_despesa: string,
  descricao: string
): Promise<DespesaCartao | null> {
  // Obter o email do usuário do localStorage
  const userEmail = localStorage.getItem('userEmail');
  // Obter o ID do usuário do localStorage (mantido por compatibilidade)
  const userId = localStorage.getItem('userId');
  
  if (!userEmail || !userId) {
    console.error('Dados do usuário não encontrados no localStorage');
    return null;
  }
  
  // Normalizar o email (minúsculo e sem espaços)
  const normalizedEmail = userEmail.trim().toLowerCase();
  
  try {
    // Obter o nome do cartão diretamente da tabela cartoes_credito
    const { data: cartaoData, error: cartaoError } = await supabase
      .from('cartoes_credito')
      .select('nome')
      .eq('id', cartao_id)
      .single();
      
    if (cartaoError || !cartaoData) {
      console.error('Erro ao obter nome do cartão:', cartaoError);
      return null;
    }
    
    const nomeCartao = cartaoData.nome;
    
    console.log('Tentando criar despesa de cartão com os dados:', {
      login: normalizedEmail,
      nome: nomeCartao,
      valor,
      data_despesa,
      descricao
    });
    
    // Insert new expense with login and nome (but not cartao_id)
    const { data, error } = await supabase
      .from('despesas_cartao')
      .insert([{ 
        login: normalizedEmail,
        nome: nomeCartao,
        valor: valor,
        data_despesa: data_despesa,
        descricao: descricao,
        cartao_id: cartao_id // Keep for now to avoid breaking existing functionality
      }])
      .select();
      
    if (error) {
      console.error('Erro ao criar despesa:', error);
      throw new Error('Não foi possível adicionar a despesa ao cartão');
    }
    
    if (!data || data.length === 0) {
      console.error('Nenhum dado retornado ao criar despesa');
      return null;
    }
    
    // Add cartao_codigo to result
    const despesaCompleta = {
      ...data[0],
      cartao_codigo: cartao_codigo
    } as DespesaCartao;
    
    return despesaCompleta;
  } catch (error) {
    console.error('Erro ao criar despesa:', error);
    return null;
  }
}
