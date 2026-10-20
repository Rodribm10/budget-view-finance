import { CreditCard, Minus, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TransactionHeaderProps {
  onOpenDialog: (tipo: 'receita' | 'despesa') => void;
  onOpenCartaoCreditoDialog: () => void;
  disableAdicionar?: boolean;
}

// Uma ação principal (gasto é o mais comum); as outras ficam ao lado, mais discretas.
export function TransactionHeader({
  onOpenDialog,
  onOpenCartaoCreditoDialog,
  disableAdicionar = false,
}: TransactionHeaderProps) {
  return (
    <div className="flex gap-2">
      <Button onClick={() => onOpenDialog('despesa')} disabled={disableAdicionar} className="flex-1 md:flex-none">
        <Minus className="mr-1.5 h-4 w-4" /> Gasto
      </Button>
      <Button variant="outline" onClick={() => onOpenDialog('receita')} disabled={disableAdicionar} className="flex-1 md:flex-none">
        <Plus className="mr-1.5 h-4 w-4" /> Entrada
      </Button>
      <Button variant="outline" onClick={onOpenCartaoCreditoDialog} disabled={disableAdicionar} className="flex-1 md:flex-none">
        <CreditCard className="mr-1.5 h-4 w-4" /> Cartão
      </Button>
    </div>
  );
}
