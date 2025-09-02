export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      "1001_amore_conselheira": {
        Row: {
          created_at: string
          criado_em: string | null
          email: string | null
          id: number
          liberado_ate: string | null
          nome: string | null
          telefone: string | null
          token: string | null
        }
        Insert: {
          created_at?: string
          criado_em?: string | null
          email?: string | null
          id?: number
          liberado_ate?: string | null
          nome?: string | null
          telefone?: string | null
          token?: string | null
        }
        Update: {
          created_at?: string
          criado_em?: string | null
          email?: string | null
          id?: number
          liberado_ate?: string | null
          nome?: string | null
          telefone?: string | null
          token?: string | null
        }
        Relationships: []
      }
      Agenda_consulta_Seven: {
        Row: {
          created_at: string
          dia_mes_ano: string | null
          event_id: number | null
          Horario_marcado: string | null
          id: number
          "nome procedimento": string | null
        }
        Insert: {
          created_at?: string
          dia_mes_ano?: string | null
          event_id?: number | null
          Horario_marcado?: string | null
          id?: number
          "nome procedimento"?: string | null
        }
        Update: {
          created_at?: string
          dia_mes_ano?: string | null
          event_id?: number | null
          Horario_marcado?: string | null
          id?: number
          "nome procedimento"?: string | null
        }
        Relationships: []
      }
      avisos_enviados: {
        Row: {
          conta_id: string
          created_at: string
          dados_webhook: Json | null
          data_aviso: string
          hora_aviso: string
          id: string
          status_envio: string
          tentativas: number
        }
        Insert: {
          conta_id: string
          created_at?: string
          dados_webhook?: Json | null
          data_aviso: string
          hora_aviso: string
          id?: string
          status_envio?: string
          tentativas?: number
        }
        Update: {
          conta_id?: string
          created_at?: string
          dados_webhook?: Json | null
          data_aviso?: string
          hora_aviso?: string
          id?: string
          status_envio?: string
          tentativas?: number
        }
        Relationships: [
          {
            foreignKeyName: "avisos_enviados_conta_id_fkey"
            columns: ["conta_id"]
            isOneToOne: false
            referencedRelation: "contas_recorrentes"
            referencedColumns: ["id"]
          },
        ]
      }
      Bloqueio_Rosana_Seven_zap: {
        Row: {
          acao: string | null
          created_at: string
          duracao_min: number | null
          id: number
          liberado_ate: string | null
          status: string | null
          Telefone: string | null
        }
        Insert: {
          acao?: string | null
          created_at?: string
          duracao_min?: number | null
          id?: number
          liberado_ate?: string | null
          status?: string | null
          Telefone?: string | null
        }
        Update: {
          acao?: string | null
          created_at?: string
          duracao_min?: number | null
          id?: number
          liberado_ate?: string | null
          status?: string | null
          Telefone?: string | null
        }
        Relationships: []
      }
      cartoes_credito: {
        Row: {
          banco: string | null
          bandeira: string | null
          created_at: string
          dia_vencimento: number | null
          id: string
          limite_total: number | null
          login: string | null
          melhor_dia_compra: number | null
          nome: string
          user_id: string
        }
        Insert: {
          banco?: string | null
          bandeira?: string | null
          created_at?: string
          dia_vencimento?: number | null
          id?: string
          limite_total?: number | null
          login?: string | null
          melhor_dia_compra?: number | null
          nome: string
          user_id: string
        }
        Update: {
          banco?: string | null
          bandeira?: string | null
          created_at?: string
          dia_vencimento?: number | null
          id?: string
          limite_total?: number | null
          login?: string | null
          melhor_dia_compra?: number | null
          nome?: string
          user_id?: string
        }
        Relationships: []
      }
      conselheiraamore: {
        Row: {
          content: string | null
          embedding: string | null
          id: number
          metadata: Json | null
        }
        Insert: {
          content?: string | null
          embedding?: string | null
          id?: number
          metadata?: Json | null
        }
        Update: {
          content?: string | null
          embedding?: string | null
          id?: number
          metadata?: Json | null
        }
        Relationships: []
      }
      contas_recorrentes: {
        Row: {
          ativo: boolean
          created_at: string
          data_pagamento: string | null
          descricao: string | null
          dia_vencimento: number
          dias_antecedencia: number
          email_usuario: string | null
          hora_aviso: string
          id: string
          nome_conta: string
          status: string | null
          updated_at: string
          user_id: string
          valor: number | null
          valor_pago: number | null
          whatsapp_usuario: string | null
        }
        Insert: {
          ativo?: boolean
          created_at?: string
          data_pagamento?: string | null
          descricao?: string | null
          dia_vencimento: number
          dias_antecedencia?: number
          email_usuario?: string | null
          hora_aviso?: string
          id?: string
          nome_conta: string
          status?: string | null
          updated_at?: string
          user_id: string
          valor?: number | null
          valor_pago?: number | null
          whatsapp_usuario?: string | null
        }
        Update: {
          ativo?: boolean
          created_at?: string
          data_pagamento?: string | null
          descricao?: string | null
          dia_vencimento?: number
          dias_antecedencia?: number
          email_usuario?: string | null
          hora_aviso?: string
          id?: string
          nome_conta?: string
          status?: string | null
          updated_at?: string
          user_id?: string
          valor?: number | null
          valor_pago?: number | null
          whatsapp_usuario?: string | null
        }
        Relationships: []
      }
      contatos: {
        Row: {
          anexo_url: string | null
          assunto: string
          created_at: string
          id: string
          mensagem: string
          motivo: string
          status: string
          user_id: string | null
        }
        Insert: {
          anexo_url?: string | null
          assunto: string
          created_at?: string
          id?: string
          mensagem: string
          motivo: string
          status?: string
          user_id?: string | null
        }
        Update: {
          anexo_url?: string | null
          assunto?: string
          created_at?: string
          id?: string
          mensagem?: string
          motivo?: string
          status?: string
          user_id?: string | null
        }
        Relationships: []
      }
      conversas_zap: {
        Row: {
          created_at: string
          date_time: string | null
          id: number
          id_transacao_gerada: number | null
          login: string | null
          msg_recebida: string | null
          remote_jid: string | null
          status_processamento: string | null
        }
        Insert: {
          created_at?: string
          date_time?: string | null
          id?: number
          id_transacao_gerada?: number | null
          login?: string | null
          msg_recebida?: string | null
          remote_jid?: string | null
          status_processamento?: string | null
        }
        Update: {
          created_at?: string
          date_time?: string | null
          id?: number
          id_transacao_gerada?: number | null
          login?: string | null
          msg_recebida?: string | null
          remote_jid?: string | null
          status_processamento?: string | null
        }
        Relationships: []
      }
      despesas_cartao: {
        Row: {
          ano_fatura: number | null
          cartao_id: string | null
          created_at: string
          data_despesa: string
          descricao: string
          despesa_pai_id: string | null
          id: string
          login: string | null
          mes_fatura: number | null
          nome: string | null
          observacoes: string | null
          parcela_atual: number | null
          status_conciliacao: string | null
          total_parcelas: number | null
          valor: number
          valor_original: number | null
        }
        Insert: {
          ano_fatura?: number | null
          cartao_id?: string | null
          created_at?: string
          data_despesa: string
          descricao: string
          despesa_pai_id?: string | null
          id?: string
          login?: string | null
          mes_fatura?: number | null
          nome?: string | null
          observacoes?: string | null
          parcela_atual?: number | null
          status_conciliacao?: string | null
          total_parcelas?: number | null
          valor: number
          valor_original?: number | null
        }
        Update: {
          ano_fatura?: number | null
          cartao_id?: string | null
          created_at?: string
          data_despesa?: string
          descricao?: string
          despesa_pai_id?: string | null
          id?: string
          login?: string | null
          mes_fatura?: number | null
          nome?: string | null
          observacoes?: string | null
          parcela_atual?: number | null
          status_conciliacao?: string | null
          total_parcelas?: number | null
          valor?: number
          valor_original?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "despesas_cartao_cartao_id_fkey"
            columns: ["cartao_id"]
            isOneToOne: false
            referencedRelation: "cartoes_credito"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "despesas_cartao_despesa_pai_id_fkey"
            columns: ["despesa_pai_id"]
            isOneToOne: false
            referencedRelation: "despesas_cartao"
            referencedColumns: ["id"]
          },
        ]
      }
      faq_feedback: {
        Row: {
          created_at: string
          faq_id: string
          helpful: boolean
          id: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          faq_id: string
          helpful: boolean
          id?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          faq_id?: string
          helpful?: boolean
          id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "faq_feedback_faq_id_fkey"
            columns: ["faq_id"]
            isOneToOne: false
            referencedRelation: "faqs"
            referencedColumns: ["id"]
          },
        ]
      }
      faqs: {
        Row: {
          ativo: boolean
          created_at: string
          id: string
          imagem_url: string | null
          pergunta: string
          resposta: string
        }
        Insert: {
          ativo?: boolean
          created_at?: string
          id?: string
          imagem_url?: string | null
          pergunta: string
          resposta: string
        }
        Update: {
          ativo?: boolean
          created_at?: string
          id?: string
          imagem_url?: string | null
          pergunta?: string
          resposta?: string
        }
        Relationships: []
      }
      faturas_cartao: {
        Row: {
          ano: number
          cartao_id: string | null
          created_at: string | null
          data_pagamento: string | null
          data_vencimento: string | null
          id: string
          login: string | null
          mes: number
          status_pagamento: string | null
          valor_total: number | null
        }
        Insert: {
          ano: number
          cartao_id?: string | null
          created_at?: string | null
          data_pagamento?: string | null
          data_vencimento?: string | null
          id?: string
          login?: string | null
          mes: number
          status_pagamento?: string | null
          valor_total?: number | null
        }
        Update: {
          ano?: number
          cartao_id?: string | null
          created_at?: string | null
          data_pagamento?: string | null
          data_vencimento?: string | null
          id?: string
          login?: string | null
          mes?: number
          status_pagamento?: string | null
          valor_total?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "faturas_cartao_cartao_id_fkey"
            columns: ["cartao_id"]
            isOneToOne: false
            referencedRelation: "cartoes_credito"
            referencedColumns: ["id"]
          },
        ]
      }
      grupos_whatsapp: {
        Row: {
          created_at: string | null
          id: number
          login: string | null
          nome_grupo: string | null
          remote_jid: string
          status: string | null
          user_id: string
          workflow_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          login?: string | null
          nome_grupo?: string | null
          remote_jid: string
          status?: string | null
          user_id: string
          workflow_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          login?: string | null
          nome_grupo?: string | null
          remote_jid?: string
          status?: string | null
          user_id?: string
          workflow_id?: string | null
        }
        Relationships: []
      }
      metas: {
        Row: {
          ano: number
          created_at: string | null
          id: string
          mes: number
          user_id: string
          valor_meta: number
        }
        Insert: {
          ano: number
          created_at?: string | null
          id?: string
          mes: number
          user_id: string
          valor_meta: number
        }
        Update: {
          ano?: number
          created_at?: string | null
          id?: string
          mes?: number
          user_id?: string
          valor_meta?: number
        }
        Relationships: []
      }
      n8n_chat_dolceamore: {
        Row: {
          id: number
          message: Json
          session_id: string
        }
        Insert: {
          id?: number
          message: Json
          session_id: string
        }
        Update: {
          id?: number
          message?: Json
          session_id?: string
        }
        Relationships: []
      }
      n8n_chat_dolceamoree: {
        Row: {
          id: number
          message: Json
          session_id: string
        }
        Insert: {
          id?: number
          message: Json
          session_id: string
        }
        Update: {
          id?: number
          message?: Json
          session_id?: string
        }
        Relationships: []
      }
      n8n_chat_histories: {
        Row: {
          id: number
          message: Json
          session_id: string
        }
        Insert: {
          id?: number
          message: Json
          session_id: string
        }
        Update: {
          id?: number
          message?: Json
          session_id?: string
        }
        Relationships: []
      }
      n8n_chat_histories_primeade: {
        Row: {
          id: number
          message: Json
          session_id: string
        }
        Insert: {
          id?: number
          message: Json
          session_id: string
        }
        Update: {
          id?: number
          message?: Json
          session_id?: string
        }
        Relationships: []
      }
      n8n_chat_primevl: {
        Row: {
          id: number
          message: Json
          session_id: string
        }
        Insert: {
          id?: number
          message: Json
          session_id: string
        }
        Update: {
          id?: number
          message?: Json
          session_id?: string
        }
        Relationships: []
      }
      n8n_chat_qnn01: {
        Row: {
          id: number
          message: Json
          session_id: string
        }
        Insert: {
          id?: number
          message: Json
          session_id: string
        }
        Update: {
          id?: number
          message?: Json
          session_id?: string
        }
        Relationships: []
      }
      n8n_chat_recanto: {
        Row: {
          id: number
          message: Json
          session_id: string
        }
        Insert: {
          id?: number
          message: Json
          session_id: string
        }
        Update: {
          id?: number
          message?: Json
          session_id?: string
        }
        Relationships: []
      }
      n8n_chat_samambaia: {
        Row: {
          id: number
          message: Json
          session_id: string
        }
        Insert: {
          id?: number
          message: Json
          session_id: string
        }
        Update: {
          id?: number
          message?: Json
          session_id?: string
        }
        Relationships: []
      }
      n8n_fila_mensagens: {
        Row: {
          id: number
          id_mensagem: string
          mensagem: string
          telefone: string
          timestamp: string
        }
        Insert: {
          id?: number
          id_mensagem: string
          mensagem: string
          telefone: string
          timestamp: string
        }
        Update: {
          id?: number
          id_mensagem?: string
          mensagem?: string
          telefone?: string
          timestamp?: string
        }
        Relationships: []
      }
      n8n_historico_mensagens: {
        Row: {
          created_at: string
          id: number
          message: Json
          session_id: string
        }
        Insert: {
          created_at?: string
          id?: number
          message: Json
          session_id: string
        }
        Update: {
          created_at?: string
          id?: number
          message?: Json
          session_id?: string
        }
        Relationships: []
      }
      pagamentos_mercadopago: {
        Row: {
          created_at: string
          event_id: string | null
          event_type: string
          id: string
          payer_email: string | null
          raw_body: Json
          status: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          event_id?: string | null
          event_type: string
          id?: string
          payer_email?: string | null
          raw_body: Json
          status?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          event_id?: string | null
          event_type?: string
          id?: string
          payer_email?: string | null
          raw_body?: Json
          status?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      perfis_usuario: {
        Row: {
          aniversario: string | null
          atualizado_em: string | null
          cep: string | null
          cidade: string | null
          cpf: string | null
          estado: string | null
          id: string
          nacionalidade: string | null
          nome_preferido: string | null
          objetivo_financeiro: string | null
          participa_pesquisas: boolean | null
          sexo: string | null
        }
        Insert: {
          aniversario?: string | null
          atualizado_em?: string | null
          cep?: string | null
          cidade?: string | null
          cpf?: string | null
          estado?: string | null
          id: string
          nacionalidade?: string | null
          nome_preferido?: string | null
          objetivo_financeiro?: string | null
          participa_pesquisas?: boolean | null
          sexo?: string | null
        }
        Update: {
          aniversario?: string | null
          atualizado_em?: string | null
          cep?: string | null
          cidade?: string | null
          cpf?: string | null
          estado?: string | null
          id?: string
          nacionalidade?: string | null
          nome_preferido?: string | null
          objetivo_financeiro?: string | null
          participa_pesquisas?: boolean | null
          sexo?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "perfis_usuario_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          document_number: string | null
          full_name: string | null
          id: string
        }
        Insert: {
          document_number?: string | null
          full_name?: string | null
          id: string
        }
        Update: {
          document_number?: string | null
          full_name?: string | null
          id?: string
        }
        Relationships: []
      }
      status_pagamento_mensal: {
        Row: {
          ano: number
          conta_id: string | null
          created_at: string | null
          data_pagamento: string | null
          id: string
          login: string | null
          mes: number
          status: string | null
          valor_pago: number | null
        }
        Insert: {
          ano: number
          conta_id?: string | null
          created_at?: string | null
          data_pagamento?: string | null
          id?: string
          login?: string | null
          mes: number
          status?: string | null
          valor_pago?: number | null
        }
        Update: {
          ano?: number
          conta_id?: string | null
          created_at?: string | null
          data_pagamento?: string | null
          id?: string
          login?: string | null
          mes?: number
          status?: string | null
          valor_pago?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "status_pagamento_mensal_conta_id_fkey"
            columns: ["conta_id"]
            isOneToOne: false
            referencedRelation: "contas_recorrentes"
            referencedColumns: ["id"]
          },
        ]
      }
      transacoes: {
        Row: {
          categoria: string | null
          created_at: string
          detalhes: string | null
          estabelecimento: string | null
          grupo_id: string | null
          id: number
          login: string | null
          quando: string | null
          tipo: string | null
          user: string | null
          valor: number | null
        }
        Insert: {
          categoria?: string | null
          created_at?: string
          detalhes?: string | null
          estabelecimento?: string | null
          grupo_id?: string | null
          id?: number
          login?: string | null
          quando?: string | null
          tipo?: string | null
          user?: string | null
          valor?: number | null
        }
        Update: {
          categoria?: string | null
          created_at?: string
          detalhes?: string | null
          estabelecimento?: string | null
          grupo_id?: string | null
          id?: number
          login?: string | null
          quando?: string | null
          tipo?: string | null
          user?: string | null
          valor?: number | null
        }
        Relationships: []
      }
      usuarios: {
        Row: {
          created_at: string
          email: string
          empresa: string | null
          id: string
          instancia_zap: string | null
          liberado_permanente: boolean | null
          nome: string | null
          remote_jid: string | null
          status_instancia: string | null
          webhook: string | null
          whatsapp: string
          workflow_id: string | null
        }
        Insert: {
          created_at?: string
          email: string
          empresa?: string | null
          id?: string
          instancia_zap?: string | null
          liberado_permanente?: boolean | null
          nome?: string | null
          remote_jid?: string | null
          status_instancia?: string | null
          webhook?: string | null
          whatsapp: string
          workflow_id?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          empresa?: string | null
          id?: string
          instancia_zap?: string | null
          liberado_permanente?: boolean | null
          nome?: string | null
          remote_jid?: string | null
          status_instancia?: string | null
          webhook?: string | null
          whatsapp?: string
          workflow_id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      autenticar_usuario: {
        Args: { email_login: string; senha_login: string }
        Returns: string
      }
      binary_quantize: {
        Args: { "": string } | { "": unknown }
        Returns: unknown
      }
      conselheiraamore: {
        Args: { filter?: Json; match_count?: number; query_embedding: string }
        Returns: {
          content: string
          id: number
          metadata: Json
          similarity: number
        }[]
      }
      halfvec_avg: {
        Args: { "": number[] }
        Returns: unknown
      }
      halfvec_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      halfvec_send: {
        Args: { "": unknown }
        Returns: string
      }
      halfvec_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
      hnsw_bit_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnsw_halfvec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnsw_sparsevec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnswhandler: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflat_bit_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflat_halfvec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflathandler: {
        Args: { "": unknown }
        Returns: unknown
      }
      l2_norm: {
        Args: { "": unknown } | { "": unknown }
        Returns: number
      }
      l2_normalize: {
        Args: { "": string } | { "": unknown } | { "": unknown }
        Returns: string
      }
      registrar_usuario: {
        Args:
          | { email: string; empresa: string; nome: string; senha: string }
          | {
              email: string
              empresa: string
              nome: string
              senha: string
              whatsapp: string
            }
        Returns: string
      }
      sparsevec_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      sparsevec_send: {
        Args: { "": unknown }
        Returns: string
      }
      sparsevec_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
      vector_avg: {
        Args: { "": number[] }
        Returns: string
      }
      vector_dims: {
        Args: { "": string } | { "": unknown }
        Returns: number
      }
      vector_norm: {
        Args: { "": string }
        Returns: number
      }
      vector_out: {
        Args: { "": string }
        Returns: unknown
      }
      vector_send: {
        Args: { "": string }
        Returns: string
      }
      vector_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
