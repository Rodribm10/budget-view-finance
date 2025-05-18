
import { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import TransactionsTable from '@/components/dashboard/TransactionsTable';
import { TransactionForm } from '@/components/dashboard/TransactionForm';
import { Transaction } from '@/types/financialTypes';
import { useToast } from "@/components/ui/use-toast";
import { getTransacoes } from '@/services/transacaoService';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
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
  }, [toast]);

  const handleTransactionSuccess = () => {
    setIsDialogOpen(false);
    loadTransactions();
    toast({
      title: "Transação registrada",
      description: "A nova transação foi adicionada com sucesso",
    });
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-tight">Todas as Transações</h1>
          <Button className="flex items-center gap-2" onClick={() => setIsDialogOpen(true)}>
            <PlusCircle className="h-4 w-4" />
            Nova Transação
          </Button>
        </div>

        <TransactionsTable 
          transactions={transactions} 
          isLoading={isLoading} 
          showPagination={true}
        />

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Nova Transação</DialogTitle>
              <DialogDescription>
                Preencha os campos para registrar uma nova transação.
              </DialogDescription>
            </DialogHeader>
            <TransactionForm 
              onSuccess={handleTransactionSuccess}
              onCancel={() => setIsDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default TransacoesPage;
