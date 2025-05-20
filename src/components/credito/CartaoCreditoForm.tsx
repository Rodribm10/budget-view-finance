
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from '@/components/ui/use-toast';
import { criarCartao } from '@/services/cartaoCreditoService';
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

const cartaoSchema = z.object({
  nome: z.string().min(1, { message: 'Nome do cartão é obrigatório' }),
});

type CartaoFormValues = z.infer<typeof cartaoSchema>;

interface CartaoCreditoFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export function CartaoCreditoForm({ onSuccess, onCancel }: CartaoCreditoFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<CartaoFormValues>({
    resolver: zodResolver(cartaoSchema),
    defaultValues: {
      nome: '',
    }
  });

  async function onSubmit(data: CartaoFormValues) {
    setIsSubmitting(true);
    
    try {
      const resultado = await criarCartao(data.nome);
      
      if (resultado) {
        toast({
          title: "Cartão adicionado",
          description: "Cartão de crédito cadastrado com sucesso",
        });
        onSuccess();
      } else {
        toast({
          title: "Erro ao salvar",
          description: "Não foi possível salvar o cartão de crédito",
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
        <FormField
          control={form.control}
          name="nome"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome do Cartão</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Nubank, Itaú, Banco do Brasil..." {...field} />
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
