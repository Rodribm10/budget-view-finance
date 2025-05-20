
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface TransactionSummaryCardsProps {
  totalReceitas: number;
  totalDespesas: number;
  formatCurrency: (value: number) => string;
}

export const TransactionSummaryCards = ({ 
  totalReceitas, 
  totalDespesas,
  formatCurrency 
}: TransactionSummaryCardsProps) => {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader className="pb-2 bg-green-50">
          <CardTitle className="text-finance-green flex items-center">
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
            Gastos do mês
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <p className="text-2xl font-bold text-finance-red">
            {formatCurrency(totalDespesas)}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
