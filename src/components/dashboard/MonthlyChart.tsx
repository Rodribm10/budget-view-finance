
import React from 'react';
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

  // Criar dados para o ano completo (12 meses)
  const generateFullYearData = () => {
    const currentYear = new Date().getFullYear();
    const months = [
      'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
      'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
    ];
    
    const fullYearData = months.map((month, index) => {
      const monthKey = `${currentYear}-${String(index + 1).padStart(2, '0')}`;
      const existingData = data.find(d => d.month === monthKey);
      
      return {
        month: month,
        monthKey: monthKey,
        receitas: existingData ? existingData.receitas : 0,
        despesas: existingData ? existingData.despesas : 0
      };
    });
    
    return fullYearData;
  };

  const fullYearData = generateFullYearData();

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
    <div className="h-full animate-fade-in">
      {isLoading ? (
        <div className="flex items-center justify-center h-[320px]">
          <div className="h-32 w-32 rounded-full border-4 border-t-primary border-opacity-20 animate-spin" />
        </div>
      ) : (
        <div className="h-[320px] relative">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={fullYearData}
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
                {fullYearData.map((entry, index) => (
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
                {fullYearData.map((entry, index) => (
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
    </div>
  );
};

export default MonthlyChart;
