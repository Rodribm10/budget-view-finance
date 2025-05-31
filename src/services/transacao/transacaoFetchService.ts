
import { supabase } from "@/integrations/supabase/client";
import { Transaction } from "@/types/financialTypes";
import { getUserEmail, getUserGroups } from "./baseService";

/**
 * Fetch all transactions for the current user with optional month filter
 * @param monthFilter - Optional month filter in format 'YYYY-MM'
 * @returns Promise with array of transactions
 */
export async function getTransacoes(monthFilter?: string): Promise<Transaction[]> {
  console.log("Buscando transações do Supabase...", monthFilter ? `Filtro do mês: ${monthFilter}` : "Sem filtro de mês");
  
  // Get the user's email from localStorage
  const normalizedEmail = getUserEmail();
  
  if (!normalizedEmail) {
    return [];
  }
  
  console.log("Buscando transações para o usuário com email:", normalizedEmail);
  
  try {
    // First, get all user's groups by email
    const groupIds = await getUserGroups(normalizedEmail);
    console.log(`Encontrados ${groupIds.length} grupos vinculados ao usuário:`, groupIds);
    
    // Build the query with month filter if provided
    let query = supabase
      .from('transacoes')
      .select('*')
      .or(`login.eq.${normalizedEmail},${groupIds.length > 0 ? `grupo_id.in.(${groupIds.map(id => `"${id}"`).join(',')})` : ''}`)
      .order('quando', { ascending: false });

    // Apply month filter if provided
    if (monthFilter) {
      const startDate = `${monthFilter}-01`;
      const year = parseInt(monthFilter.split('-')[0]);
      const month = parseInt(monthFilter.split('-')[1]);
      const endDate = new Date(year, month, 0).toISOString().split('T')[0]; // Last day of the month
      
      query = query
        .gte('quando', startDate)
        .lte('quando', `${endDate}T23:59:59.999Z`);
      
      console.log(`Aplicando filtro de mês: ${startDate} até ${endDate}`);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Erro ao buscar transações:', error);
      throw new Error('Não foi possível carregar as transações');
    }

    console.log("Transações encontradas:", data);

    // Transform the received data to the expected format, normalizing the types
    return data.map((item: any) => ({
      id: item.id.toString(),
      user: item.user || '',
      login: item.login || normalizedEmail, // Ensure the login field is filled
      created_at: item.created_at,
      valor: item.tipo?.toLowerCase() === 'receita' ? Math.abs(item.valor || 0) : -Math.abs(item.valor || 0),
      quando: item.quando || new Date().toISOString(),
      detalhes: item.detalhes || '',
      estabelecimento: item.estabelecimento || '',
      tipo: item.tipo?.toLowerCase() || 'despesa',
      categoria: item.categoria || 'Outros',
      grupo_id: item.grupo_id || null
    }));
  } catch (error) {
    console.error('Erro ao buscar transações:', error);
    return [];
  }
}
