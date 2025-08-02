
import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { getCategorySummary, getMonthlyData } from "@/services/transacao";
import { CategorySummary, MonthlyData } from "@/types/financialTypes";
import { useTransactions } from "@/hooks/useTransactions";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardLoadingState from "@/components/dashboard/DashboardLoadingState";
import DashboardSummaryCards from "@/components/dashboard/DashboardSummaryCards";
import DashboardCharts from "@/components/dashboard/DashboardCharts";
import DashboardRecentTransactions from "@/components/dashboard/DashboardRecentTransactions";
import { MonthFilter } from "@/components/filters/MonthFilter";

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
    <div className="space-y-6" data-tour="dashboard-content">
      <DashboardHeader />
      
      {/* Filtro de Mês/Ano */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Dashboard</h2>
        <MonthFilter 
          selectedMonth={selectedMonth}
          onMonthChange={setSelectedMonth}
        />
      </div>
      
      <DashboardSummaryCards 
        resumo={resumo} 
        formatCurrency={formatCurrency}
        selectedMonth={selectedMonth}
      />

      <DashboardCharts 
        monthlyData={monthlyData}
        categories={categories}
        isLoading={isLoading}
      />

      <DashboardRecentTransactions 
        transactions={transactions}
        transactionsLoading={transactionsLoading}
      />
    </div>
  );
};

export default Dashboard;
