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
      .eq('login', normalizedEmail);
      
    if (error) {
      console.error('Erro ao buscar cartões:', error);
      throw new Error('Não foi possível carregar os cartões de crédito');
    }
    
    // Garantir que todos os dados têm os campos necessários da interface CartaoCredito
    const cartoesCompletos = data.map(cartao => {
      const cartaoCompleto = { 
        ...cartao,
        bandeira: cartao.bandeira || 'Não especificada',
        banco: cartao.banco || 'Não especificado',
        cartao_codigo: cartao.cartao_codigo || `cartao_${cartao.id.substring(0, 8)}`
      } as CartaoCredito;
      
      return cartaoCompleto;
    });
    
    // Buscar o total de despesas para cada cartão - Promise.all já tipa corretamente o retorno
    const cartoesComTotal = await Promise.all(
      cartoesCompletos.map(async (cartao) => {
        const total = await getTotalDespesasCartao(cartao.cartao_codigo);
        return { ...cartao, total_despesas: total };
      })
    );
    
    return cartoesComTotal;
  } catch (error) {
    console.error('Erro ao buscar cartões:', error);
    return [];
  }
}

/**
 * Checks if a card with the same name and bank already exists for the user
 * @param nome Card name
 * @param banco Bank name
 * @returns Boolean indicating if the card exists
 */
export async function verificarCartaoExistente(nome: string, banco: string): Promise<boolean> {
  // Obter o email do usuário do localStorage
  const userEmail = localStorage.getItem('userEmail');
  
  if (!userEmail) {
    console.error('Email do usuário não encontrado no localStorage');
    return false;
  }
  
  // Normalizar o email (minúsculo e sem espaços)
  const normalizedEmail = userEmail.trim().toLowerCase();
  
  try {
    const { data, error, count } = await supabase
      .from('cartoes_credito')
      .select('*', { count: 'exact' })
      .eq('login', normalizedEmail)
      .eq('nome', nome)
      .eq('banco', banco);
      
    if (error) {
      console.error('Erro ao verificar cartão existente:', error);
      return false;
    }
    
    return count ? count > 0 : false;
  } catch (error) {
    console.error('Erro ao verificar cartão existente:', error);
    return false;
  }
}

/**
 * Creates a new credit card
 * @param nome Card name
 * @param bandeira Card brand
 * @param banco Bank name
 * @returns Created credit card or null if failed
 */
export async function criarCartao(nome: string, bandeira: string, banco: string): Promise<CartaoCredito | null> {
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
  
  // Verificar se já existe um cartão com o mesmo nome e banco
  const cartaoExistente = await verificarCartaoExistente(nome, banco);
  if (cartaoExistente) {
    throw new Error(`Você já possui um cartão ${nome} do banco ${banco}.`);
  }
  
  // Gerar um código único para o cartão
  const cartao_codigo = gerarCartaoCodigo(nome, banco);
  
  try {
    const { data, error } = await supabase
      .from('cartoes_credito')
      .insert([{ 
        nome: nome,
        bandeira: bandeira,
        banco: banco,
        cartao_codigo: cartao_codigo,
        user_id: userId,
        login: normalizedEmail
      }])
      .select();
      
    if (error) {
      console.error('Erro ao criar cartão:', error);
      throw new Error('Não foi possível criar o cartão de crédito');
    }
    
    return data[0] as CartaoCredito;
  } catch (error) {
    console.error('Erro ao criar cartão:', error);
    throw error;
  }
}

/**
 * Fetches details of a specific credit card
 * @param cartaoId Card ID
 * @returns Credit card or null if not found
 */
export async function getCartao(cartaoId: string): Promise<CartaoCredito | null> {
  try {
    const { data, error } = await supabase
      .from('cartoes_credito')
      .select('*')
      .eq('id', cartaoId)
      .single();
      
    if (error) {
      console.error('Erro ao buscar cartão:', error);
      throw new Error('Não foi possível carregar os detalhes do cartão');
    }
    
    // Garantir que o objeto retornado tem todos os campos necessários
    const cartaoCompleto = { ...data } as CartaoCredito;
    
    // Garantir que cartao_codigo existe
    if (!cartaoCompleto.cartao_codigo) {
      cartaoCompleto.cartao_codigo = `cartao_${cartaoCompleto.id.substring(0, 8)}`;
    }
    
    return cartaoCompleto;
  } catch (error) {
    console.error('Erro ao buscar cartão:', error);
    return null;
  }
}
