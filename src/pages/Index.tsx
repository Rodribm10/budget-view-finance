
import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { getCategorySummary, getMonthlyData } from "@/services/transacao";
import { CategorySummary, MonthlyData } from "@/types/financialTypes";
import { useTransactions } from "@/hooks/useTransactions";
import { Link } from "react-router-dom";
import DashboardLoadingState from "@/components/dashboard/DashboardLoadingState";
import MonthlyChart from "@/components/dashboard/MonthlyChart";
import { MonthFilter } from "@/components/filters/MonthFilter";
import ResumoMes from "@/components/painel/ResumoMes";
import ParaRevisar from "@/components/painel/ParaRevisar";
import GastosPorCategoria from "@/components/painel/GastosPorCategoria";
import ListaTransacoes from "@/components/painel/ListaTransacoes";

const Dashboard = () => {
  const [categories, setCategories] = useState<CategorySummary[]>([]);
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  });
  const { toast } = useToast();

  const getCurrentMonth = () => {
    return selectedMonth;
  };

  // Usar o mesmo hook que a página de transações para garantir cálculos consistentes
  const {
    transactions,
    isLoading: transactionsLoading,
    totalReceitas,
    totalDespesas,
    totalCartoes,
    formatCurrency
  } = useTransactions({ monthFilter: getCurrentMonth() });

  // Criar resumo compatível com DashboardSummaryCards usando os mesmos cálculos
  const resumo = {
    totalReceitas,
    totalDespesas,
    totalCartoes,
    saldo: totalReceitas - totalDespesas - totalCartoes
  };

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

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      console.log("🔍 [Dashboard] Carregando dados do dashboard com filtro:", selectedMonth);
      
      // Load categories for chart with month filter
      const categoriesData = await getCategorySummary('despesa', selectedMonth);
      setCategories(categoriesData);

      // Load monthly data for chart
      const monthlyDataResult = await getMonthlyData();
      setMonthlyData(monthlyDataResult);
      
      console.log("✅ [Dashboard] Dados carregados - Receitas:", totalReceitas, "Despesas:", totalDespesas, "Cartões:", totalCartoes);
    } catch (error) {
      console.error("❌ [Dashboard] Erro ao carregar dados:", error);
      toast({
        title: "Erro ao carregar dados",
        description: "Não foi possível obter os dados do Supabase",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, [toast, selectedMonth, totalReceitas, totalDespesas, totalCartoes]);

  if (isLoading || transactionsLoading) {
    return <DashboardLoadingState />;
  }

  return (
    <div className="space-y-5" data-tour="dashboard-content">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl font-semibold tracking-tight md:text-2xl">Visão geral</h1>
        <MonthFilter selectedMonth={selectedMonth} onMonthChange={setSelectedMonth} />
      </div>

      <ResumoMes mes={selectedMonth} entradas={totalReceitas} despesas={totalDespesas} cartoes={totalCartoes} />

      <ParaRevisar transacoes={transactions} />

      <div className="grid gap-5 lg:grid-cols-5">
        <section className="rounded-2xl border bg-card p-5 lg:col-span-3">
          <h2 className="mb-4 text-sm font-semibold">Onde o dinheiro foi</h2>
          <GastosPorCategoria categorias={categories} mes={selectedMonth} />
        </section>
        <section className="rounded-2xl border bg-card p-5 lg:col-span-2">
          <h2 className="mb-4 text-sm font-semibold">Últimos 6 meses</h2>
          <MonthlyChart data={monthlyData} isLoading={isLoading} />
        </section>
      </div>

      <section className="overflow-hidden rounded-2xl border bg-card">
        <div className="flex items-center justify-between px-5 py-4">
          <h2 className="text-sm font-semibold">Últimos lançamentos</h2>
          <Link to="/transacoes" className="text-sm font-medium text-primary hover:underline">Ver todos</Link>
        </div>
        <ListaTransacoes transacoes={transactions.slice(0, 8)} />
      </section>
    </div>
  );
};

export default Dashboard;
