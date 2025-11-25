import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { LogImportacao } from '@/types/importacaoTypes';
import { CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ResultadoImportacaoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  log: LogImportacao | null;
}

export const ResultadoImportacaoDialog = ({ open, onOpenChange, log }: ResultadoImportacaoDialogProps) => {
  const navigate = useNavigate();

  if (!log) return null;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const getIcon = () => {
    if (log.status === 'sucesso') return <CheckCircle2 className="w-12 h-12 text-green-600" />;
    if (log.status === 'erro') return <XCircle className="w-12 h-12 text-red-600" />;
    return <AlertCircle className="w-12 h-12 text-yellow-600" />;
  };

  const getTitulo = () => {
    if (log.status === 'sucesso') return 'Importação Concluída com Sucesso!';
    if (log.status === 'erro') return 'Erro na Importação';
    return 'Importação Parcialmente Concluída';
  };

  const handleVerTransacoes = () => {
    onOpenChange(false);
    navigate('/transacoes');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex flex-col items-center gap-4 py-4">
            {getIcon()}
            <DialogTitle className="text-center text-xl">
              {getTitulo()}
            </DialogTitle>
          </div>
        </DialogHeader>
        
        <div className="space-y-3 py-4">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Total de registros:</span>
            <span className="font-semibold">{log.total_registros}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Importadas:</span>
            <span className="font-semibold text-green-600">{log.importados}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Duplicadas (ignoradas):</span>
            <span className="font-semibold text-yellow-600">{log.duplicados}</span>
          </div>
          
          {log.erros > 0 && (
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Erros:</span>
              <span className="font-semibold text-red-600">{log.erros}</span>
            </div>
          )}
          
          <div className="flex justify-between items-center pt-3 border-t">
            <span className="text-muted-foreground">Valor total importado:</span>
            <span className="font-bold text-lg">{formatCurrency(log.valor_total)}</span>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="w-full sm:w-auto">
            Fechar
          </Button>
          <Button onClick={handleVerTransacoes} className="w-full sm:w-auto">
            Ver Transações
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
