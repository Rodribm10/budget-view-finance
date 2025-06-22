
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { CategorySummary } from '@/types/financialTypes';

interface CategoryChartProps {
  categories: CategorySummary[];
  isLoading?: boolean;
}

const CategoryChart: React.FC<CategoryChartProps> = ({ categories, isLoading = false }) => {
  const validCategories = categories.filter(cat => cat.valor > 0);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const renderCustomLegend = (props: any) => {
    const { payload } = props;
    return (
      <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-2 text-xs">
        {payload.map((entry: any, index: number) => (
          <div key={`item-${index}`} className="flex items-center">
            <div
              className="w-3 h-3 mr-2 rounded-full shadow"
              style={{ backgroundColor: entry.color }}
            />
            <span className="truncate font-semibold text-zinc-700 dark:text-white">
              {entry.value} ({(entry.payload.percentage * 100).toFixed(0)}%)
            </span>
          </div>
        ))}
      </div>
    );
  };

  const renderCustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 p-3 rounded-xl shadow-lg transition-all duration-300">
          <p className="font-semibold text-sm text-zinc-800 dark:text-white mb-1">{payload[0].name}</p>
          <p className="font-bold text-base">{formatCurrency(payload[0].value)}</p>
          <p className="text-xs text-gray-600 dark:text-gray-400">{`${(payload[0].payload.percentage * 100).toFixed(1)}%`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="dashboard-card h-full shadow-xl rounded-2xl animate-fade-in bg-gradient-to-br from-orange-50 via-white to-indigo-50 dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-900 border-0">
      <CardHeader className="pb-2 bg-gradient-to-r from-indigo-50/60 to-orange-50/0 dark:from-zinc-900 dark:to-zinc-900 rounded-t-2xl">
        <CardTitle className="text-lg font-bold tracking-tight text-zinc-700 dark:text-white flex items-center">
          <span className="mr-2">🧾</span> Gastos por Categoria
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center h-[260px]">
            <div className="h-32 w-32 rounded-full border-4 border-t-primary border-opacity-20 animate-spin" />
          </div>
        ) : validCategories.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[260px] text-muted-foreground">
            <span>Sem dados disponíveis</span>
            <span className="text-xs mt-2">Verifique se existem transações do tipo 'despesa' cadastradas</span>
          </div>
        ) : (
          <div className="h-[300px] relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={validCategories}
                  cx="50%"
                  cy="45%"
                  outerRadius={90}
                  innerRadius={40}
                  fill="#8884d8"
                  dataKey="valor"
                  nameKey="categoria"
                  paddingAngle={2}
                  strokeWidth={2}
                  stroke="#fff"
                  isAnimationActive={true}
                  animationDuration={1300}
                >
                  {validCategories.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.color} 
                      style={{ filter: 'drop-shadow(0px 2px 3px rgba(0,0,0,0.08))' }}
                    />
                  ))}
                </Pie>
                <Tooltip content={renderCustomTooltip} />
                <Legend content={renderCustomLegend} layout="horizontal" verticalAlign="bottom" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CategoryChart;
