
import { useState, useEffect } from 'react';
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
import { Transaction } from '@/types/financialTypes';
import { updateTransacao } from '@/services/transacaoService';

const transactionSchema = z.object({
  estabelecimento: z.string().min(1, { message: 'Estabelecimento é obrigatório' }),
  valor: z.string().min(1, { message: 'Valor é obrigatório' }),
  detalhes: z.string().min(1, { message: 'Detalhes são obrigatórios' }),
  categoria: z.string().min(1, { message: 'Categoria é obrigatória' }),
  tipo: z.string().min(1, { message: 'Tipo é obrigatório' }),
  quando: z.string().min(1, { message: 'Data é obrigatória' }),
  grupo_id: z.string().optional()
});

type TransactionFormValues = z.infer<typeof transactionSchema>;

interface TransactionFormProps {
  onSuccess: () => void;
  onCancel: () => void;
  defaultTipo?: 'receita' | 'despesa';
  grupoId?: string;
  transaction?: Transaction | null; // Added this property
  isEditing?: boolean; // Added this property
}

export function TransactionForm({ 
  onSuccess, 
  onCancel, 
  defaultTipo = 'despesa', 
  grupoId,
  transaction = null, // Default to null
  isEditing = false // Default to false
}: TransactionFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [grupos, setGrupos] = useState<{remote_jid: string, nome_grupo: string | null}[]>([]);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Fetch user groups when the form loads
  useEffect(() => {
    const fetchGrupos = async () => {
      const userEmail = localStorage.getItem('userEmail');
      if (!userEmail) {
        console.error('Email do usuário não encontrado');
        return;
      }
      
      const normalizedEmail = userEmail.trim().toLowerCase();
      
      const { data, error } = await supabase
        .from('grupos_whatsapp')
        .select('remote_jid, nome_grupo')
        .eq('login', normalizedEmail);
        
      if (error) {
        console.error('Erro ao buscar grupos:', error);
      } else if (data) {
        setGrupos(data);
      }
    };
    
    fetchGrupos();
  }, []);

  // Set up form with default values or transaction data if editing
  const form = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      estabelecimento: transaction?.estabelecimento || '',
      valor: transaction ? String(Math.abs(transaction.valor)) : '',
      detalhes: transaction?.detalhes || '',
      categoria: transaction?.categoria || '',
      tipo: transaction?.tipo as 'receita' | 'despesa' || defaultTipo,
      quando: transaction?.quando ? 
        new Date(transaction.quando).toISOString().split('T')[0] : 
        new Date().toISOString().split('T')[0],
      grupo_id: transaction?.grupo_id || grupoId || ''
    }
  });

  async function onSubmit(data: TransactionFormValues) {
    setIsSubmitting(true);
    
    try {
      // Get user email from localStorage - principal identifier now
      const userEmail = localStorage.getItem('userEmail');
      
      if (!userEmail) {
        toast({
          title: "Erro no formulário",
          description: "Email do usuário não encontrado",
          variant: "destructive"
        });
        return;
      }
      
      // Normalize the email (lowercase and trim spaces)
      const normalizedEmail = userEmail.trim().toLowerCase();
      
      // Get user ID from localStorage - kept for compatibility
      const userId = localStorage.getItem('userId') || '';
      
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
      
      console.log(`Salvando transação para usuário: ${normalizedEmail} (ID: ${userId})`);
      
      // Handle editing vs creating new transaction
      if (isEditing && transaction) {
        // Update existing transaction
        const updatedTransaction = {
          ...transaction,
          estabelecimento: data.estabelecimento,
          valor: valorFinal,
          detalhes: data.detalhes,
          categoria: data.categoria,
          tipo: data.tipo,
          quando: data.quando,
          grupo_id: data.grupo_id || null
        };
        
        await updateTransacao(updatedTransaction);
        toast({
          title: "Transação atualizada",
          description: "Transação atualizada com sucesso",
        });
        onSuccess();
      } else {
        // Create new transaction
        // Prepare transaction data including login and grupo_id
        const transactionData = {
          user: userId, // Kept for compatibility
          login: normalizedEmail, // Main field for identification
          estabelecimento: data.estabelecimento,
          valor: valorFinal,
          detalhes: data.detalhes,
          categoria: data.categoria,
          tipo: data.tipo,
          quando: data.quando,
          grupo_id: data.grupo_id || null
        };
        
        console.log('Dados da transação a serem salvos:', transactionData);
        
        // With RLS disabled, we can insert directly to the fixed table
        const { error } = await supabase
          .from('transacoes')
          .insert([transactionData]);
          
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
        
        {grupos.length > 0 && (
          <FormField
            control={form.control}
            name="grupo_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Grupo WhatsApp (opcional)</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  value={field.value || ""}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um grupo (opcional)" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="">Nenhum grupo</SelectItem>
                    {grupos.map((grupo) => (
                      <SelectItem key={grupo.remote_jid} value={grupo.remote_jid}>
                        {grupo.nome_grupo || grupo.remote_jid}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        
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
