import { supabase } from '@/integrations/supabase/client';
import { ContaBancaria } from '@/types/importacaoTypes';

/**
 * Busca todas as contas bancárias do usuário
 */
export async function getContasBancarias(): Promise<ContaBancaria[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Usuário não autenticado');

  const userEmail = user.email?.toLowerCase();

  const { data, error } = await supabase
    .from('contas_bancarias')
    .select('*')
    .eq('user_id', user.id)
    .eq('ativo', true)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Erro ao buscar contas bancárias:', error);
    throw error;
  }

  return data || [];
}

/**
 * Cria uma nova conta bancária
 */
export async function criarContaBancaria(conta: Partial<ContaBancaria>): Promise<ContaBancaria> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Usuário não autenticado');

  const userEmail = user.email?.toLowerCase();

  const { data, error } = await supabase
    .from('contas_bancarias')
    .insert({
      user_id: user.id,
      login: userEmail,
      nome: conta.nome,
      banco: conta.banco,
      tipo: conta.tipo || 'corrente',
      saldo_inicial: conta.saldo_inicial || 0,
      ativo: true
    })
    .select()
    .single();

  if (error) {
    console.error('Erro ao criar conta bancária:', error);
    throw error;
  }

  return data;
}

/**
 * Atualiza uma conta bancária existente
 */
export async function atualizarContaBancaria(id: string, conta: Partial<ContaBancaria>): Promise<ContaBancaria> {
  const { data, error } = await supabase
    .from('contas_bancarias')
    .update({
      nome: conta.nome,
      banco: conta.banco,
      tipo: conta.tipo,
      saldo_inicial: conta.saldo_inicial,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Erro ao atualizar conta bancária:', error);
    throw error;
  }

  return data;
}

/**
 * Deleta (desativa) uma conta bancária
 */
export async function deletarContaBancaria(id: string): Promise<void> {
  const { error } = await supabase
    .from('contas_bancarias')
    .update({ ativo: false })
    .eq('id', id);

  if (error) {
    console.error('Erro ao deletar conta bancária:', error);
    throw error;
  }
}
