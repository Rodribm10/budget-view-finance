
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { X, Save } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuthStore } from '@/stores/authStore';

interface ContaRecorrenteFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

interface FormData {
  nome_conta: string;
  descricao: string;
  valor: number;
  dia_vencimento: number;
  hora_aviso: string;
  dias_antecedencia: number;
}

const ContaRecorrenteForm = ({ onClose, onSuccess }: ContaRecorrenteFormProps) => {
  const { user } = useAuthStore();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    defaultValues: {
      hora_aviso: '09:00',
      dias_antecedencia: 1
    }
  });

  const onSubmit = async (data: FormData) => {
    if (!user?.id) {
      toast.error('Usuário não encontrado. Faça login novamente.');
      return;
    }

    try {
      const { error } = await supabase
        .from('contas_recorrentes')
        .insert([{
          ...data,
          user_id: user.id,
          valor: data.valor || null
        }]);

      if (error) throw error;

      toast.success('Conta recorrente cadastrada com sucesso!');
      onSuccess();
    } catch (error) {
      console.error('Erro ao cadastrar conta:', error);
      toast.error('Erro ao cadastrar conta. Tente novamente.');
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Nova Conta Recorrente</CardTitle>
            <CardDescription>
              Configure uma conta que será cobrada mensalmente no mesmo dia
            </CardDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nome_conta">Nome da Conta *</Label>
              <Input
                id="nome_conta"
                {...register('nome_conta', { required: 'Nome da conta é obrigatório' })}
                placeholder="Ex: Energia elétrica, Internet, Financiamento"
              />
              {errors.nome_conta && (
                <p className="text-sm text-red-600">{errors.nome_conta.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="valor">Valor (opcional)</Label>
              <Input
                id="valor"
                type="number"
                step="0.01"
                {...register('valor', { 
                  valueAsNumber: true,
                  min: { value: 0, message: 'Valor deve ser positivo' }
                })}
                placeholder="0,00"
              />
              {errors.valor && (
                <p className="text-sm text-red-600">{errors.valor.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="descricao">Descrição (opcional)</Label>
            <Textarea
              id="descricao"
              {...register('descricao')}
              placeholder="Adicione detalhes sobre esta conta..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dia_vencimento">Dia do Vencimento *</Label>
              <Input
                id="dia_vencimento"
                type="number"
                {...register('dia_vencimento', {
                  required: 'Dia do vencimento é obrigatório',
                  valueAsNumber: true,
                  min: { value: 1, message: 'Dia deve ser entre 1 e 31' },
                  max: { value: 31, message: 'Dia deve ser entre 1 e 31' }
                })}
                placeholder="15"
              />
              {errors.dia_vencimento && (
                <p className="text-sm text-red-600">{errors.dia_vencimento.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="hora_aviso">Horário do Aviso *</Label>
              <Input
                id="hora_aviso"
                type="time"
                {...register('hora_aviso', { required: 'Horário é obrigatório' })}
              />
              {errors.hora_aviso && (
                <p className="text-sm text-red-600">{errors.hora_aviso.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="dias_antecedencia">Dias de Antecedência *</Label>
              <Input
                id="dias_antecedencia"
                type="number"
                {...register('dias_antecedencia', {
                  required: 'Dias de antecedência é obrigatório',
                  valueAsNumber: true,
                  min: { value: 1, message: 'Mínimo 1 dia' },
                  max: { value: 30, message: 'Máximo 30 dias' }
                })}
                placeholder="1"
              />
              {errors.dias_antecedencia && (
                <p className="text-sm text-red-600">{errors.dias_antecedencia.message}</p>
              )}
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Como funcionam os avisos:</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Se escolher 1 dia de antecedência: receberá 1 aviso no dia anterior</li>
              <li>• Se escolher 3 dias: receberá avisos nos 3 dias anteriores ao vencimento</li>
              <li>• Os avisos são enviados no horário configurado via WhatsApp</li>
            </ul>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700">
              <Save className="h-4 w-4 mr-2" />
              {isSubmitting ? 'Salvando...' : 'Salvar Conta'}
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ContaRecorrenteForm;
