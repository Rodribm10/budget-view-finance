
import { supabase } from "@/integrations/supabase/client";
import { Transaction } from "@/types/financialTypes";

export async function getTransacoes(): Promise<Transaction[]> {
  console.log("Buscando transações do Supabase...");
  const { data, error } = await supabase
    .from('transacoes')
    .select('*')
    .order('quando', { ascending: false });

  if (error) {
    console.error('Erro ao buscar transações:', error);
    throw new Error('Não foi possível carregar as transações');
  }

  console.log("Transações encontradas:", data);

  // Transformar os dados recebidos para o formato esperado
  return data.map((item) => ({
    id: item.id.toString(),
    user: item.user || '',
    created_at: item.created_at,
    valor: item.tipo === 'entrada' ? Math.abs(item.valor || 0) : -Math.abs(item.valor || 0),
    quando: item.quando || new Date().toISOString(),
    detalhes: item.detalhes || '',
    estabelecimento: item.estabelecimento || '',
    tipo: (item.tipo === 'entrada' || item.tipo === 'saida') ? item.tipo : 'saida',
    categoria: item.categoria || 'Outros'
  }));
}

export async function getTransactionSummary() {
  console.log("Buscando resumo das transações...");
  const { data, error } = await supabase
    .from('transacoes')
    .select('tipo, valor');

  if (error) {
    console.error('Erro ao buscar resumo das transações:', error);
    throw new Error('Não foi possível carregar o resumo das transações');
  }

  console.log("Dados para resumo encontrados:", data);

  const totalReceitas = data
    .filter(item => item.tipo === 'entrada')
    .reduce((sum, item) => sum + Math.abs(item.valor || 0), 0);

  const totalDespesas = data
    .filter(item => item.tipo === 'saida')
    .reduce((sum, item) => sum + Math.abs(item.valor || 0), 0);

  const resultado = {
    receitas: totalReceitas,
    despesas: totalDespesas,
    saldo: totalReceitas - totalDespesas
  };

  console.log("Resumo calculado:", resultado);
  return resultado;
}

export async function getCategorySummary() {
  console.log("Buscando resumo de categorias...");
  const { data, error } = await supabase
    .from('transacoes')
    .select('categoria, valor, tipo')
    .eq('tipo', 'saida');

  if (error) {
    console.error('Erro ao buscar resumo de categorias:', error);
    throw new Error('Não foi possível carregar o resumo por categoria');
  }
  
  console.log("Dados de categorias encontrados:", data);
  
  // Agrupar por categoria
  const categorias: Record<string, number> = {};
  data.forEach(item => {
    if (item.categoria && item.valor) {
      if (!categorias[item.categoria]) {
        categorias[item.categoria] = 0;
      }
      categorias[item.categoria] += Math.abs(item.valor);
    }
  });
  
  // Calcular o total para porcentagens
  const total = Object.values(categorias).reduce((sum, valor) => sum + valor, 0);

  // Cores para categorias (reuse das cores no mockData)
  const cores = ["#F59E0B", "#60A5FA", "#8B5CF6", "#EF4444", "#10B981", "#6366F1", "#EC4899", "#14B8A6"];
  
  // Mapear para o formato esperado
  const resultado = Object.entries(categorias).map(([categoria, valor], index) => ({
    categoria,
    valor,
    percentage: total > 0 ? valor / total : 0,
    color: cores[index % cores.length]
  }));

  console.log("Resumo de categorias calculado:", resultado);
  return resultado;
}

export async function getMonthlyData() {
  console.log("Buscando dados mensais...");
  const { data, error } = await supabase
    .from('transacoes')
    .select('quando, valor, tipo');

  if (error) {
    console.error('Erro ao buscar dados mensais:', error);
    throw new Error('Não foi possível carregar os dados mensais');
  }

  console.log("Dados mensais encontrados:", data);

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
        meses[nomeMes].receitas += Math.abs(item.valor);
      } else {
        meses[nomeMes].despesas += Math.abs(item.valor);
      }
    }
  });

  // Converter para o formato esperado
  const resultado = Object.entries(meses).map(([month, values]) => ({
    month,
    receitas: values.receitas,
    despesas: values.despesas
  }));

  console.log("Dados mensais calculados:", resultado);
  return resultado;
}
