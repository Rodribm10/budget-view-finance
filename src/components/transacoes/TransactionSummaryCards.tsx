
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowDown, CreditCard, Wallet } from 'lucide-react';

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
      <Card>
        <CardHeader className="pb-2 bg-green-50">
          <CardTitle className="text-finance-green flex items-center">
            <Wallet className="h-4 w-4 mr-2" />
            Ganhos do mês
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <p className="text-2xl font-bold text-finance-green">
            {formatCurrency(totalReceitas)}
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2 bg-red-50">
          <CardTitle className="text-finance-red flex items-center">
            <ArrowDown className="h-4 w-4 mr-2" />
            Gastos do mês
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <p className="text-2xl font-bold text-finance-red">
            {formatCurrency(totalDespesas)}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2 bg-blue-50">
          <CardTitle className="text-finance-blue flex items-center">
            <CreditCard className="h-4 w-4 mr-2" />
            Gastos em cartões
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4 space-y-1">
          <p className="text-2xl font-bold text-finance-blue">
            {formatCurrency(totalCartoes)}
          </p>
          <div className="flex items-center justify-between pt-2 text-sm border-t">
            <span className="text-muted-foreground">Total geral:</span>
            <span className="font-medium text-finance-red">{formatCurrency(totalGeral)}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
