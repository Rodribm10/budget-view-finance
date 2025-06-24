
import { useState, useMemo } from 'react';
import { Transaction } from '@/types/financialTypes';
import { useToast } from '@/hooks/use-toast';
import { deleteTransacao } from '@/services/transacaoService';

interface UseTransactionTableLogicProps {
  transactions: Transaction[];
  showPagination?: boolean;
  onDelete?: () => void;
}

export const useTransactionTableLogic = ({ 
  transactions, 
  showPagination = false, 
  onDelete 
}: UseTransactionTableLogicProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortColumn, setSortColumn] = useState<string>('quando');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState<Transaction | null>(null);
  const { toast } = useToast();
  const itemsPerPage = showPagination ? 10 : 5;

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const handleDeleteClick = (transaction: Transaction) => {
    setTransactionToDelete(transaction);
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!transactionToDelete) return;
    
    try {
      await deleteTransacao(transactionToDelete.id);
      toast({
        title: "Transação excluída",
        description: "A transação foi removida com sucesso",
      });
      
      if (onDelete) {
        onDelete();
      }
    } catch (error) {
      console.error('Erro ao excluir transação:', error);
      toast({
        title: "Erro",
        description: "Não foi possível excluir a transação",
        variant: "destructive"
      });
    } finally {
      setDeleteConfirmOpen(false);
      setTransactionToDelete(null);
    }
  };

  const filteredTransactions = useMemo(() => {
    return transactions.filter((transaction) => {
      const query = searchQuery.toLowerCase();
      return (
        transaction.estabelecimento?.toLowerCase().includes(query) ||
        transaction.detalhes?.toLowerCase().includes(query) ||
        transaction.categoria?.toLowerCase().includes(query) ||
        transaction.tipo?.toLowerCase().includes(query)
      );
    });
  }, [transactions, searchQuery]);

  const sortedTransactions = useMemo(() => {
    return [...filteredTransactions].sort((a, b) => {
      if (sortColumn === 'valor') {
        return sortDirection === 'asc' ? a.valor - b.valor : b.valor - a.valor;
      }
      
      if (sortColumn === 'quando') {
        return sortDirection === 'asc' 
          ? new Date(a.quando).getTime() - new Date(b.quando).getTime()
          : new Date(b.quando).getTime() - new Date(a.quando).getTime();
      }
      
      const aValue = a[sortColumn as keyof Transaction]?.toString().toLowerCase() || '';
      const bValue = b[sortColumn as keyof Transaction]?.toString().toLowerCase() || '';
      
      return sortDirection === 'asc' 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    });
  }, [filteredTransactions, sortColumn, sortDirection]);

  const totalPages = Math.ceil(sortedTransactions.length / itemsPerPage);
  const paginatedTransactions = useMemo(() => {
    return sortedTransactions.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );
  }, [sortedTransactions, currentPage, itemsPerPage]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  return {
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
  };
};
