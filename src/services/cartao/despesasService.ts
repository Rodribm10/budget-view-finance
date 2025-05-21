
import { supabase } from "@/integrations/supabase/client";
import { DespesaCartao } from "@/types/cartaoTypes";
import { getCartao } from "./cartoesService";

/**
 * Fetches expenses for a specific credit card
 * @param cartaoId Card ID
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
    // Primeiro, obter o cartao_codigo do cartão
    const cartao = await getCartao(cartaoId);
    
    if (!cartao) {
      console.error('Cartão não encontrado');
      return [];
    }
    
    const { data, error } = await supabase
      .from('despesas_cartao')
      .select('*')
      .eq('cartao_id', cartaoId)
      .order('data_despesa', { ascending: false });
      
    if (error) {
      console.error('Erro ao buscar despesas:', error);
      throw new Error('Não foi possível carregar as despesas do cartão');
    }
    
    // Mapear os resultados para o tipo DespesaCartao, adicionando o cartao_codigo
    const despesasCompletas = data.map(despesa => ({
      ...despesa,
      cartao_codigo: cartao.cartao_codigo || '' // Use o código do cartão obtido anteriormente
    })) as DespesaCartao[];
    
    return despesasCompletas;
  } catch (error) {
    console.error('Erro ao buscar despesas:', error);
    return [];
  }
}

/**
 * Creates a new expense for a credit card
 * @param cartao_id Card ID
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
    const { data, error } = await supabase
      .from('despesas_cartao')
      .insert([{ 
        cartao_id: cartao_id,
        valor: valor,
        data_despesa: data_despesa,
        descricao: descricao,
        login: normalizedEmail,
        user_id: userId
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
    
    // Adicionar cartao_codigo ao resultado
    const despesaCompleta = {
      ...data[0],
      cartao_codigo: cartao_codigo // Use o código do cartão fornecido no parâmetro
    } as DespesaCartao;
    
    return despesaCompleta;
  } catch (error) {
    console.error('Erro ao criar despesa:', error);
    return null;
  }
}

/**
 * Calculates the total expenses for a credit card
 * @param cartaoCodigo Card code
 * @returns Total expenses amount
 */
export async function getTotalDespesasCartao(cartaoCodigo: string): Promise<number> {
  // Check if cartaoCodigo is empty
  if (!cartaoCodigo) {
    console.error('Código do cartão não fornecido');
    return 0;
  }
  
  // Obter o email do usuário do localStorage
  const userEmail = localStorage.getItem('userEmail');
  
  if (!userEmail) {
    console.error('Email do usuário não encontrado no localStorage');
    return 0;
  }
  
  try {
    // Buscar todas as despesas com o ID do cartão em vez do código
    // Já que cartao_codigo não existe na tabela despesas_cartao
    const { data: cartoes, error: cartoesError } = await supabase
      .from('cartoes_credito')
      .select('id')
      .eq('nome', cartaoCodigo) // Usamos o nome como identificador alternativo
      .limit(1);
      
    if (cartoesError || !cartoes || cartoes.length === 0) {
      console.error('Erro ao buscar cartão pelo código:', cartoesError);
      return 0;
    }
    
    const cartaoId = cartoes[0].id;
    
    // Buscar despesas pelo ID do cartão
    const { data, error } = await supabase
      .from('despesas_cartao')
      .select('valor')
      .eq('cartao_id', cartaoId);
      
    if (error) {
      console.error('Erro ao calcular total de despesas:', error);
      return 0;
    }
    
    // Somar todos os valores das despesas
    const total = data.reduce((acc, item) => acc + Number(item.valor), 0);
    return total;
  } catch (error) {
    console.error('Erro ao calcular total de despesas:', error);
    return 0;
  }
}
