
import { useEffect } from 'react';
import { Transaction } from '@/types/financialTypes';
import { Form } from '@/components/ui/form';
import { useTransactionForm } from '@/hooks/useTransactionForm';
import { TransactionTextField } from '@/components/transaction/TransactionTextField';
import { TransactionTypeField } from '@/components/transaction/TransactionTypeField';
import { TransactionDateField } from '@/components/transaction/TransactionDateField';
import { GroupSelectField } from '@/components/transaction/GroupSelectField';
import { TransactionFormActions } from '@/components/transaction/TransactionFormActions';

interface TransactionFormProps {
  onSuccess: () => void;
  onCancel: () => void;
  defaultTipo?: 'receita' | 'despesa';
  grupoId?: string;
  transaction?: Transaction | null;
  isEditing?: boolean;
}

export function TransactionForm({ 
  onSuccess, 
  onCancel, 
  defaultTipo = 'despesa', 
  grupoId,
  transaction = null,
  isEditing = false
}: TransactionFormProps) {
  const {
    form,
    grupos,
    isSubmitting,
    onSubmit,
    fetchGrupos
  } = useTransactionForm(
    onSuccess,
    onCancel,
    defaultTipo,
    transaction,
    isEditing
  );

  // Fetch user groups when the form loads
  useEffect(() => {
    fetchGrupos();
  }, []);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <TransactionTextField
          form={form}
          name="estabelecimento"
          label="Estabelecimento"
          placeholder="Nome do estabelecimento"
        />
        
        <TransactionTextField
          form={form}
          name="valor"
          label="Valor"
          placeholder="0,00"
          type="text"
          inputMode="decimal"
        />
        
        <TransactionTypeField form={form} />
        
        <TransactionTextField
          form={form}
          name="categoria"
          label="Categoria"
          placeholder="Categoria"
        />
        
        <TransactionTextField
          form={form}
          name="detalhes"
          label="Detalhes"
          placeholder="Detalhes da transação"
        />
        
        <TransactionDateField form={form} />
        
        <GroupSelectField form={form} grupos={grupos} />
        
        <TransactionFormActions
          onCancel={onCancel}
          isSubmitting={isSubmitting}
          defaultTipo={defaultTipo}
        />
      </form>
    </Form>
  );
}
