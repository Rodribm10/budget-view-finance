
import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { getResumoFinanceiro, getCategorySummary, getMonthlyData } from "@/services/transacao";
import { ResumoFinanceiro, CategorySummary, MonthlyData } from "@/types/financialTypes";
import { useTransactions } from "@/hooks/useTransactions";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardLoadingState from "@/components/dashboard/DashboardLoadingState";
import DashboardSummaryCards from "@/components/dashboard/DashboardSummaryCards";
import DashboardCharts from "@/components/dashboard/DashboardCharts";
import DashboardRecentTransactions from "@/components/dashboard/DashboardRecentTransactions";

const Dashboard = () => {
  const [resumo, setResumo] = useState<ResumoFinanceiro | null>(null);
  const [categories, setCategories] = useState<CategorySummary[]>([]);
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const getCurrentMonth = () => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  };

  const {
    transactions,
    isLoading: transactionsLoading,
    formatCurrency
  } = useTransactions({ monthFilter: getCurrentMonth() });

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

  const loadResumo = async () => {
    try {
      setIsLoading(true);
      console.log("Carregando resumo financeiro...");
      const data = await getResumoFinanceiro();
      console.log("Resumo carregado:", data);
      setResumo(data);
      
      // Load categories for chart
      const categoriesData = await getCategorySummary('despesa');
      setCategories(categoriesData);

      // Load monthly data for chart
      const monthlyDataResult = await getMonthlyData();
      setMonthlyData(monthlyDataResult);
    } catch (error) {
      console.error("Erro ao carregar resumo:", error);
      toast({
        title: "Erro ao carregar resumo",
        description: "Não foi possível obter os dados do Supabase",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadResumo();
  }, [toast]);

  if (isLoading) {
    return <DashboardLoadingState />;
  }

  return (
    <div className="space-y-6" data-tour="dashboard-content">
      <DashboardHeader />
      
      <DashboardSummaryCards 
        resumo={resumo} 
        formatCurrency={formatCurrency} 
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
