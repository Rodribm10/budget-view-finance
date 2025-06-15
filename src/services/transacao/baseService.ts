
import { supabase } from "@/integrations/supabase/client";

/**
 * Get user email from local storage and normalize it
 * @returns Normalized user email or null if not found
 */
export const getUserEmail = (): string | null => {
  const userEmail = localStorage.getItem('userEmail');
  
  console.log("📧 [getUserEmail] Email raw do localStorage:", userEmail);
  
  if (!userEmail) {
    console.error('❌ [getUserEmail] Email do usuário não encontrado no localStorage');
    console.log("🔍 [getUserEmail] Verificando todas as chaves do localStorage:");
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      console.log(`   ${key}: ${localStorage.getItem(key)}`);
    }
    return null;
  }
  
  // Normalize the email (lowercase and trim spaces)
  const normalizedEmail = userEmail.trim().toLowerCase();
  console.log("✅ [getUserEmail] Email normalizado:", normalizedEmail);
  
  return normalizedEmail;
};

/**
 * Get user groups by email
 * @param userEmail Normalized user email
 * @returns Array of group IDs or empty array if error
 */
export const getUserGroups = async (userEmail: string): Promise<string[]> => {
  try {
    console.log("👥 [getUserGroups] Buscando grupos para email:", userEmail);
    
    const { data: userGroups, error: groupsError } = await supabase
      .from('grupos_whatsapp')
      .select('remote_jid')
      .eq('login', userEmail);
      
    if (groupsError) {
      console.error('❌ [getUserGroups] Erro ao buscar grupos do usuário:', groupsError);
      return [];
    }
    
    console.log("👥 [getUserGroups] Grupos encontrados:", userGroups);
    
    // Extract IDs of the groups to use in the filter
    const groupIds = userGroups ? userGroups.map(group => group.remote_jid) : [];
    console.log("👥 [getUserGroups] IDs dos grupos extraídos:", groupIds);
    
    return groupIds;
  } catch (error) {
    console.error('💥 [getUserGroups] Erro ao obter grupos do usuário:', error);
    return [];
  }
};

/**
 * Format currency value to Brazilian Real (BRL)
 * @param value Number to format as currency
 * @returns Formatted currency string
 */
export const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};
