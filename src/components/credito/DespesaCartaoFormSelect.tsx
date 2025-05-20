
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from '@/components/ui/use-toast';
import { criarDespesa } from '@/services/cartaoCreditoService';
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
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

const despesaSchema = z.object({
  cartaoId: z.string().min(1, { message: 'Cartão é obrigatório' }),
  valor: z.string().min(1, { message: 'Valor é obrigatório' }),
  data_despesa: z.string().min(1, { message: 'Data é obrigatória' }),
  descricao: z.string().min(1, { message: 'Descrição é obrigatória' }),
});

type DespesaFormValues = z.infer<typeof despesaSchema>;

interface DespesaCartaoFormSelectProps {
  cartoes: CartaoCredito[];
  onSuccess: () => void;
  onCancel: () => void;
}

export function DespesaCartaoFormSelect({ cartoes, onSuccess, onCancel }: DespesaCartaoFormSelectProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<DespesaFormValues>({
    resolver: zodResolver(despesaSchema),
    defaultValues: {
      cartaoId: '',
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
      
      const resultado = await criarDespesa(
        data.cartaoId,
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

  const selectedCartaoNome = form.watch('cartaoId') ? 
    cartoes.find(cartao => cartao.id === form.watch('cartaoId'))?.nome : '';

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="cartaoId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cartão de Crédito</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um cartão" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {cartoes.map((cartao) => (
                    <SelectItem key={cartao.id} value={cartao.id}>
                      {cartao.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {selectedCartaoNome && (
          <div className="mb-4">
            <p className="text-sm text-muted-foreground">Cartão selecionado: <span className="font-medium">{selectedCartaoNome}</span></p>
          </div>
        )}
        
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
