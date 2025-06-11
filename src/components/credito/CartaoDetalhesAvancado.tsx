
import { useState, useEffect } from 'react';
import { CartaoCredito, DespesaCartao, FaturaCartao } from "@/types/cartaoTypes";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreditCard, Calendar, DollarSign, TrendingUp, FileText } from "lucide-react";
import { FiltroFaturas } from "./FiltroFaturas";
import { DespesasComParcelas } from "./DespesasComParcelas";
import { useFaturas } from "@/hooks/useFaturas";
import { formatCurrency } from "@/utils/formatters";
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface CartaoDetalhesAvancadoProps {
  cartao: CartaoCredito;
  despesas: DespesaCartao[];
  isLoading: boolean;
  onDespesaSuccess: () => void;
}

export function CartaoDetalhesAvancado({ 
  cartao, 
  despesas: todasDespesas, 
  isLoading,
  onDespesaSuccess 
}: CartaoDetalhesAvancadoProps) {
  const [faturaAtual, setFaturaAtual] = useState<{ mes: number; ano: number } | null>(null);
  const [despesasFiltradas, setDespesasFiltradas] = useState<DespesaCartao[]>([]);
  const [faturaSelecionada, setFaturaSelecionada] = useState<FaturaCartao | null>(null);
  const { toast } = useToast();

  const {
    faturas,
    isLoading: loadingFaturas,
    calcularFaturaAtual,
    criarFatura,
    atualizarStatusPagamento
  } = useFaturas({ cartaoId: cartao.id });

  useEffect(() => {
    // Calcular fatura atual baseada no dia de vencimento
    const fatura = calcularFaturaAtual(cartao.dia_vencimento, cartao.melhor_dia_compra);
    setFaturaAtual(fatura);
  }, [cartao, calcularFaturaAtual]);

  useEffect(() => {
    // Filtrar despesas pela fatura selecionada
    if (faturaAtual) {
      const despesasDaFatura = todasDespesas.filter(despesa => 
        despesa.mes_fatura === faturaAtual.mes && despesa.ano_fatura === faturaAtual.ano
      );
      setDespesasFiltradas(despesasDaFatura);

      // Buscar dados da fatura
      const fatura = faturas.find(f => f.mes === faturaAtual.mes && f.ano === faturaAtual.ano);
      setFaturaSelecionada(fatura || null);
    }
  }, [faturaAtual, todasDespesas, faturas]);

  const handleFaturaChange = (mes: number, ano: number) => {
    setFaturaAtual({ mes, ano });
  };

  const handleCriarFatura = async (mes: number, ano: number) => {
    const novaFatura = await criarFatura(mes, ano, cartao.dia_vencimento);
    if (novaFatura) {
      toast({
        title: "Fatura criada",
        description: `Fatura de ${mes}/${ano} criada com sucesso`,
      });
    }
  };

  const handleEditDespesa = (despesa: DespesaCartao) => {
    // TODO: Implementar edição de despesa
    console.log('Editar despesa:', despesa);
  };

  const handleDeleteDespesa = async (id: string) => {
    try {
      const { error } = await supabase
        .from('despesas_cartao')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      onDespesaSuccess();
      toast({
        title: "Despesa removida",
        description: "Despesa removida com sucesso",
      });
    } catch (error) {
      console.error('Erro ao remover despesa:', error);
      toast({
        title: "Erro ao remover despesa",
        description: "Não foi possível remover a despesa",
        variant: "destructive"
      });
    }
  };

  const handleToggleConciliacao = async (id: string, novoStatus: 'pendente' | 'conciliado' | 'divergente') => {
    try {
      const { error } = await supabase
        .from('despesas_cartao')
        .update({ status_conciliacao: novoStatus })
        .eq('id', id);

      if (error) throw error;
      
      onDespesaSuccess();
      toast({
        title: "Status atualizado",
        description: `Despesa marcada como ${novoStatus}`,
      });
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      toast({
        title: "Erro ao atualizar status",
        description: "Não foi possível atualizar o status da despesa",
        variant: "destructive"
      });
    }
  };

  const valorTotalFatura = despesasFiltradas.reduce((total, despesa) => total + despesa.valor, 0);
  const totalConciliado = despesasFiltradas.filter(d => d.status_conciliacao === 'conciliado').length;
  const totalPendente = despesasFiltradas.filter(d => d.status_conciliacao === 'pendente').length;

  return (
    <div className="space-y-6">
      {/* Header do Cartão */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <CreditCard className="h-8 w-8 text-blue-600" />
              <div>
                <CardTitle className="text-2xl">{cartao.nome}</CardTitle>
                <p className="text-muted-foreground">
                  {cartao.banco} • {cartao.bandeira}
                </p>
              </div>
            </div>
            
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Limite Total</p>
              <p className="text-xl font-semibold">
                {cartao.limite_total ? formatCurrency(cartao.limite_total) : 'N/A'}
              </p>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Filtro de Faturas */}
      {faturaAtual && (
        <FiltroFaturas
          faturas={faturas}
          faturaAtual={faturaAtual}
          onFaturaChange={handleFaturaChange}
          onCriarFatura={handleCriarFatura}
        />
      )}

      {/* Resumo da Fatura */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Valor Total</p>
                <p className="text-lg font-semibold">{formatCurrency(valorTotalFatura)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">Total Despesas</p>
                <p className="text-lg font-semibold">{despesasFiltradas.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Conciliadas</p>
                <p className="text-lg font-semibold">{totalConciliado}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="text-sm text-muted-foreground">Pendentes</p>
                <p className="text-lg font-semibold">{totalPendente}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Status da Fatura */}
      {faturaSelecionada && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Status da Fatura</CardTitle>
              <div className="flex items-center space-x-2">
                <Badge variant={
                  faturaSelecionada.status_pagamento === 'pago' ? 'default' : 
                  faturaSelecionada.status_pagamento === 'vencido' ? 'destructive' : 'secondary'
                }>
                  {faturaSelecionada.status_pagamento}
                </Badge>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => atualizarStatusPagamento(
                    faturaSelecionada.id,
                    faturaSelecionada.status_pagamento === 'pago' ? 'pendente' : 'pago',
                    faturaSelecionada.status_pagamento === 'pago' ? undefined : new Date().toISOString().split('T')[0]
                  )}
                >
                  {faturaSelecionada.status_pagamento === 'pago' ? 'Marcar como Pendente' : 'Marcar como Pago'}
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Data de Vencimento</p>
                <p>{faturaSelecionada.data_vencimento ? new Date(faturaSelecionada.data_vencimento).toLocaleDateString('pt-BR') : 'N/A'}</p>
              </div>
              {faturaSelecionada.data_pagamento && (
                <div>
                  <p className="text-muted-foreground">Data de Pagamento</p>
                  <p>{new Date(faturaSelecionada.data_pagamento).toLocaleDateString('pt-BR')}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Despesas */}
      <Card>
        <CardHeader>
          <CardTitle>Despesas da Fatura</CardTitle>
        </CardHeader>
        <CardContent>
          <DespesasComParcelas
            despesas={despesasFiltradas}
            onEditDespesa={handleEditDespesa}
            onDeleteDespesa={handleDeleteDespesa}
            onToggleConciliacao={handleToggleConciliacao}
          />
        </CardContent>
      </Card>
    </div>
  );
}
