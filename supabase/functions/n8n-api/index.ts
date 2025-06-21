
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const N8N_API_KEY = Deno.env.get('N8N_API_KEY')
const N8N_BASE_URL = 'https://n8n.innova1001.com.br/api/v1'

interface N8nRequest {
  endpoint: string
  method: 'GET' | 'POST' | 'PUT' | 'DELETE'
  body?: any
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    if (!N8N_API_KEY) {
      throw new Error('N8N_API_KEY not configured')
    }

    const { endpoint, method, body }: N8nRequest = await req.json()
    
    const url = `${N8N_BASE_URL}${endpoint}`
    console.log(`Making ${method} request to n8n: ${url}`)
    
    const options: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
        'X-N8N-API-KEY': N8N_API_KEY
      },
      body: body ? JSON.stringify(body) : undefined
    }

    const response = await fetch(url, options)
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error(`n8n API error: ${response.status} - ${errorText}`)
      throw new Error(`n8n API request failed: ${response.status} - ${errorText}`)
    }

    const data = await response.json()
    
    return new Response(JSON.stringify(data), {
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    })
  } catch (error) {
    console.error('Error in n8n-api function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    )
  }
})
