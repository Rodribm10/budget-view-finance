
import { Button } from "@/components/ui/button";

interface TransactionFormActionsProps {
  onCancel: () => void;
  isSubmitting: boolean;
  defaultTipo?: 'receita' | 'despesa';
}

export function TransactionFormActions({ 
  onCancel, 
  isSubmitting, 
  defaultTipo = 'despesa' 
}: TransactionFormActionsProps) {
  return (
    <div className="flex justify-end space-x-2 pt-2">
      <Button 
        variant="outline" 
        type="button" 
        onClick={onCancel} 
        disabled={isSubmitting}
      >
        Cancelar
      </Button>
      <Button 
        type="submit" 
        disabled={isSubmitting} 
        className={defaultTipo === 'receita' ? 'bg-finance-green hover:bg-finance-green/90' : ''}
      >
        {isSubmitting ? "Salvando..." : "Salvar"}
      </Button>
    </div>
  );
}
