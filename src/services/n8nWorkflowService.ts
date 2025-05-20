
// Service dedicated to n8n workflow operations
import { toast } from "@/hooks/use-toast";

const N8N_API_URL = 'https://n8n.innova1001.com.br/api/v1/workflows';
const N8N_API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2YmM4MjQxOS0zZTk1LTRiYmMtODMwMy0xODAzZjk4YmQ4YjciLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwiaWF0IjoxNzQ3NzM0NzYyLCJleHAiOjE3NTAzMDIwMDB9.Evr_o42xLJPq1c2p5SUWo00IY85WXp8s_nqSy64V-is';

/**
 * Creates a workflow in the n8n system for a specific user
 * @param email User email to associate with the workflow
 * @returns The created workflow data or null if creation failed
 */
export async function createWorkflowInN8n(email: string): Promise<{ id: string } | null> {
  try {
    console.log(`Criando workflow no n8n para o email: ${email}`);
    
    // Nome do workflow formatado corretamente
    const workflowName = `Workflow Home Finance - ${email}`;
    console.log(`Nome do workflow: ${workflowName}`);
    
    // Testar primeiro com uma requisição OPTIONS para verificar CORS
    console.log("Enviando requisição OPTIONS para verificar CORS...");
    
    try {
      const optionsResponse = await fetch(N8N_API_URL, {
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
    
    const response = await fetch(N8N_API_URL, {
      method: 'POST',
      headers: {
        'X-N8N-API-KEY': N8N_API_KEY,
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

/**
 * Clones an existing n8n workflow for a user
 * @param email User email 
 * @param grupoId Group ID to associate with cloned workflow
 * @returns The cloned workflow data or null if cloning failed
 */
export async function cloneN8nWorkflow(email: string, grupoId: string): Promise<{ workflow_id: string } | null> {
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
