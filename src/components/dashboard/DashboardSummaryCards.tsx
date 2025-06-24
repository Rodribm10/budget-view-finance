
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { ArrowUpIcon, ArrowDownIcon, CreditCardIcon, Target } from "lucide-react";
import { ResumoFinanceiro } from "@/types/financialTypes";
import { useNavigateWithFilter } from "@/hooks/useNavigateWithFilter";

interface DashboardSummaryCardsProps {
  resumo: ResumoFinanceiro | null;
  formatCurrency: (value: number) => string;
}

const DashboardSummaryCards: React.FC<DashboardSummaryCardsProps> = ({ resumo, formatCurrency }) => {
  const { navigateToTransactions } = useNavigateWithFilter();
  
  const saldo = resumo ? resumo.totalReceitas - resumo.totalDespesas - (resumo.totalCartoes || 0) : 0;
  const totalDespesasGeral = resumo ? resumo.totalDespesas + (resumo.totalCartoes || 0) : 0;

  return (
    <div className="grid gap-6 md:grid-cols-4">
      {/* Card Receitas - Clicável */}
      <Card 
        className="relative overflow-hidden border-2 border-green-200 bg-gradient-to-br from-green-50 to-emerald-100 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group transform hover:scale-105"
        onClick={() => navigateToTransactions('receita')}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-green-400/10 to-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <CardContent className="p-6 relative">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-500 rounded-full shadow-lg">
              <ArrowUpIcon className="h-6 w-6 text-white" />
            </div>
            <div className="text-xs font-bold px-3 py-1 bg-green-500 text-white rounded-full shadow-sm">
              +5%
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-semibold text-green-700">Receitas</p>
            <p className="text-3xl font-bold text-green-600">
              {resumo ? formatCurrency(resumo.totalReceitas) : 'R$ 0,00'}
            </p>
            <p className="text-xs text-green-600 opacity-80">Clique para ver detalhes</p>
          </div>
        </CardContent>
      </Card>

      {/* Card Despesas - Clicável */}
      <Card 
        className="relative overflow-hidden border-2 border-red-200 bg-gradient-to-br from-red-50 to-rose-100 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group transform hover:scale-105"
        onClick={() => navigateToTransactions('despesa')}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-red-400/10 to-rose-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <CardContent className="p-6 relative">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-red-500 rounded-full shadow-lg">
              <ArrowDownIcon className="h-6 w-6 text-white" />
            </div>
            <div className="text-xs font-bold px-3 py-1 bg-red-500 text-white rounded-full shadow-sm">
              -2%
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-semibold text-red-700">Despesas</p>
            <p className="text-3xl font-bold text-red-600">
              {resumo ? formatCurrency(totalDespesasGeral) : 'R$ 0,00'}
            </p>
            {resumo && resumo.totalCartoes > 0 && (
              <p className="text-xs text-red-500">Cartões: {formatCurrency(resumo.totalCartoes)}</p>
            )}
            <p className="text-xs text-red-600 opacity-80">Clique para ver detalhes</p>
          </div>
        </CardContent>
      </Card>

      {/* Card Saldo */}
      <Card className="relative overflow-hidden border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-sky-100 shadow-lg hover:shadow-xl transition-all duration-300 group transform hover:scale-105">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-400/10 to-sky-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <CardContent className="p-6 relative">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-500 rounded-full shadow-lg">
              <CreditCardIcon className="h-6 w-6 text-white" />
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-semibold text-blue-700">Saldo</p>
            <p className={`text-3xl font-bold ${
              saldo >= 0 ? 'text-blue-600' : 'text-red-600'
            }`}>
              {resumo ? formatCurrency(saldo) : 'R$ 0,00'}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Card Economia */}
      <Card className="relative overflow-hidden border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-violet-100 shadow-lg hover:shadow-xl transition-all duration-300 group transform hover:scale-105">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-400/10 to-violet-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <CardContent className="p-6 relative">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-500 rounded-full shadow-lg">
              <Target className="h-6 w-6 text-white" />
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-semibold text-purple-700">Economia</p>
            <p className="text-3xl font-bold text-purple-600">
              -22.2%
            </p>
            <p className="text-xs text-purple-500">{resumo ? formatCurrency(Math.abs(saldo)) : 'R$ 0,00'}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardSummaryCards;
