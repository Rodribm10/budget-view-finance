
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { FaturaCartao } from '@/types/cartaoTypes';

interface UseFaturasProps {
  cartaoId: string;
}

export function useFaturas({ cartaoId }: UseFaturasProps) {
  const [faturas, setFaturas] = useState<FaturaCartao[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [faturaAtual, setFaturaAtual] = useState<{ mes: number; ano: number } | null>(null);

  const calcularFaturaAtual = (diaVencimento: number = 10, melhorDiaCompra: number = 5) => {
    const hoje = new Date();
    const diaAtual = hoje.getDate();
    const mesAtual = hoje.getMonth() + 1;
    const anoAtual = hoje.getFullYear();

    // Se estamos antes do dia de vencimento, a fatura atual é do mês atual
    // Se estamos depois do dia de vencimento, a fatura atual é do próximo mês
    if (diaAtual <= diaVencimento) {
      return { mes: mesAtual, ano: anoAtual };
    } else {
      const proximoMes = mesAtual === 12 ? 1 : mesAtual + 1;
      const proximoAno = mesAtual === 12 ? anoAtual + 1 : anoAtual;
      return { mes: proximoMes, ano: proximoAno };
    }
  };

  const loadFaturas = async () => {
    setIsLoading(true);
    try {
      const userEmail = localStorage.getItem('userEmail');
      if (!userEmail) return;

      const { data, error } = await supabase
        .from('faturas_cartao')
        .select('*')
        .eq('cartao_id', cartaoId)
        .eq('login', userEmail.trim().toLowerCase())
        .order('ano', { ascending: false })
        .order('mes', { ascending: false });

      if (error) throw error;
      
      // Mapear os dados para garantir que status_pagamento seja do tipo correto
      const faturasMapeadas = (data || []).map(fatura => ({
        ...fatura,
        status_pagamento: fatura.status_pagamento as 'pendente' | 'pago' | 'vencido'
      })) as FaturaCartao[];
      
      setFaturas(faturasMapeadas);
    } catch (error) {
      console.error('Erro ao carregar faturas:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const criarFatura = async (mes: number, ano: number, diaVencimento: number = 10) => {
    try {
      const userEmail = localStorage.getItem('userEmail');
      if (!userEmail) return null;

      const dataVencimento = new Date(ano, mes - 1, diaVencimento);

      const { data, error } = await supabase
        .from('faturas_cartao')
        .insert({
          cartao_id: cartaoId,
          mes,
          ano,
          data_vencimento: dataVencimento.toISOString().split('T')[0],
          login: userEmail.trim().toLowerCase(),
          valor_total: 0
        })
        .select()
        .single();

      if (error) throw error;
      
      await loadFaturas();
      return data;
    } catch (error) {
      console.error('Erro ao criar fatura:', error);
      return null;
    }
  };

  const atualizarStatusPagamento = async (faturaId: string, status: 'pendente' | 'pago' | 'vencido', dataPagamento?: string) => {
    try {
      const { error } = await supabase
        .from('faturas_cartao')
        .update({
          status_pagamento: status,
          data_pagamento: dataPagamento || null
        })
        .eq('id', faturaId);

      if (error) throw error;
      await loadFaturas();
    } catch (error) {
      console.error('Erro ao atualizar status da fatura:', error);
    }
  };

  useEffect(() => {
    if (cartaoId) {
      loadFaturas();
    }
  }, [cartaoId]);

  return {
    faturas,
    isLoading,
    faturaAtual,
    calcularFaturaAtual,
    setFaturaAtual,
    loadFaturas,
    criarFatura,
    atualizarStatusPagamento
  };
}
