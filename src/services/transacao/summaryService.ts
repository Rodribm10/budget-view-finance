
import { supabase } from "@/integrations/supabase/client";
import { CategorySummary, MonthlyData, ResumoFinanceiro } from "@/types/financialTypes";
import { getUserEmail, getUserGroups } from "./baseService";

/**
 * Get transaction summary (total income, expenses, balance)
 * @param monthFilter - Optional month filter in format 'YYYY-MM'
 * @returns Promise with transaction summary
 */
export async function getTransactionSummary(monthFilter?: string): Promise<{ totalReceitas: number; totalDespesas: number; saldo: number }> {
  console.log("📊 [getTransactionSummary] Calculando resumo de transações...");
  console.log("📊 [getTransactionSummary] Filtro de mês:", monthFilter);
  
  const normalizedEmail = getUserEmail();
  
  if (!normalizedEmail) {
    console.error("❌ [getTransactionSummary] Email não encontrado");
    return { totalReceitas: 0, totalDespesas: 0, saldo: 0 };
  }

  try {
    const groupIds = await getUserGroups(normalizedEmail);
    
    let query = supabase.from('transacoes').select('tipo, valor');
    
    if (groupIds.length > 0) {
      const orFilter = `login.eq.${normalizedEmail},grupo_id.in.(${groupIds.map(id => `"${id}"`).join(',')})`;
      query = query.or(orFilter);
    } else {
      query = query.eq('login', normalizedEmail);
    }

    // Apply month filter if provided
    if (monthFilter) {
      const startDate = `${monthFilter}-01`;
      const year = parseInt(monthFilter.split('-')[0]);
      const month = parseInt(monthFilter.split('-')[1]);
      const endDate = new Date(year, month, 0).toISOString().split('T')[0];
      
      query = query
        .gte('quando', startDate)
        .lte('quando', `${endDate}T23:59:59.999Z`);
      
      console.log(`📅 [getTransactionSummary] Filtro de data aplicado: ${startDate} até ${endDate}`);
    }

    const { data, error } = await query;

    if (error) {
      console.error('❌ [getTransactionSummary] Erro:', error);
      return { totalReceitas: 0, totalDespesas: 0, saldo: 0 };
    }

    const receitas = data
      .filter(t => t.tipo?.toLowerCase() === 'receita')
      .reduce((sum, t) => sum + Number(t.valor || 0), 0);

    const despesas = data
      .filter(t => t.tipo?.toLowerCase() === 'despesa')
      .reduce((sum, t) => sum + Number(t.valor || 0), 0);

    const saldo = receitas - despesas;

    console.log(`📊 [getTransactionSummary] Receitas: ${receitas}, Despesas: ${despesas}, Saldo: ${saldo}`);

    return { totalReceitas: receitas, totalDespesas: despesas, saldo };
  } catch (error) {
    console.error('💥 [getTransactionSummary] Erro geral:', error);
    return { totalReceitas: 0, totalDespesas: 0, saldo: 0 };
  }
}

/**
 * Get financial summary including credit cards
 * @param monthFilter - Optional month filter in format 'YYYY-MM'
 * @returns Promise with complete financial summary
 */
