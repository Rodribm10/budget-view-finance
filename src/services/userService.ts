
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

export interface UserInfo {
  id: string;
  nome: string;
  email: string;
  empresa: string | null;
  created_at: string;
}

export const getUsersRegisteredToday = async (): Promise<UserInfo[]> => {
  try {
    console.log("Buscando usuários cadastrados hoje...");
    // Obtém a data atual no formato YYYY-MM-DD
    const today = format(new Date(), 'yyyy-MM-dd');
    
    // Busca usuários cadastrados hoje
    const { data, error } = await supabase
      .from("usuarios")
      .select("*")
      .gte('created_at', `${today}T00:00:00`) // Data início (hoje 00:00:00)
      .lte('created_at', `${today}T23:59:59`) // Data fim (hoje 23:59:59)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error("Erro ao buscar usuários:", error);
      throw error;
    }
    
    console.log(`Encontrados ${data?.length || 0} usuários cadastrados hoje:`, data);
    
    return data as UserInfo[];
  } catch (error) {
    console.error("Erro ao buscar usuários cadastrados hoje:", error);
    throw error;
  }
};

export const getAllUsers = async (): Promise<UserInfo[]> => {
  try {
    console.log("Buscando todos os usuários...");
    
    const { data, error } = await supabase
      .from("usuarios")
      .select("*")
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error("Erro ao buscar usuários:", error);
      throw error;
    }
    
    console.log(`Encontrados ${data?.length || 0} usuários no total`);
    
    return data as UserInfo[];
  } catch (error) {
    console.error("Erro ao buscar todos os usuários:", error);
    throw error;
  }
};
