import { CategorySummary } from '@/types/financialTypes';
import { categoria } from '@/lib/categorias';
import { IconeCategoria } from './ListaTransacoes';
import { reais } from './dinheiro';

// Barras horizontais em vez de rosca: dá pra comparar categorias de relance e ler o valor exato.
export default function GastosPorCategoria({ categorias, limite = 7 }: { categorias: CategorySummary[]; limite?: number }) {
  const validas = categorias.filter((c) => c.valor > 0).sort((a, b) => b.valor - a.valor);
  if (!validas.length) return <p className="py-8 text-center text-sm text-muted-foreground">Sem gastos neste mês.</p>;

  const topo = validas.slice(0, limite);
  const resto = validas.slice(limite);
  if (resto.length) {
    topo.push({ categoria: `Outras ${resto.length}`, valor: resto.reduce((s, c) => s + c.valor, 0), percentage: resto.reduce((s, c) => s + c.percentage, 0), color: '' });
  }
  const maior = topo[0].valor;

  return (
    <ul className="space-y-3.5">
      {topo.map((c) => (
        <li key={c.categoria} className="flex items-center gap-3">
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
        </li>
      ))}
    </ul>
  );
}
