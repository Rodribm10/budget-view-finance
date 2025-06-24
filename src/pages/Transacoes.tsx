
import { useTransactions } from '@/hooks/useTransactions';
import { TransactionSummaryCards } from '@/components/transacoes/TransactionSummaryCards';
import { TransactionDialogs } from '@/components/transacoes/TransactionDialogs';
import { TransactionHeader } from '@/components/transacoes/TransactionHeader';
import TransactionsTable from '@/components/dashboard/TransactionsTable';
import { SimpleCard } from "@/components/ui/simple-card";

const Transacoes = () => {
  const {
    transactions,
    isLoading,
    isDialogOpen,
    tipoForm,
    selectedTransaction,
    isEditing,
    isCartaoCreditoDialogOpen,
    cartoes,
    totalReceitas,
    totalDespesas,
    totalCartoes,
    formatCurrency,
    handleTransactionSuccess,
    handleDespesaCartaoSuccess,
    handleEditTransaction,
    handleCloseDialog,
    handleCloseCartaoCreditoDialog,
    handleOpenDialog,
    handleOpenCartaoCreditoDialog,
    loadTransactions
  } = useTransactions();

  return (
    <div className="space-y-6">
      <TransactionHeader 
        onOpenDialog={handleOpenDialog}
        onOpenCartaoCreditoDialog={handleOpenCartaoCreditoDialog}
      />

      <TransactionSummaryCards 
        totalReceitas={totalReceitas}
        totalDespesas={totalDespesas}
        totalCartoes={totalCartoes}
        formatCurrency={formatCurrency}
      />

      <SimpleCard title="Todas as Transações" className="border-gray-200">
        <TransactionsTable 
          transactions={transactions}
          isLoading={isLoading}
          showPagination={true}
          onEdit={handleEditTransaction}
          onDelete={loadTransactions}
        />
      </SimpleCard>

      <TransactionDialogs
        isDialogOpen={isDialogOpen}
        tipoForm={tipoForm}
        selectedTransaction={selectedTransaction}
        isEditing={isEditing}
        isCartaoCreditoDialogOpen={isCartaoCreditoDialogOpen}
        cartoes={cartoes}
        onTransactionSuccess={handleTransactionSuccess}
        onDespesaCartaoSuccess={handleDespesaCartaoSuccess}
        onCloseDialog={handleCloseDialog}
        onCloseCartaoCreditoDialog={handleCloseCartaoCreditoDialog}
      />
    </div>
  );
};

export default Transacoes;
