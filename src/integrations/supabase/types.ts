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
    PostgrestVersion: "12.2.3"
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
          atlas_categorized: boolean | null
          atlas_confidence_score: number | null
          atlas_model: string | null
          atlas_original_description: string | null
          atlas_reasoning: string | null
          atlas_review_status: string | null
          atlas_suggested_at: string | null
          bank_account_id: string | null
          bank_category: string | null
          bank_integration_id: string | null
          bank_transaction_id: string | null
          chart_of_account_id: number | null
          codigo_barras: string | null
          conferred_at: string | null
          conferred_by_name: string | null
          conferred_by_user_id: string | null
          created_at: string | null
          created_by: string | null
          description: string | null
          document_number: string | null
          document_type: string | null
          due_date: string
          external_payload: Json | null
          external_reference_id: string | null
          external_source: string | null
          external_synced_at: string | null
          external_update_blocked_reason: string | null
          id: string
          imported_from_bank: boolean | null
          installments: number | null
          invoice_evidence_required: boolean
          invoice_image_filename: string | null
          invoice_image_mime_type: string | null
          invoice_image_path: string | null
          invoice_image_uploaded_at: string | null
          invoice_image_uploaded_by: string | null
          is_internal_transfer: boolean | null
          issue_date: string | null
          loan_id: string | null
          missing_invoice_evidence: boolean
          missing_invoice_reason: string | null
          organization_id: string
          origin_module: string | null
          paid_amount: number | null
          paid_at: string | null
          paid_by_user_id: string | null
          partner_id: string | null
          payment_date: string | null
          payment_method_id: string | null
          payment_splits: Json | null
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
          atlas_categorized?: boolean | null
          atlas_confidence_score?: number | null
          atlas_model?: string | null
          atlas_original_description?: string | null
          atlas_reasoning?: string | null
          atlas_review_status?: string | null
          atlas_suggested_at?: string | null
          bank_account_id?: string | null
          bank_category?: string | null
          bank_integration_id?: string | null
          bank_transaction_id?: string | null
          chart_of_account_id?: number | null
          codigo_barras?: string | null
          conferred_at?: string | null
          conferred_by_name?: string | null
          conferred_by_user_id?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          document_number?: string | null
          document_type?: string | null
          due_date: string
          external_payload?: Json | null
          external_reference_id?: string | null
          external_source?: string | null
          external_synced_at?: string | null
          external_update_blocked_reason?: string | null
          id?: string
          imported_from_bank?: boolean | null
          installments?: number | null
          invoice_evidence_required?: boolean
          invoice_image_filename?: string | null
          invoice_image_mime_type?: string | null
          invoice_image_path?: string | null
          invoice_image_uploaded_at?: string | null
          invoice_image_uploaded_by?: string | null
          is_internal_transfer?: boolean | null
          issue_date?: string | null
          loan_id?: string | null
          missing_invoice_evidence?: boolean
          missing_invoice_reason?: string | null
          organization_id: string
          origin_module?: string | null
          paid_amount?: number | null
          paid_at?: string | null
          paid_by_user_id?: string | null
          partner_id?: string | null
          payment_date?: string | null
          payment_method_id?: string | null
          payment_splits?: Json | null
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
          atlas_categorized?: boolean | null
          atlas_confidence_score?: number | null
          atlas_model?: string | null
          atlas_original_description?: string | null
          atlas_reasoning?: string | null
          atlas_review_status?: string | null
          atlas_suggested_at?: string | null
          bank_account_id?: string | null
          bank_category?: string | null
          bank_integration_id?: string | null
          bank_transaction_id?: string | null
          chart_of_account_id?: number | null
          codigo_barras?: string | null
          conferred_at?: string | null
          conferred_by_name?: string | null
          conferred_by_user_id?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          document_number?: string | null
          document_type?: string | null
          due_date?: string
          external_payload?: Json | null
          external_reference_id?: string | null
          external_source?: string | null
          external_synced_at?: string | null
          external_update_blocked_reason?: string | null
          id?: string
          imported_from_bank?: boolean | null
          installments?: number | null
          invoice_evidence_required?: boolean
          invoice_image_filename?: string | null
          invoice_image_mime_type?: string | null
          invoice_image_path?: string | null
          invoice_image_uploaded_at?: string | null
          invoice_image_uploaded_by?: string | null
          is_internal_transfer?: boolean | null
          issue_date?: string | null
          loan_id?: string | null
          missing_invoice_evidence?: boolean
          missing_invoice_reason?: string | null
          organization_id?: string
          origin_module?: string | null
          paid_amount?: number | null
          paid_at?: string | null
          paid_by_user_id?: string | null
          partner_id?: string | null
          payment_date?: string | null
          payment_method_id?: string | null
          payment_splits?: Json | null
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
            foreignKeyName: "accounts_payable_loan_id_fkey"
            columns: ["loan_id"]
            isOneToOne: false
            referencedRelation: "loans"
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
      accounts_payable_audit: {
        Row: {
          accounts_payable_id: string
          changed_at: string
          changes: Json
          event_type: string
          id: number
          organization_id: string
          source: string
          user_id: string | null
          user_name: string | null
          user_role: string | null
        }
        Insert: {
          accounts_payable_id: string
          changed_at?: string
          changes?: Json
          event_type: string
          id?: never
          organization_id: string
          source: string
          user_id?: string | null
          user_name?: string | null
          user_role?: string | null
        }
        Update: {
          accounts_payable_id?: string
          changed_at?: string
          changes?: Json
          event_type?: string
          id?: never
          organization_id?: string
          source?: string
          user_id?: string | null
          user_name?: string | null
          user_role?: string | null
        }
        Relationships: []
      }
      accounts_payable_funding_sources: {
        Row: {
          amount: number
          created_at: string
          created_by: string | null
          funding_type: string
          id: string
          notes: string | null
          organization_id: string
          payable_id: string
          source_bank_account_id: string | null
          source_mode: string
          source_unit_id: string
          transfer_group_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string
          created_by?: string | null
          funding_type: string
          id?: string
          notes?: string | null
          organization_id: string
          payable_id: string
          source_bank_account_id?: string | null
          source_mode: string
          source_unit_id: string
          transfer_group_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string
          created_by?: string | null
          funding_type?: string
          id?: string
          notes?: string | null
          organization_id?: string
          payable_id?: string
          source_bank_account_id?: string | null
          source_mode?: string
          source_unit_id?: string
          transfer_group_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "accounts_payable_funding_sources_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "accounts_payable_funding_sources_payable_id_fkey"
            columns: ["payable_id"]
            isOneToOne: false
            referencedRelation: "accounts_payable"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "accounts_payable_funding_sources_source_bank_account_id_fkey"
            columns: ["source_bank_account_id"]
            isOneToOne: false
            referencedRelation: "bank_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "accounts_payable_funding_sources_source_unit_id_fkey"
            columns: ["source_unit_id"]
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
      agent_knowledge: {
        Row: {
          agent_id: string
          category: string
          content: string
          created_at: string | null
          embedding: string | null
          id: string
          metadata: Json | null
        }
        Insert: {
          agent_id: string
          category: string
          content: string
          created_at?: string | null
          embedding?: string | null
          id?: string
          metadata?: Json | null
        }
        Update: {
          agent_id?: string
          category?: string
          content?: string
          created_at?: string | null
          embedding?: string | null
          id?: string
          metadata?: Json | null
        }
        Relationships: []
      }
      agent_logs: {
        Row: {
          action: string
          agent_id: string
          created_at: string | null
          details: string | null
          id: string
        }
        Insert: {
          action: string
          agent_id: string
          created_at?: string | null
          details?: string | null
          id?: string
        }
        Update: {
          action?: string
          agent_id?: string
          created_at?: string | null
          details?: string | null
          id?: string
        }
        Relationships: []
      }
      agent_presence: {
        Row: {
          agent_id: string
          current_task_id: string | null
          last_heartbeat: string | null
          status: string | null
        }
        Insert: {
          agent_id: string
          current_task_id?: string | null
          last_heartbeat?: string | null
          status?: string | null
        }
        Update: {
          agent_id?: string
          current_task_id?: string | null
          last_heartbeat?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "agent_presence_current_task_id_fkey"
            columns: ["current_task_id"]
            isOneToOne: false
            referencedRelation: "agent_tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      agent_tasks: {
        Row: {
          assigned_to: string
          category: string | null
          context: Json | null
          created_at: string | null
          created_by: string
          description: string | null
          id: string
          priority: string | null
          started_at: string | null
          status: string | null
          status_history: Json | null
          title: string
          updated_at: string | null
        }
        Insert: {
          assigned_to: string
          category?: string | null
          context?: Json | null
          created_at?: string | null
          created_by: string
          description?: string | null
          id?: string
          priority?: string | null
          started_at?: string | null
          status?: string | null
          status_history?: Json | null
          title: string
          updated_at?: string | null
        }
        Update: {
          assigned_to?: string
          category?: string | null
          context?: Json | null
          created_at?: string | null
          created_by?: string
          description?: string | null
          id?: string
          priority?: string | null
          started_at?: string | null
          status?: string | null
          status_history?: Json | null
          title?: string
          updated_at?: string | null
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
          conference_stage: string | null
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
          conference_stage?: string | null
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
          conference_stage?: string | null
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
      atlas_corrections_log: {
        Row: {
          applied: boolean
          correct_chart_of_account_id: number
          corrected_at: string
          corrected_by: string | null
          description: string
          id: string
          organization_id: string
          wrong_chart_of_account_id: number | null
        }
        Insert: {
          applied?: boolean
          correct_chart_of_account_id: number
          corrected_at?: string
          corrected_by?: string | null
          description: string
          id?: string
          organization_id: string
          wrong_chart_of_account_id?: number | null
        }
        Update: {
          applied?: boolean
          correct_chart_of_account_id?: number
          corrected_at?: string
          corrected_by?: string | null
          description?: string
          id?: string
          organization_id?: string
          wrong_chart_of_account_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "atlas_corrections_log_correct_chart_of_account_id_fkey"
            columns: ["correct_chart_of_account_id"]
            isOneToOne: false
            referencedRelation: "chart_of_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "atlas_corrections_log_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "atlas_corrections_log_wrong_chart_of_account_id_fkey"
            columns: ["wrong_chart_of_account_id"]
            isOneToOne: false
            referencedRelation: "chart_of_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      atlas_intelligence_patterns: {
        Row: {
          chart_of_account_id: number | null
          confidence_score: number | null
          created_at: string | null
          description_pattern: string
          id: string
          last_used_at: string | null
          organization_id: string | null
          person_id: string | null
          source: string | null
          usage_count: number | null
        }
        Insert: {
          chart_of_account_id?: number | null
          confidence_score?: number | null
          created_at?: string | null
          description_pattern: string
          id?: string
          last_used_at?: string | null
          organization_id?: string | null
          person_id?: string | null
          source?: string | null
          usage_count?: number | null
        }
        Update: {
          chart_of_account_id?: number | null
          confidence_score?: number | null
          created_at?: string | null
          description_pattern?: string
          id?: string
          last_used_at?: string | null
          organization_id?: string | null
          person_id?: string | null
          source?: string | null
          usage_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "atlas_intelligence_patterns_chart_of_account_id_fkey"
            columns: ["chart_of_account_id"]
            isOneToOne: false
            referencedRelation: "chart_of_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "atlas_intelligence_patterns_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "atlas_intelligence_patterns_person_id_fkey"
            columns: ["person_id"]
            isOneToOne: false
            referencedRelation: "people"
            referencedColumns: ["id"]
          },
        ]
      }
      atlas_learned_mappings: {
        Row: {
          chart_of_account_id: number
          created_at: string
          description_normalized: string
          frequency: number
          id: string
          is_manual_override: boolean
          last_used_at: string
          organization_id: string
          source: string
          updated_at: string
        }
        Insert: {
          chart_of_account_id: number
          created_at?: string
          description_normalized: string
          frequency?: number
          id?: string
          is_manual_override?: boolean
          last_used_at?: string
          organization_id: string
          source?: string
          updated_at?: string
        }
        Update: {
          chart_of_account_id?: number
          created_at?: string
          description_normalized?: string
          frequency?: number
          id?: string
          is_manual_override?: boolean
          last_used_at?: string
          organization_id?: string
          source?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "atlas_learned_mappings_chart_of_account_id_fkey"
            columns: ["chart_of_account_id"]
            isOneToOne: false
            referencedRelation: "chart_of_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "atlas_learned_mappings_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      atlas_review_runs: {
        Row: {
          created_at: string
          id: string
          last_run_at: string
          month: number
          organization_id: string
          run_count: number
          unit_id: string | null
          updated_at: string
          year: number
        }
        Insert: {
          created_at?: string
          id?: string
          last_run_at?: string
          month: number
          organization_id: string
          run_count?: number
          unit_id?: string | null
          updated_at?: string
          year: number
        }
        Update: {
          created_at?: string
          id?: string
          last_run_at?: string
          month?: number
          organization_id?: string
          run_count?: number
          unit_id?: string | null
          updated_at?: string
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "atlas_review_runs_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "atlas_review_runs_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "units"
            referencedColumns: ["id"]
          },
        ]
      }
      audio_digests: {
        Row: {
          created_at: string
          destinatario_nome: string
          destinatario_telefone: string
          erro: string | null
          expires_at: string
          id: string
          manchete: string | null
          organization_id: string
          papel: string
          reference_date: string
          report_ids: string[]
          sent_at: string | null
          status: string
          token: string
        }
        Insert: {
          created_at?: string
          destinatario_nome: string
          destinatario_telefone: string
          erro?: string | null
          expires_at?: string
          id?: string
          manchete?: string | null
          organization_id: string
          papel?: string
          reference_date: string
          report_ids?: string[]
          sent_at?: string | null
          status?: string
          token?: string
        }
        Update: {
          created_at?: string
          destinatario_nome?: string
          destinatario_telefone?: string
          erro?: string | null
          expires_at?: string
          id?: string
          manchete?: string | null
          organization_id?: string
          papel?: string
          reference_date?: string
          report_ids?: string[]
          sent_at?: string | null
          status?: string
          token?: string
        }
        Relationships: [
          {
            foreignKeyName: "audio_digests_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      automacao_financas: {
        Row: {
          atualizado_em: string
          conta_banco_id: string | null
          conta_dinheiro_id: string | null
          gowa_device: string
          grupo_jid: string | null
          grupo_nome: string
          lido_ate: string
          login: string
          pluggy_account_id: string
          resumo: Json
        }
        Insert: {
          atualizado_em?: string
          conta_banco_id?: string | null
          conta_dinheiro_id?: string | null
          gowa_device: string
          grupo_jid?: string | null
          grupo_nome: string
          lido_ate?: string
          login: string
          pluggy_account_id: string
          resumo?: Json
        }
        Update: {
          atualizado_em?: string
          conta_banco_id?: string | null
          conta_dinheiro_id?: string | null
          gowa_device?: string
          grupo_jid?: string | null
          grupo_nome?: string
          lido_ate?: string
          login?: string
          pluggy_account_id?: string
          resumo?: Json
        }
        Relationships: [
          {
            foreignKeyName: "automacao_financas_conta_banco_id_fkey"
            columns: ["conta_banco_id"]
            isOneToOne: false
            referencedRelation: "contas_bancarias"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "automacao_financas_conta_dinheiro_id_fkey"
            columns: ["conta_dinheiro_id"]
            isOneToOne: false
            referencedRelation: "contas_bancarias"
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
      bank_account_daily_confirmations: {
        Row: {
          bank_account_id: string
          created_at: string
          created_by: string | null
          id: string
          no_expense: boolean
          no_income: boolean
          organization_id: string
          reference_date: string
        }
        Insert: {
          bank_account_id: string
          created_at?: string
          created_by?: string | null
          id?: string
          no_expense?: boolean
          no_income?: boolean
          organization_id: string
          reference_date: string
        }
        Update: {
          bank_account_id?: string
          created_at?: string
          created_by?: string | null
          id?: string
          no_expense?: boolean
          no_income?: boolean
          organization_id?: string
          reference_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "bank_account_daily_confirmations_bank_account_id_fkey"
            columns: ["bank_account_id"]
            isOneToOne: false
            referencedRelation: "bank_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bank_account_daily_confirmations_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
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
          is_cash_destination: boolean
          is_safe_box: boolean | null
          is_safe_box_destination: boolean | null
          monitor_freshness: boolean | null
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
          is_cash_destination?: boolean
          is_safe_box?: boolean | null
          is_safe_box_destination?: boolean | null
          monitor_freshness?: boolean | null
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
          is_cash_destination?: boolean
          is_safe_box?: boolean | null
          is_safe_box_destination?: boolean | null
          monitor_freshness?: boolean | null
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
          taxa_maquininha_pct: number | null
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
          taxa_maquininha_pct?: number | null
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
          taxa_maquininha_pct?: number | null
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
      bank_transactions: {
        Row: {
          amount: number
          bank_account_id: string | null
          bank_integration_id: string
          candidates: Json | null
          category: string | null
          counterparty: string | null
          created_at: string | null
          date: string
          description: string | null
          direction: string
          external_id: string
          fee: number
          id: string
          match_status: string
          matched_accounts_payable_id: string | null
          notes: string | null
          operation_type: string | null
          organization_id: string
          posted_at: string | null
          raw: Json
          unit_id: string | null
          updated_at: string | null
        }
        Insert: {
          amount: number
          bank_account_id?: string | null
          bank_integration_id: string
          candidates?: Json | null
          category?: string | null
          counterparty?: string | null
          created_at?: string | null
          date: string
          description?: string | null
          direction: string
          external_id: string
          fee?: number
          id?: string
          match_status?: string
          matched_accounts_payable_id?: string | null
          notes?: string | null
          operation_type?: string | null
          organization_id: string
          posted_at?: string | null
          raw?: Json
          unit_id?: string | null
          updated_at?: string | null
        }
        Update: {
          amount?: number
          bank_account_id?: string | null
          bank_integration_id?: string
          candidates?: Json | null
          category?: string | null
          counterparty?: string | null
          created_at?: string | null
          date?: string
          description?: string | null
          direction?: string
          external_id?: string
          fee?: number
          id?: string
          match_status?: string
          matched_accounts_payable_id?: string | null
          notes?: string | null
          operation_type?: string | null
          organization_id?: string
          posted_at?: string | null
          raw?: Json
          unit_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bank_transactions_bank_integration_id_fkey"
            columns: ["bank_integration_id"]
            isOneToOne: false
            referencedRelation: "bank_integrations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bank_transactions_matched_accounts_payable_id_fkey"
            columns: ["matched_accounts_payable_id"]
            isOneToOne: false
            referencedRelation: "accounts_payable"
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
      card_receipts: {
        Row: {
          acquirer: string | null
          amount: number | null
          authorization_code: string | null
          card_brand: string | null
          card_kind: string | null
          card_last4: string | null
          created_at: string
          created_by: string | null
          establishment_code: string | null
          id: string
          image_path: string | null
          machine_id: string | null
          merchant_cnpj: string | null
          merchant_name: string | null
          organization_id: string
          raw_ai: Json
          receipt_date: string | null
          receipt_time: string | null
          status: string
          status_reason: string | null
          transaction_uid: string | null
          unit_id: string
          updated_at: string
        }
        Insert: {
          acquirer?: string | null
          amount?: number | null
          authorization_code?: string | null
          card_brand?: string | null
          card_kind?: string | null
          card_last4?: string | null
          created_at?: string
          created_by?: string | null
          establishment_code?: string | null
          id?: string
          image_path?: string | null
          machine_id?: string | null
          merchant_cnpj?: string | null
          merchant_name?: string | null
          organization_id: string
          raw_ai?: Json
          receipt_date?: string | null
          receipt_time?: string | null
          status?: string
          status_reason?: string | null
          transaction_uid?: string | null
          unit_id: string
          updated_at?: string
        }
        Update: {
          acquirer?: string | null
          amount?: number | null
          authorization_code?: string | null
          card_brand?: string | null
          card_kind?: string | null
          card_last4?: string | null
          created_at?: string
          created_by?: string | null
          establishment_code?: string | null
          id?: string
          image_path?: string | null
          machine_id?: string | null
          merchant_cnpj?: string | null
          merchant_name?: string | null
          organization_id?: string
          raw_ai?: Json
          receipt_date?: string | null
          receipt_time?: string | null
          status?: string
          status_reason?: string | null
          transaction_uid?: string | null
          unit_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "card_receipts_machine_id_fkey"
            columns: ["machine_id"]
            isOneToOne: false
            referencedRelation: "unit_card_machines"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "card_receipts_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "card_receipts_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "units"
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
      cash_flow_visibility_rules: {
        Row: {
          bank_account_id: string | null
          created_at: string
          hidden_from_month: string
          id: string
          is_active: boolean
          organization_id: string
          scope: string
          unit_id: string | null
          updated_at: string
        }
        Insert: {
          bank_account_id?: string | null
          created_at?: string
          hidden_from_month: string
          id?: string
          is_active?: boolean
          organization_id: string
          scope: string
          unit_id?: string | null
          updated_at?: string
        }
        Update: {
          bank_account_id?: string | null
          created_at?: string
          hidden_from_month?: string
          id?: string
          is_active?: boolean
          organization_id?: string
          scope?: string
          unit_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "cash_flow_visibility_rules_bank_account_id_fkey"
            columns: ["bank_account_id"]
            isOneToOne: false
            referencedRelation: "bank_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cash_flow_visibility_rules_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cash_flow_visibility_rules_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "units"
            referencedColumns: ["id"]
          },
        ]
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
      central_compras_ingestion_logs: {
        Row: {
          created_at: string
          error_code: string | null
          error_message: string | null
          external_reference_id: string | null
          id: string
          organization_id: string | null
          payload: Json | null
          payment_kind: string | null
          source_order_id: string
          status: string
          target_id: string | null
          target_table: string | null
        }
        Insert: {
          created_at?: string
          error_code?: string | null
          error_message?: string | null
          external_reference_id?: string | null
          id?: string
          organization_id?: string | null
          payload?: Json | null
          payment_kind?: string | null
          source_order_id: string
          status: string
          target_id?: string | null
          target_table?: string | null
        }
        Update: {
          created_at?: string
          error_code?: string | null
          error_message?: string | null
          external_reference_id?: string | null
          id?: string
          organization_id?: string | null
          payload?: Json | null
          payment_kind?: string | null
          source_order_id?: string
          status?: string
          target_id?: string | null
          target_table?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "central_compras_ingestion_logs_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      central_compras_mappings: {
        Row: {
          chart_of_account_id: number | null
          created_at: string
          credit_card_id: string | null
          id: string
          notes: string | null
          organization_id: string
          payment_method_id: string | null
          person_id: string | null
          source_key: string
          source_kind: string
          source_name: string
          unit_id: string | null
          updated_at: string
        }
        Insert: {
          chart_of_account_id?: number | null
          created_at?: string
          credit_card_id?: string | null
          id?: string
          notes?: string | null
          organization_id: string
          payment_method_id?: string | null
          person_id?: string | null
          source_key: string
          source_kind: string
          source_name: string
          unit_id?: string | null
          updated_at?: string
        }
        Update: {
          chart_of_account_id?: number | null
          created_at?: string
          credit_card_id?: string | null
          id?: string
          notes?: string | null
          organization_id?: string
          payment_method_id?: string | null
          person_id?: string | null
          source_key?: string
          source_kind?: string
          source_name?: string
          unit_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "central_compras_mappings_chart_of_account_id_fkey"
            columns: ["chart_of_account_id"]
            isOneToOne: false
            referencedRelation: "chart_of_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "central_compras_mappings_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "central_compras_mappings_payment_method_id_fkey"
            columns: ["payment_method_id"]
            isOneToOne: false
            referencedRelation: "payment_methods"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "central_compras_mappings_person_id_fkey"
            columns: ["person_id"]
            isOneToOne: false
            referencedRelation: "people"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "central_compras_mappings_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "units"
            referencedColumns: ["id"]
          },
        ]
      }
      ceo_radar_alert_states: {
        Row: {
          alert_key: string
          id: string
          organization_id: string
          snooze_until: string | null
          state: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          alert_key: string
          id?: string
          organization_id: string
          snooze_until?: string | null
          state?: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          alert_key?: string
          id?: string
          organization_id?: string
          snooze_until?: string | null
          state?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      ceo_units_radar_rule_exemptions: {
        Row: {
          created_at: string
          created_by: string | null
          id: string
          organization_id: string
          rule_id: string
          unit_id: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id?: string
          organization_id: string
          rule_id: string
          unit_id: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          id?: string
          organization_id?: string
          rule_id?: string
          unit_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ceo_units_radar_rule_exemptions_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ceo_units_radar_rule_exemptions_rule_id_fkey"
            columns: ["rule_id"]
            isOneToOne: false
            referencedRelation: "ceo_units_radar_rules"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ceo_units_radar_rule_exemptions_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "units"
            referencedColumns: ["id"]
          },
        ]
      }
      ceo_units_radar_rules: {
        Row: {
          account_id: number
          created_at: string
          document_type_id: string | null
          id: string
          is_fixed: boolean
          organization_id: string
          position: number
          supplier_id: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          account_id: number
          created_at?: string
          document_type_id?: string | null
          id?: string
          is_fixed?: boolean
          organization_id: string
          position?: number
          supplier_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          account_id?: number
          created_at?: string
          document_type_id?: string | null
          id?: string
          is_fixed?: boolean
          organization_id?: string
          position?: number
          supplier_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ceo_units_radar_rules_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "chart_of_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ceo_units_radar_rules_document_type_id_fkey"
            columns: ["document_type_id"]
            isOneToOne: false
            referencedRelation: "document_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ceo_units_radar_rules_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ceo_units_radar_rules_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "people"
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
      chart_of_account_reclassification_audit: {
        Row: {
          accounts_payable_id: string
          batch_id: string
          changed_at: string
          id: number
          new_account_id: number
          new_code: string
          old_account_id: number
          old_code: string
          organization_id: string
          reason: string
        }
        Insert: {
          accounts_payable_id: string
          batch_id: string
          changed_at?: string
          id?: number
          new_account_id: number
          new_code: string
          old_account_id: number
          old_code: string
          organization_id: string
          reason: string
        }
        Update: {
          accounts_payable_id?: string
          batch_id?: string
          changed_at?: string
          id?: number
          new_account_id?: number
          new_code?: string
          old_account_id?: number
          old_code?: string
          organization_id?: string
          reason?: string
        }
        Relationships: [
          {
            foreignKeyName: "chart_of_account_reclassification_audi_accounts_payable_id_fkey"
            columns: ["accounts_payable_id"]
            isOneToOne: false
            referencedRelation: "accounts_payable"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chart_of_account_reclassification_audit_new_account_id_fkey"
            columns: ["new_account_id"]
            isOneToOne: false
            referencedRelation: "chart_of_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chart_of_account_reclassification_audit_old_account_id_fkey"
            columns: ["old_account_id"]
            isOneToOne: false
            referencedRelation: "chart_of_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chart_of_account_reclassification_audit_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
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
          dre_section_override_id: string | null
          id: number
          is_active: boolean
          is_internal_transfer: boolean | null
          is_loan_account: boolean | null
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
          dre_section_override_id?: string | null
          id?: number
          is_active?: boolean
          is_internal_transfer?: boolean | null
          is_loan_account?: boolean | null
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
          dre_section_override_id?: string | null
          id?: number
          is_active?: boolean
          is_internal_transfer?: boolean | null
          is_loan_account?: boolean | null
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
            foreignKeyName: "chart_of_accounts_dre_section_override_id_fkey"
            columns: ["dre_section_override_id"]
            isOneToOne: false
            referencedRelation: "faixas_dre"
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
      client_charge_notifications: {
        Row: {
          charge_id: string
          destino: string | null
          enviado_em: string
          erro: string | null
          etapa: string
          id: number
          message_id: string | null
        }
        Insert: {
          charge_id: string
          destino?: string | null
          enviado_em?: string
          erro?: string | null
          etapa: string
          id?: never
          message_id?: string | null
        }
        Update: {
          charge_id?: string
          destino?: string | null
          enviado_em?: string
          erro?: string | null
          etapa?: string
          id?: never
          message_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "client_charge_notifications_charge_id_fkey"
            columns: ["charge_id"]
            isOneToOne: false
            referencedRelation: "client_charges"
            referencedColumns: ["id"]
          },
        ]
      }
      client_charges: {
        Row: {
          competencia: string | null
          created_at: string
          descricao: string
          enviada_em: string | null
          forma_pagamento: string | null
          id: string
          itens: Json | null
          observacao: string | null
          organization_id: string
          pago_em: string | null
          tipo: string
          token: string
          valor: number
          valor_pago: number | null
          vencimento: string
        }
        Insert: {
          competencia?: string | null
          created_at?: string
          descricao: string
          enviada_em?: string | null
          forma_pagamento?: string | null
          id?: string
          itens?: Json | null
          observacao?: string | null
          organization_id: string
          pago_em?: string | null
          tipo: string
          token?: string
          valor: number
          valor_pago?: number | null
          vencimento: string
        }
        Update: {
          competencia?: string | null
          created_at?: string
          descricao?: string
          enviada_em?: string | null
          forma_pagamento?: string | null
          id?: string
          itens?: Json | null
          observacao?: string | null
          organization_id?: string
          pago_em?: string | null
          tipo?: string
          token?: string
          valor?: number
          valor_pago?: number | null
          vencimento?: string
        }
        Relationships: [
          {
            foreignKeyName: "client_charges_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      client_contracts: {
        Row: {
          ativo: boolean
          cnpj: string | null
          contato_email: string | null
          contato_nome: string | null
          contato_whatsapp: string | null
          dia_cobranca: number
          dia_vencimento: number
          dias_tolerancia: number
          inicio: string | null
          observacao: string | null
          organization_id: string
          razao_social: string | null
          reajuste_em: string | null
          reajuste_indice: string
          suspensao_automatica: boolean
          updated_at: string
        }
        Insert: {
          ativo?: boolean
          cnpj?: string | null
          contato_email?: string | null
          contato_nome?: string | null
          contato_whatsapp?: string | null
          dia_cobranca?: number
          dia_vencimento?: number
          dias_tolerancia?: number
          inicio?: string | null
          observacao?: string | null
          organization_id: string
          razao_social?: string | null
          reajuste_em?: string | null
          reajuste_indice?: string
          suspensao_automatica?: boolean
          updated_at?: string
        }
        Update: {
          ativo?: boolean
          cnpj?: string | null
          contato_email?: string | null
          contato_nome?: string | null
          contato_whatsapp?: string | null
          dia_cobranca?: number
          dia_vencimento?: number
          dias_tolerancia?: number
          inicio?: string | null
          observacao?: string | null
          organization_id?: string
          razao_social?: string | null
          reajuste_em?: string | null
          reajuste_indice?: string
          suspensao_automatica?: boolean
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "client_contracts_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: true
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      client_unit_prices: {
        Row: {
          organization_id: string
          unit_id: string
          updated_at: string
          valor: number
        }
        Insert: {
          organization_id: string
          unit_id: string
          updated_at?: string
          valor: number
        }
        Update: {
          organization_id?: string
          unit_id?: string
          updated_at?: string
          valor?: number
        }
        Relationships: [
          {
            foreignKeyName: "client_unit_prices_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "client_unit_prices_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: true
            referencedRelation: "units"
            referencedColumns: ["id"]
          },
        ]
      }
      closing_audio_reports: {
        Row: {
          audio_url: string | null
          blocos: string[]
          closing_id: string | null
          created_at: string
          dados_json: Json | null
          dry_run: boolean
          duracao_segundos: number | null
          erro: string | null
          finished_at: string | null
          id: string
          iniciado_em: string | null
          organization_id: string
          partes_urls: string[]
          passo_em: string | null
          reference_date: string
          roteiro: string | null
          status: string
          tipo: string
          unit_id: string
          voz: string
        }
        Insert: {
          audio_url?: string | null
          blocos?: string[]
          closing_id?: string | null
          created_at?: string
          dados_json?: Json | null
          dry_run?: boolean
          duracao_segundos?: number | null
          erro?: string | null
          finished_at?: string | null
          id?: string
          iniciado_em?: string | null
          organization_id: string
          partes_urls?: string[]
          passo_em?: string | null
          reference_date: string
          roteiro?: string | null
          status?: string
          tipo?: string
          unit_id: string
          voz?: string
        }
        Update: {
          audio_url?: string | null
          blocos?: string[]
          closing_id?: string | null
          created_at?: string
          dados_json?: Json | null
          dry_run?: boolean
          duracao_segundos?: number | null
          erro?: string | null
          finished_at?: string | null
          id?: string
          iniciado_em?: string | null
          organization_id?: string
          partes_urls?: string[]
          passo_em?: string | null
          reference_date?: string
          roteiro?: string | null
          status?: string
          tipo?: string
          unit_id?: string
          voz?: string
        }
        Relationships: [
          {
            foreignKeyName: "closing_audio_reports_closing_id_fkey"
            columns: ["closing_id"]
            isOneToOne: false
            referencedRelation: "financial_closings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "closing_audio_reports_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "closing_audio_reports_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "units"
            referencedColumns: ["id"]
          },
        ]
      }
      closing_variance_commentary: {
        Row: {
          analysis: Json
          closing_id: string | null
          context: Json
          created_at: string
          generated_by: string | null
          id: string
          organization_id: string
          peer_unit_id: string | null
          provider: string | null
          reference_date: string
          unit_id: string
          updated_at: string
        }
        Insert: {
          analysis: Json
          closing_id?: string | null
          context: Json
          created_at?: string
          generated_by?: string | null
          id?: string
          organization_id: string
          peer_unit_id?: string | null
          provider?: string | null
          reference_date: string
          unit_id: string
          updated_at?: string
        }
        Update: {
          analysis?: Json
          closing_id?: string | null
          context?: Json
          created_at?: string
          generated_by?: string | null
          id?: string
          organization_id?: string
          peer_unit_id?: string | null
          provider?: string | null
          reference_date?: string
          unit_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "closing_variance_commentary_closing_id_fkey"
            columns: ["closing_id"]
            isOneToOne: false
            referencedRelation: "financial_closings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "closing_variance_commentary_peer_unit_id_fkey"
            columns: ["peer_unit_id"]
            isOneToOne: false
            referencedRelation: "units"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "closing_variance_commentary_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "units"
            referencedColumns: ["id"]
          },
        ]
      }
      cmo_daily_reports: {
        Row: {
          alerts: Json | null
          avg_cpa: number | null
          avg_ctr: number | null
          created_at: string | null
          dashboard_html: string | null
          github_url: string | null
          id: string
          report_content: string | null
          report_date: string
          telegram_message_id: number | null
          total_conversions: number | null
          total_spend: number | null
        }
        Insert: {
          alerts?: Json | null
          avg_cpa?: number | null
          avg_ctr?: number | null
          created_at?: string | null
          dashboard_html?: string | null
          github_url?: string | null
          id?: string
          report_content?: string | null
          report_date: string
          telegram_message_id?: number | null
          total_conversions?: number | null
          total_spend?: number | null
        }
        Update: {
          alerts?: Json | null
          avg_cpa?: number | null
          avg_ctr?: number | null
          created_at?: string | null
          dashboard_html?: string | null
          github_url?: string | null
          id?: string
          report_content?: string | null
          report_date?: string
          telegram_message_id?: number | null
          total_conversions?: number | null
          total_spend?: number | null
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
      contas_pagamentos: {
        Row: {
          ano: number
          conta_id: string
          created_at: string
          id: number
          login: string
          mes: number
          origem: string
          pago_em: string
          transacao_id: number | null
          valor: number | null
        }
        Insert: {
          ano: number
          conta_id: string
          created_at?: string
          id?: never
          login: string
          mes: number
          origem: string
          pago_em: string
          transacao_id?: number | null
          valor?: number | null
        }
        Update: {
          ano?: number
          conta_id?: string
          created_at?: string
          id?: never
          login?: string
          mes?: number
          origem?: string
          pago_em?: string
          transacao_id?: number | null
          valor?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "contas_pagamentos_conta_id_fkey"
            columns: ["conta_id"]
            isOneToOne: false
            referencedRelation: "contas_recorrentes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contas_pagamentos_transacao_id_fkey"
            columns: ["transacao_id"]
            isOneToOne: false
            referencedRelation: "transacoes"
            referencedColumns: ["id"]
          },
        ]
      }
      contas_recorrentes: {
        Row: {
          apelido_extrato: string | null
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
          apelido_extrato?: string | null
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
          apelido_extrato?: string | null
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
      daily_report_access: {
        Row: {
          created_at: string
          last_sent_date: string | null
          last_viewed_at: string | null
          name: string | null
          organization_id: string | null
          phone: string
          token: string
          views_count: number
        }
        Insert: {
          created_at?: string
          last_sent_date?: string | null
          last_viewed_at?: string | null
          name?: string | null
          organization_id?: string | null
          phone: string
          token?: string
          views_count?: number
        }
        Update: {
          created_at?: string
          last_sent_date?: string | null
          last_viewed_at?: string | null
          name?: string | null
          organization_id?: string | null
          phone?: string
          token?: string
          views_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "daily_report_access_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      daily_report_sends: {
        Row: {
          created_at: string
          error_message: string | null
          id: string
          message: string | null
          organization_id: string | null
          payload: Json | null
          recipients: Json | null
          report_date: string
          status: string
          unit_id: string
        }
        Insert: {
          created_at?: string
          error_message?: string | null
          id?: string
          message?: string | null
          organization_id?: string | null
          payload?: Json | null
          recipients?: Json | null
          report_date: string
          status: string
          unit_id: string
        }
        Update: {
          created_at?: string
          error_message?: string | null
          id?: string
          message?: string | null
          organization_id?: string | null
          payload?: Json | null
          recipients?: Json | null
          report_date?: string
          status?: string
          unit_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "daily_report_sends_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "daily_report_sends_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "units"
            referencedColumns: ["id"]
          },
        ]
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
      dre_ai_config: {
        Row: {
          ativo: boolean
          created_at: string
          id: string
          llm_model: string
          llm_reasoning_effort: string
          organization_id: string
          run_day: number
          run_hour: number
          updated_at: string
          whatsapp_webhook: string | null
        }
        Insert: {
          ativo?: boolean
          created_at?: string
          id?: string
          llm_model?: string
          llm_reasoning_effort?: string
          organization_id: string
          run_day?: number
          run_hour?: number
          updated_at?: string
          whatsapp_webhook?: string | null
        }
        Update: {
          ativo?: boolean
          created_at?: string
          id?: string
          llm_model?: string
          llm_reasoning_effort?: string
          organization_id?: string
          run_day?: number
          run_hour?: number
          updated_at?: string
          whatsapp_webhook?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "dre_ai_config_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: true
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      dre_ai_decisions: {
        Row: {
          concluded_at: string | null
          created_at: string
          created_by: string
          decisao: string
          id: string
          organization_id: string
          prazo: string
          prioridade: string
          report_id: string | null
          responsavel_id: string
          run_id: string
          status: string
          titulo: string
          unit_id: string | null
          updated_at: string
        }
        Insert: {
          concluded_at?: string | null
          created_at?: string
          created_by?: string
          decisao: string
          id?: string
          organization_id: string
          prazo: string
          prioridade?: string
          report_id?: string | null
          responsavel_id: string
          run_id: string
          status?: string
          titulo: string
          unit_id?: string | null
          updated_at?: string
        }
        Update: {
          concluded_at?: string | null
          created_at?: string
          created_by?: string
          decisao?: string
          id?: string
          organization_id?: string
          prazo?: string
          prioridade?: string
          report_id?: string | null
          responsavel_id?: string
          run_id?: string
          status?: string
          titulo?: string
          unit_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "dre_ai_decisions_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dre_ai_decisions_report_id_fkey"
            columns: ["report_id"]
            isOneToOne: false
            referencedRelation: "dre_ai_reports"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dre_ai_decisions_run_id_fkey"
            columns: ["run_id"]
            isOneToOne: false
            referencedRelation: "dre_ai_runs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dre_ai_decisions_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "units"
            referencedColumns: ["id"]
          },
        ]
      }
      dre_ai_recipients: {
        Row: {
          ativo: boolean
          created_at: string
          escopo: string
          id: string
          name: string
          organization_id: string
          papel: string
          phone: string
        }
        Insert: {
          ativo?: boolean
          created_at?: string
          escopo?: string
          id?: string
          name: string
          organization_id: string
          papel?: string
          phone: string
        }
        Update: {
          ativo?: boolean
          created_at?: string
          escopo?: string
          id?: string
          name?: string
          organization_id?: string
          papel?: string
          phone?: string
        }
        Relationships: [
          {
            foreignKeyName: "dre_ai_recipients_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      dre_ai_reports: {
        Row: {
          conteudo_md: string
          created_at: string
          dados_json: Json | null
          id: string
          resumo_1_linha: string | null
          resumo_whatsapp: string | null
          run_id: string
          tipo: string
          unit_id: string | null
          unit_ids: string[] | null
        }
        Insert: {
          conteudo_md: string
          created_at?: string
          dados_json?: Json | null
          id?: string
          resumo_1_linha?: string | null
          resumo_whatsapp?: string | null
          run_id: string
          tipo: string
          unit_id?: string | null
          unit_ids?: string[] | null
        }
        Update: {
          conteudo_md?: string
          created_at?: string
          dados_json?: Json | null
          id?: string
          resumo_1_linha?: string | null
          resumo_whatsapp?: string | null
          run_id?: string
          tipo?: string
          unit_id?: string | null
          unit_ids?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "dre_ai_reports_run_id_fkey"
            columns: ["run_id"]
            isOneToOne: false
            referencedRelation: "dre_ai_runs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dre_ai_reports_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "units"
            referencedColumns: ["id"]
          },
        ]
      }
      dre_ai_runs: {
        Row: {
          erro: string | null
          finished_at: string | null
          id: string
          llm_model: string | null
          mes_ref: string
          organization_id: string
          started_at: string
          status: string
          trigger: string
        }
        Insert: {
          erro?: string | null
          finished_at?: string | null
          id?: string
          llm_model?: string | null
          mes_ref: string
          organization_id: string
          started_at?: string
          status?: string
          trigger: string
        }
        Update: {
          erro?: string | null
          finished_at?: string | null
          id?: string
          llm_model?: string | null
          mes_ref?: string
          organization_id?: string
          started_at?: string
          status?: string
          trigger?: string
        }
        Relationships: [
          {
            foreignKeyName: "dre_ai_runs_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      dre_ai_sends: {
        Row: {
          erro: string | null
          id: string
          phone: string
          recipient_id: string | null
          run_id: string
          sent_at: string
          status: string
        }
        Insert: {
          erro?: string | null
          id?: string
          phone: string
          recipient_id?: string | null
          run_id: string
          sent_at?: string
          status: string
        }
        Update: {
          erro?: string | null
          id?: string
          phone?: string
          recipient_id?: string | null
          run_id?: string
          sent_at?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "dre_ai_sends_recipient_id_fkey"
            columns: ["recipient_id"]
            isOneToOne: false
            referencedRelation: "dre_ai_recipients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dre_ai_sends_run_id_fkey"
            columns: ["run_id"]
            isOneToOne: false
            referencedRelation: "dre_ai_runs"
            referencedColumns: ["id"]
          },
        ]
      }
      dre_classification_audit_runs: {
        Row: {
          completed_at: string | null
          created_at: string
          created_by: string | null
          data_fingerprint: string
          findings_count: number
          id: string
          month: number
          organization_id: string
          pending_count: number
          status: string
          total_transactions: number
          unit_id: string | null
          year: number
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          created_by?: string | null
          data_fingerprint: string
          findings_count?: number
          id?: string
          month: number
          organization_id: string
          pending_count?: number
          status?: string
          total_transactions?: number
          unit_id?: string | null
          year: number
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          created_by?: string | null
          data_fingerprint?: string
          findings_count?: number
          id?: string
          month?: number
          organization_id?: string
          pending_count?: number
          status?: string
          total_transactions?: number
          unit_id?: string | null
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "dre_classification_audit_runs_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dre_classification_audit_runs_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "units"
            referencedColumns: ["id"]
          },
        ]
      }
      dre_classification_findings: {
        Row: {
          created_at: string
          current_chart_of_account_id: number | null
          decided_at: string | null
          decided_by: string | null
          decision: string
          decision_reason: string | null
          id: string
          reasoning: string
          rule_code: string
          run_id: string
          severity: string
          suggested_chart_of_account_id: number | null
          transaction_amount: number
          transaction_description: string | null
          transaction_id: string
          transaction_issue_date: string | null
        }
        Insert: {
          created_at?: string
          current_chart_of_account_id?: number | null
          decided_at?: string | null
          decided_by?: string | null
          decision?: string
          decision_reason?: string | null
          id?: string
          reasoning: string
          rule_code: string
          run_id: string
          severity: string
          suggested_chart_of_account_id?: number | null
          transaction_amount?: number
          transaction_description?: string | null
          transaction_id: string
          transaction_issue_date?: string | null
        }
        Update: {
          created_at?: string
          current_chart_of_account_id?: number | null
          decided_at?: string | null
          decided_by?: string | null
          decision?: string
          decision_reason?: string | null
          id?: string
          reasoning?: string
          rule_code?: string
          run_id?: string
          severity?: string
          suggested_chart_of_account_id?: number | null
          transaction_amount?: number
          transaction_description?: string | null
          transaction_id?: string
          transaction_issue_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "dre_classification_findings_current_chart_of_account_id_fkey"
            columns: ["current_chart_of_account_id"]
            isOneToOne: false
            referencedRelation: "chart_of_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dre_classification_findings_run_id_fkey"
            columns: ["run_id"]
            isOneToOne: false
            referencedRelation: "dre_classification_audit_runs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dre_classification_findings_suggested_chart_of_account_id_fkey"
            columns: ["suggested_chart_of_account_id"]
            isOneToOne: false
            referencedRelation: "chart_of_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dre_classification_findings_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "accounts_payable"
            referencedColumns: ["id"]
          },
        ]
      }
      dre_closures: {
        Row: {
          classification_audit_run_id: string | null
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
          classification_audit_run_id?: string | null
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
          classification_audit_run_id?: string | null
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
            foreignKeyName: "dre_closures_classification_audit_run_id_fkey"
            columns: ["classification_audit_run_id"]
            isOneToOne: false
            referencedRelation: "dre_classification_audit_runs"
            referencedColumns: ["id"]
          },
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
          closing_audio_enabled: boolean
          closing_audio_voice: string
          created_at: string | null
          id: string
          organization_id: string
          secure_share_webhook_url: string | null
          updated_at: string | null
          webhook_url: string
        }
        Insert: {
          closing_audio_enabled?: boolean
          closing_audio_voice?: string
          created_at?: string | null
          id?: string
          organization_id: string
          secure_share_webhook_url?: string | null
          updated_at?: string | null
          webhook_url: string
        }
        Update: {
          closing_audio_enabled?: boolean
          closing_audio_voice?: string
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
      enquetes_canal: {
        Row: {
          ativo: boolean | null
          criado_em: string | null
          data_postagem: string
          id: number
          opcao_1: string
          opcao_2: string
          opcao_3: string | null
          opcao_4: string | null
          pergunta: string
          posted_at: string | null
        }
        Insert: {
          ativo?: boolean | null
          criado_em?: string | null
          data_postagem: string
          id?: number
          opcao_1: string
          opcao_2: string
          opcao_3?: string | null
          opcao_4?: string | null
          pergunta: string
          posted_at?: string | null
        }
        Update: {
          ativo?: boolean | null
          criado_em?: string | null
          data_postagem?: string
          id?: number
          opcao_1?: string
          opcao_2?: string
          opcao_3?: string | null
          opcao_4?: string | null
          pergunta?: string
          posted_at?: string | null
        }
        Relationships: []
      }
      expense_allocation_items: {
        Row: {
          accounts_payable_id: string | null
          allocation_id: string
          amount: number
          bank_account_id: string | null
          created_at: string
          decided_at: string | null
          decided_by: string | null
          id: string
          notes: string | null
          organization_id: string
          rejection_reason: string | null
          status: string
          unit_id: string
          updated_at: string
        }
        Insert: {
          accounts_payable_id?: string | null
          allocation_id: string
          amount: number
          bank_account_id?: string | null
          created_at?: string
          decided_at?: string | null
          decided_by?: string | null
          id?: string
          notes?: string | null
          organization_id: string
          rejection_reason?: string | null
          status?: string
          unit_id: string
          updated_at?: string
        }
        Update: {
          accounts_payable_id?: string | null
          allocation_id?: string
          amount?: number
          bank_account_id?: string | null
          created_at?: string
          decided_at?: string | null
          decided_by?: string | null
          id?: string
          notes?: string | null
          organization_id?: string
          rejection_reason?: string | null
          status?: string
          unit_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "expense_allocation_items_accounts_payable_id_fkey"
            columns: ["accounts_payable_id"]
            isOneToOne: false
            referencedRelation: "accounts_payable"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "expense_allocation_items_allocation_id_fkey"
            columns: ["allocation_id"]
            isOneToOne: false
            referencedRelation: "expense_allocations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "expense_allocation_items_bank_account_id_fkey"
            columns: ["bank_account_id"]
            isOneToOne: false
            referencedRelation: "bank_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "expense_allocation_items_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "expense_allocation_items_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "units"
            referencedColumns: ["id"]
          },
        ]
      }
      expense_allocations: {
        Row: {
          chart_of_account_id: number
          created_at: string
          created_by: string | null
          description: string
          document_number: string | null
          due_date: string
          id: string
          issue_date: string
          organization_id: string
          person_id: string
          status: string
          total_amount: number
          updated_at: string
        }
        Insert: {
          chart_of_account_id: number
          created_at?: string
          created_by?: string | null
          description: string
          document_number?: string | null
          due_date: string
          id?: string
          issue_date: string
          organization_id: string
          person_id: string
          status?: string
          total_amount: number
          updated_at?: string
        }
        Update: {
          chart_of_account_id?: number
          created_at?: string
          created_by?: string | null
          description?: string
          document_number?: string | null
          due_date?: string
          id?: string
          issue_date?: string
          organization_id?: string
          person_id?: string
          status?: string
          total_amount?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "expense_allocations_chart_of_account_id_fkey"
            columns: ["chart_of_account_id"]
            isOneToOne: false
            referencedRelation: "chart_of_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "expense_allocations_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "expense_allocations_person_id_fkey"
            columns: ["person_id"]
            isOneToOne: false
            referencedRelation: "people"
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
      financial_closing_audit: {
        Row: {
          changed_at: string
          closing_id: string
          event_type: string
          id: number
          organization_id: string | null
          reference_date: string
          snapshot: Json
          source: string
          unit_id: string
          user_id: string | null
          user_name: string | null
          user_role: string | null
        }
        Insert: {
          changed_at?: string
          closing_id: string
          event_type: string
          id?: never
          organization_id?: string | null
          reference_date: string
          snapshot?: Json
          source: string
          unit_id: string
          user_id?: string | null
          user_name?: string | null
          user_role?: string | null
        }
        Update: {
          changed_at?: string
          closing_id?: string
          event_type?: string
          id?: never
          organization_id?: string | null
          reference_date?: string
          snapshot?: Json
          source?: string
          unit_id?: string
          user_id?: string | null
          user_name?: string | null
          user_role?: string | null
        }
        Relationships: []
      }
      financial_closing_report_deliveries: {
        Row: {
          attempt_count: number
          closing_id: string
          created_at: string
          id: string
          last_error: string | null
          partner_id: string
          partner_name: string
          partner_phone: string | null
          provider_message_id: string | null
          run_id: string
          sent_at: string | null
          status: string
          updated_at: string
        }
        Insert: {
          attempt_count?: number
          closing_id: string
          created_at?: string
          id?: string
          last_error?: string | null
          partner_id: string
          partner_name: string
          partner_phone?: string | null
          provider_message_id?: string | null
          run_id: string
          sent_at?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          attempt_count?: number
          closing_id?: string
          created_at?: string
          id?: string
          last_error?: string | null
          partner_id?: string
          partner_name?: string
          partner_phone?: string | null
          provider_message_id?: string | null
          run_id?: string
          sent_at?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "financial_closing_report_deliveries_closing_id_fkey"
            columns: ["closing_id"]
            isOneToOne: false
            referencedRelation: "financial_closings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "financial_closing_report_deliveries_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "unit_partners"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "financial_closing_report_deliveries_run_id_fkey"
            columns: ["run_id"]
            isOneToOne: false
            referencedRelation: "financial_closing_report_runs"
            referencedColumns: ["id"]
          },
        ]
      }
      financial_closing_report_runs: {
        Row: {
          attempt_count: number
          closing_id: string
          created_at: string
          id: string
          last_error: string | null
          organization_id: string
          response_metadata: Json | null
          sent_at: string | null
          share_id: string | null
          status: string
          unit_id: string
          updated_at: string
          webhook_url: string | null
        }
        Insert: {
          attempt_count?: number
          closing_id: string
          created_at?: string
          id?: string
          last_error?: string | null
          organization_id: string
          response_metadata?: Json | null
          sent_at?: string | null
          share_id?: string | null
          status?: string
          unit_id: string
          updated_at?: string
          webhook_url?: string | null
        }
        Update: {
          attempt_count?: number
          closing_id?: string
          created_at?: string
          id?: string
          last_error?: string | null
          organization_id?: string
          response_metadata?: Json | null
          sent_at?: string | null
          share_id?: string | null
          status?: string
          unit_id?: string
          updated_at?: string
          webhook_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "financial_closing_report_runs_closing_id_fkey"
            columns: ["closing_id"]
            isOneToOne: true
            referencedRelation: "financial_closings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "financial_closing_report_runs_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "financial_closing_report_runs_share_id_fkey"
            columns: ["share_id"]
            isOneToOne: true
            referencedRelation: "financial_closing_shares"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "financial_closing_report_runs_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "units"
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
          report_snapshot: Json | null
          report_snapshot_created_at: string | null
          report_snapshot_version: string | null
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
          report_snapshot?: Json | null
          report_snapshot_created_at?: string | null
          report_snapshot_version?: string | null
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
          report_snapshot?: Json | null
          report_snapshot_created_at?: string | null
          report_snapshot_version?: string | null
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
          operating_profit: number | null
          plr_adjustment: number | null
          plr_base: number | null
          plr_eligible_applications: number | null
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
          operating_profit?: number | null
          plr_adjustment?: number | null
          plr_base?: number | null
          plr_eligible_applications?: number | null
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
          operating_profit?: number | null
          plr_adjustment?: number | null
          plr_base?: number | null
          plr_eligible_applications?: number | null
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
      financial_notes: {
        Row: {
          amount: number | null
          attachments: Json
          content: string | null
          created_at: string
          created_by: string
          creditor: string | null
          debtor: string | null
          event_date: string | null
          id: string
          organization_id: string
          resolution_notes: string | null
          resolved_at: string | null
          status: string
          title: string
          type: string
          unit_id: string | null
          updated_at: string
        }
        Insert: {
          amount?: number | null
          attachments?: Json
          content?: string | null
          created_at?: string
          created_by?: string
          creditor?: string | null
          debtor?: string | null
          event_date?: string | null
          id?: string
          organization_id: string
          resolution_notes?: string | null
          resolved_at?: string | null
          status?: string
          title: string
          type?: string
          unit_id?: string | null
          updated_at?: string
        }
        Update: {
          amount?: number | null
          attachments?: Json
          content?: string | null
          created_at?: string
          created_by?: string
          creditor?: string | null
          debtor?: string | null
          event_date?: string | null
          id?: string
          organization_id?: string
          resolution_notes?: string | null
          resolved_at?: string | null
          status?: string
          title?: string
          type?: string
          unit_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "financial_notes_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "financial_notes_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "units"
            referencedColumns: ["id"]
          },
        ]
      }
      financial_notes_access: {
        Row: {
          created_at: string
          granted_by: string
          id: string
          organization_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          granted_by?: string
          id?: string
          organization_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          granted_by?: string
          id?: string
          organization_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "financial_notes_access_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      financial_snapshots: {
        Row: {
          created_at: string
          id: string
          organization_id: string
          payload: Json
          snapshot_date: string
          snapshot_ts: string
          summary: Json
        }
        Insert: {
          created_at?: string
          id?: string
          organization_id: string
          payload?: Json
          snapshot_date: string
          snapshot_ts?: string
          summary?: Json
        }
        Update: {
          created_at?: string
          id?: string
          organization_id?: string
          payload?: Json
          snapshot_date?: string
          snapshot_ts?: string
          summary?: Json
        }
        Relationships: []
      }
      fixed_cost_monitors: {
        Row: {
          chart_of_account_id: number
          created_at: string
          created_by: string | null
          enabled: boolean
          id: string
          organization_id: string
          updated_at: string
        }
        Insert: {
          chart_of_account_id: number
          created_at?: string
          created_by?: string | null
          enabled?: boolean
          id?: string
          organization_id: string
          updated_at?: string
        }
        Update: {
          chart_of_account_id?: number
          created_at?: string
          created_by?: string | null
          enabled?: boolean
          id?: string
          organization_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fixed_cost_monitors_chart_of_account_id_fkey"
            columns: ["chart_of_account_id"]
            isOneToOne: false
            referencedRelation: "chart_of_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fixed_cost_monitors_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      group_entities: {
        Row: {
          ativo: boolean
          cnpj: string | null
          created_at: string | null
          id: string
          nome_curto: string | null
          organization_id: string
          razao_social: string
        }
        Insert: {
          ativo?: boolean
          cnpj?: string | null
          created_at?: string | null
          id?: string
          nome_curto?: string | null
          organization_id: string
          razao_social: string
        }
        Update: {
          ativo?: boolean
          cnpj?: string | null
          created_at?: string | null
          id?: string
          nome_curto?: string | null
          organization_id?: string
          razao_social?: string
        }
        Relationships: []
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
      interunit_loan_repayments: {
        Row: {
          amount: number
          created_at: string | null
          created_by: string | null
          creditor_ap_id: string | null
          debtor_ap_id: string | null
          id: string
          notes: string | null
          organization_id: string
          repayment_date: string
          transfer_request_id: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          created_by?: string | null
          creditor_ap_id?: string | null
          debtor_ap_id?: string | null
          id?: string
          notes?: string | null
          organization_id: string
          repayment_date: string
          transfer_request_id: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          created_by?: string | null
          creditor_ap_id?: string | null
          debtor_ap_id?: string | null
          id?: string
          notes?: string | null
          organization_id?: string
          repayment_date?: string
          transfer_request_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "interunit_loan_repayments_creditor_ap_id_fkey"
            columns: ["creditor_ap_id"]
            isOneToOne: false
            referencedRelation: "accounts_payable"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "interunit_loan_repayments_debtor_ap_id_fkey"
            columns: ["debtor_ap_id"]
            isOneToOne: false
            referencedRelation: "accounts_payable"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "interunit_loan_repayments_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "interunit_loan_repayments_transfer_request_id_fkey"
            columns: ["transfer_request_id"]
            isOneToOne: false
            referencedRelation: "interunit_transfer_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      interunit_transfer_requests: {
        Row: {
          accounts_payable_id: string | null
          amount: number
          approved_at: string | null
          approved_by: string | null
          created_at: string
          created_by: string | null
          description: string | null
          executed_at: string | null
          from_bank_account_id: string | null
          from_unit_id: string | null
          funding_source_id: string | null
          id: string
          loan_date: string | null
          notes: string | null
          organization_id: string
          status: string
          to_bank_account_id: string | null
          to_unit_id: string | null
          webhook_meta: Json | null
        }
        Insert: {
          accounts_payable_id?: string | null
          amount: number
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          executed_at?: string | null
          from_bank_account_id?: string | null
          from_unit_id?: string | null
          funding_source_id?: string | null
          id?: string
          loan_date?: string | null
          notes?: string | null
          organization_id: string
          status?: string
          to_bank_account_id?: string | null
          to_unit_id?: string | null
          webhook_meta?: Json | null
        }
        Update: {
          accounts_payable_id?: string | null
          amount?: number
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          executed_at?: string | null
          from_bank_account_id?: string | null
          from_unit_id?: string | null
          funding_source_id?: string | null
          id?: string
          loan_date?: string | null
          notes?: string | null
          organization_id?: string
          status?: string
          to_bank_account_id?: string | null
          to_unit_id?: string | null
          webhook_meta?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "interunit_transfer_requests_accounts_payable_id_fkey"
            columns: ["accounts_payable_id"]
            isOneToOne: false
            referencedRelation: "accounts_payable"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "interunit_transfer_requests_from_bank_account_id_fkey"
            columns: ["from_bank_account_id"]
            isOneToOne: false
            referencedRelation: "bank_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "interunit_transfer_requests_from_unit_id_fkey"
            columns: ["from_unit_id"]
            isOneToOne: false
            referencedRelation: "units"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "interunit_transfer_requests_funding_source_id_fkey"
            columns: ["funding_source_id"]
            isOneToOne: false
            referencedRelation: "accounts_payable_funding_sources"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "interunit_transfer_requests_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "interunit_transfer_requests_to_bank_account_id_fkey"
            columns: ["to_bank_account_id"]
            isOneToOne: false
            referencedRelation: "bank_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "interunit_transfer_requests_to_unit_id_fkey"
            columns: ["to_unit_id"]
            isOneToOne: false
            referencedRelation: "units"
            referencedColumns: ["id"]
          },
        ]
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
      loan_transactions: {
        Row: {
          amount: number
          created_at: string | null
          date: string
          description: string | null
          id: string
          loan_id: string
          payable_id: string | null
          type: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          date: string
          description?: string | null
          id?: string
          loan_id: string
          payable_id?: string | null
          type: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          date?: string
          description?: string | null
          id?: string
          loan_id?: string
          payable_id?: string | null
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "loan_transactions_loan_id_fkey"
            columns: ["loan_id"]
            isOneToOne: false
            referencedRelation: "loans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "loan_transactions_payable_id_fkey"
            columns: ["payable_id"]
            isOneToOne: false
            referencedRelation: "accounts_payable"
            referencedColumns: ["id"]
          },
        ]
      }
      loans: {
        Row: {
          borrower_id: string
          chart_of_account_id: number | null
          created_at: string | null
          description: string | null
          end_date: string | null
          id: string
          installments_count: number | null
          interest_rate: number
          interest_type: string | null
          lender_id: string | null
          notes: string | null
          organization_id: string
          principal_amount: number
          rate_tiers: Json | null
          start_date: string
          status: string | null
          unit_id: string | null
          updated_at: string | null
        }
        Insert: {
          borrower_id: string
          chart_of_account_id?: number | null
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          installments_count?: number | null
          interest_rate?: number
          interest_type?: string | null
          lender_id?: string | null
          notes?: string | null
          organization_id: string
          principal_amount?: number
          rate_tiers?: Json | null
          start_date?: string
          status?: string | null
          unit_id?: string | null
          updated_at?: string | null
        }
        Update: {
          borrower_id?: string
          chart_of_account_id?: number | null
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          installments_count?: number | null
          interest_rate?: number
          interest_type?: string | null
          lender_id?: string | null
          notes?: string | null
          organization_id?: string
          principal_amount?: number
          rate_tiers?: Json | null
          start_date?: string
          status?: string | null
          unit_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "loans_chart_of_account_id_fkey"
            columns: ["chart_of_account_id"]
            isOneToOne: false
            referencedRelation: "chart_of_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "loans_lender_id_fkey"
            columns: ["lender_id"]
            isOneToOne: false
            referencedRelation: "people"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "loans_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "loans_person_id_fkey"
            columns: ["borrower_id"]
            isOneToOne: false
            referencedRelation: "people"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "loans_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "units"
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
      meta_ads_daily: {
        Row: {
          ad_account_id: string
          ad_account_name: string
          adset_id: string | null
          adset_name: string | null
          campaign_id: string
          campaign_name: string
          clicks: number
          conversions: number | null
          cost_per_conversion: number | null
          cpc: number | null
          cpm: number | null
          created_at: string | null
          ctr: number | null
          date: string
          id: string
          impressions: number
          raw_actions: Json | null
          spend: number
        }
        Insert: {
          ad_account_id: string
          ad_account_name: string
          adset_id?: string | null
          adset_name?: string | null
          campaign_id: string
          campaign_name: string
          clicks: number
          conversions?: number | null
          cost_per_conversion?: number | null
          cpc?: number | null
          cpm?: number | null
          created_at?: string | null
          ctr?: number | null
          date: string
          id?: string
          impressions: number
          raw_actions?: Json | null
          spend: number
        }
        Update: {
          ad_account_id?: string
          ad_account_name?: string
          adset_id?: string | null
          adset_name?: string | null
          campaign_id?: string
          campaign_name?: string
          clicks?: number
          conversions?: number | null
          cost_per_conversion?: number | null
          cpc?: number | null
          cpm?: number | null
          created_at?: string | null
          ctr?: number | null
          date?: string
          id?: string
          impressions?: number
          raw_actions?: Json | null
          spend?: number
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
      organization_bank_mcp: {
        Row: {
          api_key: string
          created_at: string | null
          endpoint_base: string
          install_id: string
          organization_id: string
          status: string
          updated_at: string | null
          validated_at: string | null
        }
        Insert: {
          api_key: string
          created_at?: string | null
          endpoint_base?: string
          install_id: string
          organization_id: string
          status?: string
          updated_at?: string | null
          validated_at?: string | null
        }
        Update: {
          api_key?: string
          created_at?: string | null
          endpoint_base?: string
          install_id?: string
          organization_id?: string
          status?: string
          updated_at?: string | null
          validated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "organization_bank_mcp_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: true
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      organization_members: {
        Row: {
          can_delete_transactions: boolean | null
          can_reopen_financial_checkpoints: boolean
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
          can_reopen_financial_checkpoints?: boolean
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
          can_reopen_financial_checkpoints?: boolean
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
      organization_modules: {
        Row: {
          enabled_at: string
          enabled_by: string | null
          module_key: string
          organization_id: string
        }
        Insert: {
          enabled_at?: string
          enabled_by?: string | null
          module_key: string
          organization_id: string
        }
        Update: {
          enabled_at?: string
          enabled_by?: string | null
          module_key?: string
          organization_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "organization_modules_organization_id_fkey"
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
          motivo_suspensao: string | null
          name: string
          owner_id: string
          radar_notification_day: number | null
          radar_notification_time: string | null
          radar_notification_webhook: string | null
          suspensa_em: string | null
          webhook_url: string | null
        }
        Insert: {
          approval_webhook_url?: string | null
          created_at?: string | null
          id?: string
          logo_url?: string | null
          motivo_suspensao?: string | null
          name: string
          owner_id: string
          radar_notification_day?: number | null
          radar_notification_time?: string | null
          radar_notification_webhook?: string | null
          suspensa_em?: string | null
          webhook_url?: string | null
        }
        Update: {
          approval_webhook_url?: string | null
          created_at?: string | null
          id?: string
          logo_url?: string | null
          motivo_suspensao?: string | null
          name?: string
          owner_id?: string
          radar_notification_day?: number | null
          radar_notification_time?: string | null
          radar_notification_webhook?: string | null
          suspensa_em?: string | null
          webhook_url?: string | null
        }
        Relationships: []
      }
      oxpi_safe_box_cash_syncs: {
        Row: {
          account_payable_id: string | null
          amount: number
          bank_account_id: string | null
          caixa_ids: number[]
          created_at: string
          error_message: string | null
          id: string
          organization_id: string
          raw_summary: Json
          reference_date: string
          status: string
          synced_at: string
          total_received: number
          unit_id: string
          updated_at: string
        }
        Insert: {
          account_payable_id?: string | null
          amount?: number
          bank_account_id?: string | null
          caixa_ids?: number[]
          created_at?: string
          error_message?: string | null
          id?: string
          organization_id: string
          raw_summary?: Json
          reference_date: string
          status?: string
          synced_at?: string
          total_received?: number
          unit_id: string
          updated_at?: string
        }
        Update: {
          account_payable_id?: string | null
          amount?: number
          bank_account_id?: string | null
          caixa_ids?: number[]
          created_at?: string
          error_message?: string | null
          id?: string
          organization_id?: string
          raw_summary?: Json
          reference_date?: string
          status?: string
          synced_at?: string
          total_received?: number
          unit_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "oxpi_safe_box_cash_syncs_account_payable_id_fkey"
            columns: ["account_payable_id"]
            isOneToOne: false
            referencedRelation: "accounts_payable"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "oxpi_safe_box_cash_syncs_bank_account_id_fkey"
            columns: ["bank_account_id"]
            isOneToOne: false
            referencedRelation: "bank_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "oxpi_safe_box_cash_syncs_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "oxpi_safe_box_cash_syncs_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "units"
            referencedColumns: ["id"]
          },
        ]
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
      people_dedup_20260930: {
        Row: {
          address: string | null
          created_at: string | null
          document: string | null
          email: string | null
          keeper_id: string | null
          name: string | null
          organization_id: string | null
          phone: string | null
          removed_id: string | null
          type: string | null
          unit_id: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string | null
          document?: string | null
          email?: string | null
          keeper_id?: string | null
          name?: string | null
          organization_id?: string | null
          phone?: string | null
          removed_id?: string | null
          type?: string | null
          unit_id?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string | null
          document?: string | null
          email?: string | null
          keeper_id?: string | null
          name?: string | null
          organization_id?: string | null
          phone?: string | null
          removed_id?: string | null
          type?: string | null
          unit_id?: string | null
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
      plr_blocking_account_rules: {
        Row: {
          chart_of_account_id: number
          created_at: string
          enabled: boolean
          id: string
          organization_id: string
          unit_id: string | null
          updated_at: string
        }
        Insert: {
          chart_of_account_id: number
          created_at?: string
          enabled?: boolean
          id?: string
          organization_id: string
          unit_id?: string | null
          updated_at?: string
        }
        Update: {
          chart_of_account_id?: number
          created_at?: string
          enabled?: boolean
          id?: string
          organization_id?: string
          unit_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "plr_blocking_account_rules_chart_of_account_id_fkey"
            columns: ["chart_of_account_id"]
            isOneToOne: false
            referencedRelation: "chart_of_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "plr_blocking_account_rules_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "plr_blocking_account_rules_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "units"
            referencedColumns: ["id"]
          },
        ]
      }
      plr_monthly_snapshots: {
        Row: {
          blockers: Json
          closing_id: string | null
          created_at: string
          created_by: string | null
          deadline: string
          id: string
          month: number
          net_profit: number | null
          operating_profit: number | null
          organization_id: string
          plr_adjustment: number | null
          plr_base: number | null
          plr_eligible_applications: number | null
          profile_id: string | null
          reward_amount: number
          snapshot_data: Json
          status: string
          unit_id: string
          updated_at: string
          year: number
        }
        Insert: {
          blockers?: Json
          closing_id?: string | null
          created_at?: string
          created_by?: string | null
          deadline: string
          id?: string
          month: number
          net_profit?: number | null
          operating_profit?: number | null
          organization_id: string
          plr_adjustment?: number | null
          plr_base?: number | null
          plr_eligible_applications?: number | null
          profile_id?: string | null
          reward_amount?: number
          snapshot_data?: Json
          status: string
          unit_id: string
          updated_at?: string
          year: number
        }
        Update: {
          blockers?: Json
          closing_id?: string | null
          created_at?: string
          created_by?: string | null
          deadline?: string
          id?: string
          month?: number
          net_profit?: number | null
          operating_profit?: number | null
          organization_id?: string
          plr_adjustment?: number | null
          plr_base?: number | null
          plr_eligible_applications?: number | null
          profile_id?: string | null
          reward_amount?: number
          snapshot_data?: Json
          status?: string
          unit_id?: string
          updated_at?: string
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "plr_monthly_snapshots_closing_id_fkey"
            columns: ["closing_id"]
            isOneToOne: false
            referencedRelation: "financial_closings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "plr_monthly_snapshots_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "plr_monthly_snapshots_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "plr_reward_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "plr_monthly_snapshots_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "units"
            referencedColumns: ["id"]
          },
        ]
      }
      plr_reward_profiles: {
        Row: {
          base_reward: number
          created_at: string
          enabled: boolean
          id: string
          is_default: boolean
          max_profit: number | null
          max_reward: number
          min_profit: number
          name: string
          organization_id: string
          step_profit: number
          step_reward: number
          updated_at: string
        }
        Insert: {
          base_reward?: number
          created_at?: string
          enabled?: boolean
          id?: string
          is_default?: boolean
          max_profit?: number | null
          max_reward?: number
          min_profit?: number
          name: string
          organization_id: string
          step_profit?: number
          step_reward?: number
          updated_at?: string
        }
        Update: {
          base_reward?: number
          created_at?: string
          enabled?: boolean
          id?: string
          is_default?: boolean
          max_profit?: number | null
          max_reward?: number
          min_profit?: number
          name?: string
          organization_id?: string
          step_profit?: number
          step_reward?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "plr_reward_profiles_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      plr_unit_profile_assignments: {
        Row: {
          created_at: string
          effective_from: string
          effective_to: string | null
          id: string
          organization_id: string
          profile_id: string
          unit_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          effective_from: string
          effective_to?: string | null
          id?: string
          organization_id: string
          profile_id: string
          unit_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          effective_from?: string
          effective_to?: string | null
          id?: string
          organization_id?: string
          profile_id?: string
          unit_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "plr_unit_profile_assignments_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "plr_unit_profile_assignments_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "plr_reward_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "plr_unit_profile_assignments_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "units"
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
      promocoes_canal: {
        Row: {
          ativo: boolean | null
          criado_em: string | null
          data_fim: string
          data_inicio: string
          data_postagem: string | null
          descricao: string
          id: number
          marca: string
          posted_at: string | null
          tipo_periodo: string | null
          titulo: string
        }
        Insert: {
          ativo?: boolean | null
          criado_em?: string | null
          data_fim: string
          data_inicio: string
          data_postagem?: string | null
          descricao: string
          id?: number
          marca: string
          posted_at?: string | null
          tipo_periodo?: string | null
          titulo: string
        }
        Update: {
          ativo?: boolean | null
          criado_em?: string | null
          data_fim?: string
          data_inicio?: string
          data_postagem?: string | null
          descricao?: string
          id?: number
          marca?: string
          posted_at?: string | null
          tipo_periodo?: string | null
          titulo?: string
        }
        Relationships: []
      }
      rename_plr_backup_2026_09: {
        Row: {
          campo: string
          criado_em: string
          origem: string
          registro_id: string
          valor_anterior: string | null
        }
        Insert: {
          campo: string
          criado_em?: string
          origem: string
          registro_id: string
          valor_anterior?: string | null
        }
        Update: {
          campo?: string
          criado_em?: string
          origem?: string
          registro_id?: string
          valor_anterior?: string | null
        }
        Relationships: []
      }
      ria_clientes: {
        Row: {
          atualizado_em: string | null
          cancelado_em: string | null
          chatwoot_account_id: number | null
          cidade: string | null
          criado_em: string | null
          email: string | null
          id: string
          lead_id: string | null
          metadata: Json | null
          nome: string | null
          nome_motel: string | null
          onboarding_status: string | null
          status: string | null
          stripe_customer_id: string | null
          stripe_session_id: string | null
          stripe_subscription_id: string | null
          telefone: string | null
          valor_total_centavos: number | null
          whatsapp_numero: string | null
        }
        Insert: {
          atualizado_em?: string | null
          cancelado_em?: string | null
          chatwoot_account_id?: number | null
          cidade?: string | null
          criado_em?: string | null
          email?: string | null
          id?: string
          lead_id?: string | null
          metadata?: Json | null
          nome?: string | null
          nome_motel?: string | null
          onboarding_status?: string | null
          status?: string | null
          stripe_customer_id?: string | null
          stripe_session_id?: string | null
          stripe_subscription_id?: string | null
          telefone?: string | null
          valor_total_centavos?: number | null
          whatsapp_numero?: string | null
        }
        Update: {
          atualizado_em?: string | null
          cancelado_em?: string | null
          chatwoot_account_id?: number | null
          cidade?: string | null
          criado_em?: string | null
          email?: string | null
          id?: string
          lead_id?: string | null
          metadata?: Json | null
          nome?: string | null
          nome_motel?: string | null
          onboarding_status?: string | null
          status?: string | null
          stripe_customer_id?: string | null
          stripe_session_id?: string | null
          stripe_subscription_id?: string | null
          telefone?: string | null
          valor_total_centavos?: number | null
          whatsapp_numero?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "clientes_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "ria_leads"
            referencedColumns: ["id"]
          },
        ]
      }
      ria_cobrancas_pix: {
        Row: {
          atualizado_em: string | null
          cidade_motel: string | null
          cliente_id: string | null
          cpf_cnpj: string | null
          criado_em: string | null
          email: string | null
          expira_em: string | null
          id: string
          inter_unidade: number
          lead_id: string | null
          nome: string | null
          nome_motel: string | null
          pago_em: string | null
          pix_copia_cola: string
          pix_location: string | null
          raw_response: Json | null
          status: string
          telefone: string | null
          txid: string
          valor_centavos: number
        }
        Insert: {
          atualizado_em?: string | null
          cidade_motel?: string | null
          cliente_id?: string | null
          cpf_cnpj?: string | null
          criado_em?: string | null
          email?: string | null
          expira_em?: string | null
          id?: string
          inter_unidade?: number
          lead_id?: string | null
          nome?: string | null
          nome_motel?: string | null
          pago_em?: string | null
          pix_copia_cola: string
          pix_location?: string | null
          raw_response?: Json | null
          status?: string
          telefone?: string | null
          txid: string
          valor_centavos: number
        }
        Update: {
          atualizado_em?: string | null
          cidade_motel?: string | null
          cliente_id?: string | null
          cpf_cnpj?: string | null
          criado_em?: string | null
          email?: string | null
          expira_em?: string | null
          id?: string
          inter_unidade?: number
          lead_id?: string | null
          nome?: string | null
          nome_motel?: string | null
          pago_em?: string | null
          pix_copia_cola?: string
          pix_location?: string | null
          raw_response?: Json | null
          status?: string
          telefone?: string | null
          txid?: string
          valor_centavos?: number
        }
        Relationships: [
          {
            foreignKeyName: "cobrancas_pix_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "ria_clientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cobrancas_pix_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "ria_leads"
            referencedColumns: ["id"]
          },
        ]
      }
      ria_instancias_chatwoot: {
        Row: {
          ativado_em: string | null
          chatwoot_account_id: number | null
          chatwoot_inbox_id: number | null
          cliente_id: string | null
          criado_em: string | null
          evolution_instance_name: string | null
          id: string
          observacoes: string | null
          status: string | null
          whatsapp_numero: string | null
        }
        Insert: {
          ativado_em?: string | null
          chatwoot_account_id?: number | null
          chatwoot_inbox_id?: number | null
          cliente_id?: string | null
          criado_em?: string | null
          evolution_instance_name?: string | null
          id?: string
          observacoes?: string | null
          status?: string | null
          whatsapp_numero?: string | null
        }
        Update: {
          ativado_em?: string | null
          chatwoot_account_id?: number | null
          chatwoot_inbox_id?: number | null
          cliente_id?: string | null
          criado_em?: string | null
          evolution_instance_name?: string | null
          id?: string
          observacoes?: string | null
          status?: string | null
          whatsapp_numero?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "instancias_chatwoot_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "ria_clientes"
            referencedColumns: ["id"]
          },
        ]
      }
      ria_leads: {
        Row: {
          atualizado_em: string | null
          cidade: string | null
          criado_em: string | null
          email: string | null
          id: string
          nome: string | null
          nome_motel: string | null
          notas: string | null
          origem: string | null
          qtd_suites: number | null
          status: string | null
          telefone: string | null
        }
        Insert: {
          atualizado_em?: string | null
          cidade?: string | null
          criado_em?: string | null
          email?: string | null
          id?: string
          nome?: string | null
          nome_motel?: string | null
          notas?: string | null
          origem?: string | null
          qtd_suites?: number | null
          status?: string | null
          telefone?: string | null
        }
        Update: {
          atualizado_em?: string | null
          cidade?: string | null
          criado_em?: string | null
          email?: string | null
          id?: string
          nome?: string | null
          nome_motel?: string | null
          notas?: string | null
          origem?: string | null
          qtd_suites?: number | null
          status?: string | null
          telefone?: string | null
        }
        Relationships: []
      }
      ria_pagamentos: {
        Row: {
          cliente_id: string | null
          criado_em: string | null
          id: string
          status: string | null
          stripe_customer_id: string | null
          stripe_invoice_id: string | null
          valor_centavos: number | null
        }
        Insert: {
          cliente_id?: string | null
          criado_em?: string | null
          id?: string
          status?: string | null
          stripe_customer_id?: string | null
          stripe_invoice_id?: string | null
          valor_centavos?: number | null
        }
        Update: {
          cliente_id?: string | null
          criado_em?: string | null
          id?: string
          status?: string | null
          stripe_customer_id?: string | null
          stripe_invoice_id?: string | null
          valor_centavos?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "pagamentos_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "ria_clientes"
            referencedColumns: ["id"]
          },
        ]
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
      safe_box_transfers: {
        Row: {
          amount: number
          created_at: string | null
          destination_bank_id: string | null
          destination_chart_of_account_id: number | null
          id: string
          manager_id: string
          notes: string | null
          organization_id: string
          photo_url: string | null
          receiver_id: string
          receiver_signature_url: string | null
          sender_id: string | null
          transfer_date: string
          unit_id: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          destination_bank_id?: string | null
          destination_chart_of_account_id?: number | null
          id?: string
          manager_id: string
          notes?: string | null
          organization_id: string
          photo_url?: string | null
          receiver_id: string
          receiver_signature_url?: string | null
          sender_id?: string | null
          transfer_date: string
          unit_id: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          destination_bank_id?: string | null
          destination_chart_of_account_id?: number | null
          id?: string
          manager_id?: string
          notes?: string | null
          organization_id?: string
          photo_url?: string | null
          receiver_id?: string
          receiver_signature_url?: string | null
          sender_id?: string | null
          transfer_date?: string
          unit_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "safe_box_transfers_destination_bank_id_fkey"
            columns: ["destination_bank_id"]
            isOneToOne: false
            referencedRelation: "bank_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "safe_box_transfers_destination_chart_of_account_id_fkey"
            columns: ["destination_chart_of_account_id"]
            isOneToOne: false
            referencedRelation: "chart_of_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "safe_box_transfers_manager_id_fkey"
            columns: ["manager_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "safe_box_transfers_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "safe_box_transfers_receiver_id_fkey"
            columns: ["receiver_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "safe_box_transfers_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "safe_box_transfers_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "units"
            referencedColumns: ["id"]
          },
        ]
      }
      sorteios_canal: {
        Row: {
          ativo: boolean | null
          criado_em: string | null
          data_encerramento: string
          data_postagem: string
          descricao: string
          id: number
          link_formulario: string
          posted_at: string | null
          premio: string
        }
        Insert: {
          ativo?: boolean | null
          criado_em?: string | null
          data_encerramento: string
          data_postagem: string
          descricao: string
          id?: number
          link_formulario: string
          posted_at?: string | null
          premio: string
        }
        Update: {
          ativo?: boolean | null
          criado_em?: string | null
          data_encerramento?: string
          data_postagem?: string
          descricao?: string
          id?: number
          link_formulario?: string
          posted_at?: string | null
          premio?: string
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
      system_audit_log: {
        Row: {
          acao: string
          actor: string | null
          antes: Json | null
          at: string
          depois: Json | null
          id: number
          organization_id: string | null
        }
        Insert: {
          acao: string
          actor?: string | null
          antes?: Json | null
          at?: string
          depois?: Json | null
          id?: never
          organization_id?: string | null
        }
        Update: {
          acao?: string
          actor?: string | null
          antes?: Json | null
          at?: string
          depois?: Json | null
          id?: never
          organization_id?: string | null
        }
        Relationships: []
      }
      system_settings: {
        Row: {
          chave_pix: string
          id: boolean
          pix_cidade: string
          recebedor_cnpj: string | null
          recebedor_nome: string
          updated_at: string
          whatsapp_admin: string | null
        }
        Insert: {
          chave_pix: string
          id?: boolean
          pix_cidade?: string
          recebedor_cnpj?: string | null
          recebedor_nome: string
          updated_at?: string
          whatsapp_admin?: string | null
        }
        Update: {
          chave_pix?: string
          id?: boolean
          pix_cidade?: string
          recebedor_cnpj?: string | null
          recebedor_nome?: string
          updated_at?: string
          whatsapp_admin?: string | null
        }
        Relationships: []
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
          revisar: boolean
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
          revisar?: boolean
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
          revisar?: boolean
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
      unit_card_machines: {
        Row: {
          acquirer: string
          cnpj: string
          created_at: string
          establishment_code: string | null
          id: string
          is_active: boolean
          nickname: string | null
          organization_id: string
          unit_id: string
          updated_at: string
        }
        Insert: {
          acquirer: string
          cnpj: string
          created_at?: string
          establishment_code?: string | null
          id?: string
          is_active?: boolean
          nickname?: string | null
          organization_id: string
          unit_id: string
          updated_at?: string
        }
        Update: {
          acquirer?: string
          cnpj?: string
          created_at?: string
          establishment_code?: string | null
          id?: string
          is_active?: boolean
          nickname?: string | null
          organization_id?: string
          unit_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "unit_card_machines_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "unit_card_machines_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "units"
            referencedColumns: ["id"]
          },
        ]
      }
      unit_closing_checkpoints: {
        Row: {
          checkpoint_date: string
          created_at: string
          created_by: string | null
          id: string
          unit_id: string
        }
        Insert: {
          checkpoint_date: string
          created_at?: string
          created_by?: string | null
          id?: string
          unit_id: string
        }
        Update: {
          checkpoint_date?: string
          created_at?: string
          created_by?: string | null
          id?: string
          unit_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "unit_closing_checkpoints_unit_id_fkey"
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
          consumption_goal: number | null
          consumption_realized: number | null
          created_at: string | null
          created_by: string | null
          efficiency_goal_extraordinary_pct: number | null
          efficiency_goal_high_pct: number | null
          efficiency_goal_normal_pct: number | null
          efficiency_goal_pct: number | null
          expense_goal: number | null
          id: string
          month: string
          occupancy_goal: number | null
          occupancy_realized: number | null
          rev_par: number | null
          sales_goal: number | null
          sales_realized: number | null
          taxa_ocupacao: number | null
          ticket_medio: number | null
          unit_id: string
          updated_at: string | null
        }
        Insert: {
          consumption_goal?: number | null
          consumption_realized?: number | null
          created_at?: string | null
          created_by?: string | null
          efficiency_goal_extraordinary_pct?: number | null
          efficiency_goal_high_pct?: number | null
          efficiency_goal_normal_pct?: number | null
          efficiency_goal_pct?: number | null
          expense_goal?: number | null
          id?: string
          month: string
          occupancy_goal?: number | null
          occupancy_realized?: number | null
          rev_par?: number | null
          sales_goal?: number | null
          sales_realized?: number | null
          taxa_ocupacao?: number | null
          ticket_medio?: number | null
          unit_id: string
          updated_at?: string | null
        }
        Update: {
          consumption_goal?: number | null
          consumption_realized?: number | null
          created_at?: string | null
          created_by?: string | null
          efficiency_goal_extraordinary_pct?: number | null
          efficiency_goal_high_pct?: number | null
          efficiency_goal_normal_pct?: number | null
          efficiency_goal_pct?: number | null
          expense_goal?: number | null
          id?: string
          month?: string
          occupancy_goal?: number | null
          occupancy_realized?: number | null
          rev_par?: number | null
          sales_goal?: number | null
          sales_realized?: number | null
          taxa_ocupacao?: number | null
          ticket_medio?: number | null
          unit_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "unit_rankings_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "unit_rankings_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "units"
            referencedColumns: ["id"]
          },
        ]
      }
      unit_rankings_history: {
        Row: {
          changed_at: string | null
          changed_by: string | null
          changed_fields: string[] | null
          consumption_goal: number | null
          consumption_realized: number | null
          efficiency_goal_extraordinary_pct: number | null
          efficiency_goal_high_pct: number | null
          efficiency_goal_normal_pct: number | null
          efficiency_goal_pct: number | null
          expense_goal: number | null
          history_id: string
          month: string
          occupancy_goal: number | null
          occupancy_realized: number | null
          operation: string | null
          ranking_id: string
          rev_par: number | null
          sales_goal: number | null
          sales_realized: number | null
          taxa_ocupacao: number | null
          ticket_medio: number | null
          unit_id: string
        }
        Insert: {
          changed_at?: string | null
          changed_by?: string | null
          changed_fields?: string[] | null
          consumption_goal?: number | null
          consumption_realized?: number | null
          efficiency_goal_extraordinary_pct?: number | null
          efficiency_goal_high_pct?: number | null
          efficiency_goal_normal_pct?: number | null
          efficiency_goal_pct?: number | null
          expense_goal?: number | null
          history_id?: string
          month: string
          occupancy_goal?: number | null
          occupancy_realized?: number | null
          operation?: string | null
          ranking_id: string
          rev_par?: number | null
          sales_goal?: number | null
          sales_realized?: number | null
          taxa_ocupacao?: number | null
          ticket_medio?: number | null
          unit_id: string
        }
        Update: {
          changed_at?: string | null
          changed_by?: string | null
          changed_fields?: string[] | null
          consumption_goal?: number | null
          consumption_realized?: number | null
          efficiency_goal_extraordinary_pct?: number | null
          efficiency_goal_high_pct?: number | null
          efficiency_goal_normal_pct?: number | null
          efficiency_goal_pct?: number | null
          expense_goal?: number | null
          history_id?: string
          month?: string
          occupancy_goal?: number | null
          occupancy_realized?: number | null
          operation?: string | null
          ranking_id?: string
          rev_par?: number | null
          sales_goal?: number | null
          sales_realized?: number | null
          taxa_ocupacao?: number | null
          ticket_medio?: number | null
          unit_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_history_unit"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "units"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "unit_rankings_history_changed_by_fkey"
            columns: ["changed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      units: {
        Row: {
          address: string | null
          audio_fechamento_enabled: boolean
          audio_previa_dia_semana: number
          audio_previa_frequencia: string
          audio_previa_hora: number
          coordenadora_nome: string | null
          coordenadora_telefone: string | null
          created_at: string | null
          daily_report_enabled: boolean
          daily_report_time: string
          daily_report_webhook: string | null
          distribution_webhook_url: string | null
          enable_payment_conference: boolean | null
          gestora_nome: string | null
          gestora_telefone: string | null
          id: string
          inaudit_audio_report_enabled: boolean
          inaudit_unit_ref: string | null
          last_radar_notification_sent_at: string | null
          leader_id: string | null
          leader_whatsapp: string | null
          name: string
          organization_id: string
          plugplay_id: string | null
          plugplay_token: string | null
          radar_notification_day: number | null
          radar_notification_time: string | null
          radar_notification_webhook: string | null
        }
        Insert: {
          address?: string | null
          audio_fechamento_enabled?: boolean
          audio_previa_dia_semana?: number
          audio_previa_frequencia?: string
          audio_previa_hora?: number
          coordenadora_nome?: string | null
          coordenadora_telefone?: string | null
          created_at?: string | null
          daily_report_enabled?: boolean
          daily_report_time?: string
          daily_report_webhook?: string | null
          distribution_webhook_url?: string | null
          enable_payment_conference?: boolean | null
          gestora_nome?: string | null
          gestora_telefone?: string | null
          id?: string
          inaudit_audio_report_enabled?: boolean
          inaudit_unit_ref?: string | null
          last_radar_notification_sent_at?: string | null
          leader_id?: string | null
          leader_whatsapp?: string | null
          name: string
          organization_id: string
          plugplay_id?: string | null
          plugplay_token?: string | null
          radar_notification_day?: number | null
          radar_notification_time?: string | null
          radar_notification_webhook?: string | null
        }
        Update: {
          address?: string | null
          audio_fechamento_enabled?: boolean
          audio_previa_dia_semana?: number
          audio_previa_frequencia?: string
          audio_previa_hora?: number
          coordenadora_nome?: string | null
          coordenadora_telefone?: string | null
          created_at?: string | null
          daily_report_enabled?: boolean
          daily_report_time?: string
          daily_report_webhook?: string | null
          distribution_webhook_url?: string | null
          enable_payment_conference?: boolean | null
          gestora_nome?: string | null
          gestora_telefone?: string | null
          id?: string
          inaudit_audio_report_enabled?: boolean
          inaudit_unit_ref?: string | null
          last_radar_notification_sent_at?: string | null
          leader_id?: string | null
          leader_whatsapp?: string | null
          name?: string
          organization_id?: string
          plugplay_id?: string | null
          plugplay_token?: string | null
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
      usage_agreement_acks: {
        Row: {
          acked_at: string
          agreement_id: string
          id: string
          user_id: string
          version: number
        }
        Insert: {
          acked_at?: string
          agreement_id: string
          id?: string
          user_id: string
          version: number
        }
        Update: {
          acked_at?: string
          agreement_id?: string
          id?: string
          user_id?: string
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "usage_agreement_acks_agreement_id_fkey"
            columns: ["agreement_id"]
            isOneToOne: false
            referencedRelation: "usage_agreements"
            referencedColumns: ["id"]
          },
        ]
      }
      usage_agreement_overrides: {
        Row: {
          accounts_payable_id: string | null
          agreement_id: string | null
          context: Json
          created_at: string
          detector_key: string
          id: string
          justification: string
          organization_id: string
          user_id: string
        }
        Insert: {
          accounts_payable_id?: string | null
          agreement_id?: string | null
          context?: Json
          created_at?: string
          detector_key: string
          id?: string
          justification: string
          organization_id: string
          user_id: string
        }
        Update: {
          accounts_payable_id?: string | null
          agreement_id?: string | null
          context?: Json
          created_at?: string
          detector_key?: string
          id?: string
          justification?: string
          organization_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "usage_agreement_overrides_accounts_payable_id_fkey"
            columns: ["accounts_payable_id"]
            isOneToOne: false
            referencedRelation: "accounts_payable"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "usage_agreement_overrides_agreement_id_fkey"
            columns: ["agreement_id"]
            isOneToOne: false
            referencedRelation: "usage_agreements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "usage_agreement_overrides_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      usage_agreement_versions: {
        Row: {
          agreement_id: string
          body: string
          created_at: string
          created_by: string | null
          id: string
          version: number
        }
        Insert: {
          agreement_id: string
          body: string
          created_at?: string
          created_by?: string | null
          id?: string
          version: number
        }
        Update: {
          agreement_id?: string
          body?: string
          created_at?: string
          created_by?: string | null
          id?: string
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "usage_agreement_versions_agreement_id_fkey"
            columns: ["agreement_id"]
            isOneToOne: false
            referencedRelation: "usage_agreements"
            referencedColumns: ["id"]
          },
        ]
      }
      usage_agreements: {
        Row: {
          closed_at: string | null
          closed_by: string | null
          context_route: string | null
          created_at: string
          created_by: string | null
          current_version: number
          detector_key: string | null
          id: string
          organization_id: string
          outcome: string | null
          outcome_note: string | null
          status: string
          target_user_ids: string[] | null
          title: string
          updated_at: string
        }
        Insert: {
          closed_at?: string | null
          closed_by?: string | null
          context_route?: string | null
          created_at?: string
          created_by?: string | null
          current_version?: number
          detector_key?: string | null
          id?: string
          organization_id: string
          outcome?: string | null
          outcome_note?: string | null
          status?: string
          target_user_ids?: string[] | null
          title: string
          updated_at?: string
        }
        Update: {
          closed_at?: string | null
          closed_by?: string | null
          context_route?: string | null
          created_at?: string
          created_by?: string | null
          current_version?: number
          detector_key?: string | null
          id?: string
          organization_id?: string
          outcome?: string | null
          outcome_note?: string | null
          status?: string
          target_user_ids?: string[] | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "usage_agreements_organization_id_fkey"
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
      vendas_oxpi: {
        Row: {
          caixa_id: number | null
          data: string
          forma_oxpi: string
          forma_pagamento: string
          id: number
          operador: string | null
          organization_id: string
          oxpi_ref: string
          synced_at: string
          unit_id: string
          valor: number
        }
        Insert: {
          caixa_id?: number | null
          data: string
          forma_oxpi: string
          forma_pagamento: string
          id?: never
          operador?: string | null
          organization_id: string
          oxpi_ref: string
          synced_at?: string
          unit_id: string
          valor: number
        }
        Update: {
          caixa_id?: number | null
          data?: string
          forma_oxpi?: string
          forma_pagamento?: string
          id?: never
          operador?: string | null
          organization_id?: string
          oxpi_ref?: string
          synced_at?: string
          unit_id?: string
          valor?: number
        }
        Relationships: [
          {
            foreignKeyName: "vendas_oxpi_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendas_oxpi_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "units"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      v_blackbelt_atraso_lancamento: {
        Row: {
          avaliado_ate: string | null
          dias_avaliados: number | null
          dias_em_atraso: number | null
          month: number | null
          pior_atraso_no_mes: number | null
          pior_conta: string | null
          unit_id: string | null
          unit_name: string | null
          year: number | null
        }
        Relationships: [
          {
            foreignKeyName: "bank_accounts_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "units"
            referencedColumns: ["id"]
          },
        ]
      }
      v_painel_caixa: {
        Row: {
          dias_atras: number | null
          ultimo_caixa: string | null
          unit_name: string | null
        }
        Relationships: []
      }
      v_painel_metas_vendas: {
        Row: {
          mes_ref: string | null
          sales_goal: number | null
          sales_realized: number | null
          unit_name: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      _dre_month_summary: {
        Args: { p_month: number; p_org: string; p_unit: string; p_year: number }
        Returns: Json
      }
      accept_invitation: {
        Args: { p_invitation_id: string; p_user_id: string }
        Returns: Json
      }
      ack_usage_agreement: {
        Args: { p_agreement_id: string }
        Returns: undefined
      }
      approve_expense_allocation_item: {
        Args: { p_item_id: string }
        Returns: string
      }
      atlas_find_similar_mappings: {
        Args: {
          p_description: string
          p_limit?: number
          p_organization_id: string
        }
        Returns: {
          chart_of_account_code: string
          chart_of_account_id: number
          chart_of_account_name: string
          description_normalized: string
          frequency: number
          is_manual_override: boolean
          similarity_score: number
          source: string
        }[]
      }
      atlas_get_learned_stats: {
        Args: { p_organization_id: string }
        Returns: {
          category_code: number
          category_name: string
          last_learned_at: string
          manual_overrides: number
          mappings_count: number
        }[]
      }
      atlas_get_pending_corrections: {
        Args: { p_limit?: number; p_organization_id: string }
        Returns: {
          actual_chart_code: string
          actual_chart_id: number
          actual_chart_name: string
          amount: number
          description: string
          issue_date: string
          suggested_chart_code: string
          suggested_chart_id: number
          suggested_chart_name: string
          transaction_id: number
          unit_name: string
        }[]
      }
      atlas_get_suggestion: {
        Args: {
          p_description: string
          p_organization_id: string
          p_person_id?: string
        }
        Returns: {
          chart_of_account_id: number
          confidence_score: number
          source: string
        }[]
      }
      atlas_learn_from_closure: {
        Args: { p_month?: number; p_organization_id: string; p_year?: number }
        Returns: Json
      }
      atlas_operational_target_code: {
        Args: { p_description: string }
        Returns: string
      }
      atlas_save_correction: {
        Args: {
          p_correct_chart_id: number
          p_description: string
          p_organization_id: string
          p_wrong_chart_id: number
        }
        Returns: Json
      }
      atlas_train_from_closures: {
        Args: { p_organization_id: string }
        Returns: undefined
      }
      audio_digest_por_token: { Args: { p_token: string }; Returns: Json }
      autenticar_usuario: {
        Args: { email_login: string; senha_login: string }
        Returns: string
      }
      blackbelt_check_ritualistica_penalty: {
        Args: { p_month: number; p_unit_id: string; p_year: number }
        Returns: Json
      }
      blackbelt_check_weekly_update_penalty: {
        Args: { p_month: number; p_unit_id: string; p_year: number }
        Returns: Json
      }
      caixa_cofre_pendencias: {
        Args: { p_dias?: number; p_organization_id: string }
        Returns: {
          dia: string
          motivo: string
          unidade: string
        }[]
      }
      calculate_plr_reward: {
        Args: {
          p_base_reward: number
          p_max_reward: number
          p_min_profit: number
          p_profit: number
          p_step_profit: number
          p_step_reward: number
        }
        Returns: number
      }
      calculate_proposed_dre_metrics: {
        Args: {
          p_month: number
          p_organization_id: string
          p_unit_id: string
          p_year: number
        }
        Returns: {
          eligible_applications: number
          operating_profit: number
          plr_adjustment: number
          plr_base: number
        }[]
      }
      can_access_expense_allocation_unit: {
        Args: { p_organization_id: string; p_unit_id: string }
        Returns: boolean
      }
      cash_flow_account_visible:
        | {
            Args: {
              p_bank_account_id: string
              p_organization_id: string
              p_reference_date: string
            }
            Returns: boolean
          }
        | {
            Args: {
              p_bank_account_id: string
              p_organization_id: string
              p_reference_date: string
              p_unit_id: string
            }
            Returns: boolean
          }
      check_phantom_allocation: {
        Args: {
          p_amount: number
          p_due_date: string
          p_organization_id?: string
          p_person_id: string
          p_unit_id: string
        }
        Returns: {
          amount: number
          created_by_name: string
          description: string
          due_date: string
          id: string
          unit_id: string
          unit_name: string
        }[]
      }
      check_user_unit_access: {
        Args: { check_unit_id: string }
        Returns: boolean
      }
      clone_organization_settings: {
        Args: { p_source: string; p_target: string }
        Returns: undefined
      }
      close_usage_agreement: {
        Args: { p_agreement_id: string; p_note?: string; p_outcome: string }
        Returns: undefined
      }
      closing_audio_contas_abertas: {
        Args: { p_mes_ref: string; p_org: string; p_unit: string }
        Returns: Json
      }
      closing_audio_destinatarios: {
        Args: { p_tipo?: string; p_unit: string }
        Returns: {
          nome: string
          papel: string
          telefone: string
        }[]
      }
      closing_audio_reservar_passo: {
        Args: { p_id: string; p_minutos?: number }
        Returns: boolean
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
      create_client_organization: {
        Args: { p_name: string; p_source_organization_id?: string }
        Returns: string
      }
      create_expense_allocation: {
        Args: {
          p_chart_of_account_id: number
          p_description: string
          p_document_number: string
          p_due_date: string
          p_issue_date: string
          p_items: Json
          p_person_id: string
          p_total_amount: number
        }
        Returns: string
      }
      create_usage_agreement: {
        Args: {
          p_body: string
          p_context_route?: string
          p_detector_key?: string
          p_organization_id?: string
          p_target_user_ids?: string[]
          p_title: string
        }
        Returns: string
      }
      dre_ai_comparativo: {
        Args: { p_mes_ref: string; p_org: string; p_unit_ids: string[] }
        Returns: Json
      }
      dre_ai_context: {
        Args: { p_mes_ref: string; p_org: string }
        Returns: Json
      }
      dre_ai_lancamentos: {
        Args: {
          p_codes: string[]
          p_incluir_mes_anterior?: boolean
          p_mes_ref: string
          p_org: string
          p_unit: string
        }
        Returns: Json
      }
      dre_ai_medias: {
        Args: { p_mes_ref: string; p_org: string }
        Returns: Json
      }
      dre_ai_parcial: {
        Args: { p_ate?: string; p_org: string; p_unit: string }
        Returns: Json
      }
      dre_classification_fingerprint: {
        Args: {
          p_month: number
          p_organization_id: string
          p_unit_id: string
          p_year: number
        }
        Returns: string
      }
      expire_old_invitations: { Args: never; Returns: undefined }
      fn_cashflow_snapshot_create: {
        Args: { p_organization_id: string; p_snapshot_date?: string }
        Returns: Json
      }
      fn_cashflow_snapshot_get: {
        Args: { p_organization_id: string; p_snapshot_date: string }
        Returns: {
          organization_id: string
          payload: Json
          snapshot_date: string
          snapshot_ts: string
          summary: Json
        }[]
      }
      fn_cashflow_snapshot_range: {
        Args: { p_from: string; p_organization_id: string; p_to: string }
        Returns: {
          snapshot_date: string
          summary: Json
        }[]
      }
      generate_bill_months: {
        Args: { bill_id: string; target_year: number }
        Returns: undefined
      }
      generate_loan_installments: {
        Args: { p_target_month?: string }
        Returns: Json
      }
      get_agreement_by_detector: {
        Args: { p_detector_key: string; p_organization_id?: string }
        Returns: {
          body: string
          id: string
          title: string
          version: number
        }[]
      }
      get_agreement_target_candidates: {
        Args: { p_organization_id?: string }
        Returns: {
          full_name: string
          role: string
          user_id: string
        }[]
      }
      get_agreements_overview: {
        Args: { p_organization_id?: string }
        Returns: {
          ack_status: Json
          body: string
          closed_at: string
          closed_by_name: string
          context_route: string
          created_at: string
          created_by_name: string
          detector_key: string
          id: string
          outcome: string
          outcome_note: string
          status: string
          target_user_ids: string[]
          title: string
          version: number
        }[]
      }
      get_all_notifications_for_directors: {
        Args: { p_include_own?: boolean; p_user_id: string }
        Returns: {
          content: string
          created_at: string
          id: string
          is_read: boolean
          link: string
          title: string
          type: string
          user_id: string
          user_name: string
        }[]
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
      get_atlas_review_items: {
        Args: { p_limit?: number; p_organization_id: string }
        Returns: {
          confidence_score: number
          current_coa_code: string
          current_coa_name: string
          description: string
          issue_date: string
          transaction_id: string
          unit_name: string
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
      get_ceo_radar_alerts_summary: {
        Args: { p_organization_id: string }
        Returns: Json
      }
      get_ceo_radar_allocations: {
        Args: { p_months?: number; p_organization_id: string }
        Returns: Json
      }
      get_ceo_radar_allocations_v2: {
        Args: { p_month?: number; p_organization_id: string; p_year?: number }
        Returns: Json
      }
      get_ceo_radar_audit_findings: {
        Args: { p_organization_id: string }
        Returns: Json
      }
      get_ceo_radar_commitments: {
        Args: { p_organization_id: string }
        Returns: Json
      }
      get_ceo_radar_expense_variation: {
        Args: {
          p_month: number
          p_organization_id: string
          p_unit_id?: string
          p_year: number
        }
        Returns: Json
      }
      get_ceo_radar_health_inputs: {
        Args: { p_month: number; p_organization_id: string; p_year: number }
        Returns: Json
      }
      get_ceo_radar_revenue_pulse: {
        Args: { p_organization_id: string }
        Returns: Json
      }
      get_ceo_units_radar_payments: {
        Args: { p_month: number; p_year: number }
        Returns: {
          amount: number
          chart_of_account_id: number
          description: string
          due_date: string
          id: string
          issue_date: string
          paid_amount: number
          payment_date: string
          payment_method_id: string
          payment_method_name: string
          person_id: string
          person_name: string
          status: string
          structured_code: string
          unit_id: string
        }[]
      }
      get_cfo_bank_balances:
        | {
            Args: never
            Returns: {
              banco: string
              saldo: number
              tipo_conta: string
              unidade: string
            }[]
          }
        | {
            Args: { target_unit_id?: string }
            Returns: {
              banco: string
              saldo: number
              tipo_conta: string
              unidade: string
            }[]
          }
      get_cfo_critical_risk:
        | {
            Args: never
            Returns: {
              conta_critica: string
              status_pagamento: string
              unidade: string
              vencimento: string
              whatsapp_responsavel: string
            }[]
          }
        | {
            Args: { target_unit_id?: string }
            Returns: {
              conta_critica: string
              status_pagamento: string
              unidade: string
              vencimento: string
              whatsapp_responsavel: string
            }[]
          }
      get_cfo_daily_report:
        | {
            Args: never
            Returns: {
              descricao: string
              status_atual: string
              tipo: string
              unidade: string
              valor: number
              vencimento: string
            }[]
          }
        | {
            Args: { target_unit_id?: string }
            Returns: {
              descricao: string
              status_atual: string
              tipo: string
              unidade: string
              valor: number
              vencimento: string
            }[]
          }
      get_cfo_financial_health:
        | { Args: never; Returns: Json }
        | { Args: { target_unit_id?: string }; Returns: Json }
      get_client_invoice: { Args: { p_token: string }; Returns: Json }
      get_comment_counts: { Args: { p_organization_id: string }; Returns: Json }
      get_comparacao_mom: {
        Args: { org_id: string }
        Returns: {
          categoria: string
          dias_comparados: number
          mes_anterior: number
          mes_atual: number
          unidade: string
          variacao_abs: number
          variacao_pct: number
        }[]
      }
      get_comparacao_yoy: {
        Args: { org_id: string }
        Returns: {
          categoria: string
          crescimento_yoy: number
          dias_comparados: number
          mes_ano_anterior: number
          mes_atual: number
          unidade: string
        }[]
      }
      get_daily_cash_flow: {
        Args: {
          p_bank_account_id?: string
          p_month: number
          p_organization_id: string
          p_payment_method_id?: string
          p_unit_id?: string
          p_year: number
        }
        Returns: {
          day: number
          projected_entries: number
          projected_exits: number
          realized_entries: number
          realized_exits: number
        }[]
      }
      get_days_since_last_input: {
        Args: { p_organization_id: string; p_unit_id?: string }
        Returns: number
      }
      get_detailed_freshness_status: {
        Args: { p_organization_id: string; p_unit_id?: string }
        Returns: {
          bank_account_id: string
          bank_name: string
          days_since_last_expense: number
          days_since_last_income: number
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
      get_dre_data_yearly: {
        Args: { p_organization_id?: string; p_unit_id?: string; p_year: number }
        Returns: {
          budgeted: number
          chart_of_account_id: number
          month: number
          realized: number
        }[]
      }
      get_dre_variance_context: {
        Args: {
          p_month: number
          p_peer_unit_id?: string
          p_unit_id: string
          p_year: number
        }
        Returns: Json
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
      get_expense_allocation_overview: {
        Args: never
        Returns: {
          account_code: string
          account_name: string
          accounts_payable_id: string
          allocation_id: string
          allocation_status: string
          bank_account_id: string
          bank_name: string
          chart_of_account_id: number
          created_at: string
          created_by: string
          created_by_name: string
          decided_at: string
          description: string
          document_number: string
          due_date: string
          issue_date: string
          item_amount: number
          item_id: string
          item_status: string
          organization_id: string
          person_id: string
          person_name: string
          rejection_reason: string
          total_amount: number
          unit_id: string
          unit_name: string
        }[]
      }
      get_fifth_business_day_after_month: {
        Args: { p_month: number; p_year: number }
        Returns: string
      }
      get_fixed_cost_impact: {
        Args: {
          p_month: number
          p_only_paid?: boolean
          p_organization_id: string
          p_unit_id?: string
          p_view_type?: string
          p_year: number
        }
        Returns: {
          account_code: string
          account_description: string
          chart_of_account_id: number
          fixed_cost_amount: number
          fixed_cost_pct_of_revenue: number
          revenue_amount: number
          unit_id: string
          unit_name: string
        }[]
      }
      get_gastos_dia_anterior: {
        Args: { org_id: string }
        Returns: {
          categoria: string
          data_vencimento: string
          descricao: string
          fornecedor: string
          unidade: string
          valor: number
        }[]
      }
      get_gastos_mes_atual: {
        Args: { org_id: string }
        Returns: {
          categoria: string
          num_transacoes: number
          total_gasto: number
          unidade: string
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
      get_loan_month_snapshot: {
        Args: { p_loan_id: string; p_target_month: string }
        Returns: {
          aports: number
          balance_end: number
          balance_start: number
          installment: number
          interest: number
          month_start: string
          payments: number
        }[]
      }
      get_monthly_expense_summary: {
        Args: { p_ano: number; p_mes: number; p_unidade: string }
        Returns: {
          ano: number
          despesa_ano_anterior: number
          despesa_atual: number
          despesa_mes_anterior: number
          mes: number
          supermercado_ano_anterior: number
          supermercado_atual: number
          supermercado_mes_anterior: number
          unidade: string
        }[]
      }
      get_my_billing_alert: {
        Args: { p_organization_id: string }
        Returns: Json
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
      get_outliers_unidades: {
        Args: { org_id: string }
        Returns: {
          categoria: string
          desvio_percentual: number
          media_categoria: number
          total_gasto: number
          unidade: string
        }[]
      }
      get_pending_agreements: {
        Args: { p_organization_id?: string }
        Returns: {
          body: string
          context_route: string
          detector_key: string
          id: string
          title: string
          version: number
        }[]
      }
      get_phantom_allocation_groups: {
        Args: {
          p_end_date?: string
          p_organization_id?: string
          p_start_date?: string
        }
        Returns: {
          accounts_payable_ids: string[]
          amount: number
          due_date: string
          has_override: boolean
          item_count: number
          person_id: string
          person_name: string
          total_amount: number
          unit_count: number
          unit_ids: string[]
          unit_names: string[]
        }[]
      }
      get_plr_apuration: {
        Args: { p_month: number; p_year: number }
        Returns: {
          blockers: Json
          blocking_count: number
          closing_id: string
          deadline: string
          net_profit: number
          organization_id: string
          profile: Json
          profile_id: string
          profile_name: string
          reward_amount: number
          snapshot_created_at: string
          snapshot_id: string
          status: string
          unit_id: string
          unit_name: string
        }[]
      }
      get_plr_apuration_v2: {
        Args: { p_month: number; p_year: number }
        Returns: {
          blockers: Json
          blocking_count: number
          closing_id: string
          deadline: string
          net_profit: number
          operating_profit: number
          organization_id: string
          plr_adjustment: number
          plr_base: number
          plr_eligible_applications: number
          profile: Json
          profile_id: string
          profile_name: string
          reward_amount: number
          snapshot_created_at: string
          snapshot_id: string
          status: string
          unit_id: string
          unit_name: string
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
      get_unit_efficiency_ranking: {
        Args: { p_organization_id: string; p_period: string }
        Returns: {
          achievement_level: string
          average_ticket: number
          comparison_cutoff_day: number
          consumption_realized: number
          efficiency_goal_extraordinary_pct: number
          efficiency_goal_high_pct: number
          efficiency_goal_normal_pct: number
          efficiency_goal_pct: number
          efficiency_pct: number
          eligible_for_rank: boolean
          expense_pct: number
          goal_delta_pp: number
          is_partial_month: boolean
          occupancy_rate: number
          occupancy_realized: number
          operational_expense_count: number
          operational_expenses: number
          period: string
          previous_average_ticket: number
          previous_consumption_realized: number
          previous_efficiency_pct: number
          previous_expense_pct: number
          previous_occupancy_rate: number
          previous_occupancy_realized: number
          previous_operational_expenses: number
          previous_rev_par: number
          previous_sales_realized: number
          rank_position: number
          rev_par: number
          sales_realized: number
          status: string
          unit_id: string
          unit_name: string
        }[]
      }
      get_units_financial_summary: {
        Args: { p_organization_id: string }
        Returns: {
          accounts: Json
          days_since_last_input: number
          is_up_to_date: boolean
          total_balance: number
          unit_id: string
          unit_name: string
        }[]
      }
      has_card_reconciliation_access: {
        Args: { check_unit_id: string }
        Returns: boolean
      }
      has_financial_notes_access: { Args: { org_id: string }; Returns: boolean }
      is_active_org_member: {
        Args: { p_organization_id: string }
        Returns: boolean
      }
      is_admin_of_org: { Args: { org_id: string }; Returns: boolean }
      is_agreement_manager: {
        Args: { p_organization_id: string }
        Returns: boolean
      }
      is_card_reconciliation_manager: {
        Args: { check_org: string }
        Returns: boolean
      }
      is_expense_allocation_manager: {
        Args: { p_organization_id: string }
        Returns: boolean
      }
      is_financial_notes_admin: { Args: { org_id: string }; Returns: boolean }
      is_system_owner: { Args: never; Returns: boolean }
      log_agreement_override: {
        Args: {
          p_accounts_payable_id?: string
          p_context: Json
          p_detector_key: string
          p_justification: string
          p_organization_id?: string
        }
        Returns: string
      }
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
      montar_audio_digests: { Args: { p_data?: string }; Returns: number }
      normalizar_telefone_br: { Args: { p_telefone: string }; Returns: string }
      normalize_atlas_description: {
        Args: { description: string }
        Returns: string
      }
      openclaw_create_task: {
        Args: {
          p_assigned_to: string
          p_context?: Json
          p_created_by: string
          p_description: string
          p_title: string
        }
        Returns: string
      }
      openclaw_get_blocked_tasks: {
        Args: { p_agent_id: string }
        Returns: {
          assigned_to: string
          category: string | null
          context: Json | null
          created_at: string | null
          created_by: string
          description: string | null
          id: string
          priority: string | null
          started_at: string | null
          status: string | null
          status_history: Json | null
          title: string
          updated_at: string | null
        }[]
        SetofOptions: {
          from: "*"
          to: "agent_tasks"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      openclaw_get_pending_tasks: {
        Args: { p_agent_id: string }
        Returns: {
          assigned_to: string
          category: string | null
          context: Json | null
          created_at: string | null
          created_by: string
          description: string | null
          id: string
          priority: string | null
          started_at: string | null
          status: string | null
          status_history: Json | null
          title: string
          updated_at: string | null
        }[]
        SetofOptions: {
          from: "*"
          to: "agent_tasks"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      openclaw_get_recent_completed_tasks: {
        Args: never
        Returns: {
          assigned_to: string
          category: string | null
          context: Json | null
          created_at: string | null
          created_by: string
          description: string | null
          id: string
          priority: string | null
          started_at: string | null
          status: string | null
          status_history: Json | null
          title: string
          updated_at: string | null
        }[]
        SetofOptions: {
          from: "*"
          to: "agent_tasks"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      openclaw_get_task_by_id: {
        Args: { p_task_id: string }
        Returns: {
          assigned_to: string
          category: string | null
          context: Json | null
          created_at: string | null
          created_by: string
          description: string | null
          id: string
          priority: string | null
          started_at: string | null
          status: string | null
          status_history: Json | null
          title: string
          updated_at: string | null
        }[]
        SetofOptions: {
          from: "*"
          to: "agent_tasks"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      openclaw_log_action: {
        Args: { p_action: string; p_agent_id: string; p_details: string }
        Returns: undefined
      }
      openclaw_update_task_status: {
        Args: { p_context?: Json; p_status: string; p_task_id: string }
        Returns: undefined
      }
      record_loan_bulk_payment: {
        Args: {
          p_bank_account_id?: string
          p_loan_ids: string[]
          p_mode: string
          p_target_month: string
          p_unit_id?: string
        }
        Returns: Json
      }
      record_loan_send_to_approval: {
        Args: {
          p_loan_ids: string[]
          p_target_month: string
          p_unit_id: string
        }
        Returns: Json
      }
      refresh_expense_allocation_status: {
        Args: { p_allocation_id: string }
        Returns: undefined
      }
      register_cash_outflow: {
        Args: {
          p_amount: number
          p_chart_of_account_id?: number
          p_date: string
          p_destination_bank_id?: string
          p_notes?: string
          p_origin_bank_id: string
          p_unit_id: string
        }
        Returns: string
      }
      register_safe_box_transfer: {
        Args: {
          p_amount: number
          p_destination_bank_id?: string
          p_destination_chart_of_account_id?: number
          p_notes?: string
          p_photo_url?: string
          p_receiver_id: string
          p_sender_id: string
          p_signature_url: string
          p_transfer_date: string
          p_unit_id: string
        }
        Returns: string
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
      reject_expense_allocation_item: {
        Args: { p_item_id: string; p_reason: string }
        Returns: undefined
      }
      resolve_dre_classification_finding: {
        Args: {
          p_decision: string
          p_finding_id: string
          p_reason?: string
          p_target_chart_of_account_id?: number
        }
        Returns: Json
      }
      resolve_member_organization: {
        Args: { p_organization_id: string }
        Returns: string
      }
      run_dre_classification_audit: {
        Args: {
          p_month: number
          p_organization_id: string
          p_unit_id: string
          p_year: number
        }
        Returns: Json
      }
      show_limit: { Args: never; Returns: number }
      show_trgm: { Args: { "": string }; Returns: string[] }
      sync_radar_status: {
        Args: { target_bill_id?: string; target_org_id?: string }
        Returns: undefined
      }
      system_delete_empty_org: {
        Args: { p_organization_id: string }
        Returns: undefined
      }
      system_gerar_faturas: {
        Args: {
          p_forcar?: boolean
          p_hoje?: string
          p_organization_id?: string
        }
        Returns: number
      }
      system_overview: {
        Args: never
        Returns: {
          ceos: string[]
          contrato_ativo: boolean
          created_at: string
          em_aberto: number
          em_atraso: number
          id: string
          modulos: string[]
          motivo_suspensao: string
          name: string
          reajuste_em: string
          suspensa_em: string
          tem_whatsapp: boolean
          ultimo_acesso: string
          unidades: number
          unidades_cobradas: number
          usuarios: number
          valor_mensal: number
        }[]
      }
      system_set_suspensao: {
        Args: {
          p_motivo?: string
          p_organization_id: string
          p_suspensa: boolean
        }
        Returns: undefined
      }
      system_users: {
        Args: never
        Returns: {
          bloqueado: boolean
          criado_em: string
          email: string
          nome: string
          organizacoes: Json
          ultimo_acesso: string
          user_id: string
        }[]
      }
      telefones_normalizados: {
        Args: { p_telefones: string[] }
        Returns: string[]
      }
      unaccent: { Args: { "": string }; Returns: string }
      update_usage_agreement: {
        Args: {
          p_agreement_id: string
          p_body: string
          p_context_route?: string
          p_detector_key?: string
          p_target_user_ids?: string[]
          p_title?: string
        }
        Returns: number
      }
      vencimento_conta: {
        Args: { ano: number; dia: number; mes: number }
        Returns: string
      }
    }
    Enums: {
      bank_type: "banco_inter" | "stone" | "banco_mcp"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
      bank_type: ["banco_inter", "stone", "banco_mcp"],
      indicator_enum: ["Crédito", "Débito"],
      invitation_status: ["pending", "accepted", "cancelled", "expired"],
      member_status: ["pending", "active", "inactive"],
      organization_role: ["CEO", "Controller", "Manager", "Member"],
      sync_status: ["pending", "processing", "success", "error", "partial"],
      transaction_type_enum: ["income", "expense"],
    },
  },
} as const
