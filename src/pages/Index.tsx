
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ArrowUpIcon, ArrowDownIcon, CreditCardIcon, Target, TrendingUpIcon, TrendingDownIcon } from "lucide-react";
import { getResumoFinanceiro, getCategorySummary } from "@/services/transacao";
import { ResumoFinanceiro, CategorySummary } from "@/types/financialTypes";
import TransactionsTable from "@/components/dashboard/TransactionsTable";
import { useTransactions } from "@/hooks/useTransactions";
import CategoryChart from "@/components/dashboard/CategoryChart";
import { SimpleCard } from "@/components/ui/simple-card";

const Dashboard = () => {
  const [resumo, setResumo] = useState<ResumoFinanceiro | null>(null);
  const [categories, setCategories] = useState<CategorySummary[]>([]);
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
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Receitas</CardTitle>
            <ArrowUpIcon className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {resumo ? formatCurrency(resumo.totalReceitas) : 'R$ 0,00'}
            </div>
            <p className="text-xs text-muted-foreground">Entradas do mês</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Despesas</CardTitle>
            <ArrowDownIcon className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {resumo ? formatCurrency(resumo.totalDespesas) : 'R$ 0,00'}
            </div>
            <p className="text-xs text-muted-foreground">Saídas do mês</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cartões de Crédito</CardTitle>
            <CreditCardIcon className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {resumo ? formatCurrency(resumo.totalCartoes || 0) : 'R$ 0,00'}
            </div>
            <p className="text-xs text-muted-foreground">Gastos nos cartões</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saldo</CardTitle>
            <Target className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${
              saldo >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {resumo ? formatCurrency(saldo) : 'R$ 0,00'}
            </div>
            <p className="text-xs text-muted-foreground">Resultado do mês</p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        {/* 1. Receitas vs Despesas */}
        <SimpleCard title="Receitas vs Despesas" className="border-green-200">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUpIcon className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Receitas</p>
                <p className="text-xl font-bold text-green-600">
                  {resumo ? formatCurrency(resumo.totalReceitas) : 'R$ 0,00'}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <TrendingDownIcon className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Despesas</p>
                <p className="text-xl font-bold text-red-600">
                  {resumo ? formatCurrency(resumo.totalDespesas + (resumo.totalCartoes || 0)) : 'R$ 0,00'}
                </p>
              </div>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Resultado:</span>
              <span className={`text-lg font-bold ${saldo >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {resumo ? formatCurrency(saldo) : 'R$ 0,00'}
              </span>
            </div>
          </div>
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
