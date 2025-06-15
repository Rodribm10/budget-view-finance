
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface AccessControlResult {
  loading: boolean;
  podeAdicionarTransacao: boolean;
  motivo: string | null; // mensagem para exibir ao usuário se bloqueado
  diasRestantesTrial: number;
  trialExpiraEm: Date | null;
  adminLiberou: boolean;
}

export function useAccessControl(): AccessControlResult {
  const [result, setResult] = useState<AccessControlResult>({
    loading: true,
    podeAdicionarTransacao: false,
    motivo: null,
    diasRestantesTrial: 0,
    trialExpiraEm: null,
    adminLiberou: false,
  });

  useEffect(() => {
    async function checkAccess() {
      const userEmail = localStorage.getItem("userEmail");
      if (!userEmail) {
        setResult({
          loading: false,
          podeAdicionarTransacao: false,
          motivo: "Erro ao identificar usuário. Faça login novamente.",
          diasRestantesTrial: 0,
          trialExpiraEm: null,
          adminLiberou: false,
        });
        return;
      }

      // Buscar data de cadastro e liberado_permanente do usuário
      const { data: usuarios, error: userError } = await supabase
        .from("usuarios")
        .select("created_at, liberado_permanente")
        .eq("email", userEmail.trim().toLowerCase());

      if (userError || !usuarios || usuarios.length === 0) {
        setResult({
          loading: false,
          podeAdicionarTransacao: false,
          motivo: "Erro ao buscar dados do usuário. Tente novamente mais tarde.",
          diasRestantesTrial: 0,
          trialExpiraEm: null,
          adminLiberou: false,
        });
        return;
      }

      const cadastro = new Date(usuarios[0].created_at);
      const agora = new Date();
      const trialExpiraEm = new Date(cadastro.getTime());
      trialExpiraEm.setDate(trialExpiraEm.getDate() + 30);
      const dentroTrial = agora < trialExpiraEm;
      const diasRestantes = Math.ceil((trialExpiraEm.getTime() - agora.getTime()) / (1000 * 60 * 60 * 24));
      const liberadoPermanente = usuarios[0].liberado_permanente === true;

      if (liberadoPermanente) {
        setResult({
          loading: false,
          podeAdicionarTransacao: true,
          motivo: "Seu acesso foi liberado permanentemente pelo administrador.",
          diasRestantesTrial: 0,
          trialExpiraEm,
          adminLiberou: true,
        });
        return;
      }

      if (dentroTrial) {
        setResult({
          loading: false,
          podeAdicionarTransacao: true,
          motivo: null,
          diasRestantesTrial: diasRestantes,
          trialExpiraEm,
          adminLiberou: false,
        });
        return;
      }

      // Busca pagamento aprovado na tabela de pagamentos_mercadopago
      const { data: pagamentos, error: pagamentoError } = await supabase
        .from("pagamentos_mercadopago")
        .select("id, status, created_at, payer_email")
        .eq("payer_email", userEmail.trim().toLowerCase())
        .eq("status", "approved");

      if (pagamentoError) {
        setResult({
          loading: false,
          podeAdicionarTransacao: false,
          motivo: "Erro ao verificar status de pagamento.",
          diasRestantesTrial: 0,
          trialExpiraEm,
          adminLiberou: false,
        });
        return;
      }

      const pagamentoMesVigente = pagamentos && pagamentos.some((p: any) => {
        const pgDate = new Date(p.created_at);
        return pgDate.getFullYear() === agora.getFullYear() && pgDate.getMonth() === agora.getMonth();
      });

      if (pagamentoMesVigente) {
        setResult({
          loading: false,
          podeAdicionarTransacao: true,
          motivo: null,
          diasRestantesTrial: 0,
          trialExpiraEm,
          adminLiberou: false,
        });
        return;
      }

      setResult({
        loading: false,
        podeAdicionarTransacao: false,
        motivo:
          "Seu período de teste acabou. Para continuar adicionando transações, realize o pagamento da assinatura.",
        diasRestantesTrial: 0,
        trialExpiraEm,
        adminLiberou: false,
      });
    }

    checkAccess();
  }, []);

  return result;
}
