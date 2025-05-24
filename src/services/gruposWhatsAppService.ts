
import { supabase } from '@/integrations/supabase/client';
import { WhatsAppGroup } from '@/types/financialTypes';
import { getUserWhatsAppInstance } from './whatsAppInstanceService';

/**
 * Lista todos os grupos do WhatsApp do usuário atual
 */
export async function listarGruposWhatsApp(): Promise<WhatsAppGroup[]> {
  try {
    const userEmail = localStorage.getItem('userEmail');
    if (!userEmail) {
      console.error('Email do usuário não fornecido');
      throw new Error('Email do usuário não encontrado');
    }

    console.log('Buscando grupos para o usuário:', userEmail);

    // Primeiro verificar se o usuário tem instância WhatsApp
    const instanceData = await getUserWhatsAppInstance(userEmail);
    console.log('Dados da instância do usuário:', instanceData);

    if (!instanceData || !instanceData.instancia_zap) {
      console.log('Usuário não tem instância WhatsApp válida ou dados estão incompletos');
      return [];
    }

    // Buscar grupos usando o email como user_id
    const { data: grupos, error } = await supabase
      .from('grupos_whatsapp')
      .select('*')
      .eq('user_id', userEmail.trim().toLowerCase())
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erro ao listar grupos do WhatsApp:', error);
      throw new Error('Não foi possível listar os grupos de WhatsApp');
    }

    console.log('Grupos encontrados:', grupos);
    return grupos || [];

  } catch (error) {
    console.error('Erro ao listar grupos do WhatsApp:', error);
    throw error;
  }
}

/**
 * Verifica se o usuário tem uma instância WhatsApp conectada
 */
export async function verificarInstanciaWhatsApp(): Promise<{
  hasInstance: boolean;
  instanceName: string | null;
  status: string | null;
}> {
  try {
    const userEmail = localStorage.getItem('userEmail');
    if (!userEmail) {
      console.log('Email do usuário não fornecido');
      return { hasInstance: false, instanceName: null, status: null };
    }

    console.log('Verificando instância para o usuário:', userEmail);
    const instanceData = await getUserWhatsAppInstance(userEmail);

    if (!instanceData) {
      console.log('Usuário não possui instância');
      return { hasInstance: false, instanceName: null, status: null };
    }

    const hasInstance = !!(instanceData.instancia_zap && instanceData.instancia_zap.trim() !== '');
    console.log('Resultado da verificação:', {
      hasInstance,
      instanceName: instanceData.instancia_zap,
      status: instanceData.status_instancia
    });

    return {
      hasInstance,
      instanceName: instanceData.instancia_zap,
      status: instanceData.status_instancia
    };

  } catch (error) {
    console.error('Erro ao verificar instância WhatsApp:', error);
    return { hasInstance: false, instanceName: null, status: null };
  }
}
