
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { ResultadoMeta } from '@/types/financialTypes';
import { Check, Edit2, Trash2 } from 'lucide-react';

interface MetaProgressCardProps {
  meta: ResultadoMeta;
  onEditClick: () => void;
  onDeleteClick: () => void;
}

export function MetaProgressCard({ meta, onEditClick, onDeleteClick }: MetaProgressCardProps) {
  // Format the month name in Portuguese
  const mesFormatado = format(new Date(meta.ano, meta.mes - 1, 1), 'MMMM', { locale: ptBR });
  const mesCapitalizado = mesFormatado.charAt(0).toUpperCase() + mesFormatado.slice(1);

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-3">
          <div>
            <h3 className="text-lg font-medium">{mesCapitalizado}</h3>
            <p className="text-sm text-muted-foreground">{meta.ano}</p>
          </div>
          <div className="flex space-x-2">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8" 
              onClick={onEditClick}
            >
              <Edit2 className="h-4 w-4" />
              <span className="sr-only">Editar</span>
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10" 
              onClick={onDeleteClick}
            >
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Deletar</span>
            </Button>
          </div>
        </div>
        
        <div className="mb-4">
          <div className="flex justify-between mb-1">
            <span className="text-sm">Meta de Economia</span>
            <span className="text-sm font-semibold">R$ {meta.valor_meta.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm">Economia Real</span>
            <span className="text-sm font-semibold">R$ {meta.economia_real.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
          </div>
        </div>
        
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm font-semibold">Progresso</span>
            <span className="text-sm font-medium">
              {meta.percentual_atingido.toFixed(0)}%
            </span>
          </div>
          <Progress value={meta.percentual_atingido} className="h-2" />
        </div>
      </CardContent>
      
      <CardFooter className={`p-3 ${meta.meta_batida ? 'bg-green-100 dark:bg-green-900/20' : 'bg-muted/50'}`}>
        <div className="flex items-center w-full justify-between">
          <span className="text-sm font-medium">
            {meta.meta_batida ? 'Meta atingida!' : 'Meta em andamento'}
          </span>
          {meta.meta_batida && <Check className="h-4 w-4 text-green-600 dark:text-green-500" />}
        </div>
      </CardFooter>
    </Card>
  );
}
