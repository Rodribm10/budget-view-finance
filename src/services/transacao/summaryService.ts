
import { supabase } from "@/integrations/supabase/client";
import { CategorySummary, MonthlyData } from "@/types/financialTypes";
import { getUserEmail, getUserGroups } from "./baseService";

/**
 * Get transaction summary (totals for incomes and expenses) with optional month filter
 * @param monthFilter - Optional month filter in format 'YYYY-MM'
 * @returns Promise with summary data
 */
export async function getTransactionSummary(monthFilter?: string) {
  console.log("Buscando resumo das transações...", monthFilter ? `Filtro do mês: ${monthFilter}` : "Sem filtro de mês");
  
  const normalizedEmail = getUserEmail();
  
  if (!normalizedEmail) {
    return { receitas: 0, despesas: 0, saldo: 0 };
  }
  
  try {
    // Get user groups by email
    const groupIds = await getUserGroups(normalizedEmail);
    
    // Build the query with month filter if provided
    let query = supabase
      .from('transacoes')
      .select('tipo, valor')
      .or(`login.eq.${normalizedEmail},${groupIds.length > 0 ? `grupo_id.in.(${groupIds.map(id => `"${id}"`).join(',')})` : ''}`);

    // Apply month filter if provided
    if (monthFilter) {
      const startDate = `${monthFilter}-01`;
      const year = parseInt(monthFilter.split('-')[0]);
      const month = parseInt(monthFilter.split('-')[1]);
      const endDate = new Date(year, month, 0).toISOString().split('T')[0]; // Last day of the month
      
      query = query
        .gte('quando', startDate)
        .lte('quando', `${endDate}T23:59:59.999Z`);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Erro ao buscar resumo das transações:', error);
      throw new Error('Não foi possível carregar o resumo das transações');
    }

    console.log("Dados para resumo encontrados:", data);

    const totalReceitas = data
      .filter((item: any) => item.tipo?.toLowerCase() === 'receita')
      .reduce((sum: number, item: any) => sum + Math.abs(item.valor || 0), 0);

    const totalDespesas = data
      .filter((item: any) => (item.tipo?.toLowerCase() === 'despesa'))
      .reduce((sum: number, item: any) => sum + Math.abs(item.valor || 0), 0);

    const resultado = {
      receitas: totalReceitas,
      despesas: totalDespesas,
      saldo: totalReceitas - totalDespesas
    };

    console.log("Resumo calculado:", resultado);
    return resultado;
  } catch (error) {
    console.error('Erro ao buscar resumo das transações:', error);
    return { receitas: 0, despesas: 0, saldo: 0 };
  }
}

/**
 * Get category summary for transactions with optional month filter
 * @param tipoFiltro Filter by transaction type ('receita', 'despesa', or 'all')
 * @param monthFilter - Optional month filter in format 'YYYY-MM'
 * @returns Promise with category summary data
 */
