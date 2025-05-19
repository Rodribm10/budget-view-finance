
import { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import SummaryCard from '@/components/dashboard/SummaryCard';
import TransactionsTable from '@/components/dashboard/TransactionsTable';
import CategoryChart from '@/components/dashboard/CategoryChart';
import MonthlyChart from '@/components/dashboard/MonthlyChart';
import { Wallet, ArrowUp, ArrowDown, PiggyBank, Percent, DollarSign } from 'lucide-react';
import { Transaction, CategorySummary, MonthlyData } from '@/types/financialTypes';
import { useToast } from "@/components/ui/use-toast";
import { getTransacoes, getTransactionSummary, getCategorySummary, getMonthlyData } from '@/services/transacaoService';

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<CategorySummary[]>([]);
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
  const [totals, setTotals] = useState({ receitas: 0, despesas: 0, saldo: 0 });
  const { toast } = useToast();

  // Atualizar o userId no localStorage para garantir consistência
  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    const finDashUser = localStorage.getItem('finDashUser');
    
    if (!storedUserId && finDashUser) {
      localStorage.setItem('userId', finDashUser);
    } else if (!storedUserId && !finDashUser) {
      const defaultId = '9f267008-9128-4a2f-b730-de0a0b5602a9';
      localStorage.setItem('userId', defaultId);
    }
  }, []);

  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);
        console.log("Iniciando carregamento de dados...");
        
        // Buscar todos os dados necessários
        const [transacoesData, totalsData, categoriesData, monthlyDataResult] = await Promise.all([
          getTransacoes(),
          getTransactionSummary(),
          getCategorySummary(),
          getMonthlyData()
        ]);
        
        console.log("Dados obtidos com sucesso:", {
          transacoes: transacoesData.length,
          totals: totalsData,
          categories: categoriesData.length,
          monthlyData: monthlyDataResult.length
        });
        
        setTransactions(transacoesData);
        setTotals(totalsData);
        setCategories(categoriesData);
        setMonthlyData(monthlyDataResult);
        
        toast({
          title: "Dados carregados com sucesso",
          description: "Seus dados financeiros foram atualizados"
        });
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
        toast({
          title: "Erro ao carregar dados",
          description: "Verifique a conexão com o Supabase",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    }
    
    loadData();
  }, [toast]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-tight">Dashboard Financeiro</h1>
          <p className="text-sm text-muted-foreground">
            Última atualização: {new Date().toLocaleDateString('pt-BR')}
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <SummaryCard
            title="Receitas"
            value={formatCurrency(totals.receitas)}
            icon={<ArrowUp size={20} className="text-finance-green" />}
            trend={5}
            iconClass="bg-finance-green/10"
            valueClass="text-finance-green"
          />
          <SummaryCard
            title="Despesas"
            value={formatCurrency(totals.despesas)}
            icon={<ArrowDown size={20} className="text-finance-red" />}
            trend={-2}
            iconClass="bg-finance-red/10"
            valueClass="text-finance-red"
          />
          <SummaryCard
            title="Saldo"
            value={formatCurrency(totals.saldo)}
            icon={<Wallet size={20} className="text-finance-blue" />}
            iconClass="bg-finance-blue/10"
            valueClass="text-finance-blue"
          />
          <SummaryCard
            title="Economia"
            value={`${totals.receitas > 0 ? ((totals.saldo / totals.receitas) * 100).toFixed(1) : 0}%`}
            secondaryValue={formatCurrency(totals.saldo)}
            icon={<PiggyBank size={20} className="text-finance-purple" />}
            iconClass="bg-finance-purple/10"
            valueClass="text-finance-purple"
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <CategoryChart categories={categories} isLoading={isLoading} />
          <MonthlyChart data={monthlyData} isLoading={isLoading} />
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-semibold">Transações Recentes</h2>
          <TransactionsTable transactions={transactions} isLoading={isLoading} />
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
