import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface MonthFilterProps {
  selectedMonth: string; // YYYY-MM
  onMonthChange: (month: string) => void;
  className?: string;
}

const MESES = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

const somar = (ym: string, delta: number) => {
  const [a, m] = ym.split('-').map(Number);
  const d = new Date(a, m - 1 + delta, 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
};

export const nomeMes = (ym: string) => MESES[Number(ym.split('-')[1]) - 1] ?? '';

// Navegação ‹ mês › como nos apps de finanças: um toque pra ir e voltar, sem lista fixa de meses.
export const MonthFilter = ({ selectedMonth, onMonthChange, className }: MonthFilterProps) => {
  const [ano] = selectedMonth.split('-');
  const anoAtual = String(new Date().getFullYear());
  return (
    <div className={cn('inline-flex items-center gap-1 rounded-lg border bg-card p-0.5', className)}>
      <Button variant="ghost" size="icon" className="h-8 w-8" aria-label="Mês anterior" onClick={() => onMonthChange(somar(selectedMonth, -1))}>
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <span className="min-w-[8.5rem] text-center text-sm font-semibold tabular-nums">
        {nomeMes(selectedMonth)}{ano !== anoAtual && ` ${ano}`}
      </span>
      <Button variant="ghost" size="icon" className="h-8 w-8" aria-label="Próximo mês" onClick={() => onMonthChange(somar(selectedMonth, 1))}>
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
};
