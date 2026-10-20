import { Trash2 } from 'lucide-react';
import { Transaction } from '@/types/financialTypes';
import { categoria } from '@/lib/categorias';
import { reais, reaisComSinal } from './dinheiro';
import { cn } from '@/lib/utils';

interface Props {
  transacoes: Transaction[];
  onEditar?: (t: Transaction) => void;
  onExcluir?: (t: Transaction) => void;
  vazio?: string;
}

const dia = (iso: string) => iso.slice(0, 10);

function rotuloDia(ymd: string) {
  const hoje = new Date();
  const d = new Date(`${ymd}T12:00:00`);
  const diff = Math.round((new Date(hoje.toDateString()).getTime() - new Date(d.toDateString()).getTime()) / 86400000);
  if (diff === 0) return 'Hoje';
  if (diff === 1) return 'Ontem';
  const r = d.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'short' }).replace('.', '');
  return r[0].toUpperCase() + r.slice(1);
}

const ORIGEM: Record<string, string> = { banco: 'Banco', whatsapp: 'WhatsApp', importado: 'Extrato' };

export function IconeCategoria({ nome, tamanho = 'md' }: { nome?: string; tamanho?: 'sm' | 'md' }) {
  const { cor, icone: Icone } = categoria(nome);
  return (
    <span
      className={cn('flex shrink-0 items-center justify-center rounded-full', tamanho === 'md' ? 'h-10 w-10' : 'h-7 w-7')}
      style={{ backgroundColor: `color-mix(in oklch, ${cor} 14%, transparent)`, color: cor }}
      aria-hidden
    >
      <Icone className={tamanho === 'md' ? 'h-[18px] w-[18px]' : 'h-3.5 w-3.5'} />
    </span>
  );
}

// Lista agrupada por dia, como no extrato do banco. Toque na linha = editar.
export default function ListaTransacoes({ transacoes, onEditar, onExcluir, vazio = 'Nenhum lançamento neste período.' }: Props) {
  if (!transacoes.length) {
    return <p className="px-5 py-10 text-center text-sm text-muted-foreground">{vazio}</p>;
  }

  const grupos = new Map<string, Transaction[]>();
  for (const t of [...transacoes].sort((a, b) => b.quando.localeCompare(a.quando))) {
    const k = dia(t.quando);
    grupos.set(k, [...(grupos.get(k) ?? []), t]);
  }

  return (
    <div>
      {[...grupos.entries()].map(([ymd, itens]) => {
        const total = itens.filter((t) => t.tipo === 'receita' || t.tipo === 'despesa')
          .reduce((s, t) => s + (t.tipo === 'receita' ? Math.abs(t.valor) : -Math.abs(t.valor)), 0);
        return (
          <div key={ymd}>
            <div className="flex items-baseline justify-between border-b bg-secondary/60 px-5 py-2 text-xs">
              <span className="font-medium text-muted-foreground">{rotuloDia(ymd)}</span>
              <span className="tabular-nums text-muted-foreground">{reaisComSinal(total)}</span>
            </div>
            <ul className="divide-y">
              {itens.map((t) => {
                const entrada = t.tipo === 'receita';
                const transferencia = t.tipo === 'transferencia';
                const sub = [t.categoria, ORIGEM[t.origem ?? '']].filter(Boolean).join(' · ');
                return (
                  <li key={t.id} className="group relative flex items-center gap-3 px-5 py-3 transition-colors hover:bg-secondary/50">
                    <IconeCategoria nome={t.categoria} />
                    <button
                      type="button"
                      onClick={() => onEditar?.(t)}
                      disabled={!onEditar}
                      className="min-w-0 flex-1 text-left after:absolute after:inset-0 disabled:cursor-default"
                    >
                      <span className="flex items-center gap-1.5 text-sm font-medium">
                        {t.revisar && <span className="h-2 w-2 shrink-0 rounded-full bg-warning md:hidden" aria-label="a revisar" />}
                        <span className="truncate">{t.estabelecimento || t.detalhes || 'Sem descrição'}</span>
                      </span>
                      <span className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
                        <span className="truncate">{sub}</span>
                        {t.revisar && (
                          <span className="hidden shrink-0 rounded-full bg-warning/20 px-2 py-px font-medium text-[oklch(0.45_0.1_60)] md:inline">a revisar</span>
                        )}
                      </span>
                    </button>
                    <span className={cn('shrink-0 text-sm font-semibold tabular-nums',
                      entrada ? 'text-income' : transferencia ? 'text-muted-foreground' : 'text-foreground')}>
                      {transferencia ? `⇄ ${reais(t.valor)}` : reaisComSinal(entrada ? Math.abs(t.valor) : -Math.abs(t.valor))}
                    </span>
                    {onExcluir && (
                      <button
                        type="button"
                        onClick={() => onExcluir(t)}
                        aria-label={`Excluir ${t.estabelecimento}`}
                        className="relative z-10 -mr-2 rounded-md p-1.5 md:p-2 text-muted-foreground opacity-60 transition-opacity hover:bg-expense/10 hover:text-expense hover:opacity-100 md:opacity-0 md:group-hover:opacity-100 md:focus-visible:opacity-100"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}
    </div>
  );
}
