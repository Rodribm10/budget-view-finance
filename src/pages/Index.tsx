import { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import SummaryCard from '@/components/dashboard/SummaryCard';
import TransactionsTable from '@/components/dashboard/TransactionsTable';
import CategoryChart from '@/components/dashboard/CategoryChart';
import MonthlyChart from '@/components/dashboard/MonthlyChart';
import { MonthFilter } from '@/components/filters/MonthFilter';
import { Wallet, ArrowUp, ArrowDown, PiggyBank } from 'lucide-react';
import { Transaction, CategorySummary, MonthlyData } from '@/types/financialTypes';
import { useToast } from "@/components/ui/use-toast";
import { 
  getTransacoes, 
  getTransactionSummary, 
  getCategorySummary, 
  getMonthlyData 
} from '@/services/transacao';
import { getCartoes } from '@/services/cartaoCreditoService';

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<CategorySummary[]>([]);
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
  const [totals, setTotals] = useState({ receitas: 0, despesas: 0, saldo: 0, cartoes: 0 });
  const { toast } = useToast();

  // Função para obter o mês atual no formato YYYY-MM
  const getCurrentMonth = () => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  };

  const [selectedMonth, setSelectedMonth] = useState<string>(getCurrentMonth());

  // Load data when component mounts or month changes
  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);
        console.log("Iniciando carregamento de dados para o mês:", selectedMonth);
        
        // Buscar todos os dados necessários com filtro de mês
        const [transacoesData, totalsData, categoriesData, monthlyDataResult, cartoesData] = await Promise.all([
          getTransacoes(selectedMonth),
          getTransactionSummary(selectedMonth),
          getCategorySummary('despesa', selectedMonth),
          getMonthlyData(), // Monthly data não precisa de filtro pois já mostra todos os meses
          getCartoes()
        ]);
        
        // Calcular total dos cartões
        const totalCartoes = cartoesData.reduce((sum, cartao) => sum + (cartao.total_despesas || 0), 0);
        
        console.log("Dados obtidos com sucesso:", {
          transacoes: transacoesData.length,
          totals: totalsData,
          categories: categoriesData.length,
          monthlyData: monthlyDataResult.length,
          cartoes: cartoesData.length,
          totalCartoes: totalCartoes,
          mesEscolhido: selectedMonth
        });
        
        setTransactions(transacoesData);
        setTotals({
          ...totalsData,
          cartoes: totalCartoes,
          // Atualiza o saldo incluindo despesas de cartão
          saldo: totalsData.receitas - totalsData.despesas - totalCartoes
        });
        setCategories(categoriesData);
        setMonthlyData(monthlyDataResult);
        
        toast({
          title: "Dados carregados com sucesso",
          description: `Dados financeiros de ${selectedMonth} foram atualizados`
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
  }, [selectedMonth, toast]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  // Calculate total of all expenses (regular + credit cards)
  const totalDespesasGeral = totals.despesas + totals.cartoes;

  // Função para formatar o mês para exibição
  const formatMonthDisplay = (month: string) => {
    const [year, monthNum] = month.split('-');
    const months = [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];
    return `${months[parseInt(monthNum) - 1]} ${year}`;
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight">Dashboard Financeiro</h1>
            <p className="text-sm text-muted-foreground">
              Dados de: {formatMonthDisplay(selectedMonth)}
            </p>
          </div>
          <MonthFilter 
            selectedMonth={selectedMonth}
            onMonthChange={setSelectedMonth}
          />
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
            value={formatCurrency(totalDespesasGeral)}
            secondaryValue={`Cartões: ${formatCurrency(totals.cartoes)}`}
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
