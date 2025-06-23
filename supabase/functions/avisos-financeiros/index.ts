
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ContaRecorrente {
  id: string;
  user_id: string;
  nome_conta: string;
  descricao: string | null;
  valor: number | null;
  dia_vencimento: number;
  hora_aviso: string;
  dias_antecedencia: number;
  ativo: boolean;
  email_usuario: string | null;
  whatsapp_usuario: string | null;
}

interface AvisoData {
  conta_id: string;
  user_id: string;
  email_usuario: string | null;
  whatsapp_usuario: string | null;
  nome_conta: string;
  descricao: string | null;
  valor: number | null;
  dia_vencimento: number;
  dias_restantes: number;
  data_vencimento: string;
  webhook_url: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    const agora = new Date()
    const hoje = new Date(agora.getFullYear(), agora.getMonth(), agora.getDate())
    const horaAtual = agora.toTimeString().slice(0, 5) // HH:MM
    
    console.log(`Executando verificação de avisos às ${horaAtual}`)

    // Buscar todas as contas ativas incluindo email e whatsapp do usuário
    const { data: contas, error: contasError } = await supabase
      .from('contas_recorrentes')
      .select('*')
      .eq('ativo', true)

    if (contasError) {
      console.error('Erro ao buscar contas:', contasError)
      throw contasError
    }

    console.log(`Encontradas ${contas?.length || 0} contas ativas`)

    let avisosEnviados = 0

    for (const conta of contas || []) {
      // Calcular próxima data de vencimento
      const diaVencimento = conta.dia_vencimento
      let proximoVencimento = new Date(hoje.getFullYear(), hoje.getMonth(), diaVencimento)
      
      // Se o dia já passou neste mês, usar o próximo mês
      if (proximoVencimento <= hoje) {
        proximoVencimento = new Date(hoje.getFullYear(), hoje.getMonth() + 1, diaVencimento)
      }

      // Calcular dias restantes
      const diffTime = proximoVencimento.getTime() - hoje.getTime()
      const diasRestantes = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

      // Verificar se deve enviar aviso
      const deveEnviarAviso = (
        diasRestantes <= conta.dias_antecedencia && 
        diasRestantes >= 1 &&
        horaAtual === conta.hora_aviso
      )

      if (deveEnviarAviso) {
        console.log(`Enviando aviso para conta: ${conta.nome_conta}, dias restantes: ${diasRestantes}`)

        // Verificar se já foi enviado aviso hoje
        const dataAviso = hoje.toISOString().split('T')[0]
        const { data: avisoExistente } = await supabase
          .from('avisos_enviados')
          .select('id')
          .eq('conta_id', conta.id)
          .eq('data_aviso', dataAviso)
          .single()

        if (avisoExistente) {
          console.log(`Aviso já enviado hoje para conta: ${conta.nome_conta}`)
          continue
        }

        // Preparar dados para o webhook
        const avisoData: AvisoData = {
          conta_id: conta.id,
          user_id: conta.user_id,
          email_usuario: conta.email_usuario,
          whatsapp_usuario: conta.whatsapp_usuario,
          nome_conta: conta.nome_conta,
          descricao: conta.descricao,
          valor: conta.valor,
          dia_vencimento: conta.dia_vencimento,
          dias_restantes: diasRestantes,
          data_vencimento: proximoVencimento.toISOString().split('T')[0],
          webhook_url: 'https://webhookn8n.innova1001.com.br/webhook/avisosfinancehome'
        }

        try {
          // Enviar webhook
          const webhookResponse = await fetch('https://webhookn8n.innova1001.com.br/webhook/avisosfinancehome', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(avisoData),
          })

          const statusEnvio = webhookResponse.ok ? 'enviado' : 'erro'
          
          // Registrar envio
          await supabase
            .from('avisos_enviados')
            .insert({
              conta_id: conta.id,
              data_aviso: dataAviso,
              hora_aviso: horaAtual,
              dados_webhook: avisoData,
              status_envio: statusEnvio,
              tentativas: 1
            })

          if (webhookResponse.ok) {
            avisosEnviados++
            console.log(`✅ Aviso enviado com sucesso para: ${conta.nome_conta} (${conta.whatsapp_usuario})`)
          } else {
            console.error(`❌ Erro ao enviar webhook para: ${conta.nome_conta}`)
          }

        } catch (error) {
          console.error(`Erro ao processar conta ${conta.nome_conta}:`, error)
          
          // Registrar erro
          await supabase
            .from('avisos_enviados')
            .insert({
              conta_id: conta.id,
              data_aviso: dataAviso,
              hora_aviso: horaAtual,
              dados_webhook: avisoData,
              status_envio: 'erro',
              tentativas: 1
            })
        }
      }
    }

    console.log(`Processamento concluído. ${avisosEnviados} avisos enviados.`)

    return new Response(
      JSON.stringify({ 
        success: true, 
        avisosEnviados,
        timestamp: agora.toISOString()
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )

  } catch (error) {
    console.error('Erro na função de avisos:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})
