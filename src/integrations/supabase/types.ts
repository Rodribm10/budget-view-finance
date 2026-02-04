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
      accounts_payable: {
        Row: {
          ai_suggested_chart_of_account_id: number | null
          ai_suggestion_accepted: boolean | null
          ai_suggestion_confidence: number | null
          amount: number
          approved_by_name: string | null
          approved_by_user_id: string | null
          bank_account_id: string | null
          bank_category: string | null
          bank_integration_id: string | null
          bank_transaction_id: string | null
          chart_of_account_id: number | null
          created_at: string | null
          description: string | null
          document_number: string | null
          document_type: string | null
          due_date: string
          id: string
          imported_from_bank: boolean | null
          installments: number | null
          is_internal_transfer: boolean | null
          issue_date: string | null
          organization_id: string
          origin_module: string | null
          paid_amount: number | null
          partner_id: string | null
          payment_date: string | null
          payment_method_id: string | null
          person_id: string | null
          reconciled: boolean | null
          reconciliation_notes: string | null
          recurrence: boolean | null
          recurrence_interval: string | null
          related_closing_id: string | null
          status: string
          suggested_chart_of_account_id: number | null
          tags: string[] | null
          transaction_code: number
          transaction_type: Database["public"]["Enums"]["transaction_type_enum"]
          transfer_group_id: string | null
          unit_id: string | null
        }
        Insert: {
          ai_suggested_chart_of_account_id?: number | null
          ai_suggestion_accepted?: boolean | null
          ai_suggestion_confidence?: number | null
          amount: number
          approved_by_name?: string | null
          approved_by_user_id?: string | null
          bank_account_id?: string | null
          bank_category?: string | null
          bank_integration_id?: string | null
          bank_transaction_id?: string | null
          chart_of_account_id?: number | null
          created_at?: string | null
          description?: string | null
          document_number?: string | null
          document_type?: string | null
          due_date: string
          id?: string
          imported_from_bank?: boolean | null
          installments?: number | null
          is_internal_transfer?: boolean | null
          issue_date?: string | null
          organization_id: string
          origin_module?: string | null
          paid_amount?: number | null
          partner_id?: string | null
          payment_date?: string | null
          payment_method_id?: string | null
          person_id?: string | null
          reconciled?: boolean | null
          reconciliation_notes?: string | null
          recurrence?: boolean | null
          recurrence_interval?: string | null
          related_closing_id?: string | null
          status: string
          suggested_chart_of_account_id?: number | null
          tags?: string[] | null
          transaction_code?: number
          transaction_type?: Database["public"]["Enums"]["transaction_type_enum"]
          transfer_group_id?: string | null
          unit_id?: string | null
        }
        Update: {
          ai_suggested_chart_of_account_id?: number | null
          ai_suggestion_accepted?: boolean | null
          ai_suggestion_confidence?: number | null
          amount?: number
          approved_by_name?: string | null
          approved_by_user_id?: string | null
          bank_account_id?: string | null
          bank_category?: string | null
          bank_integration_id?: string | null
          bank_transaction_id?: string | null
          chart_of_account_id?: number | null
          created_at?: string | null
          description?: string | null
          document_number?: string | null
          document_type?: string | null
          due_date?: string
          id?: string
          imported_from_bank?: boolean | null
          installments?: number | null
          is_internal_transfer?: boolean | null
          issue_date?: string | null
          organization_id?: string
          origin_module?: string | null
          paid_amount?: number | null
          partner_id?: string | null
          payment_date?: string | null
          payment_method_id?: string | null
          person_id?: string | null
          reconciled?: boolean | null
          reconciliation_notes?: string | null
          recurrence?: boolean | null
          recurrence_interval?: string | null
          related_closing_id?: string | null
          status?: string
          suggested_chart_of_account_id?: number | null
          tags?: string[] | null
          transaction_code?: number
          transaction_type?: Database["public"]["Enums"]["transaction_type_enum"]
          transfer_group_id?: string | null
          unit_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "accounts_payable_ai_suggested_chart_of_account_id_fkey"
            columns: ["ai_suggested_chart_of_account_id"]
            isOneToOne: false
            referencedRelation: "chart_of_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "accounts_payable_bank_account_id_fkey"
            columns: ["bank_account_id"]
            isOneToOne: false
            referencedRelation: "bank_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "accounts_payable_bank_integration_id_fkey"
            columns: ["bank_integration_id"]
            isOneToOne: false
            referencedRelation: "bank_integrations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "accounts_payable_chart_of_account_id_fkey"
            columns: ["chart_of_account_id"]
            isOneToOne: false
            referencedRelation: "chart_of_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "accounts_payable_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "accounts_payable_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "unit_partners"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "accounts_payable_payment_method_id_fkey"
            columns: ["payment_method_id"]
            isOneToOne: false
            referencedRelation: "payment_methods"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "accounts_payable_person_id_fkey"
            columns: ["person_id"]
            isOneToOne: false
            referencedRelation: "people"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "accounts_payable_related_closing_id_fkey"
            columns: ["related_closing_id"]
            isOneToOne: false
            referencedRelation: "financial_closings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "accounts_payable_suggested_chart_of_account_id_fkey"
            columns: ["suggested_chart_of_account_id"]
            isOneToOne: false
            referencedRelation: "chart_of_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "accounts_payable_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "units"
            referencedColumns: ["id"]
          },
        ]
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
      ai_chart_rules: {
        Row: {
          chart_of_account_id: number
          created_at: string | null
          examples: string | null
          id: string
          keywords: string
          organization_id: string
          priority: number | null
          updated_at: string | null
        }
        Insert: {
          chart_of_account_id: number
          created_at?: string | null
          examples?: string | null
          id?: string
          keywords: string
          organization_id: string
          priority?: number | null
          updated_at?: string | null
        }
        Update: {
          chart_of_account_id?: number
          created_at?: string | null
          examples?: string | null
          id?: string
          keywords?: string
          organization_id?: string
          priority?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_chart_rules_chart_of_account_id_fkey"
            columns: ["chart_of_account_id"]
            isOneToOne: false
            referencedRelation: "chart_of_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ai_chart_rules_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_config: {
        Row: {
          assistant_name: string
          created_at: string | null
          custom_instructions: string | null
          enabled: boolean
          id: string
          model_name: string
          organization_id: string
          provider: string
          updated_at: string | null
        }
        Insert: {
          assistant_name?: string
          created_at?: string | null
          custom_instructions?: string | null
          enabled?: boolean
          id?: string
          model_name?: string
          organization_id: string
          provider?: string
          updated_at?: string | null
        }
        Update: {
          assistant_name?: string
          created_at?: string | null
          custom_instructions?: string | null
          enabled?: boolean
          id?: string
          model_name?: string
          organization_id?: string
          provider?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_config_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: true
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      approval_audit_logs: {
        Row: {
          action: string
          actor_ip: string | null
          actor_name: string | null
          actor_user_agent: string | null
          actor_user_id: string | null
          batch_id: string
          created_at: string | null
          id: string
          note: string | null
          payable_id: string | null
        }
        Insert: {
          action: string
          actor_ip?: string | null
          actor_name?: string | null
          actor_user_agent?: string | null
          actor_user_id?: string | null
          batch_id: string
          created_at?: string | null
          id?: string
          note?: string | null
          payable_id?: string | null
        }
        Update: {
          action?: string
          actor_ip?: string | null
          actor_name?: string | null
          actor_user_agent?: string | null
          actor_user_id?: string | null
          batch_id?: string
          created_at?: string | null
          id?: string
          note?: string | null
          payable_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "approval_audit_logs_batch_id_fkey"
            columns: ["batch_id"]
            isOneToOne: false
            referencedRelation: "approval_batches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "approval_audit_logs_payable_id_fkey"
            columns: ["payable_id"]
            isOneToOne: false
            referencedRelation: "accounts_payable"
            referencedColumns: ["id"]
          },
        ]
      }
      approval_batches: {
        Row: {
          access_code: string | null
          approval_token_hash: string
          assigned_approver_id: string | null
          assigned_reviewer_id: string | null
          batch_type: string
          created_at: string | null
          created_by: string
          created_by_email: string | null
          decided_at: string | null
          decided_by: string | null
          expires_at: string
          id: string
          items_count: number
          organization_id: string
          status: string
          total_amount: number
          webhook_duration_ms: number | null
          webhook_error: string | null
          webhook_payload: Json | null
          webhook_response_text: string | null
          webhook_return_duration_ms: number | null
          webhook_return_response_text: string | null
          webhook_return_sent_at: string | null
          webhook_return_status: string | null
          webhook_sent_at: string | null
          webhook_status: string | null
        }
        Insert: {
          access_code?: string | null
          approval_token_hash: string
          assigned_approver_id?: string | null
          assigned_reviewer_id?: string | null
          batch_type?: string
          created_at?: string | null
          created_by: string
          created_by_email?: string | null
          decided_at?: string | null
          decided_by?: string | null
          expires_at: string
          id?: string
          items_count?: number
          organization_id: string
          status: string
          total_amount?: number
          webhook_duration_ms?: number | null
          webhook_error?: string | null
          webhook_payload?: Json | null
          webhook_response_text?: string | null
          webhook_return_duration_ms?: number | null
          webhook_return_response_text?: string | null
          webhook_return_sent_at?: string | null
          webhook_return_status?: string | null
          webhook_sent_at?: string | null
          webhook_status?: string | null
        }
        Update: {
          access_code?: string | null
          approval_token_hash?: string
          assigned_approver_id?: string | null
          assigned_reviewer_id?: string | null
          batch_type?: string
          created_at?: string | null
          created_by?: string
          created_by_email?: string | null
          decided_at?: string | null
          decided_by?: string | null
          expires_at?: string
          id?: string
          items_count?: number
          organization_id?: string
          status?: string
          total_amount?: number
          webhook_duration_ms?: number | null
          webhook_error?: string | null
          webhook_payload?: Json | null
          webhook_response_text?: string | null
          webhook_return_duration_ms?: number | null
          webhook_return_response_text?: string | null
          webhook_return_sent_at?: string | null
          webhook_return_status?: string | null
          webhook_sent_at?: string | null
          webhook_status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "approval_batches_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      approval_items: {
        Row: {
          batch_id: string
          created_at: string | null
          current_status: string
          decided_at: string | null
          decided_by: string | null
          id: string
          note: string | null
          payable_id: string
          rejection_reason: string | null
        }
        Insert: {
          batch_id: string
          created_at?: string | null
          current_status: string
          decided_at?: string | null
          decided_by?: string | null
          id?: string
          note?: string | null
          payable_id: string
          rejection_reason?: string | null
        }
        Update: {
          batch_id?: string
          created_at?: string | null
          current_status?: string
          decided_at?: string | null
          decided_by?: string | null
          id?: string
          note?: string | null
          payable_id?: string
          rejection_reason?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "approval_items_batch_id_fkey"
            columns: ["batch_id"]
            isOneToOne: false
            referencedRelation: "approval_batches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "approval_items_payable_id_fkey"
            columns: ["payable_id"]
            isOneToOne: false
            referencedRelation: "accounts_payable"
            referencedColumns: ["id"]
          },
        ]
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
      bank_accounts: {
        Row: {
          account_number: string | null
          account_type: string | null
          agency: string | null
          balance: number | null
          bank_name: string
          created_at: string | null
          id: string
          is_active: boolean | null
          organization_id: string
          unit_id: string | null
          updated_at: string | null
        }
        Insert: {
          account_number?: string | null
          account_type?: string | null
          agency?: string | null
          balance?: number | null
          bank_name: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          organization_id: string
          unit_id?: string | null
          updated_at?: string | null
        }
        Update: {
          account_number?: string | null
          account_type?: string | null
          agency?: string | null
          balance?: number | null
          bank_name?: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          organization_id?: string
          unit_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bank_accounts_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bank_accounts_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "units"
            referencedColumns: ["id"]
          },
        ]
      }
      bank_integrations: {
        Row: {
          bank_name: string
          bank_type: Database["public"]["Enums"]["bank_type"]
          certificate_storage_path: string | null
          created_at: string | null
          encrypted_credentials: Json
          id: string
          is_active: boolean | null
          last_sync_at: string | null
          last_sync_message: string | null
          last_sync_status: string | null
          organization_id: string
          unit_id: string | null
          updated_at: string | null
        }
        Insert: {
          bank_name: string
          bank_type: Database["public"]["Enums"]["bank_type"]
          certificate_storage_path?: string | null
          created_at?: string | null
          encrypted_credentials?: Json
          id?: string
          is_active?: boolean | null
          last_sync_at?: string | null
          last_sync_message?: string | null
          last_sync_status?: string | null
          organization_id: string
          unit_id?: string | null
          updated_at?: string | null
        }
        Update: {
          bank_name?: string
          bank_type?: Database["public"]["Enums"]["bank_type"]
          certificate_storage_path?: string | null
          created_at?: string | null
          encrypted_credentials?: Json
          id?: string
          is_active?: boolean | null
          last_sync_at?: string | null
          last_sync_message?: string | null
          last_sync_status?: string | null
          organization_id?: string
          unit_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bank_integrations_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bank_integrations_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "units"
            referencedColumns: ["id"]
          },
        ]
      }
      bank_sync_logs: {
        Row: {
          bank_integration_id: string
          completed_at: string | null
          created_at: string | null
          duration_seconds: number | null
          error_details: Json | null
          error_message: string | null
          id: string
          organization_id: string
          started_at: string | null
          status: Database["public"]["Enums"]["sync_status"]
          sync_end_date: string | null
          sync_start_date: string | null
          sync_type: string
          transactions_errors: number | null
          transactions_found: number | null
          transactions_imported: number | null
          transactions_skipped: number | null
        }
        Insert: {
          bank_integration_id: string
          completed_at?: string | null
          created_at?: string | null
          duration_seconds?: number | null
          error_details?: Json | null
          error_message?: string | null
          id?: string
          organization_id: string
          started_at?: string | null
          status?: Database["public"]["Enums"]["sync_status"]
          sync_end_date?: string | null
          sync_start_date?: string | null
          sync_type: string
          transactions_errors?: number | null
          transactions_found?: number | null
          transactions_imported?: number | null
          transactions_skipped?: number | null
        }
        Update: {
          bank_integration_id?: string
          completed_at?: string | null
          created_at?: string | null
          duration_seconds?: number | null
          error_details?: Json | null
          error_message?: string | null
          id?: string
          organization_id?: string
          started_at?: string | null
          status?: Database["public"]["Enums"]["sync_status"]
          sync_end_date?: string | null
          sync_start_date?: string | null
          sync_type?: string
          transactions_errors?: number | null
          transactions_found?: number | null
          transactions_imported?: number | null
          transactions_skipped?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "bank_sync_logs_bank_integration_id_fkey"
            columns: ["bank_integration_id"]
            isOneToOne: false
            referencedRelation: "bank_integrations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bank_sync_logs_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
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
      budgets: {
        Row: {
          april: number | null
          august: number | null
          category_id: number
          created_at: string | null
          december: number | null
          february: number | null
          id: string
          january: number | null
          july: number | null
          june: number | null
          march: number | null
          may: number | null
          november: number | null
          october: number | null
          organization_id: string
          september: number | null
          unit_id: string | null
          year: number
        }
        Insert: {
          april?: number | null
          august?: number | null
          category_id: number
          created_at?: string | null
          december?: number | null
          february?: number | null
          id?: string
          january?: number | null
          july?: number | null
          june?: number | null
          march?: number | null
          may?: number | null
          november?: number | null
          october?: number | null
          organization_id: string
          september?: number | null
          unit_id?: string | null
          year: number
        }
        Update: {
          april?: number | null
          august?: number | null
          category_id?: number
          created_at?: string | null
          december?: number | null
          february?: number | null
          id?: string
          january?: number | null
          july?: number | null
          june?: number | null
          march?: number | null
          may?: number | null
          november?: number | null
          october?: number | null
          organization_id?: string
          september?: number | null
          unit_id?: string | null
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "budgets_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "chart_of_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "budgets_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
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
      category_management_limits: {
        Row: {
          category_id: number | null
          created_at: string
          direction: string | null
          enabled: boolean | null
          id: string
          limit_green: number | null
          limit_red: number | null
          limit_yellow: number | null
          metric: string | null
          organization_id: string
          unit_id: string | null
          updated_at: string
        }
        Insert: {
          category_id?: number | null
          created_at?: string
          direction?: string | null
          enabled?: boolean | null
          id?: string
          limit_green?: number | null
          limit_red?: number | null
          limit_yellow?: number | null
          metric?: string | null
          organization_id: string
          unit_id?: string | null
          updated_at?: string
        }
        Update: {
          category_id?: number | null
          created_at?: string
          direction?: string | null
          enabled?: boolean | null
          id?: string
          limit_green?: number | null
          limit_red?: number | null
          limit_yellow?: number | null
          metric?: string | null
          organization_id?: string
          unit_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "category_management_limits_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "chart_of_account_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "category_management_limits_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "units"
            referencedColumns: ["id"]
          },
        ]
      }
      chart_of_account_categories: {
        Row: {
          allowed_unit_ids: string[] | null
          code: number
          created_at: string | null
          description: string
          dre_section: string | null
          id: number
          indicator: Database["public"]["Enums"]["indicator_enum"]
          organization_id: string
          section_id: string | null
        }
        Insert: {
          allowed_unit_ids?: string[] | null
          code: number
          created_at?: string | null
          description: string
          dre_section?: string | null
          id?: number
          indicator: Database["public"]["Enums"]["indicator_enum"]
          organization_id: string
          section_id?: string | null
        }
        Update: {
          allowed_unit_ids?: string[] | null
          code?: number
          created_at?: string | null
          description?: string
          dre_section?: string | null
          id?: number
          indicator?: Database["public"]["Enums"]["indicator_enum"]
          organization_id?: string
          section_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "chart_of_account_categories_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chart_of_account_categories_section_id_fkey"
            columns: ["section_id"]
            isOneToOne: false
            referencedRelation: "faixas_dre"
            referencedColumns: ["id"]
          },
        ]
      }
      chart_of_accounts: {
        Row: {
          allowed_unit_ids: string[] | null
          category_id: number
          created_at: string | null
          description: string
          id: number
          is_internal_transfer: boolean | null
          is_obligatory: boolean | null
          organization_id: string
          structured_code: string
          transfer_direction: string | null
        }
        Insert: {
          allowed_unit_ids?: string[] | null
          category_id: number
          created_at?: string | null
          description: string
          id?: number
          is_internal_transfer?: boolean | null
          is_obligatory?: boolean | null
          organization_id: string
          structured_code: string
          transfer_direction?: string | null
        }
        Update: {
          allowed_unit_ids?: string[] | null
          category_id?: number
          created_at?: string | null
          description?: string
          id?: number
          is_internal_transfer?: boolean | null
          is_obligatory?: boolean | null
          organization_id?: string
          structured_code?: string
          transfer_direction?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "chart_of_accounts_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "chart_of_account_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chart_of_accounts_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_messages_dolceamore: {
        Row: {
          active: boolean | null
          bot_message: string | null
          created_at: string | null
          id: number
          message_type: string | null
          nomewpp: string | null
          phone: string | null
          user_message: string | null
        }
        Insert: {
          active?: boolean | null
          bot_message?: string | null
          created_at?: string | null
          id?: number
          message_type?: string | null
          nomewpp?: string | null
          phone?: string | null
          user_message?: string | null
        }
        Update: {
          active?: boolean | null
          bot_message?: string | null
          created_at?: string | null
          id?: number
          message_type?: string | null
          nomewpp?: string | null
          phone?: string | null
          user_message?: string | null
        }
        Relationships: []
      }
      chat_messages_instragram_prime: {
        Row: {
          active: boolean | null
          bot_message: string | null
          created_at: string | null
          id: number
          message_type: string | null
          nomewpp: string | null
          phone: string | null
          user_message: string | null
        }
        Insert: {
          active?: boolean | null
          bot_message?: string | null
          created_at?: string | null
          id?: number
          message_type?: string | null
          nomewpp?: string | null
          phone?: string | null
          user_message?: string | null
        }
        Update: {
          active?: boolean | null
          bot_message?: string | null
          created_at?: string | null
          id?: number
          message_type?: string | null
          nomewpp?: string | null
          phone?: string | null
          user_message?: string | null
        }
        Relationships: []
      }
      chat_messages_instragram_prime1001: {
        Row: {
          active: boolean | null
          bot_message: string | null
          created_at: string | null
          id: number
          message_type: string | null
          nomewpp: string | null
          user_message: string | null
          usuario: string | null
        }
        Insert: {
          active?: boolean | null
          bot_message?: string | null
          created_at?: string | null
          id?: number
          message_type?: string | null
          nomewpp?: string | null
          user_message?: string | null
          usuario?: string | null
        }
        Update: {
          active?: boolean | null
          bot_message?: string | null
          created_at?: string | null
          id?: number
          message_type?: string | null
          nomewpp?: string | null
          user_message?: string | null
          usuario?: string | null
        }
        Relationships: []
      }
      chat_messages_primeal: {
        Row: {
          active: boolean | null
          bot_message: string | null
          created_at: string | null
          id: number
          message_type: string | null
          nomewpp: string | null
          phone: string | null
          user_message: string | null
        }
        Insert: {
          active?: boolean | null
          bot_message?: string | null
          created_at?: string | null
          id?: number
          message_type?: string | null
          nomewpp?: string | null
          phone?: string | null
          user_message?: string | null
        }
        Update: {
          active?: boolean | null
          bot_message?: string | null
          created_at?: string | null
          id?: number
          message_type?: string | null
          nomewpp?: string | null
          phone?: string | null
          user_message?: string | null
        }
        Relationships: []
      }
      chats_dolceamore: {
        Row: {
          created_at: string | null
          id: number
          phone: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          phone?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          phone?: string | null
          updated_at?: string | null
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
      contas_bancarias: {
        Row: {
          ativo: boolean | null
          banco: string | null
          created_at: string | null
          id: string
          login: string | null
          nome: string
          saldo_inicial: number | null
          tipo: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          ativo?: boolean | null
          banco?: string | null
          created_at?: string | null
          id?: string
          login?: string | null
          nome: string
          saldo_inicial?: number | null
          tipo?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          ativo?: boolean | null
          banco?: string | null
          created_at?: string | null
          id?: string
          login?: string | null
          nome?: string
          saldo_inicial?: number | null
          tipo?: string | null
          updated_at?: string | null
          user_id?: string
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
      critical_bill_months: {
        Row: {
          alerts_sent: number[] | null
          created_at: string | null
          critical_bill_id: string
          due_date: string
          id: string
          last_alert_sent_at: string | null
          month: number
          notes: string | null
          organization_id: string
          paid_at: string | null
          payment_amount: number | null
          payment_desc: string | null
          payment_details: Json | null
          payment_ref: string | null
          payment_supplier: string | null
          status: string | null
          updated_at: string | null
          year: number
        }
        Insert: {
          alerts_sent?: number[] | null
          created_at?: string | null
          critical_bill_id: string
          due_date: string
          id?: string
          last_alert_sent_at?: string | null
          month: number
          notes?: string | null
          organization_id: string
          paid_at?: string | null
          payment_amount?: number | null
          payment_desc?: string | null
          payment_details?: Json | null
          payment_ref?: string | null
          payment_supplier?: string | null
          status?: string | null
          updated_at?: string | null
          year: number
        }
        Update: {
          alerts_sent?: number[] | null
          created_at?: string | null
          critical_bill_id?: string
          due_date?: string
          id?: string
          last_alert_sent_at?: string | null
          month?: number
          notes?: string | null
          organization_id?: string
          paid_at?: string | null
          payment_amount?: number | null
          payment_desc?: string | null
          payment_details?: Json | null
          payment_ref?: string | null
          payment_supplier?: string | null
          status?: string | null
          updated_at?: string | null
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "critical_bill_months_critical_bill_id_fkey"
            columns: ["critical_bill_id"]
            isOneToOne: false
            referencedRelation: "critical_bills"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "critical_bill_months_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      critical_bills: {
        Row: {
          alert_days: number[] | null
          chart_of_account_id: number
          created_at: string | null
          criticality: string | null
          default_due_day: number | null
          enabled: boolean | null
          id: string
          organization_id: string
          responsible_user_id: string | null
          responsible_whatsapp: string | null
          supplier_id: string | null
          unit_id: string | null
          updated_at: string | null
          validation_type: string | null
        }
        Insert: {
          alert_days?: number[] | null
          chart_of_account_id: number
          created_at?: string | null
          criticality?: string | null
          default_due_day?: number | null
          enabled?: boolean | null
          id?: string
          organization_id: string
          responsible_user_id?: string | null
          responsible_whatsapp?: string | null
          supplier_id?: string | null
          unit_id?: string | null
          updated_at?: string | null
          validation_type?: string | null
        }
        Update: {
          alert_days?: number[] | null
          chart_of_account_id?: number
          created_at?: string | null
          criticality?: string | null
          default_due_day?: number | null
          enabled?: boolean | null
          id?: string
          organization_id?: string
          responsible_user_id?: string | null
          responsible_whatsapp?: string | null
          supplier_id?: string | null
          unit_id?: string | null
          updated_at?: string | null
          validation_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "critical_bills_chart_of_account_id_fkey"
            columns: ["chart_of_account_id"]
            isOneToOne: false
            referencedRelation: "chart_of_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "critical_bills_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "critical_bills_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "people"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "critical_bills_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "units"
            referencedColumns: ["id"]
          },
        ]
      }
      dados_cliente_dolceamore: {
        Row: {
          atendimento_ia: string | null
          created_at: string | null
          id: number
          nomewpp: string | null
          telefone: string | null
        }
        Insert: {
          atendimento_ia?: string | null
          created_at?: string | null
          id?: number
          nomewpp?: string | null
          telefone?: string | null
        }
        Update: {
          atendimento_ia?: string | null
          created_at?: string | null
          id?: number
          nomewpp?: string | null
          telefone?: string | null
        }
        Relationships: []
      }
      dados_cliente_instragram_prime1001: {
        Row: {
          atendimento_ia: string | null
          created_at: string | null
          id: number
          nomewpp: string | null
          setor: string | null
          usuario: string | null
        }
        Insert: {
          atendimento_ia?: string | null
          created_at?: string | null
          id?: number
          nomewpp?: string | null
          setor?: string | null
          usuario?: string | null
        }
        Update: {
          atendimento_ia?: string | null
          created_at?: string | null
          id?: number
          nomewpp?: string | null
          setor?: string | null
          usuario?: string | null
        }
        Relationships: []
      }
      dados_cliente_primeade: {
        Row: {
          atendimento_ia: string | null
          created_at: string | null
          id: number
          nomewpp: string | null
          setor: string | null
          telefone: string | null
        }
        Insert: {
          atendimento_ia?: string | null
          created_at?: string | null
          id?: number
          nomewpp?: string | null
          setor?: string | null
          telefone?: string | null
        }
        Update: {
          atendimento_ia?: string | null
          created_at?: string | null
          id?: number
          nomewpp?: string | null
          setor?: string | null
          telefone?: string | null
        }
        Relationships: []
      }
      dados_cliente_primeal: {
        Row: {
          atendimento_ia: string | null
          created_at: string | null
          id: number
          nomewpp: string | null
          setor: string | null
          telefone: string | null
        }
        Insert: {
          atendimento_ia?: string | null
          created_at?: string | null
          id?: number
          nomewpp?: string | null
          setor?: string | null
          telefone?: string | null
        }
        Update: {
          atendimento_ia?: string | null
          created_at?: string | null
          id?: number
          nomewpp?: string | null
          setor?: string | null
          telefone?: string | null
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
      document_types: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          organization_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          organization_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          organization_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "document_types_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      documents_dolceamore: {
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
      dre_closures: {
        Row: {
          closed_at: string
          closed_by: string
          created_at: string | null
          id: string
          month: number
          organization_id: string
          unit_id: string | null
          webhook_url: string | null
          year: number
        }
        Insert: {
          closed_at?: string
          closed_by: string
          created_at?: string | null
          id?: string
          month: number
          organization_id: string
          unit_id?: string | null
          webhook_url?: string | null
          year: number
        }
        Update: {
          closed_at?: string
          closed_by?: string
          created_at?: string | null
          id?: string
          month?: number
          organization_id?: string
          unit_id?: string | null
          webhook_url?: string | null
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "dre_closures_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dre_closures_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "units"
            referencedColumns: ["id"]
          },
        ]
      }
      dre_closures_config: {
        Row: {
          created_at: string | null
          id: string
          organization_id: string
          secure_share_webhook_url: string | null
          updated_at: string | null
          webhook_url: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          organization_id: string
          secure_share_webhook_url?: string | null
          updated_at?: string | null
          webhook_url: string
        }
        Update: {
          created_at?: string | null
          id?: string
          organization_id?: string
          secure_share_webhook_url?: string | null
          updated_at?: string | null
          webhook_url?: string
        }
        Relationships: [
          {
            foreignKeyName: "dre_closures_config_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: true
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      dre_goal_achievements: {
        Row: {
          accounts_payable_id: string | null
          achieved: boolean | null
          actual_profit: number | null
          created_at: string
          goal_id: string | null
          id: string
          organization_id: string
          payable_created_at: string | null
          payable_created_by: string | null
          reward_amount: number | null
          target_profit: number | null
          unit_id: string | null
          updated_at: string
          year: number
        }
        Insert: {
          accounts_payable_id?: string | null
          achieved?: boolean | null
          actual_profit?: number | null
          created_at?: string
          goal_id?: string | null
          id?: string
          organization_id: string
          payable_created_at?: string | null
          payable_created_by?: string | null
          reward_amount?: number | null
          target_profit?: number | null
          unit_id?: string | null
          updated_at?: string
          year: number
        }
        Update: {
          accounts_payable_id?: string | null
          achieved?: boolean | null
          actual_profit?: number | null
          created_at?: string
          goal_id?: string | null
          id?: string
          organization_id?: string
          payable_created_at?: string | null
          payable_created_by?: string | null
          reward_amount?: number | null
          target_profit?: number | null
          unit_id?: string | null
          updated_at?: string
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "dre_goal_achievements_accounts_payable_id_fkey"
            columns: ["accounts_payable_id"]
            isOneToOne: false
            referencedRelation: "accounts_payable"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dre_goal_achievements_goal_id_fkey"
            columns: ["goal_id"]
            isOneToOne: false
            referencedRelation: "dre_profit_goals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dre_goal_achievements_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dre_goal_achievements_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "units"
            referencedColumns: ["id"]
          },
        ]
      }
      dre_manual_entries: {
        Row: {
          amount: number
          chart_of_account_id: number
          created_at: string | null
          id: string
          month: number
          organization_id: string
          unit_id: string
          year: number
        }
        Insert: {
          amount?: number
          chart_of_account_id: number
          created_at?: string | null
          id?: string
          month: number
          organization_id: string
          unit_id: string
          year: number
        }
        Update: {
          amount?: number
          chart_of_account_id?: number
          created_at?: string | null
          id?: string
          month?: number
          organization_id?: string
          unit_id?: string
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "dre_manual_entries_chart_of_account_id_fkey"
            columns: ["chart_of_account_id"]
            isOneToOne: false
            referencedRelation: "chart_of_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dre_manual_entries_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dre_manual_entries_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "units"
            referencedColumns: ["id"]
          },
        ]
      }
      dre_profit_goals: {
        Row: {
          created_at: string
          id: string
          level: string
          max_value: number | null
          min_value: number
          organization_id: string
          payable_chart_account_id: number | null
          payable_default_vendor_id: string | null
          payable_due_day: number | null
          payable_due_days: number | null
          payable_due_rule: string | null
          payable_enabled: boolean | null
          reward_type: string
          reward_value: number
          target_type: string | null
          unit_id: string | null
          updated_at: string
          year: number
        }
        Insert: {
          created_at?: string
          id?: string
          level: string
          max_value?: number | null
          min_value: number
          organization_id: string
          payable_chart_account_id?: number | null
          payable_default_vendor_id?: string | null
          payable_due_day?: number | null
          payable_due_days?: number | null
          payable_due_rule?: string | null
          payable_enabled?: boolean | null
          reward_type: string
          reward_value: number
          target_type?: string | null
          unit_id?: string | null
          updated_at?: string
          year: number
        }
        Update: {
          created_at?: string
          id?: string
          level?: string
          max_value?: number | null
          min_value?: number
          organization_id?: string
          payable_chart_account_id?: number | null
          payable_default_vendor_id?: string | null
          payable_due_day?: number | null
          payable_due_days?: number | null
          payable_due_rule?: string | null
          payable_enabled?: boolean | null
          reward_type?: string
          reward_value?: number
          target_type?: string | null
          unit_id?: string | null
          updated_at?: string
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "dre_profit_goals_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dre_profit_goals_payable_chart_account_id_fkey"
            columns: ["payable_chart_account_id"]
            isOneToOne: false
            referencedRelation: "chart_of_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dre_profit_goals_payable_default_vendor_id_fkey"
            columns: ["payable_default_vendor_id"]
            isOneToOne: false
            referencedRelation: "people"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dre_profit_goals_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "units"
            referencedColumns: ["id"]
          },
        ]
      }
      faixas_dre: {
        Row: {
          ativo: boolean | null
          code: string | null
          created_at: string | null
          descricao: string
          formula: Json | null
          id: string
          listar_no_dre: boolean | null
          nome: string
          operador: string
          ordem: number
          organization_id: string
          tipo: string
          updated_at: string | null
        }
        Insert: {
          ativo?: boolean | null
          code?: string | null
          created_at?: string | null
          descricao: string
          formula?: Json | null
          id?: string
          listar_no_dre?: boolean | null
          nome: string
          operador?: string
          ordem: number
          organization_id: string
          tipo: string
          updated_at?: string | null
        }
        Update: {
          ativo?: boolean | null
          code?: string | null
          created_at?: string | null
          descricao?: string
          formula?: Json | null
          id?: string
          listar_no_dre?: boolean | null
          nome?: string
          operador?: string
          ordem?: number
          organization_id?: string
          tipo?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "faixas_dre_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
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
      financial_closing_shares: {
        Row: {
          access_code: string
          closing_id: string
          created_at: string | null
          created_by: string | null
          expires_at: string | null
          id: string
          organization_id: string
          share_token: string
          views_count: number | null
        }
        Insert: {
          access_code: string
          closing_id: string
          created_at?: string | null
          created_by?: string | null
          expires_at?: string | null
          id?: string
          organization_id: string
          share_token?: string
          views_count?: number | null
        }
        Update: {
          access_code?: string
          closing_id?: string
          created_at?: string | null
          created_by?: string | null
          expires_at?: string | null
          id?: string
          organization_id?: string
          share_token?: string
          views_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "financial_closing_shares_closing_id_fkey"
            columns: ["closing_id"]
            isOneToOne: false
            referencedRelation: "financial_closings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "financial_closing_shares_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      financial_closings: {
        Row: {
          created_at: string | null
          id: string
          net_profit: number | null
          reference_date: string
          status: string | null
          total_expenses: number | null
          total_revenue: number | null
          unit_id: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          net_profit?: number | null
          reference_date: string
          status?: string | null
          total_expenses?: number | null
          total_revenue?: number | null
          unit_id: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          net_profit?: number | null
          reference_date?: string
          status?: string | null
          total_expenses?: number | null
          total_revenue?: number | null
          unit_id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "financial_closings_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "units"
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
      invitations: {
        Row: {
          created_at: string | null
          email: string
          expires_at: string
          id: string
          invited_by: string
          organization_id: string
          role: string
          status: Database["public"]["Enums"]["invitation_status"]
          token: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          expires_at?: string
          id?: string
          invited_by: string
          organization_id: string
          role: string
          status?: Database["public"]["Enums"]["invitation_status"]
          token?: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          expires_at?: string
          id?: string
          invited_by?: string
          organization_id?: string
          role?: string
          status?: Database["public"]["Enums"]["invitation_status"]
          token?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "invitations_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      logs_importacao: {
        Row: {
          conta_bancaria_id: string | null
          created_at: string | null
          detalhes_erro: string | null
          duplicados: number | null
          erros: number | null
          id: string
          importados: number | null
          login: string | null
          nome_arquivo: string
          status: string
          tipo_arquivo: string
          total_registros: number | null
          user_id: string
          valor_total: number | null
        }
        Insert: {
          conta_bancaria_id?: string | null
          created_at?: string | null
          detalhes_erro?: string | null
          duplicados?: number | null
          erros?: number | null
          id?: string
          importados?: number | null
          login?: string | null
          nome_arquivo: string
          status?: string
          tipo_arquivo: string
          total_registros?: number | null
          user_id: string
          valor_total?: number | null
        }
        Update: {
          conta_bancaria_id?: string | null
          created_at?: string | null
          detalhes_erro?: string | null
          duplicados?: number | null
          erros?: number | null
          id?: string
          importados?: number | null
          login?: string | null
          nome_arquivo?: string
          status?: string
          tipo_arquivo?: string
          total_registros?: number | null
          user_id?: string
          valor_total?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "logs_importacao_conta_bancaria_id_fkey"
            columns: ["conta_bancaria_id"]
            isOneToOne: false
            referencedRelation: "contas_bancarias"
            referencedColumns: ["id"]
          },
        ]
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
      n8n_chat_histories_primevl: {
        Row: {
          id: number
          message: Json | null
          session_id: string | null
        }
        Insert: {
          id?: number
          message?: Json | null
          session_id?: string | null
        }
        Update: {
          id?: number
          message?: Json | null
          session_id?: string | null
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
      notifications: {
        Row: {
          content: string
          created_at: string | null
          created_by: string | null
          dedupe_key: string | null
          entity_id: string | null
          entity_type: string | null
          id: string
          is_read: boolean
          link: string | null
          organization_id: string
          title: string
          type: string
          unit_id: string | null
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          created_by?: string | null
          dedupe_key?: string | null
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          is_read?: boolean
          link?: string | null
          organization_id: string
          title: string
          type: string
          unit_id?: string | null
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          created_by?: string | null
          dedupe_key?: string | null
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          is_read?: boolean
          link?: string | null
          organization_id?: string
          title?: string
          type?: string
          unit_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "units"
            referencedColumns: ["id"]
          },
        ]
      }
      organization_members: {
        Row: {
          can_delete_transactions: boolean | null
          created_at: string | null
          id: number
          is_super_admin: boolean
          organization_id: string
          role: string | null
          status: Database["public"]["Enums"]["member_status"]
          user_id: string
        }
        Insert: {
          can_delete_transactions?: boolean | null
          created_at?: string | null
          id?: number
          is_super_admin?: boolean
          organization_id: string
          role?: string | null
          status?: Database["public"]["Enums"]["member_status"]
          user_id: string
        }
        Update: {
          can_delete_transactions?: boolean | null
          created_at?: string | null
          id?: number
          is_super_admin?: boolean
          organization_id?: string
          role?: string | null
          status?: Database["public"]["Enums"]["member_status"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "organization_members_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          approval_webhook_url: string | null
          created_at: string | null
          id: string
          logo_url: string | null
          name: string
          owner_id: string
          radar_notification_day: number | null
          radar_notification_time: string | null
          radar_notification_webhook: string | null
          webhook_url: string | null
        }
        Insert: {
          approval_webhook_url?: string | null
          created_at?: string | null
          id?: string
          logo_url?: string | null
          name: string
          owner_id: string
          radar_notification_day?: number | null
          radar_notification_time?: string | null
          radar_notification_webhook?: string | null
          webhook_url?: string | null
        }
        Update: {
          approval_webhook_url?: string | null
          created_at?: string | null
          id?: string
          logo_url?: string | null
          name?: string
          owner_id?: string
          radar_notification_day?: number | null
          radar_notification_time?: string | null
          radar_notification_webhook?: string | null
          webhook_url?: string | null
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
      payment_methods: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          organization_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          organization_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          organization_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payment_methods_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      people: {
        Row: {
          address: string | null
          created_at: string | null
          document: string | null
          email: string | null
          id: string
          name: string
          organization_id: string
          phone: string | null
          type: string | null
          unit_id: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string | null
          document?: string | null
          email?: string | null
          id?: string
          name: string
          organization_id: string
          phone?: string | null
          type?: string | null
          unit_id?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string | null
          document?: string | null
          email?: string | null
          id?: string
          name?: string
          organization_id?: string
          phone?: string | null
          type?: string | null
          unit_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "people_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "people_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "units"
            referencedColumns: ["id"]
          },
        ]
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
          avatar_url: string | null
          can_lead_one_on_one: boolean | null
          document_number: string | null
          email: string | null
          full_name: string | null
          id: string
          phone: string | null
          username: string | null
          website: string | null
        }
        Insert: {
          avatar_url?: string | null
          can_lead_one_on_one?: boolean | null
          document_number?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          phone?: string | null
          username?: string | null
          website?: string | null
        }
        Update: {
          avatar_url?: string | null
          can_lead_one_on_one?: boolean | null
          document_number?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          username?: string | null
          website?: string | null
        }
        Relationships: []
      }
      role_menu_permissions: {
        Row: {
          created_at: string | null
          id: string
          menu_path: string
          role_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          menu_path: string
          role_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          menu_path?: string
          role_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "role_menu_permissions_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
        ]
      }
      roles: {
        Row: {
          can_confer_payments: boolean | null
          created_at: string | null
          description: string | null
          id: string
          is_system: boolean | null
          name: string
          organization_id: string
          updated_at: string | null
        }
        Insert: {
          can_confer_payments?: boolean | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_system?: boolean | null
          name: string
          organization_id: string
          updated_at?: string | null
        }
        Update: {
          can_confer_payments?: boolean | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_system?: boolean | null
          name?: string
          organization_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "roles_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
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
          conta_bancaria_id: string | null
          created_at: string
          detalhes: string | null
          estabelecimento: string | null
          grupo_id: string | null
          hash_unico: string | null
          id: number
          login: string | null
          origem: string | null
          quando: string | null
          tipo: string | null
          user: string | null
          valor: number | null
        }
        Insert: {
          categoria?: string | null
          conta_bancaria_id?: string | null
          created_at?: string
          detalhes?: string | null
          estabelecimento?: string | null
          grupo_id?: string | null
          hash_unico?: string | null
          id?: number
          login?: string | null
          origem?: string | null
          quando?: string | null
          tipo?: string | null
          user?: string | null
          valor?: number | null
        }
        Update: {
          categoria?: string | null
          conta_bancaria_id?: string | null
          created_at?: string
          detalhes?: string | null
          estabelecimento?: string | null
          grupo_id?: string | null
          hash_unico?: string | null
          id?: number
          login?: string | null
          origem?: string | null
          quando?: string | null
          tipo?: string | null
          user?: string | null
          valor?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "transacoes_conta_bancaria_id_fkey"
            columns: ["conta_bancaria_id"]
            isOneToOne: false
            referencedRelation: "contas_bancarias"
            referencedColumns: ["id"]
          },
        ]
      }
      transaction_comments: {
        Row: {
          batch_id: string | null
          batch_item_id: string | null
          content: string
          created_at: string | null
          id: string
          organization_id: string
          payable_id: string
          reply_to_comment_id: string | null
          source: string
          unit_id: string | null
          user_id: string | null
        }
        Insert: {
          batch_id?: string | null
          batch_item_id?: string | null
          content: string
          created_at?: string | null
          id?: string
          organization_id: string
          payable_id: string
          reply_to_comment_id?: string | null
          source: string
          unit_id?: string | null
          user_id?: string | null
        }
        Update: {
          batch_id?: string | null
          batch_item_id?: string | null
          content?: string
          created_at?: string | null
          id?: string
          organization_id?: string
          payable_id?: string
          reply_to_comment_id?: string | null
          source?: string
          unit_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "transaction_comments_batch_id_fkey"
            columns: ["batch_id"]
            isOneToOne: false
            referencedRelation: "approval_batches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transaction_comments_batch_item_id_fkey"
            columns: ["batch_item_id"]
            isOneToOne: false
            referencedRelation: "approval_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transaction_comments_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transaction_comments_payable_id_fkey"
            columns: ["payable_id"]
            isOneToOne: false
            referencedRelation: "accounts_payable"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transaction_comments_reply_to_comment_id_fkey"
            columns: ["reply_to_comment_id"]
            isOneToOne: false
            referencedRelation: "transaction_comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transaction_comments_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "units"
            referencedColumns: ["id"]
          },
        ]
      }
      unit_partners: {
        Row: {
          created_at: string | null
          email: string | null
          id: string
          name: string
          percentage: number
          phone: string | null
          unit_id: string
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          id?: string
          name: string
          percentage: number
          phone?: string | null
          unit_id: string
        }
        Update: {
          created_at?: string | null
          email?: string | null
          id?: string
          name?: string
          percentage?: number
          phone?: string | null
          unit_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "unit_partners_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "units"
            referencedColumns: ["id"]
          },
        ]
      }
      unit_rankings: {
        Row: {
          consumption_pct: number | null
          created_at: string | null
          expense_goal: number | null
          id: string
          month: string
          occupancy_rate: number | null
          sales_goal_pct: number | null
          unit_id: string
          updated_at: string | null
        }
        Insert: {
          consumption_pct?: number | null
          created_at?: string | null
          expense_goal?: number | null
          id?: string
          month: string
          occupancy_rate?: number | null
          sales_goal_pct?: number | null
          unit_id: string
          updated_at?: string | null
        }
        Update: {
          consumption_pct?: number | null
          created_at?: string | null
          expense_goal?: number | null
          id?: string
          month?: string
          occupancy_rate?: number | null
          sales_goal_pct?: number | null
          unit_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "unit_rankings_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "units"
            referencedColumns: ["id"]
          },
        ]
      }
      units: {
        Row: {
          address: string | null
          created_at: string | null
          distribution_webhook_url: string | null
          enable_payment_conference: boolean | null
          id: string
          last_radar_notification_sent_at: string | null
          leader_id: string | null
          leader_whatsapp: string | null
          name: string
          organization_id: string
          radar_notification_day: number | null
          radar_notification_time: string | null
          radar_notification_webhook: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string | null
          distribution_webhook_url?: string | null
          enable_payment_conference?: boolean | null
          id?: string
          last_radar_notification_sent_at?: string | null
          leader_id?: string | null
          leader_whatsapp?: string | null
          name: string
          organization_id: string
          radar_notification_day?: number | null
          radar_notification_time?: string | null
          radar_notification_webhook?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string | null
          distribution_webhook_url?: string | null
          enable_payment_conference?: boolean | null
          id?: string
          last_radar_notification_sent_at?: string | null
          leader_id?: string | null
          leader_whatsapp?: string | null
          name?: string
          organization_id?: string
          radar_notification_day?: number | null
          radar_notification_time?: string | null
          radar_notification_webhook?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "units_leader_id_fkey"
            columns: ["leader_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "units_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      user_menu_permissions: {
        Row: {
          created_at: string
          id: string
          menu_path: string
          organization_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          menu_path: string
          organization_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          menu_path?: string
          organization_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_menu_permissions_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      user_units: {
        Row: {
          created_at: string
          id: string
          organization_id: string
          unit_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          organization_id: string
          unit_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          organization_id?: string
          unit_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_units_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_units_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "units"
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
      accept_invitation: {
        Args: { p_invitation_id: string; p_user_id: string }
        Returns: Json
      }
      autenticar_usuario: {
        Args: { email_login: string; senha_login: string }
        Returns: string
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
      expire_old_invitations: { Args: never; Returns: undefined }
      generate_bill_months: {
        Args: { bill_id: string; target_year: number }
        Returns: undefined
      }
      get_atlas_accuracy_trend: {
        Args: { p_organization_id: string }
        Returns: {
          accepted_count: number
          accuracy_rate: number
          month_label: string
          total_count: number
        }[]
      }
      get_atlas_mismatches: {
        Args: { p_limit?: number; p_organization_id: string }
        Returns: {
          actual_account_name: string
          avg_confidence: number
          description: string
          occurrence_count: number
          suggested_account_name: string
        }[]
      }
      get_atlas_overview_stats: {
        Args: { p_organization_id: string }
        Returns: {
          acceptance_rate: number
          accepted_suggestions: number
          avg_confidence: number
          estimated_time_saved_minutes: number
          total_suggestions: number
        }[]
      }
      get_auth_user_organization_id: { Args: never; Returns: string }
      get_auth_user_organization_ids: {
        Args: never
        Returns: {
          organization_id: string
        }[]
      }
      get_cash_flow_data_with_comparison: {
        Args: { p_month: number; p_year: number }
        Returns: {
          budgeted_current: number
          chart_of_account_id: number
          realized_current: number
          realized_previous: number
        }[]
      }
      get_cash_flow_data_yearly: {
        Args: { p_organization_id?: string; p_unit_id?: string; p_year: number }
        Returns: {
          chart_of_account_id: number
          month: number
          realized_total: number
        }[]
      }
      get_cash_flow_summary: {
        Args: { p_year: number }
        Returns: {
          chart_of_account_id: number
          month: number
          total_amount: number
        }[]
      }
      get_dre_data_with_comparison: {
        Args: { p_month: number; p_year: number }
        Returns: {
          budgeted_current: number
          chart_of_account_id: number
          realized_current: number
          realized_previous: number
        }[]
      }
      get_dre_data_yearly:
        | {
            Args: { p_year: number }
            Returns: {
              budgeted_total: number
              chart_of_account_id: number
              month: number
              realized_total: number
            }[]
          }
        | {
            Args: {
              p_organization_id?: string
              p_unit_id?: string
              p_year: number
            }
            Returns: {
              budgeted_total: number
              chart_of_account_id: number
              month: number
              realized_total: number
            }[]
          }
      get_dre_yearly_v2: {
        Args: { p_organization_id: string; p_unit_id?: string; p_year: number }
        Returns: {
          account_code: string
          account_id: number
          account_name: string
          amount: number
          category_id: number
          category_name: string
          month: number
          section: string
        }[]
      }
      get_initial_balance: {
        Args: { p_organization_id?: string; p_unit_id?: string; p_year: number }
        Returns: number
      }
      get_invitation_by_token: {
        Args: { invitation_token: string }
        Returns: {
          email: string
          expires_at: string
          id: string
          organization_id: string
          organization_name: string
          role: string
          status: Database["public"]["Enums"]["invitation_status"]
          token: string
        }[]
      }
      get_my_time_records: {
        Args: { p_clerk_id: string; p_end_date: string; p_start_date: string }
        Returns: {
          created_at: string
          id: string
          is_valid_location: boolean
          latitude: number
          longitude: number
          photo_url: string
          record_timestamp: string
          record_type: string
        }[]
      }
      get_my_time_records_with_justifications: {
        Args: { p_clerk_id: string; p_end_date: string; p_start_date: string }
        Returns: {
          address: string
          custom_reason: string
          deviation_minutes: number
          id: string
          is_valid_location: boolean
          justification_id: string
          justification_type: string
          latitude: number
          longitude: number
          photo_url: string
          reason_text: string
          record_timestamp: string
          record_type: string
        }[]
      }
      get_orgs_to_notify_radar: {
        Args: never
        Returns: {
          id: string
          name: string
          radar_notification_day: number
          radar_notification_time: string
          radar_notification_webhook: string
        }[]
      }
      get_previous_balance: {
        Args: {
          p_bank_account_id?: string
          p_date: string
          p_organization_id: string
          p_payment_method_id?: string
          p_unit_id?: string
        }
        Returns: number
      }
      get_top_growing_expenses: {
        Args: { p_ref_date: string; p_unit_id: string }
        Returns: {
          account_id: number
          account_name: string
          current_value: number
          growth_diff: number
          last_year_value: number
          prev_value: number
        }[]
      }
      is_admin_of_org: { Args: { org_id: string }; Returns: boolean }
      match_documents_dolceamore: {
        Args: {
          match_count?: number
          metadata_filter?: Json
          query_embedding: string
        }
        Returns: {
          content: string
          id: number
          metadata: Json
          similarity: number
        }[]
      }
      migrate_chart_of_account: {
        Args: {
          p_organization_id: string
          p_source_account_id: number
          p_target_account_id: number
        }
        Returns: Json
      }
      registrar_usuario:
        | {
            Args: {
              email: string
              empresa: string
              nome: string
              senha: string
            }
            Returns: string
          }
        | {
            Args: {
              email: string
              empresa: string
              nome: string
              senha: string
              whatsapp: string
            }
            Returns: string
          }
      sync_radar_status: {
        Args: { target_bill_id?: string; target_org_id?: string }
        Returns: undefined
      }
    }
    Enums: {
      bank_type: "banco_inter" | "stone"
      indicator_enum: "Crédito" | "Débito"
      invitation_status: "pending" | "accepted" | "cancelled" | "expired"
      member_status: "pending" | "active" | "inactive"
      organization_role: "CEO" | "Controller" | "Manager" | "Member"
      sync_status: "pending" | "processing" | "success" | "error" | "partial"
      transaction_type_enum: "income" | "expense"
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
    Enums: {
      bank_type: ["banco_inter", "stone"],
      indicator_enum: ["Crédito", "Débito"],
      invitation_status: ["pending", "accepted", "cancelled", "expired"],
      member_status: ["pending", "active", "inactive"],
      organization_role: ["CEO", "Controller", "Manager", "Member"],
      sync_status: ["pending", "processing", "success", "error", "partial"],
      transaction_type_enum: ["income", "expense"],
    },
  },
} as const
