import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { MonthlyData } from '@/types/financialTypes';
import { reais } from '@/components/painel/dinheiro';

interface MonthlyChartProps {
  data: MonthlyData[];
  isLoading?: boolean;
}

const MESES = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
const compacto = new Intl.NumberFormat('pt-BR', { notation: 'compact', maximumFractionDigits: 1 });

// Últimos 6 meses: entrada × saída lado a lado. Ano inteiro com meses vazios só gastava espaço.
const MonthlyChart: React.FC<MonthlyChartProps> = ({ data, isLoading = false }) => {
  const hoje = new Date();
  const serie = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(hoje.getFullYear(), hoje.getMonth() - 5 + i, 1);
    const chave = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    const m = data.find((x) => x.month === chave);
    return { mes: MESES[d.getMonth()], receitas: m?.receitas ?? 0, despesas: m?.despesas ?? 0 };
  });

  if (isLoading) return <div className="h-[220px] animate-pulse rounded-lg bg-secondary" />;

  return (
    <div className="h-[220px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={serie} margin={{ top: 8, right: 0, left: -12, bottom: 0 }} barGap={3} barCategoryGap="28%">
          <CartesianGrid vertical={false} stroke="oklch(0.91 0.006 85)" />
          <XAxis dataKey="mes" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'oklch(0.5 0.012 260)' }} dy={6} />
          <YAxis axisLine={false} tickLine={false} width={52} tick={{ fontSize: 11, fill: 'oklch(0.5 0.012 260)' }}
            tickFormatter={(v: number) => (v ? compacto.format(v) : '')} />
          <Tooltip
            cursor={{ fill: 'oklch(0.955 0.006 85)' }}
            content={({ active, payload, label }) =>
              active && payload?.length ? (
                <div className="rounded-lg border bg-popover px-3 py-2 text-xs shadow-md">
                  <p className="mb-1 font-semibold">{label}</p>
                  <p className="tabular-nums text-income">Entradas {reais(Number(payload[0].value))}</p>
                  <p className="tabular-nums text-expense">Saídas {reais(Number(payload[1].value))}</p>
                </div>
              ) : null
            }
          />
          <Bar dataKey="receitas" fill="oklch(0.55 0.13 155)" radius={[4, 4, 0, 0]} maxBarSize={18} isAnimationActive={false} />
          <Bar dataKey="despesas" fill="oklch(0.56 0.19 27)" radius={[4, 4, 0, 0]} maxBarSize={18} isAnimationActive={false} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MonthlyChart;
