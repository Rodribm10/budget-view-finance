
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from '@/components/ui/use-toast';
import { CartaoCredito } from '@/types/cartaoTypes';
import { criarDespesa } from '@/services/cartao/despesasService';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from '@/lib/utils';

const despesaCartaoSchema = z.object({
  cartao_id: z.string().min(1, { message: 'Selecione um cartão' }),
  valor: z.number().positive({ message: 'O valor deve ser maior que zero' }),
  data_despesa: z.date({
    required_error: "Selecione uma data",
  }),
  descricao: z.string().min(1, { message: 'Descrição é obrigatória' }),
});

type DespesaCartaoFormValues = z.infer<typeof despesaCartaoSchema>;

interface DespesaCartaoFormSelectProps {
  cartoes: CartaoCredito[];
  onSuccess: () => void;
  onCancel: () => void;
}

export function DespesaCartaoFormSelect({ cartoes, onSuccess, onCancel }: DespesaCartaoFormSelectProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const [selectedCartao, setSelectedCartao] = useState<CartaoCredito | null>(null);

  const form = useForm<DespesaCartaoFormValues>({
    resolver: zodResolver(despesaCartaoSchema),
    defaultValues: {
      valor: undefined,
      data_despesa: new Date(),
      descricao: '',
    }
  });

  const handleCartaoChange = (cartaoId: string) => {
    const cartao = cartoes.find(c => c.id === cartaoId);
    setSelectedCartao(cartao || null);
  };

  const formatCartaoLabel = (cartao: CartaoCredito) => {
    let label = cartao.nome;
    if (cartao.banco) label += ` - ${cartao.banco}`;
    if (cartao.bandeira) label += ` (${cartao.bandeira})`;
    return label;
  };

  async function onSubmit(data: DespesaCartaoFormValues) {
    if (!selectedCartao) {
      toast({
        title: "Erro",
        description: "Selecione um cartão primeiro",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const formattedDate = format(data.data_despesa, 'yyyy-MM-dd');
      
      // Garantir que temos um cartao_codigo, mesmo que seja gerado na hora
      const cartaoCodigo = selectedCartao.cartao_codigo || selectedCartao.nome;
      
      console.log('Enviando dados para criar despesa:', {
        cartao_id: data.cartao_id,
        cartao_nome: selectedCartao.nome,
        cartao_codigo: cartaoCodigo,
        valor: data.valor,
        data_despesa: formattedDate,
        descricao: data.descricao
      });
      
      const resultado = await criarDespesa(
        data.cartao_id,
        cartaoCodigo,
        data.valor,
        formattedDate, 
        data.descricao
      );
      
      if (resultado) {
        toast({
          title: "Despesa adicionada",
          description: "Despesa do cartão registrada com sucesso",
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
        <FormField
          control={form.control}
          name="cartao_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cartão de Crédito</FormLabel>
              <Select 
                onValueChange={(value) => {
                  field.onChange(value);
                  handleCartaoChange(value);
                }} 
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um cartão" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {cartoes.map((cartao) => (
                    <SelectItem key={cartao.id} value={cartao.id}>
                      {formatCartaoLabel(cartao)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="valor"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Valor</FormLabel>
              <FormControl>
                <Input 
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  {...field}
                  onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
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
            <FormItem className="flex flex-col">
              <FormLabel>Data da Despesa</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "dd/MM/yyyy", { locale: ptBR })
                      ) : (
                        <span>Selecione uma data</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date > new Date() || date < new Date("1900-01-01")
                    }
                    initialFocus
                    locale={ptBR}
                  />
                </PopoverContent>
              </Popover>
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
                <Input placeholder="Ex: Compras de supermercado, Restaurante..." {...field} />
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
