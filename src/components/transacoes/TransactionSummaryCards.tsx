
import React from 'react';
import { ArrowUp, ArrowDown, CreditCard } from 'lucide-react';

interface TransactionSummaryCardsProps {
  totalReceitas: number;
  totalDespesas: number;
  totalCartoes: number;
  formatCurrency: (value: number) => string;
}

export const TransactionSummaryCards = ({ 
  totalReceitas, 
  totalDespesas,
  totalCartoes,
  formatCurrency 
}: TransactionSummaryCardsProps) => {
  const totalGeral = totalDespesas + totalCartoes;

  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
      {/* Card Ganhos do mês */}
      <div className="bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-200 rounded-xl p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-green-500 rounded-full">
            <ArrowUp className="h-5 w-5 text-white" />
          </div>
          <h3 className="font-semibold text-green-800">Ganhos do mês</h3>
        </div>
        <p className="text-2xl font-bold text-green-700">
          {formatCurrency(totalReceitas)}
        </p>
      </div>

      {/* Card Gastos do mês */}
      <div className="bg-gradient-to-br from-red-50 to-red-100 border-2 border-red-200 rounded-xl p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-red-500 rounded-full">
            <ArrowDown className="h-5 w-5 text-white" />
          </div>
          <h3 className="font-semibold text-red-800">Gastos do mês</h3>
        </div>
        <p className="text-2xl font-bold text-red-700">
          {formatCurrency(totalDespesas)}
        </p>
      </div>

      {/* Card Gastos em cartões */}
      <div className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 rounded-xl p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-blue-500 rounded-full">
            <CreditCard className="h-5 w-5 text-white" />
          </div>
          <h3 className="font-semibold text-blue-800">Gastos em cartões</h3>
        </div>
        <div className="space-y-2">
          <p className="text-2xl font-bold text-blue-700">
            {formatCurrency(totalCartoes)}
          </p>
          <div className="pt-2 border-t border-blue-200">
            <div className="flex justify-between items-center text-sm">
              <span className="text-blue-600">Total geral:</span>
              <span className="font-bold text-red-600">
                {formatCurrency(totalGeral)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
