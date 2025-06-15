
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
    
    // ===== VERIFICAÇÕES DE DEBUG =====
    
    // 1. Verificar total de registros na tabela
    console.log("🔍 [DEBUG] Verificando total de registros na tabela transacoes...");
    const { data: totalCount, error: countError } = await supabase
      .from('transacoes')
      .select('*', { count: 'exact' });
    
    if (countError) {
      console.error("❌ [DEBUG] Erro ao contar registros:", countError);
    } else {
      console.log("📊 [DEBUG] Total de registros na tabela transacoes:", totalCount?.length || 0);
    }
    
    // 2. Verificar registros com o email específico
    console.log("🔍 [DEBUG] Verificando registros para o email específico...");
    const { data: emailData, error: emailError } = await supabase
      .from('transacoes')
      .select('*')
      .eq('login', normalizedEmail);
    
    if (emailError) {
      console.error("❌ [DEBUG] Erro ao buscar por email:", emailError);
    } else {
      console.log("📧 [DEBUG] Registros encontrados para o email:", emailData?.length || 0);
      if (emailData && emailData.length > 0) {
        console.log("📧 [DEBUG] Primeiro registro encontrado:", emailData[0]);
      }
    }
    
    // 3. Verificar todos os emails únicos na tabela
    console.log("🔍 [DEBUG] Verificando todos os emails únicos na tabela...");
    const { data: uniqueEmails, error: uniqueError } = await supabase
      .from('transacoes')
      .select('login')
      .not('login', 'is', null);
    
    if (uniqueError) {
      console.error("❌ [DEBUG] Erro ao buscar emails únicos:", uniqueError);
    } else {
      const emails = [...new Set(uniqueEmails?.map(item => item.login))];
      console.log("📧 [DEBUG] Emails únicos encontrados na tabela:", emails);
      console.log("📧 [DEBUG] Email procurado existe na lista?", emails.includes(normalizedEmail));
    }
    
    // 4. Verificar registros por grupo_id
    if (groupIds.length > 0) {
      console.log("🔍 [DEBUG] Verificando registros por grupo_id...");
      const { data: groupData, error: groupError } = await supabase
        .from('transacoes')
        .select('*')
        .in('grupo_id', groupIds);
      
      if (groupError) {
        console.error("❌ [DEBUG] Erro ao buscar por grupo_id:", groupError);
      } else {
        console.log("👥 [DEBUG] Registros encontrados por grupo_id:", groupData?.length || 0);
        if (groupData && groupData.length > 0) {
          console.log("👥 [DEBUG] Primeiro registro por grupo:", groupData[0]);
        }
      }
    }
    
    // ===== QUERY ORIGINAL =====
    
    // Build the query with month filter if provided
    console.log("🏗️ [getTransacoes] Construindo query original...");
    
    let query = supabase
      .from('transacoes')
      .select('*');
    
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
