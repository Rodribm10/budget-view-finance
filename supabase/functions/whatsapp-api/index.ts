
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const EVOLUTION_API_KEY = Deno.env.get('EVOLUTION_API_KEY')
const EVOLUTION_SERVER_URL = 'evolutionapi2.innova1001.com.br'

interface WhatsAppRequest {
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
    if (!EVOLUTION_API_KEY) {
      throw new Error('EVOLUTION_API_KEY not configured')
    }

    const { endpoint, method, body }: WhatsAppRequest = await req.json()
    
    const url = `https://${EVOLUTION_SERVER_URL}${endpoint}`
    console.log(`Making ${method} request to: ${url}`)
    
    const options: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
        'apikey': EVOLUTION_API_KEY
      },
      body: body ? JSON.stringify(body) : undefined
    }

    const response = await fetch(url, options)
    
    if (!response.ok) {
      const errorData = await response.json()
      console.error(`API error (${response.status}):`, errorData)
      throw new Error(errorData.message || `API request failed with status ${response.status}`)
    }

    const data = await response.json()
    
    return new Response(JSON.stringify(data), {
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    })
  } catch (error) {
    console.error('Error in whatsapp-api function:', error)
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
