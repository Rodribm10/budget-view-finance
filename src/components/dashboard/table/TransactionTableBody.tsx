import { format } from 'date-fns';
import { Edit, Trash2 } from 'lucide-react';
import { Transaction } from '@/types/financialTypes';
import { Button } from '@/components/ui/button';
import { TableBody, TableCell, TableRow } from '@/components/ui/table';
import { cn } from '@/lib/utils';
interface TransactionTableBodyProps {
  transactions: Transaction[];
  isLoading: boolean;
  onEdit: (transaction: Transaction) => void;
  onDelete: (transaction: Transaction) => void;
  formatCurrency: (value: number) => string;
}
const TransactionTableBody = ({
  transactions,
  isLoading,
  onEdit,
  onDelete,
  formatCurrency
}: TransactionTableBodyProps) => {
  if (isLoading) {
    return <TableBody>
        {Array(5).fill(0).map((_, i) => <TableRow key={`skeleton-${i}`}>
            {Array(6).fill(0).map((_, j) => <TableCell key={`cell-${i}-${j}`} className="p-2">
                <div className="h-4 bg-muted rounded animate-pulse-gentle" />
              </TableCell>)}
          </TableRow>)}
      </TableBody>;
  }
  if (transactions.length === 0) {
    return <TableBody>
        <TableRow>
          <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
            Nenhuma transação encontrada
          </TableCell>
        </TableRow>
      </TableBody>;
  }
  return <TableBody>
      {transactions.map(transaction => <TableRow key={transaction.id}>
          <TableCell className="font-medium">
            {format(new Date(transaction.quando), 'dd/MM/yyyy')}
          </TableCell>
          <TableCell>{transaction.estabelecimento}</TableCell>
          <TableCell>{transaction.detalhes}</TableCell>
          <TableCell>
            <span className="inline-block px-2 py-1 text-xs font-medium rounded-md bg-orange-500">
              {transaction.categoria}
            </span>
          </TableCell>
          <TableCell className={cn("text-right font-medium", transaction.tipo === 'receita' ? "text-green-600" : "text-red-600")}>
            {formatCurrency(Math.abs(transaction.valor))}
          </TableCell>
          <TableCell className="text-right">
            <div className="flex justify-end space-x-1">
              <Button variant="ghost" size="icon" onClick={() => onEdit(transaction)} title="Editar" className="hover:bg-blue-50 hover:text-blue-600">
                <Edit className="h-4 w-4 text-blue-600" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => onDelete(transaction)} title="Excluir" className="hover:bg-red-50 hover:text-red-600">
                <Trash2 className="h-4 w-4 text-red-600" />
              </Button>
            </div>
          </TableCell>
        </TableRow>)}
    </TableBody>;
};
export default TransactionTableBody;