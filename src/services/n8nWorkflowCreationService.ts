
// Service dedicated to creating n8n workflows for new users
import { supabase } from "@/integrations/supabase/client";

interface N8nWorkflowPayload {
  name: string;
  nodes: any[];
  connections: any;
  settings: any;
}

interface N8nWorkflowResponse {
  id: string;
  name: string;
  nodes: Array<{
    webhookUrls?: string[];
  }>;
}

/**
 * Creates a workflow in n8n for a new user
 * @param userEmail The email of the user who just registered
 * @param workflowTemplate The JSON template for the workflow
 * @returns The created workflow data
 */
export async function createN8nWorkflowForUser(
  userEmail: string, 
  workflowTemplate: N8nWorkflowPayload
): Promise<{ workflowId: string; webhookUrl: string } | null> {
  try {
    console.log(`Creating n8n workflow for user: ${userEmail}`);
    
    // Extract the username from email (part before @)
    const username = userEmail.split('@')[0];
    
    // Clone the template to avoid modifying the original
    const modifiedTemplate = JSON.parse(JSON.stringify(workflowTemplate));
    
    // 1. Modify the workflow name to include user email
    modifiedTemplate.name = modifiedTemplate.name.replace('rodrigobm10@gmail.com', userEmail);
    
    // 2. Modify webhook path in the first node to use username
    if (modifiedTemplate.nodes && modifiedTemplate.nodes.length > 0) {
      const firstNode = modifiedTemplate.nodes[0];
      if (firstNode.parameters && firstNode.parameters.path) {
        firstNode.parameters.path = username;
      }
    }
    
    // 3. Replace all occurrences of rodrigobm10@gmail.com with user email
    const templateString = JSON.stringify(modifiedTemplate);
    const updatedTemplateString = templateString.replace(/rodrigobm10@gmail\.com/g, userEmail);
    const finalTemplate = JSON.parse(updatedTemplateString);
    
    console.log('Modified template for user:', finalTemplate.name);
    
    // Make the API request to n8n
    const response = await fetch('https://n8n.innova1001.com.br/api/v1/workflows', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-N8N-API-KEY': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2YmM4MjQxOS0zZTk1LTRiYmMtODMwMy0xODAzZjk4YmQ4YjciLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwiaWF0IjoxNzUwMTA5ODU3fQ.cvqDVnD6ide9WCbtCx7bVDEvkPzJyO4EhGSDhY0xIjE'
      },
      body: JSON.stringify(finalTemplate)
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Error creating n8n workflow: ${response.status} - ${errorText}`);
      throw new Error(`Failed to create workflow: ${response.status}`);
    }
    
    const workflowData: N8nWorkflowResponse = await response.json();
    console.log('Workflow created successfully:', workflowData);
    
    // Extract workflow ID and webhook URL
    const workflowId = workflowData.id;
    const webhookUrl = workflowData.nodes[0]?.webhookUrls?.[0] || `https://n8n.innova1001.com.br/webhook/${username}`;
    
    // Save the workflow info to the user's profile
    await saveWorkflowInfoToUser(userEmail, workflowId, webhookUrl);
    
    return {
      workflowId,
      webhookUrl
    };
    
  } catch (error) {
    console.error('Error creating n8n workflow:', error);
    return null;
  }
}

/**
 * Saves workflow information to the user's profile
 * @param userEmail User's email
 * @param workflowId The n8n workflow ID
 * @param webhookUrl The webhook URL
 */
async function saveWorkflowInfoToUser(
  userEmail: string, 
  workflowId: string, 
  webhookUrl: string
): Promise<void> {
  try {
    // Update the user's profile with workflow information
    const { error } = await supabase
      .from('usuarios')
      .update({ 
        webhook: webhookUrl 
      })
      .eq('email', userEmail.trim().toLowerCase());
    
    if (error) {
      console.error('Error saving workflow info to user:', error);
      throw error;
    }
    
    console.log(`Workflow info saved for user ${userEmail}: ID=${workflowId}, URL=${webhookUrl}`);
  } catch (error) {
    console.error('Error updating user with workflow info:', error);
    throw error;
  }
}
