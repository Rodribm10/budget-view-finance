
import { WhatsAppGroup } from "@/types/financialTypes";
import { createWorkflowInN8n } from "./n8nWorkflowService";
import { findOrCreateWhatsAppGroup, listWhatsAppGroups, updateWorkflowId } from "./whatsAppGroupsService";

/**
 * Main function to register a WhatsApp group and create its workflow
 * Orchestrates the process using the specialized services
 */
export async function cadastrarGrupoWhatsApp(): Promise<WhatsAppGroup | null> {
  try {
    // Find or create a WhatsApp group for the current user
    const group = await findOrCreateWhatsAppGroup();
    
    // If no group was found or created, return null
    if (!group) {
      console.error('Erro inesperado: não foi possível obter ou criar um grupo');
      return null;
    }
    
    // Create workflow in n8n if it doesn't exist
    try {
      if (!group.workflow_id) {
        const userEmail = localStorage.getItem('userEmail')?.trim().toLowerCase();
        
        if (!userEmail) {
          throw new Error('Email do usuário não encontrado no localStorage');
        }
        
        console.log(`Iniciando criação de workflow para o email: ${userEmail} e grupo ID: ${group.id}`);
        const workflowResponse = await createWorkflowInN8n(userEmail);
        
        if (workflowResponse && workflowResponse.id) {
          // Atualizar o objeto com o workflow_id
          await updateWorkflowId(group.id, workflowResponse.id);
          group.workflow_id = workflowResponse.id;
          console.log('Workflow criado com sucesso no n8n:', workflowResponse.id);
        } else {
          console.log('Resposta do n8n não contém ID de workflow válido:', workflowResponse);
        }
      }
    } catch (n8nError) {
      console.error('Erro ao criar workflow no n8n:', n8nError);
      // Não impede a criação do grupo, apenas não adiciona o workflow_id
    }
    
    // Always return the group, even if workflow creation fails
    return group;
  } catch (error) {
    console.error('Erro ao cadastrar grupo do WhatsApp:', error);
    throw error; // Propaga o erro para ser tratado no componente
  }
}

// Re-export functions from the specialized services for backward compatibility
export { listWhatsAppGroups as listarGruposWhatsApp };
export { updateWorkflowId as atualizarWorkflowId };
