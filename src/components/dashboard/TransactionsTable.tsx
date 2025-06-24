
import { Transaction } from '@/types/financialTypes';
import { Table } from '@/components/ui/table';
import TransactionTableSearch from './table/TransactionTableSearch';
import TransactionTableHeader from './table/TransactionTableHeader';
import TransactionTableBody from './table/TransactionTableBody';
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
    <div className="space-y-4">
      <TransactionTableSearch 
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <div className="rounded-md border">
        <Table>
          <TransactionTableHeader 
            sortColumn={sortColumn}
            sortDirection={sortDirection}
            onSort={handleSort}
          />
          <TransactionTableBody 
            transactions={paginatedTransactions}
            isLoading={isLoading}
            onEdit={handleEditTransaction}
            onDelete={handleDeleteClick}
            formatCurrency={formatCurrency}
          />
        </Table>
      </div>
      
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
