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
import { useNavigateWithFilter } from "@/hooks/useNavigateWithFilter";

const Dashboard = () => {
  const [resumo, setResumo] = useState<ResumoFinanceiro | null>(null);
  const [categories, setCategories] = useState<CategorySummary[]>([]);
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { navigateToTransactions } = useNavigateWithFilter();

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
  const totalDespesasGeral = resumo ? resumo.totalDespesas + (resumo.totalCartoes || 0) : 0;

  return (
    <div className="space-y-6" data-tour="dashboard-content">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        {/* Card Receitas - Clicável */}
        <Card 
          className="relative overflow-hidden border-0 bg-gradient-to-br from-green-50 to-emerald-100 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group transform hover:scale-105"
          onClick={() => navigateToTransactions('receita')}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-green-400/10 to-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <CardContent className="p-6 relative">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-500 rounded-full shadow-lg">
                <ArrowUpIcon className="h-6 w-6 text-white" />
              </div>
              <div className="text-xs font-bold px-3 py-1 bg-green-500 text-white rounded-full shadow-sm">
                +5%
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-semibold text-green-700">Receitas</p>
              <p className="text-3xl font-bold text-green-600">
                {resumo ? formatCurrency(resumo.totalReceitas) : 'R$ 0,00'}
              </p>
              <p className="text-xs text-green-600 opacity-80">Clique para ver detalhes</p>
            </div>
          </CardContent>
        </Card>

        {/* Card Despesas - Clicável */}
        <Card 
          className="relative overflow-hidden border-0 bg-gradient-to-br from-red-50 to-rose-100 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group transform hover:scale-105"
          onClick={() => navigateToTransactions('despesa')}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-red-400/10 to-rose-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <CardContent className="p-6 relative">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-red-500 rounded-full shadow-lg">
                <ArrowDownIcon className="h-6 w-6 text-white" />
              </div>
              <div className="text-xs font-bold px-3 py-1 bg-red-500 text-white rounded-full shadow-sm">
                -2%
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-semibold text-red-700">Despesas</p>
              <p className="text-3xl font-bold text-red-600">
                {resumo ? formatCurrency(totalDespesasGeral) : 'R$ 0,00'}
              </p>
              {resumo && resumo.totalCartoes > 0 && (
                <p className="text-xs text-red-500">Cartões: {formatCurrency(resumo.totalCartoes)}</p>
              )}
              <p className="text-xs text-red-600 opacity-80">Clique para ver detalhes</p>
            </div>
          </CardContent>
        </Card>

        {/* Card Saldo */}
        <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-blue-50 to-sky-100 shadow-lg hover:shadow-xl transition-all duration-300 group transform hover:scale-105">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400/10 to-sky-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <CardContent className="p-6 relative">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-500 rounded-full shadow-lg">
                <CreditCardIcon className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-semibold text-blue-700">Saldo</p>
              <p className={`text-3xl font-bold ${
                saldo >= 0 ? 'text-blue-600' : 'text-red-600'
              }`}>
                {resumo ? formatCurrency(saldo) : 'R$ 0,00'}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Card Economia */}
        <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-purple-50 to-violet-100 shadow-lg hover:shadow-xl transition-all duration-300 group transform hover:scale-105">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-400/10 to-violet-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <CardContent className="p-6 relative">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-500 rounded-full shadow-lg">
                <Target className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-semibold text-purple-700">Economia</p>
              <p className="text-3xl font-bold text-purple-600">
                -22.2%
              </p>
              <p className="text-xs text-purple-500">{resumo ? formatCurrency(Math.abs(saldo)) : 'R$ 0,00'}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        {/* 1. Receitas vs Despesas Chart */}
        <SimpleCard title="📈 Receitas vs Despesas" className="border-green-200">
          <MonthlyChart data={monthlyData} isLoading={isLoading} />
        </SimpleCard>

        {/* 2. Gastos por Categoria */}
        <SimpleCard title="📊 Despesas por Categoria" className="border-orange-200">
          <CategoryChart categories={categories} isLoading={isLoading} />
        </SimpleCard>

        {/* 3. Últimas Transações */}
        <SimpleCard title="📋 Últimas Transações" className="border-blue-200">
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
