import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Check, Pencil, Plus, RotateCcw, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuthStore } from '@/stores/authStore';
import { MonthFilter } from '@/components/filters/MonthFilter';
import { reais } from '@/components/painel/dinheiro';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

interface Conta {
  id: string;
  nome_conta: string;
  valor: number | null;
  dia_vencimento: number;
  dias_antecedencia: number | null;
  apelido_extrato: string | null;
  ativo: boolean;
}
interface Pagamento { id: number; conta_id: string; pago_em: string; valor: number | null; origem: 'auto' | 'grupo' | 'app' }

const ORIGEM = { auto: 'baixa automática', grupo: 'pelo WhatsApp', app: 'marcada no app' };
const hoje = () => new Date(new Date().toDateString());
const vencimento = (dia: number, ym: string) => {
  const [a, m] = ym.split('-').map(Number);
  return new Date(a, m - 1, Math.min(dia, new Date(a, m, 0).getDate()));
};
const ddmm = (d: Date | string) => (typeof d === 'string' ? new Date(`${d}T12:00:00`) : d).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });

// Contas fixas do mês: o que já foi pago (e como), o que vence e o que atrasou.
// O aviso no WhatsApp sai às 9h (pessoal-contas); a baixa é automática quando o nome bate no extrato.
export default function AvisosContas() {
  const { session } = useAuthStore();
  const email = session?.user?.email?.toLowerCase() ?? '';
  const qc = useQueryClient();
  const [mes, setMes] = useState(() => { const n = new Date(); return `${n.getFullYear()}-${String(n.getMonth() + 1).padStart(2, '0')}`; });
  const [editando, setEditando] = useState<Partial<Conta> | null>(null);
  const [ano, mesNum] = mes.split('-').map(Number);

  const { data: contas = [], isLoading } = useQuery({
    queryKey: ['contas', email],
    enabled: !!email,
    queryFn: async () => {
      const { data, error } = await supabase.from('contas_recorrentes')
        .select('id, nome_conta, valor, dia_vencimento, dias_antecedencia, apelido_extrato, ativo')
        .ilike('email_usuario', email).order('dia_vencimento');
      if (error) throw error;
      return data as Conta[];
    },
  });
  const { data: pagamentos = [] } = useQuery({
    queryKey: ['contas-pagamentos', email, mes],
    enabled: !!email,
    queryFn: async () => {
      const { data, error } = await supabase.from('contas_pagamentos')
        .select('id, conta_id, pago_em, valor, origem').eq('ano', ano).eq('mes', mesNum);
      if (error) throw error;
      return data as Pagamento[];
    },
  });
  const recarregar = () => qc.invalidateQueries({ queryKey: ['contas'] }).then(() => qc.invalidateQueries({ queryKey: ['contas-pagamentos'] }));

  const marcarPaga = async (c: Conta) => {
    const { error } = await supabase.from('contas_pagamentos').insert({
      conta_id: c.id, login: email, ano, mes: mesNum, pago_em: new Date().toISOString().slice(0, 10), valor: c.valor, origem: 'app',
    });
    if (error) return toast.error('Não consegui marcar como paga.');
    recarregar();
  };
  const desfazer = async (p: Pagamento) => {
    const { error } = await supabase.from('contas_pagamentos').delete().eq('id', p.id);
    if (error) return toast.error('Não consegui desfazer.');
    recarregar();
  };
  const salvar = async () => {
    if (!editando?.nome_conta?.trim() || !editando.dia_vencimento) return toast.error('Preencha nome e dia do vencimento.');
    const campos = {
      nome_conta: editando.nome_conta.trim(),
      valor: editando.valor || null,
      dia_vencimento: Math.min(Math.max(Number(editando.dia_vencimento), 1), 31),
      dias_antecedencia: Math.max(Number(editando.dias_antecedencia ?? 1), 0),
      apelido_extrato: editando.apelido_extrato?.trim() || null,
    };
    const { error } = editando.id
      ? await supabase.from('contas_recorrentes').update(campos).eq('id', editando.id)
      : await supabase.from('contas_recorrentes').insert({ ...campos, ativo: true, user_id: session?.user?.id, email_usuario: email });
    if (error) return toast.error('Não consegui salvar a conta.');
    setEditando(null);
    recarregar();
  };
  const excluir = async (c: Conta) => {
    if (!confirm(`Excluir "${c.nome_conta}"? O histórico de pagamentos dela também sai.`)) return;
    const { error } = await supabase.from('contas_recorrentes').delete().eq('id', c.id);
    if (error) return toast.error('Não consegui excluir.');
    setEditando(null);
    recarregar();
  };

  const ativas = contas.filter((c) => c.ativo);
  const pagoDe = (c: Conta) => pagamentos.find((p) => p.conta_id === c.id);
  const totalMes = ativas.reduce((s, c) => s + Number(c.valor ?? 0), 0);
  const totalPago = ativas.reduce((s, c) => s + (pagoDe(c) ? Number(pagoDe(c)!.valor ?? c.valor ?? 0) : 0), 0);
  const pagas = ativas.filter(pagoDe).length;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl font-semibold tracking-tight md:text-2xl">Contas a pagar</h1>
        <MonthFilter selectedMonth={mes} onMonthChange={setMes} />
      </div>

      <section className="rounded-2xl border bg-card px-5 py-4">
        <div className="flex items-baseline justify-between text-sm">
          <span className="text-muted-foreground">{pagas} de {ativas.length} pagas</span>
          <span className="tabular-nums"><span className="font-semibold">{reais(totalPago)}</span> <span className="text-muted-foreground">de {reais(totalMes)}</span></span>
        </div>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-secondary">
          <div className="h-full rounded-full bg-income transition-[width] duration-300" style={{ width: `${ativas.length ? (pagas / ativas.length) * 100 : 0}%` }} />
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          Aviso no grupo do WhatsApp às 9h. Quando o pagamento sai do Inter e o nome bate com o extrato, a baixa é automática; se pagar por fora, responda <b>paguei &lt;nome&gt;</b> no grupo.
        </p>
      </section>

      <section className="overflow-hidden rounded-2xl border bg-card">
        <div className="flex items-center justify-between px-5 py-3">
          <h2 className="text-sm font-semibold">Contas fixas</h2>
          <Button size="sm" onClick={() => setEditando({ dias_antecedencia: 1 })}><Plus className="mr-1 h-4 w-4" /> Nova conta</Button>
        </div>
        {isLoading ? (
          <p className="px-5 py-8 text-sm text-muted-foreground">Carregando…</p>
        ) : !ativas.length ? (
          <p className="px-5 py-8 text-center text-sm text-muted-foreground">Nenhuma conta fixa. Cadastre aluguel, escola, cartões… e receba o aviso no WhatsApp.</p>
        ) : (
          <ul className="divide-y border-t">
            {ativas.map((c) => {
              const p = pagoDe(c);
              const venc = vencimento(c.dia_vencimento, mes);
              const faltam = Math.round((venc.getTime() - hoje().getTime()) / 86400000);
              const estado = p ? { texto: `Paga ${ddmm(p.pago_em)} · ${ORIGEM[p.origem]}`, cor: 'text-income' }
                : faltam < 0 ? { texto: `Atrasada desde ${ddmm(venc)}`, cor: 'text-expense' }
                : faltam === 0 ? { texto: 'Vence hoje', cor: 'text-[oklch(0.45_0.1_60)]' }
                : { texto: `Vence ${ddmm(venc)}${faltam <= 7 ? ` · em ${faltam} ${faltam === 1 ? 'dia' : 'dias'}` : ''}`, cor: 'text-muted-foreground' };
              return (
                <li key={c.id} className="group flex items-center gap-3 px-5 py-3">
                  <span className={cn('flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold tabular-nums',
                    p ? 'bg-income/12 text-income' : faltam < 0 ? 'bg-expense/12 text-expense' : 'bg-secondary text-muted-foreground')}>
                    {p ? <Check className="h-4 w-4" /> : String(c.dia_vencimento).padStart(2, '0')}
                  </span>
                  <button type="button" onClick={() => setEditando(c)} className="min-w-0 flex-1 text-left">
                    <span className="block truncate text-sm font-medium">{c.nome_conta}</span>
                    <span className={cn('block truncate text-xs', estado.cor)}>{estado.texto}</span>
                  </button>
                  <span className="shrink-0 text-sm font-semibold tabular-nums">{c.valor ? reais(Number(p?.valor ?? c.valor)) : '—'}</span>
                  {p ? (
                    <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0 text-muted-foreground" aria-label={`Desfazer pagamento de ${c.nome_conta}`} onClick={() => desfazer(p)}>
                      <RotateCcw className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button variant="outline" size="sm" className="h-8 shrink-0" onClick={() => marcarPaga(c)}>Paga</Button>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <Dialog open={!!editando} onOpenChange={(o) => !o && setEditando(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>{editando?.id ? 'Editar conta' : 'Nova conta fixa'}</DialogTitle></DialogHeader>
          {editando && (
            <div className="grid gap-4">
              <div className="grid gap-1.5">
                <Label htmlFor="nome">Nome</Label>
                <Input id="nome" value={editando.nome_conta ?? ''} onChange={(e) => setEditando({ ...editando, nome_conta: e.target.value })} placeholder="Ex.: Escola dos filhos" />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="grid gap-1.5">
                  <Label htmlFor="valor">Valor</Label>
                  <Input id="valor" type="number" inputMode="decimal" step="0.01" value={editando.valor ?? ''} onChange={(e) => setEditando({ ...editando, valor: e.target.value ? Number(e.target.value) : null })} />
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="dia">Vence dia</Label>
                  <Input id="dia" type="number" min={1} max={31} value={editando.dia_vencimento ?? ''} onChange={(e) => setEditando({ ...editando, dia_vencimento: Number(e.target.value) })} />
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="ant">Avisar antes</Label>
                  <Input id="ant" type="number" min={0} max={15} value={editando.dias_antecedencia ?? 1} onChange={(e) => setEditando({ ...editando, dias_antecedencia: Number(e.target.value) })} />
                </div>
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="apelido">Como aparece no extrato</Label>
                <Input id="apelido" value={editando.apelido_extrato ?? ''} onChange={(e) => setEditando({ ...editando, apelido_extrato: e.target.value })} placeholder="Ex.: adventista, lima dos campos" />
                <p className="text-xs text-muted-foreground">Palavras do nome que o banco mostra no pagamento, separadas por vírgula. É o que permite a baixa automática.</p>
              </div>
            </div>
          )}
          <DialogFooter className="gap-2 sm:justify-between">
            {editando?.id ? (
              <Button variant="ghost" className="text-expense hover:bg-expense/10 hover:text-expense" onClick={() => excluir(editando as Conta)}>
                <Trash2 className="mr-1.5 h-4 w-4" /> Excluir
              </Button>
            ) : <span />}
            <Button onClick={salvar}><Pencil className="mr-1.5 h-4 w-4" /> Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
