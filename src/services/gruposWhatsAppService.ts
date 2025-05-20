
import { supabase } from "@/integrations/supabase/client";
import { WhatsAppGroup } from "@/types/financialTypes";

export async function cadastrarGrupoWhatsApp(): Promise<WhatsAppGroup | null> {
  try {
    // Obter o email do usuário do localStorage
    const userEmail = localStorage.getItem('userEmail');
    
    if (!userEmail) {
      console.error('Email do usuário não encontrado no localStorage');
      return null;
    }
    
    // Normalizar o email (minúsculo e sem espaços)
    const normalizedEmail = userEmail.trim().toLowerCase();
    
    // Criar registro na tabela grupos_whatsapp
    const { data, error } = await supabase
      .from('grupos_whatsapp')
      .insert([
        { 
          user_id: localStorage.getItem('userId') || '',
          login: normalizedEmail,
          status: 'pendente'
        }
      ])
      .select();
    
    if (error) {
      console.error('Erro ao cadastrar grupo do WhatsApp:', error);
      throw new Error('Não foi possível cadastrar o grupo de WhatsApp');
    }
    
    console.log('Grupo WhatsApp cadastrado com sucesso:', data);
    return data[0];
  } catch (error) {
    console.error('Erro ao cadastrar grupo do WhatsApp:', error);
    return null;
  }
}

export async function listarGruposWhatsApp(): Promise<WhatsAppGroup[]> {
  try {
    // Obter o email do usuário do localStorage
    const userEmail = localStorage.getItem('userEmail');
    
    if (!userEmail) {
      console.error('Email do usuário não encontrado no localStorage');
      return [];
    }
    
    // Normalizar o email (minúsculo e sem espaços)
    const normalizedEmail = userEmail.trim().toLowerCase();
    
    // Buscar grupos associados ao email do usuário
    const { data, error } = await supabase
      .from('grupos_whatsapp')
      .select('*')
      .eq('login', normalizedEmail)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Erro ao listar grupos do WhatsApp:', error);
      throw new Error('Não foi possível listar os grupos de WhatsApp');
    }
    
    console.log('Grupos WhatsApp encontrados:', data);
    return data || [];
  } catch (error) {
    console.error('Erro ao listar grupos do WhatsApp:', error);
    return [];
  }
}
