
import React from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle, CreditCard } from 'lucide-react';

interface TransactionHeaderProps {
  onOpenDialog: (tipo: 'receita' | 'despesa') => void;
  onOpenCartaoCreditoDialog: () => void;
}

export const TransactionHeader = ({ 
  onOpenDialog, 
  onOpenCartaoCreditoDialog 
}: TransactionHeaderProps) => {
  return (
    <div className="flex justify-between items-center">
      <h1 className="text-2xl font-bold tracking-tight">Todas as Transações</h1>
      <div className="flex gap-2">
        <Button 
          className="flex items-center gap-2 bg-finance-green hover:bg-finance-green/90"
          onClick={() => onOpenDialog('receita')}
        >
          <PlusCircle className="h-4 w-4" />
          Nova Receita
        </Button>
        <Button 
          className="flex items-center gap-2 bg-finance-red hover:bg-finance-red/90"
          onClick={() => onOpenDialog('despesa')}
        >
          <PlusCircle className="h-4 w-4" />
          Nova Despesa
        </Button>
        <Button 
          className="flex items-center gap-2"
          onClick={onOpenCartaoCreditoDialog}
        >
          <CreditCard className="h-4 w-4" />
          Despesa Cartão
        </Button>
      </div>
    </div>
  );
};
