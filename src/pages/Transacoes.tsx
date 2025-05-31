
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import TransactionsTable from '@/components/dashboard/TransactionsTable';
import { useTransactions } from '@/hooks/useTransactions';
import { TransactionHeader } from '@/components/transacoes/TransactionHeader';
import { TransactionSummaryCards } from '@/components/transacoes/TransactionSummaryCards';
import { TransactionDialogs } from '@/components/transacoes/TransactionDialogs';
import { MonthFilter } from '@/components/filters/MonthFilter';

const TransacoesPage = () => {
  // Função para obter o mês atual no formato YYYY-MM
  const getCurrentMonth = () => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  };

  const [selectedMonth, setSelectedMonth] = useState<string>(getCurrentMonth());

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
  } = useTransactions({ monthFilter: selectedMonth });

  // Função para formatar o mês para exibição
  const formatMonthDisplay = (month: string) => {
    const [year, monthNum] = month.split('-');
    const months = [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];
    return `${months[parseInt(monthNum) - 1]} ${year}`;
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight">Transações</h1>
            <p className="text-sm text-muted-foreground">
              Dados de: {formatMonthDisplay(selectedMonth)}
            </p>
          </div>
          <MonthFilter 
            selectedMonth={selectedMonth}
            onMonthChange={setSelectedMonth}
          />
        </div>

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
