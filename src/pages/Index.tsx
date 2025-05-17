
import { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import SummaryCard from '@/components/dashboard/SummaryCard';
import TransactionsTable from '@/components/dashboard/TransactionsTable';
import CategoryChart from '@/components/dashboard/CategoryChart';
import MonthlyChart from '@/components/dashboard/MonthlyChart';
import { DollarSign, TrendingUp, TrendingDown, PiggyBank } from 'lucide-react';
import { mockTransactions, mockCategories, mockMonthlyData, mockTotals } from '@/data/mockData';
import { useToast } from "@/components/ui/use-toast";

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Simulando carregamento de dados
    const timer = setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Dados carregados com sucesso",
        description: "Conecte ao Supabase para ver seus dados reais"
      });
    }, 1500);

    return () => clearTimeout(timer);
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
            value={formatCurrency(mockTotals.receitas)}
            icon={<DollarSign className="h-4 w-4 text-finance-green" />}
            trend={5}
            iconClass="bg-finance-green/10"
            valueClass="text-finance-green"
          />
          <SummaryCard
            title="Despesas"
            value={formatCurrency(mockTotals.despesas)}
            icon={<TrendingDown className="h-4 w-4 text-finance-red" />}
            trend={-2}
            iconClass="bg-finance-red/10"
            valueClass="text-finance-red"
          />
          <SummaryCard
            title="Saldo"
            value={formatCurrency(mockTotals.saldo)}
            icon={<TrendingUp className="h-4 w-4 text-finance-blue" />}
            iconClass="bg-finance-blue/10"
            valueClass="text-finance-blue"
          />
          <SummaryCard
            title="Economia"
            value={`${((mockTotals.saldo / mockTotals.receitas) * 100).toFixed(1)}%`}
            icon={<PiggyBank className="h-4 w-4 text-finance-purple" />}
            iconClass="bg-finance-purple/10"
            valueClass="text-finance-purple"
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <CategoryChart categories={mockCategories} isLoading={isLoading} />
          <MonthlyChart data={mockMonthlyData} isLoading={isLoading} />
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-semibold">Transações Recentes</h2>
          <TransactionsTable transactions={mockTransactions} isLoading={isLoading} />
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
