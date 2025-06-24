
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ArrowUpIcon, ArrowDownIcon, CreditCardIcon, Target, TrendingUpIcon, TrendingDownIcon } from "lucide-react";
import { getResumoFinanceiro, getCategorySummary, getMonthlyData } from "@/services/transacao";
import { ResumoFinanceiro, CategorySummary, MonthlyData } from "@/types/financialTypes";
import TransactionsTable from "@/components/dashboard/TransactionsTable";
import { useTransactions } from "@/hooks/useTransactions";
import CategoryChart from "@/components/dashboard/CategoryChart";
import MonthlyChart from "@/components/dashboard/MonthlyChart";
import { SimpleCard } from "@/components/ui/simple-card";

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
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="h-4 bg-muted rounded w-1/2 animate-pulse"></div>
                <div className="h-4 w-4 bg-muted rounded animate-pulse"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-muted rounded w-3/4 mb-2 animate-pulse"></div>
                <div className="h-3 bg-muted rounded w-1/2 animate-pulse"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const saldo = resumo ? resumo.totalReceitas - resumo.totalDespesas - (resumo.totalCartoes || 0) : 0;

  return (
    <div className="space-y-6" data-tour="dashboard-content">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-2 border-green-200 bg-green-50/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-700">Receitas</CardTitle>
            <div className="p-2 bg-green-100 rounded-full">
              <ArrowUpIcon className="h-4 w-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {resumo ? formatCurrency(resumo.totalReceitas) : 'R$ 0,00'}
            </div>
            <div className="flex items-center text-xs text-green-600 mt-1">
              <span className="bg-green-100 px-2 py-1 rounded-full">+5%</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-red-200 bg-red-50/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-red-700">Despesas</CardTitle>
            <div className="p-2 bg-red-100 rounded-full">
              <ArrowDownIcon className="h-4 w-4 text-red-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {resumo ? formatCurrency(resumo.totalDespesas + (resumo.totalCartoes || 0)) : 'R$ 0,00'}
            </div>
            <div className="flex items-center text-xs text-red-600 mt-1">
              <span className="bg-red-100 px-2 py-1 rounded-full">-2%</span>
            </div>
            {resumo && resumo.totalCartoes > 0 && (
              <p className="text-xs text-red-500 mt-1">Cartões: {formatCurrency(resumo.totalCartoes)}</p>
            )}
          </CardContent>
        </Card>

        <Card className="border-2 border-blue-200 bg-blue-50/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-700">Saldo</CardTitle>
            <div className="p-2 bg-blue-100 rounded-full">
              <CreditCardIcon className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${
              saldo >= 0 ? 'text-blue-600' : 'text-red-600'
            }`}>
              {resumo ? formatCurrency(saldo) : 'R$ 0,00'}
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-purple-200 bg-purple-50/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-700">Economia</CardTitle>
            <div className="p-2 bg-purple-100 rounded-full">
              <Target className="h-4 w-4 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              -22.2%
            </div>
            <p className="text-xs text-purple-500 mt-1">{resumo ? formatCurrency(Math.abs(saldo)) : 'R$ 0,00'}</p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        {/* 1. Receitas vs Despesas Chart */}
        <SimpleCard title="Receitas vs Despesas" className="border-green-200">
          <MonthlyChart data={monthlyData} isLoading={isLoading} />
        </SimpleCard>

        {/* 2. Gastos por Categoria */}
        <SimpleCard title="Despesas por Categoria" className="border-orange-200">
          <CategoryChart categories={categories} isLoading={isLoading} />
        </SimpleCard>

        {/* 3. Últimas Transações */}
        <SimpleCard title="Últimas Transações" className="border-blue-200">
          <TransactionsTable 
            transactions={transactions.slice(0, 5)} 
            isLoading={transactionsLoading}
            showPagination={false}
            onEdit={() => {}}
            onDelete={() => {}}
          />
        </SimpleCard>
      </div>
    </div>
  );
};

export default Dashboard;
