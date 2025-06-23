
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { ChevronDown, Search, ChevronLeft, ChevronRight, Edit, Trash2 } from 'lucide-react';
import { Transaction } from '@/types/financialTypes';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { deleteTransacao } from '@/services/transacaoService';

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

  const handleEditTransaction = (transaction: Transaction) => {
    if (onEdit) {
      onEdit(transaction);
    } else {
      console.log('Editar transação:', transaction);
      // Implementar edição futura se não houver callback
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
      
      // Callback para recarregar os dados
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

  const filteredTransactions = transactions.filter((transaction) => {
    const query = searchQuery.toLowerCase();
    return (
      transaction.estabelecimento?.toLowerCase().includes(query) ||
      transaction.detalhes?.toLowerCase().includes(query) ||
      transaction.categoria?.toLowerCase().includes(query) ||
      transaction.tipo?.toLowerCase().includes(query)
    );
  });

  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
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

  // Paginação
  const totalPages = Math.ceil(sortedTransactions.length / itemsPerPage);
  const paginatedTransactions = sortedTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar transações..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="ml-2">
              Filtrar <ChevronDown className="ml-1 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setSearchQuery('')}>
              Todas
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSearchQuery('receita')}>
              Receitas
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSearchQuery('despesa')}>
              Despesas
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead 
                className="cursor-pointer w-[160px]"
                onClick={() => handleSort('quando')}
              >
                Data {sortColumn === 'quando' && (sortDirection === 'asc' ? '↑' : '↓')}
              </TableHead>
              <TableHead 
                className="cursor-pointer"
                onClick={() => handleSort('estabelecimento')}
              >
                Estabelecimento {sortColumn === 'estabelecimento' && (sortDirection === 'asc' ? '↑' : '↓')}
              </TableHead>
              <TableHead 
                className="cursor-pointer"
                onClick={() => handleSort('detalhes')}
              >
                Detalhes {sortColumn === 'detalhes' && (sortDirection === 'asc' ? '↑' : '↓')}
              </TableHead>
              <TableHead 
                className="cursor-pointer"
                onClick={() => handleSort('categoria')}
              >
                Categoria {sortColumn === 'categoria' && (sortDirection === 'asc' ? '↑' : '↓')}
              </TableHead>
              <TableHead 
                className="text-right cursor-pointer"
                onClick={() => handleSort('valor')}
              >
                Valor {sortColumn === 'valor' && (sortDirection === 'asc' ? '↑' : '↓')}
              </TableHead>
              <TableHead className="w-[120px] text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array(5).fill(0).map((_, i) => (
                <TableRow key={`skeleton-${i}`}>
                  {Array(6).fill(0).map((_, j) => (
                    <TableCell key={`cell-${i}-${j}`} className="p-2">
                      <div className="h-4 bg-muted rounded animate-pulse-gentle" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : paginatedTransactions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  {searchQuery ? 'Nenhuma transação encontrada' : 'Não há transações disponíveis'}
                </TableCell>
              </TableRow>
            ) : (
              paginatedTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell className="font-medium">
                    {format(new Date(transaction.quando), 'dd/MM/yyyy')}
                  </TableCell>
                  <TableCell>{transaction.estabelecimento}</TableCell>
                  <TableCell>{transaction.detalhes}</TableCell>
                  <TableCell>
                    <span className="inline-block px-2 py-1 text-xs font-medium rounded-md bg-secondary">
                      {transaction.categoria}
                    </span>
                  </TableCell>
                  <TableCell className={cn(
                    "text-right font-medium",
                    transaction.tipo === 'receita' ? "text-green-600" : "text-red-600"
                  )}>
                    {formatCurrency(Math.abs(transaction.valor))}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditTransaction(transaction)}
                        title="Editar"
                        className="hover:bg-blue-50 hover:text-blue-600"
                      >
                        <Edit className="h-4 w-4 text-blue-600" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteClick(transaction)}
                        title="Excluir"
                        className="hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      
      {showPagination && totalPages > 0 && (
        <div className="flex items-center justify-between pt-2">
          <div className="text-sm text-muted-foreground">
            Mostrando <span className="font-medium">{Math.min(paginatedTransactions.length, itemsPerPage)}</span> de{" "}
            <span className="font-medium">{filteredTransactions.length}</span> transações
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
              Anterior
            </Button>
            <div className="text-sm">
              Página <span className="font-medium">{currentPage}</span> de{" "}
              <span className="font-medium">{totalPages}</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Próxima
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
      
      {!showPagination && filteredTransactions.length > itemsPerPage && (
        <div className="flex justify-center pt-2">
          <Link to="/transacoes">
            <Button 
              variant="outline" 
              size="sm"
            >
              Ver todas as transações
            </Button>
          </Link>
        </div>
      )}

      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir esta transação? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete} className="bg-red-600 hover:bg-red-700">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default TransactionsTable;
