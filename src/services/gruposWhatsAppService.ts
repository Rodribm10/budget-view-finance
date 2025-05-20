
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
    
    // Primeiro verificar se já existe um grupo pendente para este usuário
    const { data: existingGroups } = await supabase
      .from('grupos_whatsapp')
      .select('*')
      .eq('login', normalizedEmail)
      .eq('remote_jid', '')
      .eq('status', 'pendente');
    
    let groupToUse: WhatsAppGroup | null = null;
    
    if (existingGroups && existingGroups.length > 0) {
      console.log('Grupo pendente já existe para este usuário:', existingGroups[0]);
      groupToUse = existingGroups[0];
      
      // Se já existe um workflow_id, não precisamos criar novamente
      if (groupToUse.workflow_id) {
        console.log('Workflow já existe para este grupo:', groupToUse.workflow_id);
        return groupToUse;
      }
    } else {
      // Criar registro na tabela grupos_whatsapp se não existir
      console.log('Criando novo grupo para o usuário:', normalizedEmail);
      const { data, error } = await supabase
        .from('grupos_whatsapp')
        .insert({
          user_id: localStorage.getItem('userId') || '',
          remote_jid: '',
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
      groupToUse = data[0];
    }
    
    // A partir daqui, temos um grupo para usar, seja novo ou existente
    if (!groupToUse) {
      console.error('Erro inesperado: não foi possível obter ou criar um grupo');
      return null;
    }
    
    // Criar workflow no n8n se não existir
    try {
      if (!groupToUse.workflow_id) {
        console.log(`Iniciando criação de workflow para o email: ${normalizedEmail} e grupo ID: ${groupToUse.id}`);
        const workflowResponse = await createWorkflowInN8n(normalizedEmail);
        
        console.log("Resposta completa do n8n:", workflowResponse);
        
        if (workflowResponse && workflowResponse.id) {
          // Atualizar o objeto com o workflow_id
          await atualizarWorkflowId(groupToUse.id, workflowResponse.id);
          groupToUse.workflow_id = workflowResponse.id;
          console.log('Workflow criado com sucesso no n8n:', workflowResponse.id);
        } else {
          console.log('Resposta do n8n não contém ID de workflow válido:', workflowResponse);
        }
      }
    } catch (n8nError) {
      console.error('Erro ao criar workflow no n8n:', n8nError);
      // Não impede a criação do grupo, apenas não adiciona o workflow_id
    }
    
    // Sempre retorna o grupo, mesmo se a criação do workflow falhar
    return groupToUse;
  } catch (error) {
    console.error('Erro ao cadastrar grupo do WhatsApp:', error);
    throw error; // Propaga o erro para ser tratado no componente
  }
}

// Função para criar um workflow no n8n
async function createWorkflowInN8n(email: string): Promise<{ id: string } | null> {
  try {
    console.log(`Criando workflow no n8n para o email: ${email}`);
    
    // Nome do workflow formatado corretamente
    const workflowName = `Workflow Home Finance - ${email}`;
    console.log(`Nome do workflow: ${workflowName}`);
    
    // Testar primeiro com uma requisição OPTIONS para verificar CORS
    console.log("Enviando requisição OPTIONS para verificar CORS...");
    
    try {
      const optionsResponse = await fetch('https://n8n.innova1001.com.br/api/v1/workflows', {
        method: 'OPTIONS',
        headers: {
          'Access-Control-Request-Method': 'POST',
          'Access-Control-Request-Headers': 'Content-Type, X-N8N-API-KEY, Origin',
          'Origin': window.location.origin
        }
      });
      
      console.log("Resposta OPTIONS:", {
        status: optionsResponse.status,
        ok: optionsResponse.ok,
        headers: Array.from(optionsResponse.headers.entries()),
        statusText: optionsResponse.statusText
      });
    } catch (corsError) {
      console.error("Erro no teste de CORS:", corsError);
    }
    
    // Agora fazer a requisição real
    console.log("Enviando requisição POST para criar workflow...");
    
    const response = await fetch('https://n8n.innova1001.com.br/api/v1/workflows', {
      method: 'POST',
      headers: {
        'X-N8N-API-KEY': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2YmM4MjQxOS0zZTk1LTRiYmMtODMwMy0xODAzZjk4YmQ4YjciLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwiaWF0IjoxNzQ3NzM0NzYyLCJleHAiOjE3NTAzMDIwMDB9.Evr_o42xLJPq1c2p5SUWo00IY85WXp8s_nqSy64V-is',
        'Content-Type': 'application/json',
        'Origin': window.location.origin
      },
      body: JSON.stringify({
        name: workflowName,
        nodes: [],
        connections: {},
        settings: {}
      })
    });

    // Log detalhado do status da resposta
    console.log("Status da resposta n8n:", {
      status: response.status,
      statusText: response.statusText,
      ok: response.ok,
      headers: Array.from(response.headers.entries())
    });
    
    if (!response.ok) {
      let errorDetails = '';
      try {
        const errorText = await response.text();
        errorDetails = errorText;
        console.error(`Erro ao criar workflow: Status ${response.status}`, errorText);
      } catch (e) {
        console.error(`Não foi possível ler o corpo da resposta de erro: ${e}`);
      }
      throw new Error(`Erro ao criar workflow: Status ${response.status}. Detalhes: ${errorDetails}`);
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
