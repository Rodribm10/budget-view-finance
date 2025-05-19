
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
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
  SelectValue
} from '@/components/ui/select';
import { useNavigate } from 'react-router-dom';

const transactionSchema = z.object({
  estabelecimento: z.string().min(1, { message: 'Estabelecimento é obrigatório' }),
  valor: z.string().min(1, { message: 'Valor é obrigatório' }),
  detalhes: z.string().min(1, { message: 'Detalhes são obrigatórios' }),
  categoria: z.string().min(1, { message: 'Categoria é obrigatória' }),
  tipo: z.string().min(1, { message: 'Tipo é obrigatório' }),
  quando: z.string().min(1, { message: 'Data é obrigatória' })
});

type TransactionFormValues = z.infer<typeof transactionSchema>;

interface TransactionFormProps {
  onSuccess: () => void;
  onCancel: () => void;
  defaultTipo?: 'receita' | 'despesa';
}

export function TransactionForm({ onSuccess, onCancel, defaultTipo = 'despesa' }: TransactionFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const form = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      estabelecimento: '',
      valor: '',
      detalhes: '',
      categoria: '',
      tipo: defaultTipo,
      quando: new Date().toISOString().split('T')[0]
    }
  });

  async function onSubmit(data: TransactionFormValues) {
    setIsSubmitting(true);
    
    try {
      // Get user ID from localStorage - with RLS disabled, this is just for reference
      const userId = localStorage.getItem('userId') || 'default';
      const userEmail = localStorage.getItem('userEmail') || '';
      const userName = localStorage.getItem('userName') || '';
      
      const valorNumerico = parseFloat(data.valor.replace(',', '.'));
      
      if (isNaN(valorNumerico)) {
        toast({
          title: "Erro no formulário",
          description: "O valor precisa ser um número válido",
          variant: "destructive"
        });
        return;
      }
      
      // Adjust the value based on transaction type
      const valorFinal = data.tipo.toLowerCase() === 'receita' 
        ? Math.abs(valorNumerico) 
        : Math.abs(valorNumerico);
      
      console.log(`Salvando transação para usuário: ${userId} (${userEmail || userName})`);
      
      // With RLS disabled, we can insert directly to the fixed table
      const { error } = await supabase
        .from('transacoes') // Using a fixed table name instead of dynamic one
        .insert([
          {
            user: userId,  // Store user ID as reference only
            estabelecimento: data.estabelecimento,
            valor: valorFinal,
            detalhes: data.detalhes,
            categoria: data.categoria,
            tipo: data.tipo,
            quando: data.quando
          }
        ]);
        
      if (error) {
        console.error('Erro ao salvar transação:', error);
        
        toast({
          title: "Erro ao salvar",
          description: `Não foi possível salvar a transação: ${error.message}`,
          variant: "destructive"
        });
      } else {
        toast({
          title: "Transação salva",
          description: "Transação registrada com sucesso",
        });
        onSuccess();
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
          name="estabelecimento"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Estabelecimento</FormLabel>
              <FormControl>
                <Input placeholder="Nome do estabelecimento" {...field} />
              </FormControl>
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
          name="tipo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="despesa">Despesa</SelectItem>
                  <SelectItem value="receita">Receita</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="categoria"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Categoria</FormLabel>
              <FormControl>
                <Input placeholder="Categoria" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="detalhes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Detalhes</FormLabel>
              <FormControl>
                <Input placeholder="Detalhes da transação" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="quando"
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
        
        <div className="flex justify-end space-x-2 pt-2">
          <Button variant="outline" type="button" onClick={onCancel} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting} className={defaultTipo === 'receita' ? 'bg-finance-green hover:bg-finance-green/90' : ''}>
            {isSubmitting ? "Salvando..." : "Salvar"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
