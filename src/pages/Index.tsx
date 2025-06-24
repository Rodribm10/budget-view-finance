
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { ArrowUpIcon, ArrowDownIcon, CreditCardIcon, Target } from "lucide-react";
import { getResumoFinanceiro } from "@/services/transacao";
import { ResumoFinanceiro } from "@/types/financialTypes";
import TransactionsTable from "@/components/dashboard/TransactionsTable";
import { useTransactions } from "@/hooks/useTransactions";
import CategoryChart from "@/components/dashboard/CategoryChart";

const Dashboard = () => {
  const [resumo, setResumo] = useState<ResumoFinanceiro | null>(null);
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
              resumo && (resumo.totalReceitas - resumo.totalDespesas - (resumo.totalCartoes || 0)) >= 0 
                ? 'text-green-600' 
                : 'text-red-600'
            }`}>
              {resumo ? formatCurrency(resumo.totalReceitas - resumo.totalDespesas - (resumo.totalCartoes || 0)) : 'R$ 0,00'}
            </div>
            <p className="text-xs text-muted-foreground">Resultado do mês</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Despesas por Categoria</CardTitle>
            <CardDescription>Distribuição dos seus gastos</CardDescription>
          </CardHeader>
          <CardContent>
            <CategoryChart />
          </CardContent>
        </Card>

        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Últimas Transações</CardTitle>
            <CardDescription>Suas transações mais recentes</CardDescription>
          </CardHeader>
          <CardContent>
            <TransactionsTable 
              transactions={transactions.slice(0, 5)} 
              isLoading={transactionsLoading}
              showPagination={false}
              onEdit={() => {}}
              onDelete={() => {}}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