export async function getCategorySummary(tipoFiltro: string = 'despesa', monthFilter?: string): Promise<CategorySummary[]> {
  console.log(`Buscando resumo de categorias para tipo: ${tipoFiltro}`, monthFilter ? `Filtro do mês: ${monthFilter}` : "Sem filtro de mês");
  
  const normalizedEmail = getUserEmail();
  
  if (!normalizedEmail) {
    return [];
  }
  
  try {
    // Get user groups by email
    const groupIds = await getUserGroups(normalizedEmail);
    
    // Build the query with month filter if provided
    let query = supabase
      .from('transacoes')
      .select('categoria, valor, tipo')
      .or(`login.eq.${normalizedEmail},${groupIds.length > 0 ? `grupo_id.in.(${groupIds.map(id => `"${id}"`).join(',')})` : ''}`);

    // Apply month filter if provided
    if (monthFilter) {
      const startDate = `${monthFilter}-01`;
      const year = parseInt(monthFilter.split('-')[0]);
      const month = parseInt(monthFilter.split('-')[1]);
      const endDate = new Date(year, month, 0).toISOString().split('T')[0]; // Last day of the month
      
      query = query
        .gte('quando', startDate)
        .lte('quando', `${endDate}T23:59:59.999Z`);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Erro ao buscar resumo de categorias:', error);
      throw new Error('Não foi possível carregar o resumo por categoria');
    }
    
    console.log("Dados de categorias encontrados:", data);
    
    // Filter according to the requested type (incomes, expenses, or both)
    let filteredData = data;
    if (tipoFiltro.toLowerCase() === 'despesa') {
      filteredData = data.filter((item: any) => item.tipo?.toLowerCase() === 'despesa');
    } else if (tipoFiltro.toLowerCase() === 'receita') {
      filteredData = data.filter((item: any) => item.tipo?.toLowerCase() === 'receita');
    }
    
    console.log(`${filteredData.length} itens filtrados para tipo: ${tipoFiltro}`);
    
    // Group by category
    const categorias: Record<string, number> = {};
    filteredData.forEach((item: any) => {
      if (item.valor) {
        const categoriaKey = item.categoria || 'Outros';
        if (!categorias[categoriaKey]) {
          categorias[categoriaKey] = 0;
        }
        categorias[categoriaKey] += Math.abs(item.valor);
      }
    });
    
    // Calculate the total for percentages
    const total = Object.values(categorias).reduce((sum, valor) => sum + valor, 0);

    // Colors for categories (reuse colors in mockData)
    const cores = ["#F59E0B", "#60A5FA", "#8B5CF6", "#EF4444", "#10B981", "#6366F1", "#EC4899", "#14B8A6"];
    
    // Map to the expected format
    const resultado = Object.entries(categorias).map(([categoria, valor], index) => ({
      categoria,
      valor,
      percentage: total > 0 ? valor / total : 0,
      color: cores[index % cores.length]
    }));

    console.log("Resumo de categorias calculado:", resultado);
    return resultado;
  } catch (error) {
    console.error('Erro ao buscar resumo de categorias:', error);
    return [];
  }
}

/**
 * Get monthly data for transactions
 * @returns Promise with monthly data
 */
export async function getMonthlyData(): Promise<MonthlyData[]> {
  console.log("Buscando dados mensais...");
  
  const normalizedEmail = getUserEmail();
  
  if (!normalizedEmail) {
    return [];
  }
  
  try {
    // Get user groups by email
    const groupIds = await getUserGroups(normalizedEmail);
    
    // Fetch monthly data with enhanced filter based on email (login) or group_id
    const { data, error } = await supabase
      .from('transacoes')
      .select('quando, valor, tipo')
      .or(`login.eq.${normalizedEmail},${groupIds.length > 0 ? `grupo_id.in.(${groupIds.map(id => `"${id}"`).join(',')})` : ''}`);

    if (error) {
      console.error('Erro ao buscar dados mensais:', error);
      throw new Error('Não foi possível carregar os dados mensais');
    }

    console.log("Dados mensais encontrados:", data);

    const meses: Record<string, { receitas: number, despesas: number }> = {};
    const nomesMeses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    
    // Initialize months
    nomesMeses.forEach(mes => {
      meses[mes] = { receitas: 0, despesas: 0 };
    });

    // Group by month, normalizing the type
    data.forEach((item: any) => {
      if (item.quando && item.valor) {
        const data = new Date(item.quando);
        const mesIndex = data.getMonth();
        const nomeMes = nomesMeses[mesIndex];
        
        if (item.tipo?.toLowerCase() === 'receita') {
          meses[nomeMes].receitas += Math.abs(item.valor);
        } else {
          meses[nomeMes].despesas += Math.abs(item.valor);
        }
      }
    });

    // Convert to the expected format
    const resultado = Object.entries(meses).map(([month, values]) => ({
      month,
      receitas: values.receitas,
      despesas: values.despesas
    }));

    console.log("Dados mensais calculados:", resultado);
    return resultado;
  } catch (error) {
    console.error('Erro ao buscar dados mensais:', error);
    return [];
  }
}
