
import { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import TransactionsTable from '@/components/dashboard/TransactionsTable';
import { TransactionForm } from '@/components/dashboard/TransactionForm';
import { Transaction } from '@/types/financialTypes';
import { useToast } from "@/components/ui/use-toast";
import { getTransacoes } from '@/services/transacaoService';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const TransacoesPage = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [tipoForm, setTipoForm] = useState<'receita' | 'despesa'>('despesa');
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

  useEffect(() => {
    loadTransactions();
  }, []);

  const handleTransactionSuccess = () => {
    setIsDialogOpen(false);
    loadTransactions();
    toast({
      title: "Transação registrada",
      description: "A nova transação foi adicionada com sucesso",
    });
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
    setIsDialogOpen(true);
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
          />
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>
                {tipoForm === 'receita' ? 'Nova Receita' : 'Nova Despesa'}
              </DialogTitle>
              <DialogDescription>
                Preencha os campos para registrar uma nova {tipoForm === 'receita' ? 'receita' : 'despesa'}.
              </DialogDescription>
            </DialogHeader>
            <TransactionForm 
              onSuccess={handleTransactionSuccess}
              onCancel={() => setIsDialogOpen(false)}
              defaultTipo={tipoForm}
            />
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default TransacoesPage;
