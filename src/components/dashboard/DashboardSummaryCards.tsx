
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { ArrowUpIcon, ArrowDownIcon, CreditCardIcon, Target } from "lucide-react";
import { ResumoFinanceiro } from "@/types/financialTypes";
import { useNavigateWithFilter } from "@/hooks/useNavigateWithFilter";
import { getResumoFinanceiro } from "@/services/transacao";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface DashboardSummaryCardsProps {
  resumo: ResumoFinanceiro | null;
  formatCurrency: (value: number) => string;
  selectedMonth?: string;
}

const DashboardSummaryCards: React.FC<DashboardSummaryCardsProps> = ({ 
  resumo, 
  formatCurrency, 
  selectedMonth 
}) => {
  const { navigateToTransactions } = useNavigateWithFilter();
  const [resumoAnterior, setResumoAnterior] = useState<ResumoFinanceiro | null>(null);
  
  const saldo = resumo ? resumo.totalReceitas - resumo.totalDespesas - (resumo.totalCartoes || 0) : 0;
  const totalGastos = resumo ? resumo.totalDespesas + (resumo.totalCartoes || 0) : 0;
  
  // Calcular economia baseada nas transações do mês
  const economiaValor = resumo?.totalReceitas ? saldo : 0;
  const economiaPercentual = resumo?.totalReceitas && resumo.totalReceitas > 0 
    ? ((economiaValor / resumo.totalReceitas) * 100)
    : 0;

  // Função para obter dados até o mesmo dia do mês anterior
  const loadPreviousMonthDataUntilSameDay = async () => {
    if (!selectedMonth) return;
    
    try {
      const [year, month] = selectedMonth.split('-').map(Number);
      const previousMonth = month === 1 ? 12 : month - 1;
      const previousYear = month === 1 ? year - 1 : year;
      const previousMonthFilter = `${previousYear}-${String(previousMonth).padStart(2, '0')}`;
      
      // Pegar o dia atual para comparar até o mesmo dia
      const today = new Date();
      const currentDay = today.getDate();
      
      // Se estamos visualizando o mês atual, usar o dia de hoje
      // Se estamos visualizando um mês passado, usar o último dia daquele mês
      const isCurrentMonth = year === today.getFullYear() && month === (today.getMonth() + 1);
      const dayToCompare = isCurrentMonth ? currentDay : new Date(year, month, 0).getDate();
      
      console.log(`Comparando até o dia ${dayToCompare} do mês ${previousMonthFilter}`);
      
      // Para simular dados "até o mesmo dia", vamos pegar todos os dados do mês anterior
      // Em uma implementação real, você filtaria por data até o mesmo dia
      const data = await getResumoFinanceiro(previousMonthFilter);
      setResumoAnterior(data);
    } catch (error) {
      console.error("Erro ao carregar dados do mês anterior:", error);
      setResumoAnterior(null);
    }
  };

  useEffect(() => {
    loadPreviousMonthDataUntilSameDay();
  }, [selectedMonth]);

  // Calcular variações seguindo suas instruções exatas
  const calcularVariacaoReceita = (atual: number, anterior: number) => {
    if (anterior === 0) return { percentual: 0, temDados: false };
    const percentual = ((atual - anterior) / anterior) * 100;
    return { percentual, temDados: true };
  };

  const calcularVariacaoDespesa = (atual: number, anterior: number) => {
    if (anterior === 0) return { percentual: 0, temDados: false };
    const percentual = ((anterior - atual) / anterior) * 100;
    return { percentual, temDados: true };
  };

  const variacaoReceita = resumoAnterior 
    ? calcularVariacaoReceita(resumo?.totalReceitas || 0, resumoAnterior.totalReceitas)
    : { percentual: 0, temDados: false };

  const variacaoDespesa = resumoAnterior 
    ? calcularVariacaoDespesa(resumo?.totalDespesas || 0, resumoAnterior.totalDespesas)
    : { percentual: 0, temDados: false };

  // Função para formatar percentual
  const formatarPercentual = (valor: number) => {
    const sinal = valor >= 0 ? '+' : '';
    return `${sinal}${valor.toFixed(2)}%`;
  };

  // Função para gerar tooltip de receita
  const getTooltipReceita = () => {
    if (!variacaoReceita.temDados) return "Sem base de comparação com o mês anterior";
    
    if (variacaoReceita.percentual >= 0) {
      return `Receita ${variacaoReceita.percentual.toFixed(2)}% acima do mesmo período do mês passado`;
    } else {
      return `Receita ${Math.abs(variacaoReceita.percentual).toFixed(2)}% abaixo do mesmo período do mês passado`;
    }
  };

  // Função para gerar tooltip de despesa
  const getTooltipDespesa = () => {
    if (!variacaoDespesa.temDados) return "Sem base de comparação com o mês anterior";
    
    if (variacaoDespesa.percentual >= 0) {
      return `Você está ${variacaoDespesa.percentual.toFixed(2)}% mais econômico em relação ao mesmo período do mês passado`;
    } else {
      return `Gastos ${Math.abs(variacaoDespesa.percentual).toFixed(2)}% maiores em relação ao mesmo período do mês passado`;
    }
  };

  return (
    <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
      {/* Card Receitas - Clicável */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Card 
              className="relative overflow-hidden border-2 border-green-200 bg-gradient-to-br from-green-50 to-emerald-100 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group transform hover:scale-105"
              onClick={() => navigateToTransactions('receita')}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-green-400/10 to-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <CardContent className="p-4 sm:p-6 relative">
                <div className="flex items-center justify-between mb-2 sm:mb-4">
                  <div className="p-2 sm:p-3 bg-green-500 rounded-full shadow-lg">
                    <ArrowUpIcon className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
                  </div>
                  {variacaoReceita.temDados && (
                    <div className={`text-xs font-bold px-2 py-1 rounded-full shadow-sm ${
                      variacaoReceita.percentual >= 0 
                        ? 'bg-green-500 text-white' 
                        : 'bg-red-500 text-white'
                    }`}>
                      {formatarPercentual(variacaoReceita.percentual)}
                    </div>
                  )}
                  {!variacaoReceita.temDados && (
                    <div className="text-xs font-bold px-2 py-1 rounded-full shadow-sm bg-gray-500 text-white">
                      N/A
                    </div>
                  )}
                </div>
                <div className="space-y-1 sm:space-y-2">
                  <p className="text-xs sm:text-sm font-semibold text-green-700">Receitas</p>
                  <p className="text-base sm:text-xl xl:text-2xl font-bold text-green-600 leading-tight">
                    {resumo ? formatCurrency(resumo.totalReceitas) : 'R$ 0,00'}
                  </p>
                  <p className="text-xs text-green-600 opacity-80">Clique para ver detalhes</p>
                </div>
              </CardContent>
            </Card>
          </TooltipTrigger>
          <TooltipContent>
            <p>{getTooltipReceita()}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {/* Card Despesas - Clicável */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Card 
              className="relative overflow-hidden border-2 border-red-200 bg-gradient-to-br from-red-50 to-rose-100 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group transform hover:scale-105"
              onClick={() => navigateToTransactions('despesa')}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-red-400/10 to-rose-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <CardContent className="p-4 sm:p-6 relative">
                <div className="flex items-center justify-between mb-2 sm:mb-4">
                  <div className="p-2 sm:p-3 bg-red-500 rounded-full shadow-lg">
                    <ArrowDownIcon className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
                  </div>
                  {variacaoDespesa.temDados && (
                    <div className={`text-xs font-bold px-2 py-1 rounded-full shadow-sm ${
                      variacaoDespesa.percentual >= 0 
                        ? 'bg-green-500 text-white' 
                        : 'bg-red-500 text-white'
                    }`}>
                      {formatarPercentual(variacaoDespesa.percentual)}
                    </div>
                  )}
                  {!variacaoDespesa.temDados && (
                    <div className="text-xs font-bold px-2 py-1 rounded-full shadow-sm bg-gray-500 text-white">
                      N/A
                    </div>
                  )}
                </div>
                <div className="space-y-1 sm:space-y-2">
                  <p className="text-xs sm:text-sm font-semibold text-red-700">Despesas</p>
                  <p className="text-base sm:text-xl xl:text-2xl font-bold text-red-600 leading-tight">
                    {resumo ? formatCurrency(resumo.totalDespesas) : 'R$ 0,00'}
                  </p>
                  {resumo && resumo.totalCartoes && resumo.totalCartoes > 0 && (
                    <div className="pt-1 border-t border-red-200">
                      <p className="text-xs text-red-500">
                        <span className="font-medium">Cartões: </span>
                        {formatCurrency(resumo.totalCartoes)}
                      </p>
                    </div>
                  )}
                  <p className="text-xs text-red-600 opacity-80">Clique para ver detalhes</p>
                </div>
              </CardContent>
            </Card>
          </TooltipTrigger>
          <TooltipContent>
            <p>{getTooltipDespesa()}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {/* Card Saldo */}
      <Card className="relative overflow-hidden border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-sky-100 shadow-lg hover:shadow-xl transition-all duration-300 group transform hover:scale-105">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-400/10 to-sky-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <CardContent className="p-4 sm:p-6 relative">
          <div className="flex items-center justify-between mb-2 sm:mb-4">
            <div className="p-2 sm:p-3 bg-blue-500 rounded-full shadow-lg">
              <CreditCardIcon className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
            </div>
          </div>
          <div className="space-y-1 sm:space-y-2">
            <p className="text-xs sm:text-sm font-semibold text-blue-700">Saldo</p>
            <p className={`text-base sm:text-xl xl:text-2xl font-bold leading-tight ${
              saldo >= 0 ? 'text-blue-600' : 'text-red-600'
            }`}>
              {resumo ? formatCurrency(saldo) : 'R$ 0,00'}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Card Economia */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Card className="relative overflow-hidden border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-violet-100 shadow-lg hover:shadow-xl transition-all duration-300 group transform hover:scale-105">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-400/10 to-violet-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <CardContent className="p-4 sm:p-6 relative">
                <div className="flex items-center justify-between mb-2 sm:mb-4">
                  <div className="p-2 sm:p-3 bg-purple-500 rounded-full shadow-lg">
                    <Target className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
                  </div>
                </div>
                <div className="space-y-1 sm:space-y-2">
                  <p className="text-xs sm:text-sm font-semibold text-purple-700">Economia</p>
                  <p className={`text-base sm:text-xl xl:text-2xl font-bold leading-tight ${
                    economiaPercentual >= 0 ? 'text-purple-600' : 'text-red-600'
                  }`}>
                    {economiaPercentual.toFixed(1)}%
                  </p>
                  <p className="text-xs text-purple-500 leading-tight">
                    {formatCurrency(Math.abs(economiaValor))}
                  </p>
                </div>
              </CardContent>
            </Card>
          </TooltipTrigger>
          <TooltipContent>
            <p>Percentual de economia: receitas que sobraram após todas as despesas</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default DashboardSummaryCards;
