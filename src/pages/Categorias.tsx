
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { getCategorySummary } from '@/services/transacao';
import { CategorySummary } from '@/types/financialTypes';
import { MonthFilter } from "@/components/filters/MonthFilter";

interface CategoryCard {
  nome: string;
  valor: number;
  percentual: number;
  cor: string;
}

const Categorias = () => {
  const [categories, setCategories] = useState<CategorySummary[]>([]);
  const [filtro, setFiltro] = useState<'despesa' | 'receita'>('despesa');
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  });
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const loadCategories = async () => {
    try {
      setIsLoading(true);
      console.log("Carregando categorias com filtro:", filtro, "mês:", selectedMonth);
      const data = await getCategorySummary(filtro, selectedMonth);
      console.log("Categorias carregadas:", data);
      setCategories(data);
    } catch (error) {
      console.error("Erro ao carregar categorias:", error);
      toast({
        title: "Erro ao carregar categorias",
        description: "Não foi possível obter os dados das categorias",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, [filtro, selectedMonth]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${(value * 100).toFixed(1)}%`;
  };

  const totalGeral = categories.reduce((sum, cat) => sum + cat.valor, 0);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Categorias</h1>
          <div className="flex items-center gap-3">
            <MonthFilter 
              selectedMonth={selectedMonth}
              onMonthChange={setSelectedMonth}
            />
            <Select disabled>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Carregando..." />
              </SelectTrigger>
            </Select>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-muted rounded w-3/4"></div>
              </CardHeader>
              <CardContent>
                <div className="h-6 bg-muted rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-muted rounded w-full"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Categorias</h1>
        <div className="flex items-center gap-3">
          <MonthFilter 
            selectedMonth={selectedMonth}
            onMonthChange={setSelectedMonth}
          />
          <span className="text-sm text-gray-600">Filtrar por:</span>
          <Select value={filtro} onValueChange={(value: 'despesa' | 'receita') => setFiltro(value)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="despesa">Despesas</SelectItem>
              <SelectItem value="receita">Receitas</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Cards das Categorias */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {categories.map((categoria, index) => (
          <Card key={categoria.categoria} className="relative overflow-hidden border-2 hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 mb-2">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: categoria.color || '#6B7280' }}
                />
                <h3 className="font-semibold text-gray-800">{categoria.categoria}</h3>
              </div>
              <div className="space-y-2">
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(categoria.valor)}
                </p>
                <div className="space-y-1">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full transition-all duration-500"
                      style={{ 
                        backgroundColor: categoria.color || '#6B7280',
                        width: `${Math.min(categoria.percentage * 100, 100)}%`
                      }}
                    />
                  </div>
                  <p className="text-sm text-gray-600">
                    {formatPercentage(categoria.percentage)} do total
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Resumo de Categorias */}
      {categories.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>
              Resumo de Categorias ({filtro === 'despesa' ? 'Despesas' : 'Receitas'}) - {selectedMonth}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-4">Categoria</th>
                    <th className="text-right py-2 px-4">Valor</th>
                    <th className="text-right py-2 px-4">Percentual</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((categoria) => (
                    <tr key={categoria.categoria} className="border-b hover:bg-gray-50">
                      <td className="py-2 px-4">
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: categoria.color || '#6B7280' }}
                          />
                          {categoria.categoria}
                        </div>
                      </td>
                      <td className="text-right py-2 px-4 font-medium">
                        {formatCurrency(categoria.valor)}
                      </td>
                      <td className="text-right py-2 px-4">
                        {formatPercentage(categoria.percentage)}
                      </td>
                    </tr>
                  ))}
                  <tr className="border-t-2 font-bold">
                    <td className="py-2 px-4">Total</td>
                    <td className="text-right py-2 px-4">{formatCurrency(totalGeral)}</td>
                    <td className="text-right py-2 px-4">100%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {categories.length === 0 && !isLoading && (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-gray-500">
              Nenhuma categoria encontrada para {filtro === 'despesa' ? 'despesas' : 'receitas'} no mês {selectedMonth}.
            </p>
            <p className="text-sm text-gray-400 mt-2">
              Adicione algumas transações para ver as categorias aqui.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Categorias;