export async function getResumoFinanceiro(monthFilter?: string): Promise<ResumoFinanceiro> {
  console.log("📊 [getResumoFinanceiro] Calculando resumo financeiro completo...");
  console.log("📊 [getResumoFinanceiro] Filtro de mês:", monthFilter);
  
  const normalizedEmail = getUserEmail();
  
  if (!normalizedEmail) {
    console.error("❌ [getResumoFinanceiro] Email não encontrado");
    return { totalReceitas: 0, totalDespesas: 0, totalCartoes: 0, saldo: 0 };
  }

  try {
    const groupIds = await getUserGroups(normalizedEmail);
    
    let query = supabase.from('transacoes').select('tipo, valor');
    
    if (groupIds.length > 0) {
      const orFilter = `login.eq.${normalizedEmail},grupo_id.in.(${groupIds.map(id => `"${id}"`).join(',')})`;
      query = query.or(orFilter);
    } else {
      query = query.eq('login', normalizedEmail);
    }

    // Apply month filter if provided
    if (monthFilter) {
      const startDate = `${monthFilter}-01`;
      const year = parseInt(monthFilter.split('-')[0]);
      const month = parseInt(monthFilter.split('-')[1]);
      const endDate = new Date(year, month, 0).toISOString().split('T')[0];
      
      query = query
        .gte('quando', startDate)
        .lte('quando', `${endDate}T23:59:59.999Z`);
      
      console.log(`📅 [getResumoFinanceiro] Filtro de data aplicado: ${startDate} até ${endDate}`);
    }

    const { data, error } = await query;

    if (error) {
      console.error('❌ [getResumoFinanceiro] Erro:', error);
      return { totalReceitas: 0, totalDespesas: 0, totalCartoes: 0, saldo: 0 };
    }

    const receitas = data
      .filter(t => t.tipo?.toLowerCase() === 'receita')
      .reduce((sum, t) => sum + Number(t.valor || 0), 0);

    const despesas = data
      .filter(t => t.tipo?.toLowerCase() === 'despesa')
      .reduce((sum, t) => sum + Number(t.valor || 0), 0);

    // Get credit card expenses with month filter
    let cartaoQuery = supabase
      .from('despesas_cartao')
      .select('valor')
      .eq('login', normalizedEmail);

    // Apply month filter to credit card expenses if provided
    if (monthFilter) {
      const startDate = `${monthFilter}-01`;
      const year = parseInt(monthFilter.split('-')[0]);
      const month = parseInt(monthFilter.split('-')[1]);
      const endDate = new Date(year, month, 0).toISOString().split('T')[0];
      
      cartaoQuery = cartaoQuery
        .gte('data_despesa', startDate)
        .lte('data_despesa', endDate);
      
      console.log(`📅 [getResumoFinanceiro] Filtro aplicado também aos cartões: ${startDate} até ${endDate}`);
    }

    const { data: cartaoData, error: cartaoError } = await cartaoQuery;

    const totalCartoes = cartaoError ? 0 : 
      (cartaoData || []).reduce((sum, despesa) => sum + Number(despesa.valor || 0), 0);

    const saldo = receitas - despesas - totalCartoes;

    console.log(`📊 [getResumoFinanceiro] Receitas: ${receitas}, Despesas: ${despesas}, Cartões: ${totalCartoes}, Saldo: ${saldo}`);

    return { 
      totalReceitas: receitas, 
      totalDespesas: despesas, 
      totalCartoes,
      saldo 
    };
  } catch (error) {
    console.error('💥 [getResumoFinanceiro] Erro geral:', error);
    return { totalReceitas: 0, totalDespesas: 0, totalCartoes: 0, saldo: 0 };
  }
}

/**
 * Get category summary for expenses or income
 * @param tipo - Transaction type filter ('despesa', 'receita', 'all')
 * @param monthFilter - Optional month filter in format 'YYYY-MM'
 * @returns Promise with array of category summaries
 */
export async function getCategorySummary(tipo: string = 'despesa', monthFilter?: string): Promise<CategorySummary[]> {
  console.log(`📋 [getCategorySummary] Obtendo resumo por categoria para tipo: ${tipo}`);
  console.log("📋 [getCategorySummary] Filtro de mês:", monthFilter);
  
  const normalizedEmail = getUserEmail();
  
  if (!normalizedEmail) {
    console.error("❌ [getCategorySummary] Email não encontrado");
    return [];
  }

  try {
    const groupIds = await getUserGroups(normalizedEmail);
    
    // Use the EXACT same query structure as getResumoFinanceiro
    let query = supabase.from('transacoes').select('categoria, valor, tipo');
    
    // Apply EXACT same user/group filter as getResumoFinanceiro
    if (groupIds.length > 0) {
      const orFilter = `login.eq.${normalizedEmail},grupo_id.in.(${groupIds.map(id => `"${id}"`).join(',')})`;
      query = query.or(orFilter);
    } else {
      query = query.eq('login', normalizedEmail);
    }

    // Apply type filter with case-insensitive comparison - only if not 'all'
    if (tipo !== 'all') {
      // Use ilike for case-insensitive comparison
      query = query.ilike('tipo', tipo);
      console.log(`📋 [getCategorySummary] Filtro de tipo case-insensitive aplicado: ${tipo}`);
    }

    // Apply EXACT same month filter as getResumoFinanceiro
    if (monthFilter) {
      const startDate = `${monthFilter}-01`;
      const year = parseInt(monthFilter.split('-')[0]);
      const month = parseInt(monthFilter.split('-')[1]);
      const endDate = new Date(year, month, 0).toISOString().split('T')[0];
      
      query = query
        .gte('quando', startDate)
        .lte('quando', `${endDate}T23:59:59.999Z`);
      
      console.log(`📅 [getCategorySummary] Filtro de data aplicado: ${startDate} até ${endDate}`);
    }

    const { data, error } = await query;

    if (error) {
      console.error('❌ [getCategorySummary] Erro:', error);
      return [];
    }

    if (!data || data.length === 0) {
      console.warn(`⚠️ [getCategorySummary] Nenhuma transação encontrada para tipo: ${tipo}`);
      return [];
    }

    console.log(`📋 [getCategorySummary] Dados brutos recebidos (${data.length} registros):`, data.slice(0, 5));

    // Group by category and sum values - handle NULL categories properly
    const categoryMap: { [key: string]: number } = {};
    let total = 0;

    data.forEach((transaction) => {
      // Handle NULL/empty categories properly - ALWAYS use "Sem Categoria" for NULL/empty values
      let categoria = 'Sem Categoria';
      
      if (transaction.categoria && typeof transaction.categoria === 'string') {
        const cleanCategory = transaction.categoria.trim();
        if (cleanCategory.length > 0) {
          categoria = cleanCategory;
        }
      }
      
      // Use absolute values to match getResumoFinanceiro calculation
      const valor = Math.abs(Number(transaction.valor || 0));
      
      // Always add to categoryMap, even if valor is 0 (to show categories with 0 value)
      if (!categoryMap[categoria]) {
        categoryMap[categoria] = 0;
      }
      categoryMap[categoria] += valor;
      total += valor;
    });

    console.log(`📋 [getCategorySummary] Categorias processadas:`, Object.keys(categoryMap));
    console.log(`📋 [getCategorySummary] Total calculado: ${total}`);
    console.log(`📋 [getCategorySummary] Sem Categoria: ${categoryMap['Sem Categoria'] || 0}`);

    // Enhanced color palette with more distinct colors - avoiding white/light colors
    const colors = [
      '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', 
      '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'
    ];

    // Convert to CategorySummary array with colors - include ALL categories, even with 0 value
    const categoryArray = Object.entries(categoryMap)
      .map(([categoria, valor], index) => ({
        categoria,
        valor,
        percentage: total > 0 ? valor / total : 0,
        color: colors[index % colors.length]
      }))
      .sort((a, b) => b.valor - a.valor);

    console.log(`📋 [getCategorySummary] Resultado final:`, categoryArray);
    console.log(`📋 [getCategorySummary] Total final das categorias: ${categoryArray.reduce((sum, cat) => sum + cat.valor, 0)}`);
    
    return categoryArray;
  } catch (error) {
    console.error('💥 [getCategorySummary] Erro geral:', error);
    return [];
  }
}

