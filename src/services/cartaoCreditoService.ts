
import { supabase } from "@/integrations/supabase/client";
import { CartaoCredito, DespesaCartao } from "@/types/cartaoTypes";

// Função para buscar todos os cartões de crédito do usuário
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
    
    // Buscar o total de despesas para cada cartão
    const cartoesComTotal = await Promise.all(
      data.map(async (cartao: CartaoCredito) => {
        const total = await getTotalDespesasCartao(cartao.id);
        return { ...cartao, total_despesas: total };
      })
    );
    
    return cartoesComTotal;
  } catch (error) {
    console.error('Erro ao buscar cartões:', error);
    return [];
  }
}

// Função para criar um novo cartão de crédito
export async function criarCartao(nome: string): Promise<CartaoCredito | null> {
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
      .from('cartoes_credito')
      .insert([{ 
        nome: nome,
        user_id: userId,
        login: normalizedEmail
      }])
      .select();
      
    if (error) {
      console.error('Erro ao criar cartão:', error);
      throw new Error('Não foi possível criar o cartão de crédito');
    }
    
    return data[0];
  } catch (error) {
    console.error('Erro ao criar cartão:', error);
    return null;
  }
}

// Função para buscar detalhes de um cartão específico
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
    
    return data;
  } catch (error) {
    console.error('Erro ao buscar cartão:', error);
    return null;
  }
}

// Função para buscar despesas de um cartão
export async function getDespesasCartao(cartaoId: string): Promise<DespesaCartao[]> {
  try {
    const { data, error } = await supabase
      .from('despesas_cartao')
      .select('*')
      .eq('cartao_id', cartaoId)
      .order('data_despesa', { ascending: false });
      
    if (error) {
      console.error('Erro ao buscar despesas:', error);
      throw new Error('Não foi possível carregar as despesas do cartão');
    }
    
    return data;
  } catch (error) {
    console.error('Erro ao buscar despesas:', error);
    return [];
  }
}

// Função para criar uma nova despesa no cartão
export async function criarDespesa(cartaoId: string, valor: number, data_despesa: string, descricao: string): Promise<DespesaCartao | null> {
  try {
    const { data, error } = await supabase
      .from('despesas_cartao')
      .insert([{ 
        cartao_id: cartaoId,
        valor: valor,
        data_despesa: data_despesa,
        descricao: descricao
      }])
      .select();
      
    if (error) {
      console.error('Erro ao criar despesa:', error);
      throw new Error('Não foi possível adicionar a despesa ao cartão');
    }
    
    return data[0];
  } catch (error) {
    console.error('Erro ao criar despesa:', error);
    return null;
  }
}

// Função para calcular o total de despesas de um cartão
export async function getTotalDespesasCartao(cartaoId: string): Promise<number> {
  try {
    const { data, error } = await supabase
      .from('despesas_cartao')
      .select('valor')
      .eq('cartao_id', cartaoId);
      
    if (error) {
      console.error('Erro ao calcular total de despesas:', error);
      throw new Error('Não foi possível calcular o total de despesas');
    }
    
    // Somar todos os valores das despesas
    const total = data.reduce((acc, item) => acc + Number(item.valor), 0);
    return total;
  } catch (error) {
    console.error('Erro ao calcular total de despesas:', error);
    return 0;
  }
}
