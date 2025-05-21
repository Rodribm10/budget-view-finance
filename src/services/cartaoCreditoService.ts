
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
    
    // Verificar se todos os cartões têm o campo cartao_codigo
    const cartoesValidos = data.map(cartao => {
      if (!cartao.cartao_codigo) {
        // Se não tiver, gerar um código temporário baseado no id
        cartao.cartao_codigo = `cartao_${cartao.id.substring(0, 8)}`;
      }
      return cartao as CartaoCredito;
    });
    
    // Buscar o total de despesas para cada cartão
    const cartoesComTotal = await Promise.all(
      cartoesValidos.map(async (cartao: CartaoCredito) => {
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

// Verificar se já existe um cartão com o mesmo nome e banco para o usuário
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

// Função para gerar um código único para o cartão
function gerarCartaoCodigo(nome: string, banco: string): string {
  const timestamp = new Date().getTime();
  const randomStr = Math.random().toString(36).substring(2, 7);
  // Remover espaços e caracteres especiais
  const nomeSanitizado = nome.replace(/[^a-zA-Z0-9]/g, '').substring(0, 8);
  const bancoSanitizado = banco.replace(/[^a-zA-Z0-9]/g, '').substring(0, 5);
  
  return `${nomeSanitizado}_${bancoSanitizado}_${randomStr}`;
}

// Função para criar um novo cartão de crédito
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
    
    // Garantir que cartao_codigo existe
    if (!data.cartao_codigo) {
      data.cartao_codigo = `cartao_${data.id.substring(0, 8)}`;
    }
    
    return data as CartaoCredito;
  } catch (error) {
    console.error('Erro ao buscar cartão:', error);
    return null;
  }
}

// Função para buscar despesas de um cartão
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
    
    if (!cartao || !cartao.cartao_codigo) {
      console.error('Cartão não encontrado ou sem código');
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
    
    // Garantir que todas as despesas têm cartao_codigo
    const despesasCompletas = data.map(despesa => {
      if (!despesa.cartao_codigo) {
        despesa.cartao_codigo = cartao.cartao_codigo;
      }
      return despesa as DespesaCartao;
    });
    
    return despesasCompletas;
  } catch (error) {
    console.error('Erro ao buscar despesas:', error);
    return [];
  }
}

// Função para criar uma nova despesa no cartão
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
        cartao_codigo: cartao_codigo,
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
    
    return data[0] as DespesaCartao;
  } catch (error) {
    console.error('Erro ao criar despesa:', error);
    return null;
  }
}

// Função para calcular o total de despesas de um cartão
export async function getTotalDespesasCartao(cartaoCodigo: string): Promise<number> {
  // Obter o email do usuário do localStorage
  const userEmail = localStorage.getItem('userEmail');
  
  if (!userEmail) {
    console.error('Email do usuário não encontrado no localStorage');
    return 0;
  }
  
  // Normalizar o email (minúsculo e sem espaços)
  const normalizedEmail = userEmail.trim().toLowerCase();
  
  try {
    const { data, error } = await supabase
      .from('despesas_cartao')
      .select('valor')
      .eq('cartao_codigo', cartaoCodigo)
      .eq('login', normalizedEmail);
      
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
