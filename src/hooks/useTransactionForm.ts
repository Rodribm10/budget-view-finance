import { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Transaction } from '@/types/financialTypes';
import { updateTransacao } from '@/services/transacao';

const transactionSchema = z.object({
  estabelecimento: z.string().min(1, { message: 'Estabelecimento é obrigatório' }),
  valor: z.string().min(1, { message: 'Valor é obrigatório' }),
  detalhes: z.string().min(1, { message: 'Detalhes são obrigatórios' }),
  categoria: z.string().min(1, { message: 'Categoria é obrigatória' }),
  tipo: z.string().min(1, { message: 'Tipo é obrigatório' }),
  quando: z.string().min(1, { message: 'Data é obrigatória' }),
  grupo_id: z.string().nullable().optional()
});

export type TransactionFormValues = z.infer<typeof transactionSchema>;

export const useTransactionForm = (
  onSuccess: () => void,
  onCancel: () => void,
  defaultTipo: 'receita' | 'despesa' = 'despesa',
  transaction: Transaction | null = null,
  isEditing: boolean = false
) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [grupos, setGrupos] = useState<{remote_jid: string, nome_grupo: string | null}[]>([]);
  const { toast } = useToast();
  
  // Fetch user groups when the form loads
  const fetchGrupos = useCallback(async () => {
    try {
      const userEmail = localStorage.getItem('userEmail');
      console.log('🔍 Buscando grupos para usuário:', userEmail);
      
      if (!userEmail) {
        console.error('❌ Email do usuário não encontrado no localStorage');
        setGrupos([]);
        return;
      }
      
      const normalizedEmail = userEmail.trim().toLowerCase();
      console.log('📧 Email normalizado:', normalizedEmail);
      
      // Log específico para o usuário problemático
      if (normalizedEmail === 'leopootz10@gmail.com') {
        console.log('🐆 Usuário específico detectado - leopootz10@gmail.com');
      }
      
      const { data, error } = await supabase
        .from('grupos_whatsapp')
        .select('remote_jid, nome_grupo')
        .eq('login', normalizedEmail);
        
      console.log('📊 Resultado da busca de grupos:', { data, error });
        
      if (error) {
        console.error('❌ Erro ao buscar grupos:', error);
        setGrupos([]);
      } else if (data) {
        // Filtrar grupos que têm remote_jid válido (não vazio e não null)
        const gruposValidos = data.filter(grupo => 
          grupo.remote_jid && 
          grupo.remote_jid.trim() !== '' && 
          grupo.remote_jid !== null
        );
        
        console.log(`✅ ${data.length} grupos encontrados, ${gruposValidos.length} grupos válidos`);
        
        if (gruposValidos.length !== data.length) {
          console.warn('⚠️ Alguns grupos foram filtrados por terem remote_jid inválido');
        }
        
        setGrupos(gruposValidos);
      } else {
        console.log('📝 Nenhum grupo encontrado, definindo array vazio');
        setGrupos([]);
      }
    } catch (error) {
      console.error('💥 Erro inesperado ao buscar grupos:', error);
      setGrupos([]);
    }
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
      grupo_id: transaction?.grupo_id || null
    }
  });

  const onSubmit = async (data: TransactionFormValues) => {
    console.log('🚀 Iniciando submissão do formulário:', data);
    setIsSubmitting(true);
    
    try {
      // Get user email from localStorage - principal identifier now
      const userEmail = localStorage.getItem('userEmail');
      
      if (!userEmail) {
        console.error('❌ Email não encontrado no localStorage');
        toast({
          title: "Erro no formulário",
          description: "Email do usuário não encontrado",
          variant: "destructive"
        });
        return;
      }
      
      // Normalize the email (lowercase and trim spaces)
      const normalizedEmail = userEmail.trim().toLowerCase();
      console.log('📧 Email para salvar transação:', normalizedEmail);
      
      // Get user ID from localStorage - kept for compatibility
      const userId = localStorage.getItem('userId') || '';
      
      // Validação mais robusta do valor
      let valorNumerico: number;
      try {
        const valorString = String(data.valor).replace(',', '.');
        valorNumerico = parseFloat(valorString);
        
        if (!valorString || isNaN(valorNumerico) || valorNumerico <= 0) {
          throw new Error('Valor inválido');
        }
      } catch (error) {
        console.error('❌ Erro na validação do valor:', data.valor);
        toast({
          title: "Erro no formulário",
          description: "O valor precisa ser um número válido e maior que zero",
          variant: "destructive"
        });
        return;
      }
      
      // Padrão do banco: despesa negativa, receita positiva (igual ao sync do banco)
      const valorFinal = data.tipo.toLowerCase() === 'receita' 
        ? Math.abs(valorNumerico) 
        : -Math.abs(valorNumerico);
      
      console.log(`💰 Valor final calculado: ${valorFinal} (tipo: ${data.tipo})`);
      console.log(`📅 Data da transação: ${data.quando}`);
      
      // Handle editing vs creating new transaction
      if (isEditing && transaction) {
        console.log('✏️ Atualizando transação existente:', transaction.id);
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
        console.log('➕ Criando nova transação');
        // Create new transaction
        // Prepare transaction data including login and grupo_id
        const transactionData = {
          user: userId, // Kept for compatibility
          login: normalizedEmail, // Main field for identification
          estabelecimento: data.estabelecimento,
          valor: valorFinal,
          detalhes: data.detalhes,
          categoria: data.categoria,
          tipo: data.tipo.toLowerCase(),
          quando: data.quando,
          grupo_id: data.grupo_id || null
        };
        
        console.log('📊 Dados da transação a serem salvos:', transactionData);
        
        // With RLS disabled, we can insert directly to the fixed table
        const { error } = await supabase
          .from('transacoes')
          .insert([transactionData]);
          
        if (error) {
          console.error('❌ Erro ao salvar transação no Supabase:', error);
          
          toast({
            title: "Erro ao salvar",
            description: `Não foi possível salvar a transação: ${error.message}`,
            variant: "destructive"
          });
        } else {
          console.log('✅ Transação salva com sucesso');
          toast({
            title: "Transação salva",
            description: "Transação registrada com sucesso",
          });
          onSuccess();
        }
      }
    } catch (error) {
      console.error('💥 Erro inesperado ao processar formulário:', error);
      toast({
        title: "Erro inesperado",
        description: "Ocorreu um erro ao processar sua solicitação",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    form,
    grupos,
    isSubmitting,
    onSubmit,
    fetchGrupos
  };
};

export { transactionSchema };
