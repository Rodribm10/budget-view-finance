
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Trophy, Flag, FlagOff } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from '@/components/ui/progress';
import { ResultadoMeta } from '@/types/financialTypes';

interface MetaProgressCardProps {
  meta: ResultadoMeta;
  onEditClick?: () => void;
}

export function MetaProgressCard({ meta, onEditClick }: MetaProgressCardProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const getMesNome = (mes: number) => {
    const date = new Date(2000, mes - 1, 1);
    return format(date, 'MMMM', { locale: ptBR });
  };

  const getStatusIcon = () => {
    if (meta.meta_batida) {
      return <Trophy className="h-8 w-8 text-yellow-500" />;
    } else {
      return <FlagOff className="h-8 w-8 text-gray-400" />;
    }
  };

  const getProgressColor = () => {
    if (meta.meta_batida) {
      return 'bg-green-500';
    } else if (meta.percentual_atingido >= 75) {
      return 'bg-yellow-500';
    } else {
      return 'bg-red-500';
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className={`pb-2 ${meta.meta_batida ? 'bg-green-50' : 'bg-gray-50'}`}>
        <CardTitle className="flex items-center justify-between">
          <span className="capitalize">{getMesNome(meta.mes)} {meta.ano}</span>
          <div className="flex items-center">
            {getStatusIcon()}
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="pt-4 space-y-4">
        <div className="flex justify-between text-sm text-muted-foreground mb-1">
          <span>Meta: {formatCurrency(meta.valor_meta)}</span>
          <span>Economia: {formatCurrency(meta.economia_real)}</span>
        </div>
        
        <div className="space-y-1">
          <div className="h-2 w-full">
            <Progress 
              value={meta.percentual_atingido} 
              max={100}
              className={getProgressColor()}
            />
          </div>
          <div className="flex justify-between text-xs">
            <span>0%</span>
            <span className="font-medium">{meta.percentual_atingido.toFixed(0)}% atingido</span>
            <span>100%</span>
          </div>
        </div>
      </CardContent>
      
      {onEditClick && (
        <CardFooter className="bg-muted/50 pt-1 px-4 pb-2">
          <button 
            onClick={onEditClick}
            className="text-sm text-muted-foreground hover:text-primary w-full text-center"
          >
            Editar meta
          </button>
        </CardFooter>
      )}
    </Card>
  );
}
