
import React from 'react';
import { TransactionForm } from '@/components/dashboard/TransactionForm';
import { DespesaCartaoFormSelect } from '@/components/credito/DespesaCartaoFormSelect';
import { Transaction } from '@/types/financialTypes';
import { CartaoCredito } from '@/types/cartaoTypes';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface TransactionDialogsProps {
  isDialogOpen: boolean;
  isCartaoCreditoDialogOpen: boolean;
  tipoForm: 'receita' | 'despesa';
  selectedTransaction: Transaction | null;
  isEditing: boolean;
  cartoes: CartaoCredito[];
  onTransactionSuccess: () => void;
  onDespesaCartaoSuccess: () => void;
  onCloseDialog: () => void;
  onCloseCartaoCreditoDialog: () => void;
}

export const TransactionDialogs = ({
  isDialogOpen,
  isCartaoCreditoDialogOpen,
  tipoForm,
  selectedTransaction,
  isEditing,
  cartoes,
  onTransactionSuccess,
  onDespesaCartaoSuccess,
  onCloseDialog,
  onCloseCartaoCreditoDialog
}: TransactionDialogsProps) => {
  return (
    <>
      {/* Dialog para transações */}
      <Dialog open={isDialogOpen} onOpenChange={onCloseDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {isEditing 
                ? `Editar ${tipoForm === 'receita' ? 'Receita' : 'Despesa'}`
                : `Nova ${tipoForm === 'receita' ? 'Receita' : 'Despesa'}`
              }
            </DialogTitle>
            <DialogDescription>
              {isEditing
                ? 'Edite os campos para atualizar a transação.'
                : `Preencha os campos para registrar uma nova ${tipoForm === 'receita' ? 'receita' : 'despesa'}.`
              }
            </DialogDescription>
          </DialogHeader>
          <TransactionForm 
            onSuccess={onTransactionSuccess}
            onCancel={onCloseDialog}
            defaultTipo={tipoForm}
            transaction={selectedTransaction}
            isEditing={isEditing}
          />
        </DialogContent>
      </Dialog>

      {/* Dialog para despesas de cartão */}
      <Dialog open={isCartaoCreditoDialogOpen} onOpenChange={onCloseCartaoCreditoDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Nova Despesa de Cartão</DialogTitle>
            <DialogDescription>
              Selecione o cartão e preencha os detalhes da despesa.
            </DialogDescription>
          </DialogHeader>
          <DespesaCartaoFormSelect 
            cartoes={cartoes}
            onSuccess={onDespesaCartaoSuccess}
            onCancel={onCloseCartaoCreditoDialog}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};
