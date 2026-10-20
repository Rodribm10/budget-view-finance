import { ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { CategorySummary } from '@/types/financialTypes';
import { categoria } from '@/lib/categorias';
import { IconeCategoria } from './ListaTransacoes';
import { reais } from './dinheiro';

// Barras horizontais em vez de rosca: dá pra comparar categorias de relance e ler o valor exato.
// Toque numa categoria abre as despesas dela em Transações, no mesmo mês.
export default function GastosPorCategoria({ categorias, mes, limite = 7 }: { categorias: CategorySummary[]; mes: string; limite?: number }) {
  const navigate = useNavigate();
  const validas = categorias.filter((c) => c.valor > 0).sort((a, b) => b.valor - a.valor);
  if (!validas.length) return <p className="py-8 text-center text-sm text-muted-foreground">Sem gastos neste mês.</p>;

  const topo = validas.slice(0, limite);
  const resto = validas.slice(limite);
  if (resto.length) {
    topo.push({ categoria: `Outras ${resto.length}`, valor: resto.reduce((s, c) => s + c.valor, 0), percentage: resto.reduce((s, c) => s + c.percentage, 0), color: '' });
  }
  const abrir = (nome: string, i: number) => {
    // "Outras N" agrupa várias: abre a lista de saídas do mês sem filtro de categoria.
    const agrupado = i === limite && resto.length > 0;
    navigate('/transacoes', { state: { filter: 'despesa', mes, ...(agrupado ? {} : { categoria: nome }) } });
  }
  const maior = topo[0].valor;

  return (
    <ul className="-mx-2 space-y-0.5">
      {topo.map((c, i) => (
        <li key={c.categoria}>
          <button type="button" onClick={() => abrir(c.categoria, i)}
            className="group flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left transition-colors hover:bg-secondary">
          <IconeCategoria nome={c.categoria} tamanho="sm" />
          <div className="min-w-0 flex-1">
            <div className="flex items-baseline justify-between gap-3 text-sm">
              <span className="truncate font-medium">{c.categoria}</span>
              <span className="shrink-0 tabular-nums">
                {reais(c.valor)}
                <span className="ml-2 inline-block w-9 text-right text-xs text-muted-foreground">{Math.round(c.percentage * 100)}%</span>
              </span>
            </div>
            <div className="mt-1.5 h-1.5 rounded-full bg-secondary">
              <div className="h-full rounded-full" style={{ width: `${(c.valor / maior) * 100}%`, backgroundColor: categoria(c.categoria).cor }} />
            </div>
          </div>
          <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground/60 transition-colors group-hover:text-foreground" />
          </button>
        </li>
      ))}
    </ul>
  );
}
