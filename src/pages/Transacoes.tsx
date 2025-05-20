
import React from 'react';
import Layout from '@/components/layout/Layout';
import TransactionsTable from '@/components/dashboard/TransactionsTable';
import { useTransactions } from '@/hooks/useTransactions';
import { TransactionHeader } from '@/components/transacoes/TransactionHeader';
import { TransactionSummaryCards } from '@/components/transacoes/TransactionSummaryCards';
import { TransactionDialogs } from '@/components/transacoes/TransactionDialogs';

const TransacoesPage = () => {
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
    <Layout>
      <div className="space-y-6">
        <TransactionHeader 
          onOpenDialog={handleOpenDialog}
          onOpenCartaoCreditoDialog={handleOpenCartaoCreditoDialog}
        />

        {/* Resumo em Cards */}
        <TransactionSummaryCards 
          totalReceitas={totalReceitas}
          totalDespesas={totalDespesas}
          totalCartoes={totalCartoes}
          formatCurrency={formatCurrency}
        />

        {/* Tabela completa de transações */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Todas as Transações</h2>
          <TransactionsTable 
            transactions={transactions} 
            isLoading={isLoading}
            showPagination={true}
            onEdit={handleEditTransaction}
            onDelete={loadTransactions}
          />
        </div>

        {/* Diálogos */}
        <TransactionDialogs 
          isDialogOpen={isDialogOpen}
          isCartaoCreditoDialogOpen={isCartaoCreditoDialogOpen}
          tipoForm={tipoForm}
          selectedTransaction={selectedTransaction}
          isEditing={isEditing}
          cartoes={cartoes}
          onTransactionSuccess={handleTransactionSuccess}
          onDespesaCartaoSuccess={handleDespesaCartaoSuccess}
          onCloseDialog={handleCloseDialog}
          onCloseCartaoCreditoDialog={handleCloseCartaoCreditoDialog}
        />
      </div>
    </Layout>
  );
};

export default TransacoesPage;
