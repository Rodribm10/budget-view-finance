export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
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
      transacoes: {
        Row: {
          categoria: string | null
          created_at: string
          detalhes: string | null
          estabelecimento: string | null
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
          id?: number
          login?: string | null
          quando?: string | null
          tipo?: string | null
          user?: string | null
          valor?: number | null
        }
        Relationships: []
      }
      "transacoes_5f8e8181-e850-4551-88e4-bbbdc64a57ca": {
        Row: {
          categoria: string | null
          created_at: string
          detalhes: string | null
          estabelecimento: string | null
          id: number
          quando: string | null
          tipo: string | null
          usuario_id: string | null
          valor: number | null
        }
        Insert: {
          categoria?: string | null
          created_at?: string
          detalhes?: string | null
          estabelecimento?: string | null
          id?: number
          quando?: string | null
          tipo?: string | null
          usuario_id?: string | null
          valor?: number | null
        }
        Update: {
          categoria?: string | null
          created_at?: string
          detalhes?: string | null
          estabelecimento?: string | null
          id?: number
          quando?: string | null
          tipo?: string | null
          usuario_id?: string | null
          valor?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "transacoes_5f8e8181-e850-4551-88e4-bbbdc64a57ca_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      "transacoes_9f267008-9128-4a2f-b730-de0a0b5602a9": {
        Row: {
          categoria: string | null
          created_at: string
          detalhes: string | null
          estabelecimento: string | null
          id: number
          quando: string | null
          tipo: string | null
          usuario_id: string | null
          valor: number | null
        }
        Insert: {
          categoria?: string | null
          created_at?: string
          detalhes?: string | null
          estabelecimento?: string | null
          id?: number
          quando?: string | null
          tipo?: string | null
          usuario_id?: string | null
          valor?: number | null
        }
        Update: {
          categoria?: string | null
          created_at?: string
          detalhes?: string | null
          estabelecimento?: string | null
          id?: number
          quando?: string | null
          tipo?: string | null
          usuario_id?: string | null
          valor?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "transacoes_9f267008-9128-4a2f-b730-de0a0b5602a9_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      "transacoes_d2ca2174-fb8f-41d0-9897-a71a4af474a8": {
        Row: {
          categoria: string | null
          created_at: string
          detalhes: string | null
          estabelecimento: string | null
          id: number
          quando: string | null
          tipo: string | null
          usuario_id: string | null
          valor: number | null
        }
        Insert: {
          categoria?: string | null
          created_at?: string
          detalhes?: string | null
          estabelecimento?: string | null
          id?: number
          quando?: string | null
          tipo?: string | null
          usuario_id?: string | null
          valor?: number | null
        }
        Update: {
          categoria?: string | null
          created_at?: string
          detalhes?: string | null
          estabelecimento?: string | null
          id?: number
          quando?: string | null
          tipo?: string | null
          usuario_id?: string | null
          valor?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "transacoes_d2ca2174-fb8f-41d0-9897-a71a4af474a8_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      usuarios: {
        Row: {
          created_at: string
          email: string
          empresa: string | null
          id: string
          nome: string
          senha: string
        }
        Insert: {
          created_at?: string
          email: string
          empresa?: string | null
          id?: string
          nome: string
          senha: string
        }
        Update: {
          created_at?: string
          email?: string
          empresa?: string | null
          id?: string
          nome?: string
          senha?: string
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
        Args: { query_embedding: string; match_count?: number; filter?: Json }
        Returns: {
          id: number
          content: string
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
        Args: { nome: string; empresa: string; email: string; senha: string }
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
