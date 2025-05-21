
import { supabase } from "@/integrations/supabase/client";
import { DespesaCartao } from "@/types/cartaoTypes";
import { getCartao } from "./cartoesService";

/**
 * Fetches expenses for a specific credit card based on login and nome
 * @param cartaoId Card ID (still used for type compatibility)
 * @param cardName Card name to match with expenses
 * @returns Array of card expenses
 */
export async function getDespesasCartao(cartaoId: string): Promise<DespesaCartao[]> {
  // Obter o email do usuário do localStorage
  const userEmail = localStorage.getItem('userEmail');
  
  if (!userEmail) {
    console.error('Email do usuário não encontrado no localStorage');
    return [];
  }
  
  // Normalizar o email (minúsculo e sem espaços)
  const normalizedEmail = userEmail.trim().toLowerCase();
  
  try {
    // First, get the card details to get the name
    const cartao = await getCartao(cartaoId);
    
    if (!cartao) {
      console.error('Cartão não encontrado');
      return [];
    }
    
    const cardName = cartao.nome;
    
    // Now get expenses matching by login and nome instead of cartao_id
    const { data, error } = await supabase
      .from('despesas_cartao')
      .select('*')
      .eq('login', normalizedEmail)
      .eq('nome', cardName)
      .order('data_despesa', { ascending: false });
      
    if (error) {
      console.error('Erro ao buscar despesas:', error);
      throw new Error('Não foi possível carregar as despesas do cartão');
    }
    
    // Map results to DespesaCartao type, adding cartao_codigo
    const despesasCompletas = data.map(despesa => ({
      ...despesa,
      cartao_codigo: cartao.cartao_codigo || '',
      cartao_id: cartaoId // Keep for backwards compatibility
    })) as DespesaCartao[];
    
    return despesasCompletas;
  } catch (error) {
    console.error('Erro ao buscar despesas:', error);
    return [];
  }
}

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

/**
 * Calculates the total expenses for a credit card based on login and card name
 * @param cartaoId Card ID
 * @returns Total expenses amount
 */
export async function getTotalDespesasCartao(cartaoId: string): Promise<number> {
  // Check if cartaoId is empty
  if (!cartaoId) {
    console.error('ID do cartão não fornecido');
    return 0;
  }
  
  try {
    // Get the user's email from localStorage
    const userEmail = localStorage.getItem('userEmail');
    if (!userEmail) {
      console.error('Email do usuário não encontrado');
      return 0;
    }
    
    const normalizedEmail = userEmail.trim().toLowerCase();
    
    // Get the card's name from cartoes_credito
    const { data: cardData, error: cardError } = await supabase
      .from('cartoes_credito')
      .select('nome')
      .eq('id', cartaoId)
      .single();
      
    if (cardError || !cardData) {
      console.error('Erro ao obter nome do cartão:', cardError);
      return 0;
    }
    
    const cardName = cardData.nome;
    
    console.log(`Calculando total de despesas para cartão ${cardName} do usuário ${normalizedEmail}`);
    
    // Now get expenses matching both login and nome
    const { data, error } = await supabase
      .from('despesas_cartao')
      .select('valor')
      .eq('login', normalizedEmail)
      .eq('nome', cardName);
      
    if (error) {
      console.error('Erro ao calcular total de despesas:', error);
      return 0;
    }
    
    console.log(`Despesas encontradas:`, data);
    
    // Sum all expense values, ensuring numeric conversion
    const total = data.reduce((acc, item) => {
      const itemValue = Number(item.valor) || 0;
      console.log(`Somando valor ${itemValue} ao total ${acc}`);
      return acc + itemValue;
    }, 0);
    
    console.log(`Total calculado: ${total}`);
    return total;
  } catch (error) {
    console.error('Erro ao calcular total de despesas:', error);
    return 0;
  }
}
