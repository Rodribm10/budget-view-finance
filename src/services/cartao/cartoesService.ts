import { supabase } from "@/integrations/supabase/client";
import { CartaoCredito } from "@/types/cartaoTypes";
import { gerarCartaoCodigo } from "./cartaoCodigoUtils";

/**
 * Fetches all credit cards for the current user
 * @returns Array of credit cards
 */
export async function getCartoes(): Promise<CartaoCredito[]> {
  // Obter o email do usuário do localStorage
  const userEmail = localStorage.getItem('userEmail');
  
  if (!userEmail) {
    console.error('Email do usuário não encontrado no localStorage');
    return [];
  }
  
  // Normalizar o email (minúsculo e sem espaços)
  const normalizedEmail = userEmail.trim().toLowerCase();
  
  try {
    const { data, error } = await supabase
      .from('cartoes_credito')
      .select('*')
      .eq('login', normalizedEmail)
      .order('nome', { ascending: true });
      
    if (error) {
      console.error('Erro ao buscar cartões:', error);
      throw new Error('Não foi possível carregar os cartões de crédito');
    }
    
    // Para cada cartão, adicionar os campos faltantes
    const cartoesCompletos = data.map(async (cartao) => {
      // Gerar um código único para o cartão, já que não existe na tabela
      const cartaoCodigo = gerarCartaoCodigo(cartao.nome, 'banco_padrao');
      
      // Obter o total de despesas de forma direta para evitar dependência circular
      const { data: despesasData, error: despesasError } = await supabase
        .from('despesas_cartao')
        .select('valor')
        .eq('cartao_id', cartao.id);
        
      let totalDespesas = 0;
      if (!despesasError && despesasData) {
        totalDespesas = despesasData.reduce((acc, item) => acc + Number(item.valor), 0);
      }
      
      // Retornar o objeto completo com os campos faltantes
      return {
        id: cartao.id,
        nome: cartao.nome,
        user_id: cartao.user_id,
        login: cartao.login || normalizedEmail,
        created_at: cartao.created_at,
        bandeira: '',  // Campo não existe na tabela, definir valor padrão
        banco: '',     // Campo não existe na tabela, definir valor padrão
        cartao_codigo: cartaoCodigo,
        total_despesas: totalDespesas
      } as CartaoCredito;
    });
    
    // Aguardar a resolução de todas as promessas
    return Promise.all(cartoesCompletos);
  } catch (error) {
    console.error('Erro ao buscar cartões:', error);
    return [];
  }
}

/**
 * Gets a specific credit card by ID
 * @param cartaoId Card ID
 * @returns Card details or null if not found
 */
export async function getCartao(cartaoId: string): Promise<CartaoCredito | null> {
  // Obter o email do usuário do localStorage
  const userEmail = localStorage.getItem('userEmail');
  
  if (!userEmail) {
    console.error('Email do usuário não encontrado no localStorage');
    return null;
  }
  
  try {
    const { data, error } = await supabase
      .from('cartoes_credito')
      .select('*')
      .eq('id', cartaoId)
      .single();
      
    if (error) {
      console.error('Erro ao obter cartão:', error);
      return null;
    }
    
    // Gerar um código único para o cartão, já que não existe na tabela
    const cartaoCodigo = gerarCartaoCodigo(data.nome, 'banco_padrao');
    
    // Obter o total de despesas para esse cartão diretamente do banco
    const { data: despesasData, error: despesasError } = await supabase
      .from('despesas_cartao')
      .select('valor')
      .eq('cartao_id', cartaoId);
      
    let totalDespesas = 0;
    if (!despesasError && despesasData) {
      totalDespesas = despesasData.reduce((acc, item) => acc + Number(item.valor), 0);
    }
    
    // Retornar o objeto completo com os campos faltantes
    return {
      id: data.id,
      nome: data.nome,
      user_id: data.user_id,
      login: data.login,
      created_at: data.created_at,
      bandeira: '',  // Campo não existe na tabela, definir valor padrão
      banco: '',     // Campo não existe na tabela, definir valor padrão
      cartao_codigo: cartaoCodigo,
      total_despesas: totalDespesas
    } as CartaoCredito;
  } catch (error) {
    console.error('Erro ao obter cartão:', error);
    return null;
  }
}

/**
 * Creates a new credit card for the user
 * @param nome Card name
 * @param banco Bank name
 * @param bandeira Card brand
 * @returns Created card or null if failed
 */
export async function criarCartao(
  nome: string,
  banco: string,
  bandeira: string
): Promise<CartaoCredito | null> {
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
    // Gerar um código único para o cartão
    const cartao_codigo = gerarCartaoCodigo(nome, bandeira);
    
    const { data, error } = await supabase
      .from('cartoes_credito')
      .insert([{ 
        nome: nome,
        login: normalizedEmail,
        user_id: userId
      }])
      .select();
      
    if (error) {
      console.error('Erro ao criar cartão:', error);
      throw new Error('Não foi possível criar o cartão de crédito');
    }
    
    // Retornar o cartão criado com os campos adicionais
    return {
      id: data[0].id,
      nome: data[0].nome,
      user_id: data[0].user_id,
      login: data[0].login || normalizedEmail,
      created_at: data[0].created_at,
      bandeira: bandeira, // Campo não existe na tabela, mas incluído no retorno
      banco: banco, // Campo não existe na tabela, mas incluído no retorno
      cartao_codigo: cartao_codigo, // Campo não existe na tabela, mas incluído no retorno
      total_despesas: 0
    } as CartaoCredito;
  } catch (error) {
    console.error('Erro ao criar cartão:', error);
    return null;
  }
}

/**
 * Deletes a credit card and all its associated expenses
 * @param cartaoId Card ID to delete
 * @returns Success status
 */
export async function excluirCartao(cartaoId: string): Promise<boolean> {
  const userEmail = localStorage.getItem('userEmail');
  
  if (!userEmail) {
    console.error('Email do usuário não encontrado no localStorage');
    return false;
  }
  
  const normalizedEmail = userEmail.trim().toLowerCase();
  
  try {
    // First, get the card name to delete associated expenses
    const { data: cardData, error: cardError } = await supabase
      .from('cartoes_credito')
      .select('nome')
      .eq('id', cartaoId)
      .eq('login', normalizedEmail)
      .single();
      
    if (cardError) {
      console.error('Erro ao obter dados do cartão:', cardError);
      return false;
    }
    
    // Delete all expenses associated with this card
    const { error: expensesError } = await supabase
      .from('despesas_cartao')
      .delete()
      .eq('nome', cardData.nome)
      .eq('login', normalizedEmail);
      
    if (expensesError) {
      console.error('Erro ao excluir despesas do cartão:', expensesError);
      return false;
    }
    
    // Delete all invoices associated with this card
    const { error: invoicesError } = await supabase
      .from('faturas_cartao')
      .delete()
      .eq('cartao_id', cartaoId)
      .eq('login', normalizedEmail);
      
    if (invoicesError) {
      console.error('Erro ao excluir faturas do cartão:', invoicesError);
      // Continue with card deletion even if invoices fail
    }
    
    // Finally, delete the card itself
    const { error: cardDeleteError } = await supabase
      .from('cartoes_credito')
      .delete()
      .eq('id', cartaoId)
      .eq('login', normalizedEmail);
      
    if (cardDeleteError) {
      console.error('Erro ao excluir cartão:', cardDeleteError);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Erro ao excluir cartão:', error);
    return false;
  }
}
