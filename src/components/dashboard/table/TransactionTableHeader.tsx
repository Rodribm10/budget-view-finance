
import { TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface TransactionTableHeaderProps {
  sortColumn: string;
  sortDirection: 'asc' | 'desc';
  onSort: (column: string) => void;
}

const TransactionTableHeader = ({ sortColumn, sortDirection, onSort }: TransactionTableHeaderProps) => {
  const getSortIcon = (column: string) => {
    return sortColumn === column ? (sortDirection === 'asc' ? '↑' : '↓') : '';
  };

  return (
    <TableHeader>
      <TableRow>
        <TableHead 
          className="cursor-pointer w-[160px]"
          onClick={() => onSort('quando')}
        >
          Data {getSortIcon('quando')}
        </TableHead>
        <TableHead 
          className="cursor-pointer"
          onClick={() => onSort('estabelecimento')}
        >
          Estabelecimento {getSortIcon('estabelecimento')}
        </TableHead>
        <TableHead 
          className="cursor-pointer"
          onClick={() => onSort('detalhes')}
        >
          Detalhes {getSortIcon('detalhes')}
        </TableHead>
        <TableHead 
          className="cursor-pointer"
          onClick={() => onSort('categoria')}
        >
          Categoria {getSortIcon('categoria')}
        </TableHead>
        <TableHead 
          className="text-right cursor-pointer"
          onClick={() => onSort('valor')}
        >
          Valor {getSortIcon('valor')}
        </TableHead>
        <TableHead className="w-[120px] text-right">Ações</TableHead>
      </TableRow>
    </TableHeader>
  );
};

export default TransactionTableHeader;
