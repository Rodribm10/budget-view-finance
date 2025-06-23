
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
        className={`bg-green-600 hover:bg-green-700 text-white font-semibold text-sm px-4 py-2 rounded-lg transition-colors shadow-md ${disableAdicionar ? 'opacity-50 cursor-not-allowed' : ''}`}
        disabled={disableAdicionar}
        onClick={() => onOpenDialog('receita')}
        type="button"
      >
        Nova Receita
      </button>
      <button
        className={`bg-red-600 hover:bg-red-700 text-white font-semibold text-sm px-4 py-2 rounded-lg transition-colors shadow-md ${disableAdicionar ? 'opacity-50 cursor-not-allowed' : ''}`}
        disabled={disableAdicionar}
        onClick={() => onOpenDialog('despesa')}
        type="button"
      >
        Nova Despesa
      </button>
      <button
        className={`bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm px-4 py-2 rounded-lg transition-colors shadow-md ${disableAdicionar ? 'opacity-50 cursor-not-allowed' : ''}`}
        disabled={disableAdicionar}
        onClick={onOpenCartaoCreditoDialog}
        type="button"
      >
        Despesa de Cartão
      </button>
    </div>
  );
}
