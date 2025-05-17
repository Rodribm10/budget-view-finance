
import { useState } from 'react';
import { format } from 'date-fns';
import { ChevronDown, Search } from 'lucide-react';
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

interface TransactionsTableProps {
  transactions: Transaction[];
  isLoading?: boolean;
}

const TransactionsTable = ({ transactions, isLoading = false }: TransactionsTableProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortColumn, setSortColumn] = useState<string>('quando');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const filteredTransactions = transactions.filter((transaction) => {
    const query = searchQuery.toLowerCase();
    return (
      transaction.estabelecimento.toLowerCase().includes(query) ||
      transaction.detalhes.toLowerCase().includes(query) ||
      transaction.categoria.toLowerCase().includes(query)
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
            <DropdownMenuItem onClick={() => setSearchQuery('entrada')}>
              Receitas
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSearchQuery('saida')}>
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
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array(5).fill(0).map((_, i) => (
                <TableRow key={`skeleton-${i}`}>
                  {Array(5).fill(0).map((_, j) => (
                    <TableCell key={`cell-${i}-${j}`} className="p-2">
                      <div className="h-4 bg-muted rounded animate-pulse-gentle" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : sortedTransactions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  {searchQuery ? 'Nenhuma transação encontrada' : 'Não há transações disponíveis'}
                </TableCell>
              </TableRow>
            ) : (
              sortedTransactions.slice(0, 5).map((transaction) => (
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
                    transaction.tipo === 'entrada' ? "text-finance-green" : "text-finance-red"
                  )}>
                    {transaction.tipo === 'entrada' ? '+' : '-'}{formatCurrency(Math.abs(transaction.valor))}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      
      <div className="flex justify-center pt-2">
        <Button variant="outline" size="sm">
          Ver todas as transações
        </Button>
      </div>
    </div>
  );
};

export default TransactionsTable;