/**
 * Get monthly data for charts - full year
 * @returns Promise with array of monthly data
 */
export async function getMonthlyData(): Promise<MonthlyData[]> {
  console.log("📈 [getMonthlyData] Obtendo dados mensais do ano completo...");
  
  const normalizedEmail = getUserEmail();
  
  if (!normalizedEmail) {
    console.error("❌ [getMonthlyData] Email não encontrado");
    return [];
  }

  try {
    const groupIds = await getUserGroups(normalizedEmail);
    
    let query = supabase.from('transacoes').select('quando, tipo, valor');
    
    if (groupIds.length > 0) {
      const orFilter = `login.eq.${normalizedEmail},grupo_id.in.(${groupIds.map(id => `"${id}"`).join(',')})`;
      query = query.or(orFilter);
    } else {
      query = query.eq('login', normalizedEmail);
    }

    // Últimos 6 meses (o gráfico do painel mostra essa janela)
    const hoje = new Date();
    const startDate = new Date(hoje.getFullYear(), hoje.getMonth() - 5, 1);
    const endDate = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0);

    query = query
      .gte('quando', startDate.toISOString().split('T')[0])
      .lte('quando', endDate.toISOString().split('T')[0]);

    const { data, error } = await query;

    if (error) {
      console.error('❌ [getMonthlyData] Erro:', error);
      return [];
    }

    // Group by month
    const monthlyMap: { [key: string]: { receitas: number; despesas: number } } = {};

    data?.forEach((transaction) => {
      const date = new Date(transaction.quando);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      if (!monthlyMap[monthKey]) {
        monthlyMap[monthKey] = { receitas: 0, despesas: 0 };
      }

      const valor = Math.abs(Number(transaction.valor || 0));
      
      const tipo = transaction.tipo?.toLowerCase();
      if (tipo === 'receita') {
        monthlyMap[monthKey].receitas += valor;
      } else if (tipo === 'despesa') { // transferência não é gasto
        monthlyMap[monthKey].despesas += valor;
      }
    });

    // Convert to array and sort
    const monthlyArray = Object.entries(monthlyMap)
      .map(([month, data]) => ({
        month,
        receitas: data.receitas,
        despesas: data.despesas
      }))
      .sort((a, b) => a.month.localeCompare(b.month));

    console.log(`📈 [getMonthlyData] ${monthlyArray.length} meses processados`);
    return monthlyArray;
  } catch (error) {
    console.error('💥 [getMonthlyData] Erro geral:', error);
    return [];
  }
}
