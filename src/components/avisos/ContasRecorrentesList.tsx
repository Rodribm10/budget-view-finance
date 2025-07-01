import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useAuthStore } from '@/stores/authStore';
import { Edit, Trash2, Calendar, Clock, DollarSign, Bell } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import FiltroMesAno from './FiltroMesAno';
import StatusTags from './StatusTags';

interface ContaRecorrente {
  id: string;
  nome_conta: string;
  descricao: string | null;
  valor: number | null;
  dia_vencimento: number;
  hora_aviso: string;
  dias_antecedencia: number;
  ativo: boolean;
  created_at: string;
  email_usuario: string | null;
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
  const { session } = useAuthStore();
  const queryClient = useQueryClient();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  
  // Estado para filtro de mês/ano - inicializa com mês/ano atual
  const dataAtual = new Date();
  const [mesAno, setMesAno] = useState({
    mes: dataAtual.getMonth() + 1,
    ano: dataAtual.getFullYear()
  });

  // Buscar email do usuário logado
  const userEmail = session?.user?.email;

  const { data: contas, isLoading } = useQuery({
    queryKey: ['contas-recorrentes', userEmail],
    queryFn: async () => {
      if (!userEmail) return [];

      const { data, error } = await supabase
        .from('contas_recorrentes')
        .select('*')
        .eq('email_usuario', userEmail)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as ContaRecorrente[];
    },
    enabled: !!userEmail
  });

  // Buscar status de pagamento para todas as contas do período selecionado
  const { data: statusPagamentos } = useQuery({
    queryKey: ['status-pagamentos', mesAno.mes, mesAno.ano, contas?.map(c => c.id)],
    queryFn: async () => {
      if (!contas || contas.length === 0) return {};

      const { data, error } = await supabase
        .from('status_pagamento_mensal')
        .select('conta_id, status, valor_pago, data_pagamento')
        .in('conta_id', contas.map(c => c.id))
        .eq('mes', mesAno.mes)
        .eq('ano', mesAno.ano);

      if (error) throw error;

      // Converter array em objeto indexado por conta_id
      const statusMap: Record<string, StatusPagamento> = {};
      data?.forEach(status => {
        statusMap[status.conta_id] = status;
      });
      
      return statusMap;
    },
    enabled: !!contas && contas.length > 0
  });

  // Buscar avisos enviados para todas as contas do período selecionado
  const { data: avisosEnviados } = useQuery({
    queryKey: ['avisos-enviados', mesAno.mes, mesAno.ano, contas?.map(c => c.id)],
    queryFn: async () => {
      if (!contas || contas.length === 0) return {};

      // Criar range de datas para o mês/ano selecionado
      const inicioMes = new Date(mesAno.ano, mesAno.mes - 1, 1);
      const fimMes = new Date(mesAno.ano, mesAno.mes, 0);

      const { data, error } = await supabase
        .from('avisos_enviados')
        .select('conta_id, data_aviso')
        .in('conta_id', contas.map(c => c.id))
        .gte('data_aviso', inicioMes.toISOString().split('T')[0])
        .lte('data_aviso', fimMes.toISOString().split('T')[0]);

      if (error) throw error;

      // Converter array em objeto indexado por conta_id (pega o primeiro aviso do mês)
      const avisosMap: Record<string, AvisoEnviado> = {};
      data?.forEach(aviso => {
        if (!avisosMap[aviso.conta_id]) {
          avisosMap[aviso.conta_id] = aviso;
        }
      });
      
      return avisosMap;
    },
    enabled: !!contas && contas.length > 0
  });

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    
    try {
      const { error } = await supabase
        .from('contas_recorrentes')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success('Conta removida com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['contas-recorrentes'] });
    } catch (error) {
      console.error('Erro ao remover conta:', error);
      toast.error('Erro ao remover conta. Tente novamente.');
    } finally {
      setDeletingId(null);
    }
  };

  const toggleAtivo = async (id: string, ativo: boolean) => {
    try {
      const { error } = await supabase
        .from('contas_recorrentes')
        .update({ ativo: !ativo })
        .eq('id', id);

      if (error) throw error;

      toast.success(ativo ? 'Conta desativada' : 'Conta ativada');
      queryClient.invalidateQueries({ queryKey: ['contas-recorrentes'] });
    } catch (error) {
      console.error('Erro ao alterar status:', error);
      toast.error('Erro ao alterar status da conta.');
    }
  };

  const formatCurrency = (value: number | null) => {
    if (value === null) return 'Não informado';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Carregando contas...</div>
        </CardContent>
      </Card>
    );
  }

  if (!userEmail) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Suas Contas Recorrentes</CardTitle>
          <CardDescription>Você precisa estar logado para ver suas contas</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filtro de Mês/Ano */}
      <FiltroMesAno mesAno={mesAno} onMesAnoChange={setMesAno} />

      {/* Lista de Contas */}
      {!contas || contas.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Suas Contas Recorrentes</CardTitle>
            <CardDescription>Você ainda não cadastrou nenhuma conta recorrente</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Clique em "Nova Conta" para começar</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">
            Suas Contas Recorrentes - {mesAno.mes.toString().padStart(2, '0')}/{mesAno.ano}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {contas.map((conta) => (
              <div
                key={conta.id}
                className="relative group"
                onMouseEnter={() => setHoveredCard(conta.id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                {hoveredCard === conta.id && (
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-lg blur-xl transition-all duration-300 ease-in-out" />
                )}
                
                <Card className={`
                  relative z-10 transition-all duration-300 ease-in-out
                  ${conta.ativo ? 'hover:shadow-lg hover:scale-105' : 'opacity-60 hover:opacity-80'}
                  ${hoveredCard === conta.id ? 'border-blue-300 shadow-lg' : ''}
                `}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{conta.nome_conta}</CardTitle>
                        {conta.descricao && (
                          <CardDescription className="mt-1">{conta.descricao}</CardDescription>
                        )}
                      </div>
                      <Badge variant={conta.ativo ? 'default' : 'secondary'}>
                        {conta.ativo ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-3">
                    {/* Tags de Status */}
                    <StatusTags 
                      statusPagamento={statusPagamentos?.[conta.id] || null}
                      avisoEnviado={avisosEnviados?.[conta.id] || null}
                    />

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <DollarSign className="h-4 w-4 text-green-600" />
                        <span className="font-medium">Valor:</span>
                        <span>{formatCurrency(conta.valor)}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-blue-600" />
                        <span className="font-medium">Vencimento:</span>
                        <span>Todo dia {conta.dia_vencimento}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4 text-purple-600" />
                        <span className="font-medium">Horário:</span>
                        <span>{conta.hora_aviso}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm">
                        <Bell className="h-4 w-4 text-orange-600" />
                        <span className="font-medium">Antecedência:</span>
                        <span>{conta.dias_antecedencia} dia(s)</span>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2 border-t">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleAtivo(conta.id, conta.ativo)}
                        className="flex-1"
                      >
                        {conta.ativo ? 'Desativar' : 'Ativar'}
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(conta.id)}
                        disabled={deletingId === conta.id}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ContasRecorrentesList;
