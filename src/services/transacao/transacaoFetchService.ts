
import { supabase } from "@/integrations/supabase/client";
import { Transaction } from "@/types/financialTypes";
import { getUserEmail, getUserGroups } from "./baseService";

/**
 * Fetch all transactions for the current user with optional month filter
 * @param monthFilter - Optional month filter in format 'YYYY-MM'
 * @returns Promise with array of transactions
 */
export async function getTransacoes(monthFilter?: string): Promise<Transaction[]> {
  console.log("🔍 [getTransacoes] Iniciando busca de transações...");
  console.log("🔍 [getTransacoes] Filtro de mês:", monthFilter);
  
  // Get the user's email from localStorage
  const normalizedEmail = getUserEmail();
  
  console.log("📧 [getTransacoes] Email do usuário obtido:", normalizedEmail);
  
  if (!normalizedEmail) {
    console.error("❌ [getTransacoes] Email não encontrado no localStorage");
    return [];
  }
  
  try {
    // First, get all user's groups by email
    console.log("👥 [getTransacoes] Buscando grupos do usuário...");
    const groupIds = await getUserGroups(normalizedEmail);
    console.log(`👥 [getTransacoes] Encontrados ${groupIds.length} grupos vinculados ao usuário:`, groupIds);
    
    // Build the main query
    console.log("🏗️ [getTransacoes] Iniciando query principal...");
    
    let query = supabase.from('transacoes').select('*');
    
    // Log the filter being applied
    let filterDescription = "";
    
    if (groupIds.length > 0) {
      const orFilter = `login.eq.${normalizedEmail},grupo_id.in.(${groupIds.map(id => `"${id}"`).join(',')})`;
      filterDescription = `OR filter: ${orFilter}`;
      query = query.or(orFilter);
    } else {
      filterDescription = `Simple login filter: login = ${normalizedEmail}`;
      query = query.eq('login', normalizedEmail);
    }
    
    console.log("🔍 [getTransacoes] Filtro aplicado:", filterDescription);

    // Apply month filter if provided
    if (monthFilter) {
      const startDate = `${monthFilter}-01`;
      const year = parseInt(monthFilter.split('-')[0]);
      const month = parseInt(monthFilter.split('-')[1]);
      const endDate = new Date(year, month, 0).toISOString().split('T')[0];
      
      query = query
        .gte('quando', startDate)
        .lte('quando', `${endDate}T23:59:59.999Z`);
      
      console.log(`📅 [getTransacoes] Filtro de data aplicado: ${startDate} até ${endDate}`);
    }

    query = query.order('quando', { ascending: false });

    console.log("🚀 [getTransacoes] Executando query final...");
    const { data, error } = await query;

    if (error) {
      console.error('❌ [getTransacoes] Erro ao executar query:', error);
      console.error('❌ [getTransacoes] Detalhes do erro:', JSON.stringify(error, null, 2));
      throw new Error('Não foi possível carregar as transações');
    }

    console.log("✅ [getTransacoes] Query executada com sucesso");
    console.log("📊 [getTransacoes] Número de registros retornados:", data?.length || 0);
    
    if (data && data.length > 0) {
      console.log("📋 [getTransacoes] Primeiro registro retornado:", data[0]);
      console.log("📋 [getTransacoes] Estrutura dos dados:", Object.keys(data[0]));
    }

    if (!data || data.length === 0) {
      console.warn("⚠️ [getTransacoes] Nenhuma transação encontrada");
      console.warn("⚠️ [getTransacoes] Email buscado:", normalizedEmail);
      console.warn("⚠️ [getTransacoes] Filtro de mês:", monthFilter);
      console.warn("⚠️ [getTransacoes] Grupos do usuário:", groupIds);
      return [];
    }

    // Transform the received data to the expected format
    const transformedData = data.map((item: any) => ({
      id: item.id.toString(),
      user: item.user || '',
      login: item.login || normalizedEmail,
      created_at: item.created_at,
      valor: item.tipo?.toLowerCase() === 'receita' ? Math.abs(item.valor || 0) : -Math.abs(item.valor || 0),
      quando: item.quando || new Date().toISOString(),
      detalhes: item.detalhes || '',
      estabelecimento: item.estabelecimento || '',
      tipo: item.tipo?.toLowerCase() || 'despesa',
      categoria: item.categoria || 'Outros',
      grupo_id: item.grupo_id || null
    }));

    console.log("🔄 [getTransacoes] Dados transformados com sucesso");
    console.log("🔄 [getTransacoes] Total de transações processadas:", transformedData.length);

    return transformedData;
  } catch (error) {
    console.error('💥 [getTransacoes] Erro geral na função:', error);
    console.error('💥 [getTransacoes] Stack trace:', error instanceof Error ? error.stack : 'Stack não disponível');
    return [];
  }
}
