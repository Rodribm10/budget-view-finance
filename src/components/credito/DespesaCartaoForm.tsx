
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from '@/components/ui/use-toast';
import { criarDespesa } from '@/services/cartao/despesas'; // Updated import path
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { CartaoCredito } from '@/types/cartaoTypes';

const despesaSchema = z.object({
  valor: z.string().min(1, { message: 'Valor é obrigatório' }),
  data_despesa: z.string().min(1, { message: 'Data é obrigatória' }),
  descricao: z.string().min(1, { message: 'Descrição é obrigatória' }),
});

type DespesaFormValues = z.infer<typeof despesaSchema>;

interface DespesaCartaoFormProps {
  cartao: CartaoCredito;
  onSuccess: () => void;
  onCancel: () => void;
}

export function DespesaCartaoForm({ cartao, onSuccess, onCancel }: DespesaCartaoFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<DespesaFormValues>({
    resolver: zodResolver(despesaSchema),
    defaultValues: {
      valor: '',
      data_despesa: new Date().toISOString().split('T')[0],
      descricao: '',
    }
  });

  async function onSubmit(data: DespesaFormValues) {
    setIsSubmitting(true);
    
    try {
      const valorNumerico = parseFloat(data.valor.replace(',', '.'));
      
      if (isNaN(valorNumerico)) {
        toast({
          title: "Erro no formulário",
          description: "O valor precisa ser um número válido",
          variant: "destructive"
        });
        setIsSubmitting(false);
        return;
      }
      
      console.log('Enviando dados para registro de despesa:', {
        cartao_id: cartao.id,
        cartao_nome: cartao.nome,
        cartao_codigo: cartao.cartao_codigo,
        valor: valorNumerico,
        data: data.data_despesa,
        descricao: data.descricao
      });
      
      // Make sure we're passing all 5 required parameters
      const resultado = await criarDespesa(
        cartao.id,
        cartao.cartao_codigo,
        valorNumerico,
        data.data_despesa,
        data.descricao
      );
      
      if (resultado) {
        toast({
          title: "Despesa adicionada",
          description: "Despesa do cartão cadastrada com sucesso",
        });
        onSuccess();
      } else {
        toast({
          title: "Erro ao salvar",
          description: "Não foi possível salvar a despesa do cartão",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Erro ao processar formulário:', error);
      toast({
        title: "Erro inesperado",
        description: "Ocorreu um erro ao processar sua solicitação",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="mb-4">
          <h3 className="font-medium">Cartão: {cartao.nome}</h3>
        </div>
        
        <FormField
          control={form.control}
          name="valor"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Valor</FormLabel>
              <FormControl>
                <Input 
                  placeholder="0,00" 
                  {...field} 
                  type="text"
                  inputMode="decimal"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="data_despesa"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Data</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="descricao"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                <Input placeholder="Detalhes da despesa" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-end space-x-2 pt-2">
          <Button variant="outline" type="button" onClick={onCancel} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Salvando..." : "Salvar"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
