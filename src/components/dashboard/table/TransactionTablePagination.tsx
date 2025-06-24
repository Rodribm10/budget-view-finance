
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TransactionTablePaginationProps {
  showPagination: boolean;
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  totalItems: number;
  displayedItems: number;
  onPageChange: (page: number) => void;
}

const TransactionTablePagination = ({
  showPagination,
  currentPage,
  totalPages,
  itemsPerPage,
  totalItems,
  displayedItems,
  onPageChange
}: TransactionTablePaginationProps) => {
  if (showPagination && totalPages > 0) {
    return (
      <div className="flex items-center justify-between pt-2">
        <div className="text-sm text-muted-foreground">
          Mostrando <span className="font-medium">{Math.min(displayedItems, itemsPerPage)}</span> de{" "}
          <span className="font-medium">{totalItems}</span> transações
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage - 1)}
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
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Próxima
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  if (!showPagination && totalItems > itemsPerPage) {
    return (
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
    );
  }

  return null;
};

export default TransactionTablePagination;
