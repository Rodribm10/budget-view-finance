
import { supabase } from "@/integrations/supabase/client";

/**
 * Get user email from local storage and normalize it
 * @returns Normalized user email or null if not found
 */
export const getUserEmail = (): string | null => {
  const userEmail = localStorage.getItem('userEmail');
  
  if (!userEmail) {
    console.error('Email do usuário não encontrado no localStorage');
    return null;
  }
  
  // Normalize the email (lowercase and trim spaces)
  return userEmail.trim().toLowerCase();
};

/**
 * Get user groups by email
 * @param userEmail Normalized user email
 * @returns Array of group IDs or empty array if error
 */
export const getUserGroups = async (userEmail: string): Promise<string[]> => {
  try {
    const { data: userGroups, error: groupsError } = await supabase
      .from('grupos_whatsapp')
      .select('remote_jid')
      .eq('login', userEmail);
      
    if (groupsError) {
      console.error('Erro ao buscar grupos do usuário:', groupsError);
      return [];
    }
    
    // Extract IDs of the groups to use in the filter
    return userGroups ? userGroups.map(group => group.remote_jid) : [];
  } catch (error) {
    console.error('Erro ao obter grupos do usuário:', error);
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
