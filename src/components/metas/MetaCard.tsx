
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Edit, Trash2, Target } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { MetaFinanceira } from '@/types/financialTypes';
import { deletarMeta } from '@/services/metasService';
import { useToast } from '@/hooks/use-toast';

interface MetaCardProps {
  meta: MetaFinanceira;
  onEdit: (meta: MetaFinanceira) => void;
  onDeleteSuccess: () => void;
}

const MetaCard = ({ meta, onEdit, onDeleteSuccess }: MetaCardProps) => {
  const { toast } = useToast();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatMonth = (mes: number, ano: number) => {
    const date = new Date(ano, mes - 1, 1);
    return format(date, 'MMMM yyyy', { locale: ptBR });
  };

  const handleDelete = async () => {
    if (window.confirm('Tem certeza que deseja excluir esta meta?')) {
      try {
        await deletarMeta(meta.id);
        onDeleteSuccess();
      } catch (error) {
        console.error('Erro ao deletar meta:', error);
        toast({
          title: 'Erro',
          description: 'Não foi possível excluir a meta',
          variant: 'destructive',
        });
      }
    }
  };

  // Calcular progresso simulado (seria necessário buscar transações reais)
  const progressoSimulado = Math.random() * 100;
  const valorAtual = (meta.valor_meta * progressoSimulado) / 100;

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center space-x-2">
          <Target className="h-5 w-5 text-blue-600" />
          <CardTitle className="text-sm font-medium">
            {formatMonth(meta.mes, meta.ano)}
          </CardTitle>
        </div>
        <div className="flex space-x-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(meta)}
            className="h-8 w-8 p-0"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDelete}
            className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div>
            <div className="text-2xl font-bold text-blue-600">
              {formatCurrency(meta.valor_meta)}
            </div>
            <p className="text-xs text-muted-foreground">Meta de economia</p>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progresso</span>
              <span>{formatCurrency(valorAtual)}</span>
            </div>
            <Progress value={progressoSimulado} className="h-2" />
            <div className="text-xs text-muted-foreground text-center">
              {progressoSimulado.toFixed(1)}% da meta atingida
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MetaCard;
