import { ChevronRight, MessageSquareText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Transaction } from '@/types/financialTypes';
import { reais } from './dinheiro';

// O que chegou do banco sem descrição. Some quando não tem nada pra revisar.
export default function ParaRevisar({ transacoes }: { transacoes: Transaction[] }) {
  const navigate = useNavigate();
  const pendentes = transacoes.filter((t) => t.revisar);
  if (!pendentes.length) return null;
  const total = pendentes.reduce((s, t) => s + Math.abs(t.valor), 0);

  return (
    <button
      type="button"
      onClick={() => navigate('/transacoes', { state: { revisar: true } })}
      className="flex w-full items-center gap-4 rounded-2xl border border-warning/50 bg-warning/10 px-5 py-4 text-left transition-colors hover:bg-warning/15"
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-warning/25 text-[oklch(0.42_0.1_60)]">
        <MessageSquareText className="h-5 w-5" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-semibold">
          {pendentes.length} {pendentes.length === 1 ? 'lançamento do banco' : 'lançamentos do banco'} sem descrição
        </span>
        <span className="block text-xs text-muted-foreground">
          {reais(total)} no total. Responda no grupo do WhatsApp ou toque aqui pra revisar.
        </span>
      </span>
      <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground" />
    </button>
  );
}
