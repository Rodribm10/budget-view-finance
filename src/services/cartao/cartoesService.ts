
import { supabase } from "@/integrations/supabase/client";
import { CartaoCredito } from "@/types/cartaoTypes";
import { gerarCartaoCodigo } from "./cartaoCodigoUtils";
import { getTotalDespesasCartao } from "./despesasService";

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
    
    // Para cada cartão, obter o total de despesas e adicionar campos que podem estar faltando
    const cartoesComDespesas = await Promise.all(data.map(async (cartao) => {
      // Os campos bandeira, banco e cartao_codigo podem não existir na tabela
      // Vamos adicioná-los com valores padrão
      const cartaoCodigo = cartao.cartao_codigo || 
                          gerarCartaoCodigo(cartao.nome, 'banco_padrao');
      
      const totalDespesas = await getTotalDespesasCartao(cartaoCodigo);
      
      return {
        ...cartao,
        bandeira: '',  // Campo não existe na tabela, definir valor padrão
        banco: '',     // Campo não existe na tabela, definir valor padrão
        cartao_codigo: cartaoCodigo,
        total_despesas: totalDespesas
      } as CartaoCredito;
    }));
    
    return cartoesComDespesas;
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
    
    // Adicionar campos que podem não existir no banco de dados
    const cartaoCodigo = data.cartao_codigo || 
                        gerarCartaoCodigo(data.nome, 'banco_padrao');
    
    // Obter o total de despesas para esse cartão
    const totalDespesas = await getTotalDespesasCartao(cartaoCodigo);
    
    // Retorna objeto com campos padrão para campos que não existem no banco
    return {
      ...data,
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
        banco: banco,
        bandeira: bandeira,
        cartao_codigo: cartao_codigo,
        login: normalizedEmail,
        user_id: userId
      }])
      .select();
      
    if (error) {
      console.error('Erro ao criar cartão:', error);
      throw new Error('Não foi possível criar o cartão de crédito');
    }
    
    // Retornar o cartão criado
    return {
      ...data[0],
      bandeira: bandeira, // Fix: was incorrectly using banco
      banco: banco, // Fix: was incorrectly using bandeira
      cartao_codigo: cartao_codigo,
      total_despesas: 0
    } as CartaoCredito;
  } catch (error) {
    console.error('Erro ao criar cartão:', error);
    return null;
  }
}
