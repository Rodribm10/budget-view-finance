
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { MonthlyData } from '@/types/financialTypes';

interface MonthlyChartProps {
  data: MonthlyData[];
  isLoading?: boolean;
}

const MonthlyChart: React.FC<MonthlyChartProps> = ({ data, isLoading = false }) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatCompactCurrency = (value: number) => {
    if (value === 0) return '';
    if (value >= 1000) {
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 0,
        maximumFractionDigits: 1,
        notation: 'compact'
      }).format(value);
    }
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };
  
  const customTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-md shadow-lg">
          <p className="font-bold mb-1">{`Mês: ${label}`}</p>
          <p className="text-green-600">
            {`Receitas: ${formatCurrency(payload[0].value)}`}
          </p>
          <p className="text-red-600">
            {`Despesas: ${formatCurrency(payload[1].value)}`}
          </p>
          <p className="text-gray-700 font-medium pt-1 border-t border-gray-200 mt-1">
            {`Saldo: ${formatCurrency(payload[0].value - payload[1].value)}`}
          </p>
        </div>
      );
    }
    return null;
  };

  // Custom label component that only shows values above a threshold
  const CustomLabel = ({ x, y, width, value, dataKey }: any) => {
    // Only show label if value is significant (above 100)
    if (!value || value < 100) return null;
    
    const isReceita = dataKey === 'receitas';
    const yPosition = isReceita ? y - 5 : y - 5;
    
    return (
      <text
        x={x + width / 2}
        y={yPosition}
        fill={isReceita ? '#10B981' : '#EF4444'}
        textAnchor="middle"
        dominantBaseline="middle"
        className="text-xs font-semibold"
      >
        {formatCompactCurrency(value)}
      </text>
    );
  };

  return (
    <Card className="dashboard-card h-full shadow-md">
      <CardHeader className="pb-2 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
        <CardTitle className="text-lg">Receitas vs Despesas</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center h-[250px]">
            <div className="h-32 w-32 rounded-full border-4 border-t-primary border-opacity-20 animate-spin" />
          </div>
        ) : data.length === 0 ? (
          <div className="flex items-center justify-center h-[250px] text-muted-foreground">
            Sem dados disponíveis
          </div>
        ) : (
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data}
                margin={{ top: 30, right: 30, left: 20, bottom: 15 }}
                barGap={8}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.4} />
                <XAxis 
                  dataKey="month" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fontWeight: 500 }}
                  dy={10}
                />
                <YAxis 
                  tickFormatter={formatCompactCurrency}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12 }}
                  width={80}
                />
                <Tooltip 
                  cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }}
                  content={customTooltip}
                />
                <Legend 
                  verticalAlign="top"
                  height={36}
                  iconType="circle"
                  iconSize={10}
                />
                <Bar 
                  name="Receitas" 
                  dataKey="receitas" 
                  fill="#10B981"
                  radius={[4, 4, 0, 0]}
                  barSize={35}
                  animationDuration={1000}
                  label={<CustomLabel dataKey="receitas" />}
                >
                  {data.map((entry, index) => (
                    <Cell 
                      key={`cell-receitas-${index}`}
                      fill="#10B981"
                      style={{ filter: 'drop-shadow(0px 2px 2px rgba(0, 0, 0, 0.1))' }}
                    />
                  ))}
                </Bar>
                <Bar 
                  name="Despesas" 
                  dataKey="despesas" 
                  fill="#EF4444" 
                  radius={[4, 4, 0, 0]} 
                  barSize={35}
                  animationDuration={1000}
                  label={<CustomLabel dataKey="despesas" />}
                >
                  {data.map((entry, index) => (
                    <Cell 
                      key={`cell-despesas-${index}`}
                      fill="#EF4444"
                      style={{ filter: 'drop-shadow(0px 2px 2px rgba(0, 0, 0, 0.1))' }}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MonthlyChart;
