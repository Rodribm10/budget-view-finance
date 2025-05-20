
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { CategorySummary } from '@/types/financialTypes';

interface CategoryChartProps {
  categories: CategorySummary[];
  isLoading?: boolean;
}

const CategoryChart: React.FC<CategoryChartProps> = ({ categories, isLoading = false }) => {
  // Filter out any categories with zero value to prevent rendering issues
  const validCategories = categories.filter(cat => cat.valor > 0);
  
  // Calcular o valor total para exibir no centro do gráfico
  const totalValue = validCategories.reduce((sum, cat) => sum + cat.valor, 0);
  
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, name }: any) => {
    if (percent < 0.05) return null; // Não mostrar texto para fatias muito pequenas
    
    const radius = innerRadius + (outerRadius - innerRadius) * 0.7;
    const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
    const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);
  
    return (
      <text 
        x={x} 
        y={y} 
        fill="#fff" 
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        className="text-xs font-bold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const renderCustomLegend = (props: any) => {
    const { payload } = props;
    
    return (
      <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-3 text-xs">
        {payload.map((entry: any, index: number) => (
          <div key={`item-${index}`} className="flex items-center">
            <div
              className="w-3 h-3 mr-2 rounded-sm"
              style={{ backgroundColor: entry.color }}
            />
            <span className="truncate font-medium">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  };

  const renderCustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border border-border p-2 rounded-lg shadow-lg">
          <p className="font-medium">{payload[0].name}</p>
          <p className="font-bold">{formatCurrency(payload[0].value)}</p>
          <p className="text-sm">{`${(payload[0].payload.percentage * 100).toFixed(1)}%`}</p>
        </div>
      );
    }
  
    return null;
  };

  return (
    <Card className="dashboard-card h-full shadow-md">
      <CardHeader className="pb-2 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
        <CardTitle className="text-lg flex items-center">
          Gastos por Categoria
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center h-[250px]">
            <div className="h-32 w-32 rounded-full border-4 border-t-primary border-opacity-20 animate-spin" />
          </div>
        ) : validCategories.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[250px] text-muted-foreground">
            <p>Sem dados disponíveis</p>
            <p className="text-sm mt-2">Verifique se existem transações do tipo 'despesa' cadastradas</p>
          </div>
        ) : (
          <div className="h-[300px] relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={validCategories}
                  cx="50%"
                  cy="45%"
                  labelLine={false}
                  label={renderCustomizedLabel}
                  outerRadius={100}
                  innerRadius={60}
                  fill="#8884d8"
                  dataKey="valor"
                  nameKey="categoria"
                  paddingAngle={1}
                  strokeWidth={1}
                  stroke="#fff"
                >
                  {validCategories.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.color} 
                      style={{ filter: 'drop-shadow(0px 2px 2px rgba(0, 0, 0, 0.1))' }}
                    />
                  ))}
                </Pie>
                <Tooltip content={renderCustomTooltip} />
                <Legend content={renderCustomLegend} layout="horizontal" verticalAlign="bottom" />
              </PieChart>
            </ResponsiveContainer>
            
            {/* Valor total no centro do gráfico */}
            <div 
              className="absolute top-[45%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none"
              style={{ width: '120px' }}
            >
              <div className="font-bold text-lg">{formatCurrency(totalValue)}</div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CategoryChart;
