import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useTransactions } from '@/hooks/useTransactions';
import { TransactionDialogs } from '@/components/transacoes/TransactionDialogs';
import { TransactionHeader } from '@/components/transacoes/TransactionHeader';
import TransactionsTable from '@/components/dashboard/TransactionsTable';
import { MonthFilter } from "@/components/filters/MonthFilter";
import { reais } from '@/components/painel/dinheiro';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';
import { IconeCategoria } from '@/components/painel/ListaTransacoes';

type Filtro = 'todas' | 'receita' | 'despesa' | 'revisar';

const Transacoes = () => {
  const location = useLocation();
  const [filtro, setFiltro] = useState<Filtro>(() =>
    location.state?.revisar ? 'revisar' : location.state?.filter === 'receita' || location.state?.filter === 'despesa' ? location.state.filter : 'todas');
  // Vindo do painel ("Onde o dinheiro foi"): abre na categoria e no mês tocados.
  const [categoriaFiltro, setCategoriaFiltro] = useState<string | null>(location.state?.categoria ?? null);
  const [selectedMonth, setSelectedMonth] = useState(() => {
    if (location.state?.mes) return location.state.mes as string;
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  });

  const {
    transactions,
    isLoading,
    isDialogOpen,
    tipoForm,
    selectedTransaction,
    isEditing,
    isCartaoCreditoDialogOpen,
    cartoes,
    totalReceitas,
    totalDespesas,
    totalCartoes,
    handleTransactionSuccess,
    handleDespesaCartaoSuccess,
    handleEditTransaction,
    handleCloseDialog,
    handleCloseCartaoCreditoDialog,
    handleOpenDialog,
    handleOpenCartaoCreditoDialog,
    loadTransactions
  } = useTransactions({ monthFilter: selectedMonth });

  const aRevisar = transactions.filter(t => t.revisar).length;
  const daCategoria = (c?: string | null) => categoriaFiltro === 'Sem Categoria' ? !c?.trim() : c?.trim() === categoriaFiltro;
  const visiveis = (filtro === 'revisar' ? transactions.filter(t => t.revisar)
    : filtro === 'todas' ? transactions : transactions.filter(t => t.tipo === filtro))
    .filter(t => !categoriaFiltro || daCategoria(t.categoria));
  const totalCategoria = visiveis.reduce((s, t) => s + Math.abs(t.valor), 0);
  const saidas = totalDespesas + totalCartoes;

  const opcoes: Array<[Filtro, string]> = [
    ['todas', 'Todas'], ['receita', 'Entradas'], ['despesa', 'Saídas'],
    ...(aRevisar ? [['revisar', `A revisar · ${aRevisar}`] as [Filtro, string]] : []),
  ];

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl font-semibold tracking-tight md:text-2xl">Transações</h1>
        <MonthFilter selectedMonth={selectedMonth} onMonthChange={setSelectedMonth} />
      </div>

      <dl className="grid grid-cols-3 divide-x rounded-2xl border bg-card">
        {[
          ['Entradas', reais(totalReceitas), 'text-income'],
          ['Saídas', reais(saidas), 'text-expense'],
          ['Saldo', `${totalReceitas - saidas < 0 ? '−' : ''}${reais(totalReceitas - saidas)}`, totalReceitas - saidas < 0 ? 'text-expense' : 'text-foreground'],
        ].map(([rotulo, valor, cor]) => (
          <div key={rotulo} className="min-w-0 px-3 py-3 md:px-5">
            <dt className="text-xs text-muted-foreground">{rotulo}</dt>
            <dd className={cn('mt-0.5 truncate text-[13px] font-semibold tabular-nums sm:text-sm md:text-base', cor)}>{valor}</dd>
          </div>
        ))}
      </dl>

      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex gap-1 overflow-x-auto rounded-lg bg-secondary p-1" role="tablist" aria-label="Filtrar lançamentos">
          {opcoes.map(([valor, rotulo]) => (
            <button
              key={valor}
              type="button"
              role="tab"
              aria-selected={filtro === valor}
              onClick={() => setFiltro(valor)}
              className={cn(
                'whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
                filtro === valor ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground',
                valor === 'revisar' && filtro !== valor && 'text-[oklch(0.45_0.1_60)]',
              )}
            >
              {rotulo}
            </button>
          ))}
        </div>
        <TransactionHeader
          onOpenDialog={handleOpenDialog}
          onOpenCartaoCreditoDialog={handleOpenCartaoCreditoDialog}
        />
      </div>

      {categoriaFiltro && (
        <div className="flex items-center gap-3 rounded-2xl border bg-card px-4 py-3">
          <IconeCategoria nome={categoriaFiltro} tamanho="sm" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">{categoriaFiltro}</p>
            <p className="text-xs text-muted-foreground tabular-nums">{visiveis.length} {visiveis.length === 1 ? 'lançamento' : 'lançamentos'} · {reais(totalCategoria)}</p>
          </div>
          <button type="button" onClick={() => setCategoriaFiltro(null)} aria-label="Tirar filtro de categoria"
            className="rounded-md p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {filtro === 'revisar' && (
        <p className="text-sm text-muted-foreground">
          Estes vieram do banco sem descrição. Toque em um pra dar o nome certo, ou responda o resumo no grupo do WhatsApp.
        </p>
      )}

      <TransactionsTable
        transactions={visiveis}
        isLoading={isLoading}
        showPagination={true}
        onEdit={handleEditTransaction}
        onDelete={loadTransactions}
      />

      <TransactionDialogs
        isDialogOpen={isDialogOpen}
        tipoForm={tipoForm}
        selectedTransaction={selectedTransaction}
        isEditing={isEditing}
        isCartaoCreditoDialogOpen={isCartaoCreditoDialogOpen}
        cartoes={cartoes}
        onTransactionSuccess={handleTransactionSuccess}
        onDespesaCartaoSuccess={handleDespesaCartaoSuccess}
        onCloseDialog={handleCloseDialog}
        onCloseCartaoCreditoDialog={handleCloseCartaoCreditoDialog}
      />
    </div>
  );
};

export default Transacoes;
