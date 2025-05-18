
import { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar } from "@/components/ui/calendar";
import { getTransacoes } from '@/services/transacaoService';
import { Transaction } from '@/types/financialTypes';
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import { isSameDay, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const CalendarioPage = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    async function loadTransactions() {
      try {
        setIsLoading(true);
        console.log("Carregando transações para o calendário...");
        const data = await getTransacoes();
        console.log(`${data.length} transações carregadas para o calendário`);
        setTransactions(data);
      } catch (error) {
        console.error("Erro ao carregar transações:", error);
        toast({
          title: "Erro ao carregar transações",
          description: "Não foi possível obter os dados do Supabase",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    }
    
    loadTransactions();
  }, [toast]);

  useEffect(() => {
    if (selectedDate && transactions.length > 0) {
      const filtered = transactions.filter(transaction => 
        isSameDay(new Date(transaction.quando), selectedDate)
      );
      setFilteredTransactions(filtered);
    } else {
      setFilteredTransactions([]);
    }
  }, [selectedDate, transactions]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  // Função para verificar se um dia tem transações
  const hasDayTransaction = (date: Date) => {
    return transactions.some(transaction => 
      isSameDay(new Date(transaction.quando), date)
    );
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-tight">Calendário de Transações</h1>
        </div>

        <div className="grid md:grid-cols-5 gap-6">
          <Card className="md:col-span-2">
            <CardContent className="pt-6">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                locale={ptBR}
                className="max-w-full pointer-events-auto"
                modifiers={{
                  hasTransaction: (date) => hasDayTransaction(date),
                }}
                modifiersStyles={{
                  hasTransaction: {
                    fontWeight: "bold",
                    textDecoration: "underline",
                    backgroundColor: "rgba(16, 185, 129, 0.1)"
                  }
                }}
              />
              <div className="mt-4 text-sm text-muted-foreground text-center">
                Dias com transações estão destacados
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-3">
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold mb-4">
                {selectedDate ? format(selectedDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR }) : "Selecione uma data"}
              </h2>
              
              {isLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="p-4 border rounded-md animate-pulse">
                      <div className="h-4 bg-muted rounded w-1/4 mb-2"></div>
                      <div className="h-6 bg-muted rounded w-1/2"></div>
                    </div>
                  ))}
                </div>
              ) : filteredTransactions.length === 0 ? (
                <div className="text-center py-10 text-muted-foreground">
                  Nenhuma transação nesta data
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredTransactions.map((transaction) => (
                    <div key={transaction.id} className="p-4 border rounded-md hover:bg-muted/50 transition-colors">
                      <div className="flex justify-between items-center mb-1">
                        <div className="font-medium">{transaction.estabelecimento}</div>
                        <Badge variant={transaction.tipo.toLowerCase() === 'receita' || transaction.tipo.toLowerCase() === 'entrada' ? "success" : "destructive"}>
                          {transaction.tipo.toLowerCase() === 'receita' || transaction.tipo.toLowerCase() === 'entrada' ? 'Receita' : 'Despesa'}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground mb-2">{transaction.detalhes}</div>
                      <div className="flex justify-between">
                        <Badge variant="outline">{transaction.categoria}</Badge>
                        <span className={transaction.tipo.toLowerCase() === 'receita' || transaction.tipo.toLowerCase() === 'entrada' ? "text-finance-green font-medium" : "text-finance-red font-medium"}>
                          {transaction.tipo.toLowerCase() === 'receita' || transaction.tipo.toLowerCase() === 'entrada' 
                            ? formatCurrency(Math.abs(transaction.valor)) 
                            : `-${formatCurrency(Math.abs(transaction.valor))}`}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default CalendarioPage;
