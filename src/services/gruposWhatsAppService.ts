
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
      .insert({
        user_id: localStorage.getItem('userId') || '', // Mantido por compatibilidade
        remote_jid: '', // Valor temporário vazio - será preenchido pelo backend posteriormente
        login: normalizedEmail,
        status: 'pendente'
      })
      .select();
    
    if (error) {
      console.error('Erro ao cadastrar grupo do WhatsApp:', error);
      throw new Error('Não foi possível cadastrar o grupo de WhatsApp');
    }
    
    console.log('Grupo WhatsApp cadastrado com sucesso:', data);

    // Tentativa de clonagem do workflow do n8n
    try {
      const grupoId = data[0].remote_jid;
      const result = await cloneN8nWorkflow(normalizedEmail, grupoId);
      
      if (result && result.workflow_id) {
        await atualizarWorkflowId(data[0].id, result.workflow_id);
        // Atualizar o objeto data com o workflow_id
        data[0].workflow_id = result.workflow_id;
      }
    } catch (n8nError) {
      console.error('Erro ao clonar workflow do n8n:', n8nError);
      // Não impede a criação do grupo, apenas não adiciona o workflow_id
    }
    
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

// Função para clonar o workflow do n8n
async function cloneN8nWorkflow(email: string, grupoId: string): Promise<{ workflow_id: string } | null> {
  try {
    console.log(`Clonando workflow para email: ${email}, grupoId: ${grupoId}`);
    
    const response = await fetch('https://n8n.innova1001.com.br/webhook/clone-workflow', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        grupo_id: grupoId
      })
    });

    if (!response.ok) {
      throw new Error(`Erro ao clonar workflow: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Resposta da clonagem de workflow:', data);
    
    return data;
  } catch (error) {
    console.error('Erro na requisição de clonagem de workflow:', error);
    return null;
  }
}

// Função para atualizar o workflow_id no banco de dados
async function atualizarWorkflowId(groupId: number, workflowId: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('grupos_whatsapp')
      .update({ workflow_id: workflowId })
      .eq('id', groupId);
    
    if (error) {
      console.error('Erro ao atualizar workflow_id:', error);
      throw error;
    }
    
    console.log(`Workflow ID ${workflowId} atualizado com sucesso para o grupo ${groupId}`);
  } catch (error) {
    console.error('Erro ao atualizar workflow_id no banco de dados:', error);
    throw error;
  }
}
