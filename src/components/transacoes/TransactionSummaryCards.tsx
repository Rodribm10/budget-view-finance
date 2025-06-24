
import React from 'react';
import { ArrowUp, ArrowDown, CreditCard } from 'lucide-react';
import { SimpleCard } from '@/components/ui/simple-card';

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
  // Calculate the grand total of all expenses
  const totalGeral = totalDespesas + totalCartoes;

  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      <SimpleCard className="border-green-200">
        <div className="pb-2 bg-green-50 rounded-t-lg -m-6 mb-4 p-6">
          <div className="text-green-700 flex items-center font-bold">
            <ArrowUp className="h-5 w-5 mr-2 text-green-600" />
            Ganhos do mês
          </div>
        </div>
        <div className="pt-0">
          <p className="text-xl sm:text-2xl font-bold text-green-600 break-words">
            {formatCurrency(totalReceitas)}
          </p>
        </div>
      </SimpleCard>
      
      <SimpleCard className="border-red-200">
        <div className="pb-2 bg-red-50 rounded-t-lg -m-6 mb-4 p-6">
          <div className="text-red-700 flex items-center font-bold">
            <ArrowDown className="h-5 w-5 mr-2 text-red-600" />
            Gastos do mês
          </div>
        </div>
        <div className="pt-0 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 font-medium">Despesas:</span>
            <span className="text-lg sm:text-xl font-bold text-red-600 break-words">
              {formatCurrency(totalDespesas)}
            </span>
          </div>
          {totalCartoes > 0 && (
            <div className="flex items-center justify-between pt-1 border-t border-red-100">
              <span className="text-sm text-gray-600 font-medium">Cartões:</span>
              <span className="text-lg sm:text-xl font-bold text-red-500 break-words">
                {formatCurrency(totalCartoes)}
              </span>
            </div>
          )}
        </div>
      </SimpleCard>

      <SimpleCard className="border-blue-200">
        <div className="pb-2 bg-blue-50 rounded-t-lg -m-6 mb-4 p-6">
          <div className="text-blue-700 flex items-center font-bold">
            <CreditCard className="h-5 w-5 mr-2 text-blue-600" />
            Total geral
          </div>
        </div>
        <div className="pt-0">
          <p className="text-xl sm:text-2xl font-bold text-blue-600 break-words">
            {formatCurrency(totalGeral)}
          </p>
          <p className="text-xs text-blue-500 mt-1">
            Despesas + Cartões
          </p>
        </div>
      </SimpleCard>
    </div>
  );
};
