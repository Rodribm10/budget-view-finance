
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
    
    if (!data || data.length === 0) {
      console.error('Nenhum dado retornado após inserção');
      return null;
    }
    
    console.log('Grupo WhatsApp cadastrado com sucesso:', data);
    const newGroup = data[0];

    // Criar workflow no n8n
    try {
      const workflowResponse = await createWorkflowInN8n(normalizedEmail);
      
      if (workflowResponse && workflowResponse.id) {
        // Atualizar o objeto com o workflow_id
        await atualizarWorkflowId(newGroup.id, workflowResponse.id);
        newGroup.workflow_id = workflowResponse.id;
        console.log('Workflow criado com sucesso no n8n:', workflowResponse.id);
      } else {
        console.log('Resposta do n8n não contém ID de workflow válido');
      }
    } catch (n8nError) {
      console.error('Erro ao criar workflow no n8n:', n8nError);
      // Não impede a criação do grupo, apenas não adiciona o workflow_id
    }
    
    // Sempre retorna o grupo, mesmo se a criação do workflow falhar
    return newGroup;
  } catch (error) {
    console.error('Erro ao cadastrar grupo do WhatsApp:', error);
    throw error; // Propaga o erro para ser tratado no componente
  }
}

// Função para criar um workflow no n8n
async function createWorkflowInN8n(email: string): Promise<{ id: string } | null> {
  try {
    console.log(`Criando workflow no n8n para o email: ${email}`);
    
    const response = await fetch('https://n8n.innova1001.com.br/api/v1/workflows', {
      method: 'POST',
      headers: {
        'X-N8N-API-KEY': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2YmM4MjQxOS0zZTk1LTRiYmMtODMwMy0xODAzZjk4YmQ4YjciLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwiaWF0IjoxNzQ3NzM0NzYyLCJleHAiOjE3NTAzMDIwMDB9.Evr_o42xLJPq1c2p5SUWo00IY85WXp8s_nqSy64V-is',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: `Workflow Home Finance - ${email}`,
        nodes: [],
        connections: {},
        settings: {}
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Erro ao criar workflow: Status ${response.status}`, errorText);
      throw new Error(`Erro ao criar workflow: Status ${response.status}`);
    }

    const data = await response.json();
    console.log('Resposta da criação de workflow:', data);
    
    return data;
  } catch (error) {
    console.error('Erro na requisição de criação de workflow:', error);
    throw error;
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
