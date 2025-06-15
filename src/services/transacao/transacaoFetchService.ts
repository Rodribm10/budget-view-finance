
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
    
    // Build the query with month filter if provided
    console.log("🏗️ [getTransacoes] Construindo query...");
    
    let query = supabase
      .from('transacoes')
      .select('*');
    
    // Debug: First, let's see what's in the transacoes table
    console.log("🔎 [getTransacoes] Verificando todas as transações na tabela...");
    const { data: allTransactions, error: allError } = await supabase
      .from('transacoes')
      .select('*')
      .limit(10);
    
    if (allError) {
      console.error("❌ [getTransacoes] Erro ao buscar todas as transações:", allError);
    } else {
      console.log("📊 [getTransacoes] Total de transações na tabela (primeiras 10):", allTransactions);
      console.log("📊 [getTransacoes] Estrutura da primeira transação:", allTransactions[0]);
    }
    
    // Now let's build the proper filter
    if (groupIds.length > 0) {
      query = query.or(`login.eq.${normalizedEmail},grupo_id.in.(${groupIds.map(id => `"${id}"`).join(',')})`);
      console.log("🔍 [getTransacoes] Query com grupos:", `login.eq.${normalizedEmail},grupo_id.in.(${groupIds.map(id => `"${id}"`).join(',')})`);
    } else {
      query = query.eq('login', normalizedEmail);
      console.log("🔍 [getTransacoes] Query apenas por email:", normalizedEmail);
    }

    // Apply month filter if provided
    if (monthFilter) {
      const startDate = `${monthFilter}-01`;
      const year = parseInt(monthFilter.split('-')[0]);
      const month = parseInt(monthFilter.split('-')[1]);
      const endDate = new Date(year, month, 0).toISOString().split('T')[0]; // Last day of the month
      
      query = query
        .gte('quando', startDate)
        .lte('quando', `${endDate}T23:59:59.999Z`);
      
      console.log(`📅 [getTransacoes] Aplicando filtro de mês: ${startDate} até ${endDate}`);
    }

    query = query.order('quando', { ascending: false });

    console.log("🚀 [getTransacoes] Executando query final...");
    const { data, error } = await query;

    if (error) {
      console.error('❌ [getTransacoes] Erro ao executar query:', error);
      throw new Error('Não foi possível carregar as transações');
    }

    console.log("✅ [getTransacoes] Transações encontradas:", data?.length || 0);
    console.log("📋 [getTransacoes] Dados retornados:", data);

    if (!data || data.length === 0) {
      console.warn("⚠️ [getTransacoes] Nenhuma transação encontrada para o usuário:", normalizedEmail);
      
      // Let's check if there are transactions with similar emails
      console.log("🔍 [getTransacoes] Verificando emails similares na tabela...");
      const { data: similarEmails } = await supabase
        .from('transacoes')
        .select('login, count(*)')
        .not('login', 'is', null)
        .limit(20);
      
      console.log("📧 [getTransacoes] Emails encontrados na tabela transacoes:", similarEmails);
      
      return [];
    }

    // Transform the received data to the expected format, normalizing the types
    const transformedData = data.map((item: any) => ({
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

    console.log("🔄 [getTransacoes] Transações transformadas:", transformedData.length);
    console.log("🔄 [getTransacoes] Primeira transação transformada:", transformedData[0]);

    return transformedData;
  } catch (error) {
    console.error('💥 [getTransacoes] Erro geral na função:', error);
    return [];
  }
}
