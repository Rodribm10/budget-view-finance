
import { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import TransactionsTable from '@/components/dashboard/TransactionsTable';
import { Transaction } from '@/types/financialTypes';
import { useToast } from "@/components/ui/use-toast";
import { getTransacoes } from '@/services/transacaoService';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

const TransacoesPage = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    async function loadTransactions() {
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
    }
    
    loadTransactions();
  }, [toast]);

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-tight">Todas as Transações</h1>
          <Button className="flex items-center gap-2">
            <PlusCircle className="h-4 w-4" />
            Nova Transação
          </Button>
        </div>

        <TransactionsTable 
          transactions={transactions} 
          isLoading={isLoading} 
          showPagination={true}
        />
      </div>
    </Layout>
  );
};

export default TransacoesPage;
