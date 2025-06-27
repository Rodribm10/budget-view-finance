
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import FiltroMesAno from './FiltroMesAno';
import StatusTags from './StatusTags';

interface ContaRecorrente {
  id: string;
  nome_conta: string;
  valor: number;
  dia_vencimento: number;
  email_usuario: string;
  ativo: boolean;
  created_at: string;
}

interface StatusPagamento {
  status: string | null;
  valor_pago: number | null;
  data_pagamento: string | null;
}

interface AvisoEnviado {
  data_aviso: string;
}

const ContasRecorrentesList = () => {
  const [contas, setContas] = useState<ContaRecorrente[]>([]);
  const [statusPagamentos, setStatusPagamentos] = useState<{[key: string]: StatusPagamento}>({});
  const [avisosEnviados, setAvisosEnviados] = useState<{[key: string]: AvisoEnviado}>({});
  const [loading, setLoading] = useState(true);
  const [mesAno, setMesAno] = useState(() => {
    const now = new Date();
    return { mes: now.getMonth() + 1, ano: now.getFullYear() };
  });
  const { toast } = useToast();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const loadContas = async () => {
    try {
      setLoading(true);
      
      // Buscar dados do usuário logado
      const { data: { user } } = await supabase.auth.getUser();
      if (!user?.email) {
        console.error('Usuário não logado');
        return;
      }

      console.log('Buscando contas para o usuário:', user.email);
      
      // Buscar contas recorrentes do usuário
      const { data: contasData, error: contasError } = await supabase
        .from('contas_recorrentes')
        .select('*')
        .eq('email_usuario', user.email)
        .eq('ativo', true)
        .order('nome_conta');

      if (contasError) {
        console.error('Erro ao buscar contas:', contasError);
        throw contasError;
      }

      console.log('Contas encontradas:', contasData);
      setContas(contasData || []);

      // Buscar status de pagamento para cada conta no mês/ano selecionado
      const statusMap: {[key: string]: StatusPagamento} = {};
      const avisosMap: {[key: string]: AvisoEnviado} = {};

      for (const conta of contasData || []) {
        // Buscar status de pagamento
        const { data: statusData } = await supabase
          .from('status_pagamento_mensal')
          .select('status, valor_pago, data_pagamento')
          .eq('conta_id', conta.id)
          .eq('mes', mesAno.mes)
          .eq('ano', mesAno.ano)
          .single();

        if (statusData) {
          statusMap[conta.id] = statusData;
        }

        // Buscar aviso enviado
        const { data: avisoData } = await supabase
          .from('avisos_enviados')
          .select('data_aviso')
          .eq('conta_id', conta.id)
          .gte('data_aviso', `${mesAno.ano}-${String(mesAno.mes).padStart(2, '0')}-01`)
          .lt('data_aviso', `${mesAno.ano}-${String(mesAno.mes + 1).padStart(2, '0')}-01`)
          .single();

        if (avisoData) {
          avisosMap[conta.id] = avisoData;
        }
      }

      setStatusPagamentos(statusMap);
      setAvisosEnviados(avisosMap);

    } catch (error) {
      console.error('Erro ao carregar contas:', error);
      toast({
        title: "Erro ao carregar contas",
        description: "Não foi possível carregar as contas recorrentes",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContas();
  }, [mesAno]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Carregando contas...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <FiltroMesAno mesAno={mesAno} onMesAnoChange={setMesAno} />
      
      {contas.length === 0 ? (
        <Card>
          <CardContent className="p-6">
            <p className="text-center text-gray-500">
              Nenhuma conta recorrente encontrada para o período selecionado.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {contas.map((conta) => (
            <Card key={conta.id} className="relative">
              <CardHeader>
                <CardTitle className="flex justify-between items-start">
                  <span>{conta.nome_conta}</span>
                  <Badge variant="outline" className="ml-2">
                    Dia {conta.dia_vencimento}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-xl font-bold text-green-600">
                    {formatCurrency(conta.valor)}
                  </div>
                  
                  <StatusTags 
                    statusPagamento={statusPagamentos[conta.id] || null}
                    avisoEnviado={avisosEnviados[conta.id] || null}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ContasRecorrentesList;
