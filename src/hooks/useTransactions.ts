import { useState, useEffect } from 'react';
import { Transaction } from '@/types/financialTypes';
import { CartaoCredito } from '@/types/cartaoTypes';
import { useToast } from '@/hooks/use-toast';
import { getTransacoes } from '@/services/transacao';
import { getCartoes } from '@/services/cartaoCreditoService';

interface UseTransactionsProps {
  monthFilter?: string;
}

export const useTransactions = ({ monthFilter }: UseTransactionsProps = {}) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [tipoForm, setTipoForm] = useState<'receita' | 'despesa'>('despesa');
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isCartaoCreditoDialogOpen, setIsCartaoCreditoDialogOpen] = useState(false);
  const [cartoes, setCartoes] = useState<CartaoCredito[]>([]);
  const { toast } = useToast();

  const loadTransactions = async () => {
    try {
      setIsLoading(true);
      console.log("Carregando transações com filtro:", monthFilter);
      const data = await getTransacoes(monthFilter);
      console.log(`${data.length} transações carregadas com sucesso`);
      setTransactions(data);
    } catch (error) {
      console.error("Erro ao carregar transações:", error);
      toast({
        title: "Erro ao carregar transações",
        description: "Não foi possível obter os dados do Supabase",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadCartoes = async () => {
    try {
      const data = await getCartoes();
      setCartoes(data);
    } catch (error) {
      console.error("Erro ao carregar cartões:", error);
      toast({
        title: "Erro ao carregar cartões",
        description: "Não foi possível obter os dados dos cartões",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    loadTransactions();
    loadCartoes();
  }, [monthFilter]);

  const handleTransactionSuccess = () => {
    setIsDialogOpen(false);
    setSelectedTransaction(null);
    setIsEditing(false);
    loadTransactions();
    toast({
      title: isEditing ? "Transação atualizada" : "Transação registrada",
      description: isEditing 
        ? "A transação foi atualizada com sucesso" 
        : "A nova transação foi adicionada com sucesso",
    });
  };

  const handleDespesaCartaoSuccess = () => {
    setIsCartaoCreditoDialogOpen(false);
    loadCartoes();
    loadTransactions();
    toast({
      title: "Despesa de cartão registrada",
      description: "A despesa do cartão foi adicionada com sucesso",
    });
  };

  const handleEditTransaction = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setTipoForm(transaction.tipo as 'receita' | 'despesa');
    setIsEditing(true);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedTransaction(null);
    setIsEditing(false);
  };

  const handleCloseCartaoCreditoDialog = () => {
    setIsCartaoCreditoDialogOpen(false);
  };

  const handleOpenDialog = (tipo: 'receita' | 'despesa') => {
    setTipoForm(tipo);
    setIsEditing(false);
    setSelectedTransaction(null);
    setIsDialogOpen(true);
  };

  const handleOpenCartaoCreditoDialog = () => {
    setIsCartaoCreditoDialogOpen(true);
  };

  // Separar transações em receitas e despesas
  const receitas = transactions.filter(t => t.tipo === 'receita');
  const despesas = transactions.filter(t => t.tipo === 'despesa');

  // Calcular totais
  const totalReceitas = receitas.reduce((sum, t) => sum + Math.abs(t.valor), 0);
  const totalDespesas = despesas.reduce((sum, t) => sum + Math.abs(t.valor), 0);
  
  // Calcular total de despesas de cartão
  const totalCartoes = cartoes.reduce((sum, cartao) => sum + (cartao.total_despesas || 0), 0);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  return {
    transactions,
    isLoading,
    isDialogOpen,
    tipoForm,
    selectedTransaction,
    isEditing,
    isCartaoCreditoDialogOpen,
    cartoes,
    totalReceitas,
    totalDespesas,
    totalCartoes,
    formatCurrency,
    handleTransactionSuccess,
    handleDespesaCartaoSuccess,
    handleEditTransaction,
    handleCloseDialog,
    handleCloseCartaoCreditoDialog,
    handleOpenDialog,
    handleOpenCartaoCreditoDialog,
    loadTransactions
  };
};
