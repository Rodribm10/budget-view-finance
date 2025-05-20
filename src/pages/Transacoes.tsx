
import { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import TransactionsTable from '@/components/dashboard/TransactionsTable';
import { TransactionForm } from '@/components/dashboard/TransactionForm';
import { Transaction } from '@/types/financialTypes';
import { useToast } from "@/hooks/use-toast";
import { getTransacoes } from '@/services/transacaoService';
import { Button } from '@/components/ui/button';
import { PlusCircle, CreditCard } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CartaoCredito } from '@/types/cartaoTypes';
import { getCartoes } from '@/services/cartaoCreditoService';
import { DespesaCartaoFormSelect } from '@/components/credito/DespesaCartaoFormSelect';

const TransacoesPage = () => {
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
      console.log("Carregando todas as transações...");
      const data = await getTransacoes();
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
  }, []);

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
    loadCartoes(); // Recarregar lista de cartões
    loadTransactions(); // Recarregar transações
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

  // Separar transações em receitas e despesas
  const receitas = transactions.filter(t => t.tipo === 'receita');
  const despesas = transactions.filter(t => t.tipo === 'despesa');

  // Calcular totais
  const totalReceitas = receitas.reduce((sum, t) => sum + Math.abs(t.valor), 0);
  const totalDespesas = despesas.reduce((sum, t) => sum + Math.abs(t.valor), 0);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
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

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-tight">Todas as Transações</h1>
          <div className="flex gap-2">
            <Button 
              className="flex items-center gap-2 bg-finance-green hover:bg-finance-green/90"
              onClick={() => handleOpenDialog('receita')}
            >
              <PlusCircle className="h-4 w-4" />
              Nova Receita
            </Button>
            <Button 
              className="flex items-center gap-2 bg-finance-red hover:bg-finance-red/90"
              onClick={() => handleOpenDialog('despesa')}
            >
              <PlusCircle className="h-4 w-4" />
              Nova Despesa
            </Button>
            <Button 
              className="flex items-center gap-2"
              onClick={handleOpenCartaoCreditoDialog}
            >
              <CreditCard className="h-4 w-4" />
              Despesa Cartão
            </Button>
          </div>
        </div>

        {/* Resumo em Cards */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader className="pb-2 bg-green-50">
              <CardTitle className="text-finance-green flex items-center">
                Ganhos do mês
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <p className="text-2xl font-bold text-finance-green">
                {formatCurrency(totalReceitas)}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2 bg-red-50">
              <CardTitle className="text-finance-red flex items-center">
                Gastos do mês
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <p className="text-2xl font-bold text-finance-red">
                {formatCurrency(totalDespesas)}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tabela completa de transações */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Todas as Transações</h2>
          <TransactionsTable 
            transactions={transactions} 
            isLoading={isLoading}
            showPagination={true}
            onEdit={handleEditTransaction}
            onDelete={loadTransactions}
          />
        </div>

        {/* Dialog para transações */}
        <Dialog open={isDialogOpen} onOpenChange={handleCloseDialog}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>
                {isEditing 
                  ? `Editar ${tipoForm === 'receita' ? 'Receita' : 'Despesa'}`
                  : `Nova ${tipoForm === 'receita' ? 'Receita' : 'Despesa'}`
                }
              </DialogTitle>
              <DialogDescription>
                {isEditing
                  ? 'Edite os campos para atualizar a transação.'
                  : `Preencha os campos para registrar uma nova ${tipoForm === 'receita' ? 'receita' : 'despesa'}.`
                }
              </DialogDescription>
            </DialogHeader>
            <TransactionForm 
              onSuccess={handleTransactionSuccess}
              onCancel={handleCloseDialog}
              defaultTipo={tipoForm}
              transaction={selectedTransaction}
              isEditing={isEditing}
            />
          </DialogContent>
        </Dialog>

        {/* Dialog para despesas de cartão */}
        <Dialog open={isCartaoCreditoDialogOpen} onOpenChange={handleCloseCartaoCreditoDialog}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Nova Despesa de Cartão</DialogTitle>
              <DialogDescription>
                Selecione o cartão e preencha os detalhes da despesa.
              </DialogDescription>
            </DialogHeader>
            <DespesaCartaoFormSelect 
              cartoes={cartoes}
              onSuccess={handleDespesaCartaoSuccess}
              onCancel={handleCloseCartaoCreditoDialog}
            />
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default TransacoesPage;
