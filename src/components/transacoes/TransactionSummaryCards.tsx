
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  // Calculate the grand total of all expenses
  const totalGeral = totalDespesas + totalCartoes;

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card className="border-2 border-green-200 shadow-lg">
        <CardHeader className="pb-2 bg-green-50 rounded-t-lg">
          <CardTitle className="text-green-700 flex items-center font-bold">
            <ArrowUp className="h-5 w-5 mr-2 text-green-600" />
            Ganhos do mês
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <p className="text-2xl font-bold text-green-600">
            {formatCurrency(totalReceitas)}
          </p>
        </CardContent>
      </Card>
      
      <Card className="border-2 border-red-200 shadow-lg">
        <CardHeader className="pb-2 bg-red-50 rounded-t-lg">
          <CardTitle className="text-red-700 flex items-center font-bold">
            <ArrowDown className="h-5 w-5 mr-2 text-red-600" />
            Gastos do mês
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <p className="text-2xl font-bold text-red-600">
            {formatCurrency(totalDespesas)}
          </p>
        </CardContent>
      </Card>

      <Card className="border-2 border-blue-200 shadow-lg">
        <CardHeader className="pb-2 bg-blue-50 rounded-t-lg">
          <CardTitle className="text-blue-700 flex items-center font-bold">
            <CreditCard className="h-5 w-5 mr-2 text-blue-600" />
            Gastos em cartões
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4 space-y-1">
          <p className="text-2xl font-bold text-blue-600">
            {formatCurrency(totalCartoes)}
          </p>
          <div className="flex items-center justify-between pt-2 text-sm border-t">
            <span className="text-gray-600 font-medium">Total geral:</span>
            <span className="font-bold text-red-600">{formatCurrency(totalGeral)}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
