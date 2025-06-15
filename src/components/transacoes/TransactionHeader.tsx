import React from 'react';

interface TransactionHeaderProps {
  onOpenDialog: (tipo: 'receita' | 'despesa') => void;
  onOpenCartaoCreditoDialog: () => void;
  disableAdicionar?: boolean;
}

export function TransactionHeader({
  onOpenDialog,
  onOpenCartaoCreditoDialog,
  disableAdicionar = false,
}: TransactionHeaderProps) {
  return (
    <div className="flex gap-2">
      <button
        className={`bg-finance-green hover:bg-green-600 text-white text-sm px-4 py-2 rounded transition-colors ${disableAdicionar ? 'opacity-50 cursor-not-allowed' : ''}`}
        disabled={disableAdicionar}
        onClick={() => onOpenDialog('receita')}
        type="button"
      >
        Nova Receita
      </button>
      <button
        className={`bg-finance-red hover:bg-red-600 text-white text-sm px-4 py-2 rounded transition-colors ${disableAdicionar ? 'opacity-50 cursor-not-allowed' : ''}`}
        disabled={disableAdicionar}
        onClick={() => onOpenDialog('despesa')}
        type="button"
      >
        Nova Despesa
      </button>
      <button
        className={`bg-blue-500 hover:bg-blue-600 text-white text-sm px-4 py-2 rounded transition-colors ${disableAdicionar ? 'opacity-50 cursor-not-allowed' : ''}`}
        disabled={disableAdicionar}
        onClick={onOpenCartaoCreditoDialog}
        type="button"
      >
        Despesa de Cartão
      </button>
    </div>
  );
}
