
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useTransactions } from '@/hooks/useTransactions';
import { TransactionSummaryCards } from '@/components/transacoes/TransactionSummaryCards';
import { TransactionDialogs } from '@/components/transacoes/TransactionDialogs';
import { TransactionHeader } from '@/components/transacoes/TransactionHeader';
import TransactionsTable from '@/components/dashboard/TransactionsTable';
import { SimpleCard } from "@/components/ui/simple-card";

const Transacoes = () => {
  const location = useLocation();
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

  // Aplicar filtro inicial se vier do dashboard
  useEffect(() => {
    if (location.state?.filter) {
      // Aqui você pode implementar lógica adicional para filtrar automaticamente
      // Por exemplo, definir um filtro inicial na tabela
      console.log('Filtro aplicado:', location.state.filter);
    }
  }, [location.state]);

  // Filtrar transações baseado no filtro vindo do dashboard
  const getFilteredTransactions = () => {
    if (location.state?.filter) {
      return transactions.filter(t => t.tipo === location.state.filter);
    }
    return transactions;
  };

  const filteredTransactions = getFilteredTransactions();

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

      <SimpleCard 
        title={`${location.state?.filter ? 
          (location.state.filter === 'receita' ? 'Receitas' : 'Despesas') 
          : 'Todas as Transações'}`} 
        className="border-gray-200"
      >
        <TransactionsTable 
          transactions={filteredTransactions}
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
