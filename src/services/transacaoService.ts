
import { supabase } from "@/integrations/supabase/client";
import { Transaction } from "@/types/financialTypes";

export async function getTransacoes(): Promise<Transaction[]> {
  const { data, error } = await supabase
    .from('transacoes')
    .select('*')
    .order('quando', { ascending: false });

  if (error) {
    console.error('Erro ao buscar transações:', error);
    throw new Error('Não foi possível carregar as transações');
  }

  // Transformar os dados recebidos para o formato esperado
  return data.map((item) => ({
    id: item.id.toString(),
    user: item.user || '',
    created_at: item.created_at,
    valor: item.valor || 0,
    quando: item.quando || new Date().toISOString(),
    detalhes: item.detalhes || '',
    estabelecimento: item.estabelecimento || '',
    tipo: (item.tipo === 'entrada' || item.tipo === 'saida') ? item.tipo : 'saida',
    categoria: item.categoria || 'Outros'
  }));
}

export async function getTransactionSummary() {
  const { data, error } = await supabase
    .from('transacoes')
    .select('tipo, valor');

  if (error) {
    console.error('Erro ao buscar resumo das transações:', error);
    throw new Error('Não foi possível carregar o resumo das transações');
  }

  const totalReceitas = data
    .filter(item => item.tipo === 'entrada')
    .reduce((sum, item) => sum + (item.valor || 0), 0);

  const totalDespesas = data
    .filter(item => item.tipo === 'saida')
    .reduce((sum, item) => sum + (item.valor || 0), 0);

  return {
    receitas: totalReceitas,
    despesas: totalDespesas,
    saldo: totalReceitas - totalDespesas
  };
}

export async function getCategorySummary() {
  const { data, error } = await supabase
    .from('transacoes')
    .select('categoria, valor, tipo')
    .eq('tipo', 'saida');

  if (error) {
    console.error('Erro ao buscar resumo de categorias:', error);
    throw new Error('Não foi possível carregar o resumo por categoria');
  }
  
  // Agrupar por categoria
  const categorias: Record<string, number> = {};
  data.forEach(item => {
    if (item.categoria && item.valor) {
      if (!categorias[item.categoria]) {
        categorias[item.categoria] = 0;
      }
      categorias[item.categoria] += item.valor;
    }
  });
  
  // Calcular o total para porcentagens
  const total = Object.values(categorias).reduce((sum, valor) => sum + valor, 0);

  // Cores para categorias (reuse das cores no mockData)
  const cores = ["#F59E0B", "#60A5FA", "#8B5CF6", "#EF4444", "#10B981", "#6366F1", "#EC4899", "#14B8A6"];
  
  // Mapear para o formato esperado
  return Object.entries(categorias).map(([categoria, valor], index) => ({
    categoria,
    valor,
    percentage: total > 0 ? valor / total : 0,
    color: cores[index % cores.length]
  }));
}

export async function getMonthlyData() {
  const { data, error } = await supabase
    .from('transacoes')
    .select('quando, valor, tipo');

  if (error) {
    console.error('Erro ao buscar dados mensais:', error);
    throw new Error('Não foi possível carregar os dados mensais');
  }

  const meses: Record<string, { receitas: number, despesas: number }> = {};
  const nomesMeses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
  
  // Inicializar meses
  nomesMeses.forEach(mes => {
    meses[mes] = { receitas: 0, despesas: 0 };
  });

  // Agrupar por mês
  data.forEach(item => {
    if (item.quando && item.valor) {
      const data = new Date(item.quando);
      const mesIndex = data.getMonth();
      const nomeMes = nomesMeses[mesIndex];
      
      if (item.tipo === 'entrada') {
        meses[nomeMes].receitas += item.valor;
      } else {
        meses[nomeMes].despesas += item.valor;
      }
    }
  });

  // Converter para o formato esperado
  return Object.entries(meses).map(([month, values]) => ({
    month,
    receitas: values.receitas,
    despesas: values.despesas
  }));
}
