
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { salvarMeta } from '@/services/metasService';

const formSchema = z.object({
  mes: z.string(),
  ano: z.string(),
  valor_meta: z.string().refine(value => !isNaN(Number(value)) && Number(value) > 0, {
    message: 'Valor da meta deve ser um número positivo',
  }),
});

interface MetaFormProps {
  onSuccess: () => void;
  onCancel: () => void;
  userId: string;
  valorInicial?: number;
  mesInicial?: number;
  anoInicial?: number;
}

export function MetasForm({ onSuccess, onCancel, userId, valorInicial = 0, mesInicial, anoInicial }: MetaFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const meses = Array.from({ length: 12 }, (_, i) => {
    const date = new Date(2000, i, 1);
    return {
      value: (i + 1).toString(),
      label: format(date, 'MMMM', { locale: ptBR }),
    };
  });

  const anos = Array.from({ length: 6 }, (_, i) => {
    const ano = new Date().getFullYear() - 2 + i;
    return {
      value: ano.toString(),
      label: ano.toString(),
    };
  });

  // Valor atual do mês e ano
  const currentDate = new Date();
  const mesAtual = (mesInicial || currentDate.getMonth() + 1).toString();
  const anoAtual = (anoInicial || currentDate.getFullYear()).toString();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      mes: mesAtual,
      ano: anoAtual,
      valor_meta: valorInicial > 0 ? valorInicial.toString() : '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsSubmitting(true);
      const novaMeta = {
        user_id: userId,
        mes: parseInt(values.mes),
        ano: parseInt(values.ano),
        valor_meta: parseFloat(values.valor_meta)
      };
      
      await salvarMeta(novaMeta);
      
      toast({
        title: "Meta registrada com sucesso",
        description: `Meta de economia para ${meses.find(m => m.value === values.mes)?.label} de ${values.ano} salva.`,
      });
      
      onSuccess();
    } catch (error) {
      console.error("Erro ao salvar meta:", error);
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar a meta. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="mes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mês</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                  disabled={isSubmitting}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o mês" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {meses.map((mes) => (
                      <SelectItem key={mes.value} value={mes.value}>
                        {mes.label}
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
            name="ano"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ano</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                  disabled={isSubmitting}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o ano" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {anos.map((ano) => (
                      <SelectItem key={ano.value} value={ano.value}>
                        {ano.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="valor_meta"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Valor da Meta (R$)</FormLabel>
              <FormControl>
                <Input
                  placeholder="0.00"
                  {...field}
                  disabled={isSubmitting}
                  type="number"
                  step="0.01"
                  min="0"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2">
          <Button 
            variant="outline" 
            onClick={onCancel} 
            disabled={isSubmitting}
            type="button"
          >
            Cancelar
          </Button>
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="bg-finance-green hover:bg-finance-green/90"
          >
            {isSubmitting ? "Salvando..." : "Salvar Meta"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
