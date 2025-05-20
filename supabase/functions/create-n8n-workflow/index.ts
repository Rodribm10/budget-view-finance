
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'

interface RequestBody {
  email: string
  grupoId: number
  apiKey: string
  workflowData: {
    name: string
    nodes: any[]
    connections: any
    settings: any
  }
}

serve(async (req) => {
  try {
    // Handle CORS preflight request
    if (req.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      })
    }

    // Extract request body
    const { email, grupoId, apiKey, workflowData }: RequestBody = await req.json()
    
    if (!email || !grupoId || !apiKey) {
      return new Response(
        JSON.stringify({ error: 'Email, grupo ID e chave API são obrigatórios' }),
        { 
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          }
        }
      )
    }

    console.log(`Creating workflow for email: ${email}, group: ${grupoId}`)
    
    // Make request to n8n API
    const n8nResponse = await fetch('https://n8n.innova1001.com.br/api/v1/workflows', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-N8N-API-KEY': apiKey,
      },
      body: JSON.stringify(workflowData),
    })

    if (!n8nResponse.ok) {
      const errorText = await n8nResponse.text()
      console.error(`n8n API error: ${n8nResponse.status} - ${errorText}`)
      return new Response(
        JSON.stringify({ 
          error: 'Error calling n8n API', 
          status: n8nResponse.status,
          details: errorText
        }),
        { 
          status: n8nResponse.status, 
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          }
        }
      )
    }

    const workflowResponse = await n8nResponse.json()
    
    // Extract workflow ID from response
    const workflowId = workflowResponse.id
    
    if (!workflowId) {
      console.error('No workflow ID in n8n response', workflowResponse)
      return new Response(
        JSON.stringify({ error: 'No workflow ID in response', details: workflowResponse }),
        { 
          status: 500, 
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          }
        }
      )
    }
    
    console.log(`Workflow created with ID: ${workflowId}`)

    // Success response
    return new Response(
      JSON.stringify({ 
        success: true, 
        workflow_id: workflowId,
        message: 'Workflow created successfully',
        details: workflowResponse
      }),
      { 
        status: 200, 
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        }
      }
    )
  } catch (error) {
    console.error('Error in Edge Function:', error)
    
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { 
        status: 500, 
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        }
      }
    )
  }
})
