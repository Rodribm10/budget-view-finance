
import { N8N_CONFIG } from './config';
import { getUserWorkflowId } from './databaseOperations';

/**
 * N8N workflow operations
 */

/**
 * Activates user workflow in n8n
 */
export async function activateUserWorkflow(userEmail: string): Promise<void> {
  try {
    console.log(`🔄 Iniciando ativação do workflow para usuário: ${userEmail}`);
    
    // Get user's workflow ID
    const workflowId = await getUserWorkflowId(userEmail);
    console.log(`📋 Workflow ID encontrado: ${workflowId}`);
    
    // Make activation request - formato exato conforme o print
    const activationUrl = `${N8N_CONFIG.BASE_URL}/workflows/${workflowId}/activate`;
    console.log(`🔗 URL de ativação: ${activationUrl}`);
    
    const response = await fetch(activationUrl, {
      method: 'POST',
      headers: {
        'X-N8N-API-KEY': N8N_CONFIG.API_KEY,
        'Content-Type': 'application/json'
      }
      // Sem body - conforme mostrado no print, não há body na requisição
    });
    
    console.log(`📡 Status da resposta da ativação: ${response.status}`);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ Erro ao ativar workflow: ${response.status} - ${errorText}`);
      throw new Error(`Erro ao ativar workflow: ${response.status} - ${errorText}`);
    }
    
    const responseData = await response.json();
    console.log('✅ Workflow ativado com sucesso:', responseData);
    
  } catch (error) {
    console.error('💥 Erro crítico ao ativar workflow do usuário:', error);
    throw error;
  }
}
