
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
        <div className="bg-white dark:bg-zinc-900 p-3 border border-gray-200 dark:border-zinc-700 rounded-xl shadow-lg font-sans min-w-[180px] transition-all duration-300">
          <p className="font-bold mb-1 text-[15px] text-zinc-800 dark:text-zinc-100">{label}</p>
          <p className="text-green-600">{`Receitas: ${formatCurrency(payload[0].value)}`}</p>
          <p className="text-red-600">{`Despesas: ${formatCurrency(payload[1].value)}`}</p>
          <p className="text-gray-700 dark:text-gray-300 font-medium pt-1 border-t border-gray-200 dark:border-zinc-700 mt-1">
            {`Saldo: ${formatCurrency(payload[0].value - payload[1].value)}`}
          </p>
        </div>
      );
    }
    return null;
  };

  // Custom label component that only shows values above a threshold
  const CustomLabel = ({ x, y, width, value, dataKey }: any) => {
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
        className="text-xs font-semibold drop-shadow-lg"
      >
        {formatCompactCurrency(value)}
      </text>
    );
  };

  return (
    <Card className="dashboard-card h-full shadow-xl rounded-2xl animate-fade-in bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-900 border-0">
      <CardHeader className="pb-2 bg-gradient-to-r from-blue-50/50 to-blue-100/0 dark:from-zinc-900 dark:to-zinc-900 rounded-t-2xl">
        <CardTitle className="text-lg font-bold tracking-tight text-zinc-700 dark:text-white flex items-center">
          <span className="mr-2">📈</span> Receitas vs Despesas
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center h-[260px]">
            <div className="h-32 w-32 rounded-full border-4 border-t-primary border-opacity-20 animate-spin" />
          </div>
        ) : data.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[260px] text-muted-foreground">
            <span>Sem dados disponíveis</span>
          </div>
        ) : (
          <div className="h-[320px] relative">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data}
                margin={{ top: 30, right: 30, left: 20, bottom: 15 }}
                barGap={8}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.20} />
                <XAxis 
                  dataKey="month" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 13, fontWeight: 500, fill: "#334155" }}
                  dy={10}
                />
                <YAxis 
                  tickFormatter={formatCompactCurrency}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 13, fill: "#64748b" }}
                  width={80}
                />
                <Tooltip 
                  cursor={{ fill: 'rgba(16, 185, 129, 0.07)' }}
                  content={customTooltip}
                />
                <Legend 
                  verticalAlign="top"
                  height={36}
                  iconType="circle"
                  iconSize={12}
                  wrapperStyle={{ fontWeight: 600, fontSize: 13, color: "#52525b" }}
                />
                <Bar 
                  name="Receitas" 
                  dataKey="receitas" 
                  fill="#10B981"
                  radius={[8, 8, 0, 0]}
                  barSize={36}
                  animationDuration={1200}
                  label={<CustomLabel dataKey="receitas" />}
                >
                  {data.map((entry, index) => (
                    <Cell 
                      key={`cell-receitas-${index}`}
                      fill="url(#receitaBar)"
                      style={{ filter: 'drop-shadow(0px 2px 2px rgba(16,185,129,0.10))' }}
                    />
                  ))}
                </Bar>
                <Bar 
                  name="Despesas" 
                  dataKey="despesas" 
                  fill="#EF4444" 
                  radius={[8, 8, 0, 0]} 
                  barSize={36}
                  animationDuration={1200}
                  label={<CustomLabel dataKey="despesas" />}
                >
                  {data.map((entry, index) => (
                    <Cell 
                      key={`cell-despesas-${index}`}
                      fill="url(#despesaBar)"
                      style={{ filter: 'drop-shadow(0px 2px 2px rgba(239,68,68,0.08))' }}
                    />
                  ))}
                </Bar>
                <defs>
                  <linearGradient id="receitaBar" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#17ead9" />
                    <stop offset="100%" stopColor="#10B981" />
                  </linearGradient>
                  <linearGradient id="despesaBar" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#fbc2eb" />
                    <stop offset="100%" stopColor="#EF4444" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MonthlyChart;
