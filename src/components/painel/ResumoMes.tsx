import { ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { nomeMes } from '@/components/filters/MonthFilter';
import { reais } from './dinheiro';
import { cn } from '@/lib/utils';

interface Props {
  mes: string;
  entradas: number;
  despesas: number;
  cartoes: number;
}

// Saldo do mês primeiro, entradas e saídas logo abaixo. A barra mostra quanto do que entrou já saiu.
export default function ResumoMes({ mes, entradas, despesas, cartoes }: Props) {
  const navigate = useNavigate();
  const saidas = despesas + cartoes;
  const saldo = entradas - saidas;
  const usado = entradas > 0 ? Math.min(saidas / entradas, 1) : saidas > 0 ? 1 : 0;

  return (
    <section className="rounded-2xl border bg-card px-5 py-5 md:px-7 md:py-6">
      <p className="text-sm text-muted-foreground">Saldo de {nomeMes(mes).toLowerCase()}</p>
      <p className={cn('mt-1 text-[2rem] font-semibold leading-tight tracking-tight tabular-nums md:text-[2.5rem]', saldo < 0 && 'text-expense')}>
        {saldo < 0 && '−'}{reais(saldo)}
      </p>

      <div className="mt-5 h-2 overflow-hidden rounded-full bg-income/15" role="img"
        aria-label={`Saídas são ${Math.round(usado * 100)}% das entradas`}>
        <div className="h-full rounded-full bg-expense transition-[width] duration-300" style={{ width: `${usado * 100}%` }} />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4">
        <button type="button" onClick={() => navigate('/transacoes', { state: { filter: 'receita' } })}
          className="group flex items-start gap-3 rounded-lg text-left">
          <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-income/12 text-income">
            <ArrowDownLeft className="h-4 w-4" />
          </span>
          <span>
            <span className="block text-xs text-muted-foreground group-hover:text-foreground">Entradas</span>
            <span className="block text-base font-semibold tabular-nums text-income md:text-lg">{reais(entradas)}</span>
          </span>
        </button>
        <button type="button" onClick={() => navigate('/transacoes', { state: { filter: 'despesa' } })}
          className="group flex items-start gap-3 rounded-lg text-left">
          <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-expense/12 text-expense">
            <ArrowUpRight className="h-4 w-4" />
          </span>
          <span>
            <span className="block text-xs text-muted-foreground group-hover:text-foreground">Saídas</span>
            <span className="block text-base font-semibold tabular-nums text-expense md:text-lg">{reais(saidas)}</span>
            {cartoes > 0 && <span className="block text-xs text-muted-foreground tabular-nums">inclui {reais(cartoes)} de cartão</span>}
          </span>
        </button>
      </div>
    </section>
  );
}
