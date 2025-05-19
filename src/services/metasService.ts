
import { supabase } from '@/integrations/supabase/client';
import { Meta, ResultadoMeta } from '@/types/financialTypes';

// Obter todas as metas do usuário
export const getMetas = async (userId: string): Promise<Meta[]> => {
  const { data, error } = await supabase
    .from('metas')
    .select('*')
    .eq('user_id', userId)
    .order('ano', { ascending: false })
    .order('mes', { ascending: false });

  if (error) {
    console.error('Erro ao buscar metas:', error);
    throw new Error(error.message);
  }

  return data || [];
};

// Obter meta específica
export const getMeta = async (userId: string, mes: number, ano: number): Promise<Meta | null> => {
  const { data, error } = await supabase
    .from('metas')
    .select('*')
    .eq('user_id', userId)
    .eq('mes', mes)
    .eq('ano', ano)
    .maybeSingle();

  if (error) {
    console.error('Erro ao buscar meta:', error);
    throw new Error(error.message);
  }

  return data;
};

// Criar ou atualizar meta
export const salvarMeta = async (meta: {
  user_id: string,
  mes: number,
  ano: number,
  valor_meta: number
}): Promise<Meta> => {
  // Verificar se já existe uma meta para este mês/ano
  const existingMeta = await getMeta(meta.user_id, meta.mes, meta.ano);
  
  if (existingMeta) {
    // Atualizar meta existente
    const { data, error } = await supabase
      .from('metas')
      .update({ valor_meta: meta.valor_meta })
      .eq('id', existingMeta.id)
      .select()
      .single();

    if (error) {
      console.error('Erro ao atualizar meta:', error);
      throw new Error(error.message);
    }

    return data;
  } else {
    // Criar nova meta
    const { data, error } = await supabase
      .from('metas')
      .insert(meta)
      .select()
      .single();

    if (error) {
      console.error('Erro ao criar meta:', error);
      throw new Error(error.message);
    }

    return data;
  }
};

// Deletar meta
export const deletarMeta = async (metaId: string): Promise<void> => {
  const { error } = await supabase
    .from('metas')
    .delete()
    .eq('id', metaId);

  if (error) {
    console.error('Erro ao deletar meta:', error);
    throw new Error(error.message);
  }
};

// Calcular resultados das metas
export const calcularResultadosMetas = async (userId: string): Promise<ResultadoMeta[]> => {
  const metas = await getMetas(userId);
  const resultados: ResultadoMeta[] = [];

  for (const meta of metas) {
    // Buscar transações do mês da meta
    const startDate = new Date(meta.ano, meta.mes - 1, 1);
    const endDate = new Date(meta.ano, meta.mes, 0);
    
    const { data: transacoes, error } = await supabase
      .from('transacoes')
      .select('*')
      .eq('user', userId)
      .gte('quando', startDate.toISOString().split('T')[0])
      .lte('quando', endDate.toISOString().split('T')[0]);
    
    if (error) {
      console.error('Erro ao buscar transações para cálculo de metas:', error);
      continue;
    }
    
    // Calcular receitas e despesas do mês
    const receitas = transacoes
      .filter(t => t.tipo?.toLowerCase() === 'receita')
      .reduce((sum, t) => sum + Number(t.valor || 0), 0);
    
    const despesas = transacoes
      .filter(t => t.tipo?.toLowerCase() === 'despesa')
      .reduce((sum, t) => sum + Number(t.valor || 0), 0);
    
    // Calcular economia real
    const economiaReal = receitas - despesas;
    
    // Calcular percentual atingido e se a meta foi batida
    const percentualAtingido = meta.valor_meta > 0 
      ? Math.min(100, (economiaReal / meta.valor_meta) * 100) 
      : 0;
    
    const metaBatida = economiaReal >= meta.valor_meta;
    
    resultados.push({
      mes: meta.mes,
      ano: meta.ano,
      valor_meta: meta.valor_meta,
      economia_real: economiaReal,
      percentual_atingido: percentualAtingido,
      meta_batida: metaBatida
    });
  }
  
  return resultados;
};
