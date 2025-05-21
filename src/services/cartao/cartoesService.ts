
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
    
    // Para cada cartão, obter o total de despesas
    const cartoesComDespesas = await Promise.all(data.map(async (cartao) => {
      // We need to add the missing properties with default values if they don't exist
      const cartaoCodigo = cartao.cartao_codigo || '';
      const totalDespesas = await getTotalDespesasCartao(cartaoCodigo);
      
      return {
        ...cartao,
        bandeira: cartao.bandeira || '',
        banco: cartao.banco || '',
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
    
    // Add default values for potentially missing properties
    const cartaoCodigo = data.cartao_codigo || '';
    
    // Obter o total de despesas para esse cartão
    const totalDespesas = await getTotalDespesasCartao(cartaoCodigo);
    
    return {
      ...data,
      bandeira: data.bandeira || '',
      banco: data.banco || '',
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
