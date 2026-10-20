
import { Transaction } from '@/types/financialTypes';
import { Search } from 'lucide-react';
import ListaTransacoes from '@/components/painel/ListaTransacoes';
import TransactionTablePagination from './table/TransactionTablePagination';
import TransactionDeleteDialog from './table/TransactionDeleteDialog';
import { useTransactionTableLogic } from './table/useTransactionTableLogic';

interface TransactionsTableProps {
  transactions: Transaction[];
  isLoading?: boolean;
  showPagination?: boolean;
  onEdit?: (transaction: Transaction) => void;
  onDelete?: () => void;
}

const TransactionsTable = ({ 
  transactions, 
  isLoading = false,
  showPagination = false,
  onEdit,
  onDelete
}: TransactionsTableProps) => {
  const {
    searchQuery,
    setSearchQuery,
    sortColumn,
    sortDirection,
    currentPage,
    setCurrentPage,
    deleteConfirmOpen,
    setDeleteConfirmOpen,
    transactionToDelete,
    totalPages,
    paginatedTransactions,
    filteredTransactions,
    itemsPerPage,
    formatCurrency,
    handleSort,
    handleDeleteClick,
    handleConfirmDelete,
  } = useTransactionTableLogic({ transactions, showPagination, onDelete });

  const handleEditTransaction = (transaction: Transaction) => {
    if (onEdit) {
      onEdit(transaction);
    } else {
      console.log('Editar transação:', transaction);
    }
  };

  return (
    <div className="space-y-3">
      <section className="overflow-hidden rounded-2xl border bg-card">
        <div className="relative border-b">
          <Search className="pointer-events-none absolute left-5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            placeholder="Buscar por nome, categoria ou detalhe"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Buscar lançamentos"
            className="h-12 w-full bg-transparent pl-12 pr-5 text-sm outline-none placeholder:text-muted-foreground focus-visible:bg-secondary/40"
          />
        </div>
        {isLoading ? (
          <div className="space-y-px">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 px-5 py-3">
                <div className="h-10 w-10 animate-pulse rounded-full bg-secondary" />
                <div className="h-3.5 flex-1 animate-pulse rounded bg-secondary" />
                <div className="h-3.5 w-20 animate-pulse rounded bg-secondary" />
              </div>
            ))}
          </div>
        ) : (
          <ListaTransacoes
            transacoes={paginatedTransactions}
            onEditar={handleEditTransaction}
            onExcluir={onDelete ? handleDeleteClick : undefined}
            vazio={searchQuery ? 'Nada encontrado com essa busca.' : undefined}
          />
        )}
      </section>

      <TransactionTablePagination 
        showPagination={showPagination}
        currentPage={currentPage}
        totalPages={totalPages}
        itemsPerPage={itemsPerPage}
        totalItems={filteredTransactions.length}
        displayedItems={paginatedTransactions.length}
        onPageChange={setCurrentPage}
      />

      <TransactionDeleteDialog 
        isOpen={deleteConfirmOpen}
        transaction={transactionToDelete}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};

export default TransactionsTable;
