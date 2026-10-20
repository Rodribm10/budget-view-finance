// Contas a pagar: casa conta fixa × lançamento do banco, avisa o que vence e dá baixa por "paguei X".
import { brl, type Config, enviar, horaBrasilia, supabase } from "./financas-pessoais.ts";

export interface Conta { id: string; nome_conta: string; valor: number | null; dia_vencimento: number; dias_antecedencia: number | null; apelido_extrato?: string | null }
export interface Lanc { id: number; quando: string; valor: number; estabelecimento: string | null; detalhes: string | null }
export interface Baixa { conta: Conta; ano: number; mes: number; lanc: Lanc }

// ---------- datas (tudo em YYYY-MM-DD, horário de Brasília) ----------
export const hojeBR = () => horaBrasilia(new Date().toISOString()).slice(0, 10);
const somaDias = (ymd: string, d: number) => new Date(Date.parse(`${ymd}T12:00:00Z`) + d * 86400_000).toISOString().slice(0, 10);
const diasEntre = (a: string, b: string) => Math.round((Date.parse(`${b}T12:00:00Z`) - Date.parse(`${a}T12:00:00Z`)) / 86400_000);

/** Vencimento no mês, sem estourar fevereiro (mesma regra da função SQL vencimento_conta). */
export function vencimento(dia: number, ano: number, mes: number): string {
  const ultimo = new Date(Date.UTC(ano, mes, 0)).getUTCDate();
  return `${ano}-${String(mes).padStart(2, "0")}-${String(Math.min(dia, ultimo)).padStart(2, "0")}`;
}

/** [ano, mes] do mês de `ymd` deslocado `delta` meses. */
export function mesRelativo(ymd: string, delta: number): [number, number] {
  const d = new Date(Date.UTC(Number(ymd.slice(0, 4)), Number(ymd.slice(5, 7)) - 1 + delta, 1));
  return [d.getUTCFullYear(), d.getUTCMonth() + 1];
}

// ---------- casamento por nome ----------
const GENERICAS = new Set(["cartao", "credito", "conta", "pagamento", "casa", "familia", "filho", "filhos", "trabalho", "material", "plano"]);
const norm = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
export const palavras = (nome: string) => norm(nome).split(/[^a-z0-9]+/).filter((p) => p.length >= 4 && !GENERICAS.has(p));
// Apelido do extrato vale como frase inteira ("lima dos campos"); vírgula separa alternativas.
const apelidos = (c: Conta) => (c.apelido_extrato ?? "").split(",").map((a) => norm(a).trim()).filter((a) => a.length >= 3);
const temPalavra = (conta: Conta, l: Lanc) => {
  const texto = norm(`${l.estabelecimento ?? ""} ${l.detalhes ?? ""}`);
  return apelidos(conta).some((a) => texto.includes(a)) ||
    palavras(conta.nome_conta).some((p) => new RegExp(`\\b${p}\\b`).test(texto));
};

/**
 * Para cada conta em aberto, procura um gasto entre 10 dias antes e 5 dias depois do vencimento
 * cujo NOME bata (palavra do nome da conta ou apelido do extrato) e valor até ±60% (fatura varia).
 * Só valor não basta: em 20/10/2026 a simulação casou Caesb R$ 300 com um Pix qualquer de R$ 300.
 * Entre candidatos, o valor mais perto ganha. Um gasto paga uma conta só.
 */
export function casar(contas: Conta[], meses: Array<[number, number]>, abertas: Set<string>, lancs: Lanc[]): Baixa[] {
  const usados = new Set<number>();
  const candidatos: Array<{ b: Baixa; nota: number }> = [];
  for (const [ano, mes] of meses) {
    for (const c of contas) {
      if (!abertas.has(`${c.id}:${ano}-${mes}`)) continue;
      const venc = vencimento(c.dia_vencimento, ano, mes);
      for (const l of lancs) {
        const dia = l.quando.slice(0, 10);
        const d = diasEntre(venc, dia);
        if (d < -10 || d > 5) continue;
        const v = Math.abs(l.valor), alvo = Number(c.valor ?? 0);
        const desvio = alvo > 0 ? Math.abs(v - alvo) / alvo : Infinity;
        const nome = temPalavra(c, l);
        if (!nome || desvio > 0.6) continue;
        candidatos.push({ b: { conta: c, ano, mes, lanc: l }, nota: desvio + Math.abs(d) / 100 });
      }
    }
  }
  const feitas = new Set<string>();
  const baixas: Baixa[] = [];
  for (const { b } of candidatos.sort((x, y) => x.nota - y.nota)) {
    const chave = `${b.conta.id}:${b.ano}-${b.mes}`;
    if (feitas.has(chave) || usados.has(b.lanc.id)) continue;
    feitas.add(chave);
    usados.add(b.lanc.id);
    baixas.push(b);
  }
  return baixas;
}

/** Conta citada em "paguei claro" / "paguei a escola 2799". */
export function contaPorTexto(contas: Conta[], texto: string): Conta | null {
  const t = norm(texto);
  const pontua = (c: Conta) => palavras(c.nome_conta).filter((p) => t.includes(p)).length + apelidos(c).filter((a) => t.includes(a)).length;
  const melhores = contas.map((c) => [c, pontua(c)] as const).filter(([, n]) => n > 0).sort((a, b) => b[1] - a[1]);
  if (!melhores.length || (melhores[1] && melhores[1][1] === melhores[0][1])) return null; // nada ou empate
  return melhores[0][0];
}

// ---------- banco ----------
export async function carregarContas(login: string): Promise<Conta[]> {
  const { data, error } = await supabase.from("contas_recorrentes")
    .select("id, nome_conta, valor, dia_vencimento, dias_antecedencia, apelido_extrato").ilike("email_usuario", login).eq("ativo", true);
  if (error) throw new Error(`contas_recorrentes: ${error.message}`);
  return (data ?? []) as Conta[];
}

async function pagas(contas: Conta[], meses: Array<[number, number]>): Promise<Set<string>> {
  if (!contas.length) return new Set();
  const { data, error } = await supabase.from("contas_pagamentos").select("conta_id, ano, mes")
    .in("conta_id", contas.map((c) => c.id)).in("ano", [...new Set(meses.map(([a]) => a))]);
  if (error) throw new Error(`contas_pagamentos: ${error.message}`);
  return new Set((data ?? []).map((p) => `${p.conta_id}:${p.ano}-${p.mes}`));
}

/** Baixa automática nos meses atual e anterior. Devolve o que baixou. */
export async function baixaAutomatica(login: string, simular = false): Promise<Baixa[]> {
  const hoje = hojeBR();
  const meses = [mesRelativo(hoje, -1), mesRelativo(hoje, 0)];
  const contas = await carregarContas(login);
  const jaPagas = await pagas(contas, meses);
  const abertas = new Set(meses.flatMap(([a, m]) => contas.map((c) => `${c.id}:${a}-${m}`)).filter((k) => !jaPagas.has(k)));

  const inicio = somaDias(vencimento(1, ...meses[0]), -10);
  const { data: lancs, error } = await supabase.from("transacoes").select("id, quando, valor, estabelecimento, detalhes")
    .eq("login", login).eq("tipo", "despesa").gte("quando", inicio);
  if (error) throw new Error(`transacoes: ${error.message}`);
  const { data: ligados } = await supabase.from("contas_pagamentos").select("transacao_id").not("transacao_id", "is", null).eq("login", login);
  const livres = (lancs ?? []).filter((l) => !(ligados ?? []).some((x) => x.transacao_id === l.id)) as Lanc[];

  const baixas = casar(contas, meses, abertas, livres);
  if (simular) return baixas;
  for (const b of baixas) {
    const { error: e } = await supabase.from("contas_pagamentos").insert({
      conta_id: b.conta.id, login, ano: b.ano, mes: b.mes, pago_em: b.lanc.quando.slice(0, 10),
      valor: Math.abs(b.lanc.valor), transacao_id: b.lanc.id, origem: "auto",
    });
    if (e && e.code !== "23505") throw new Error(`baixa ${b.conta.nome_conta}: ${e.message}`);
  }
  return baixas;
}

/** Texto do aviso das 9h: o que vence logo e o que atrasou nos últimos 7 dias. Vazio se nada. */
export async function textoAvisos(login: string): Promise<string> {
  const hoje = hojeBR();
  const meses = [mesRelativo(hoje, -1), mesRelativo(hoje, 0), mesRelativo(hoje, 1)];
  const contas = await carregarContas(login);
  const jaPagas = await pagas(contas, meses);
  const vencendo: Array<[number, string]> = [], atrasadas: Array<[number, string]> = [];
  for (const [ano, mes] of meses) {
    for (const c of contas) {
      if (jaPagas.has(`${c.id}:${ano}-${mes}`)) continue;
      const venc = vencimento(c.dia_vencimento, ano, mes);
      const faltam = diasEntre(hoje, venc);
      const quando = venc.slice(8, 10) + "/" + venc.slice(5, 7);
      const valor = c.valor ? ` · ${brl(Number(c.valor))}` : "";
      if (faltam >= 0 && faltam <= Math.max(c.dias_antecedencia ?? 1, 1)) {
        const rotulo = faltam === 0 ? "*hoje*" : faltam === 1 ? "amanhã" : `em ${faltam} dias (${quando})`;
        vencendo.push([faltam, `• ${c.nome_conta}${valor} — vence ${rotulo}`]);
      } else if (faltam === -1 || faltam === -3) { // lembra no dia seguinte e 3 dias depois, não todo dia
        atrasadas.push([faltam, `• ${c.nome_conta}${valor} — venceu ${quando}`]);
      }
    }
  }
  if (!vencendo.length && !atrasadas.length) return "";
  const partes = ["*Contas a pagar*"];
  if (vencendo.length) partes.push(vencendo.sort((a, b) => a[0] - b[0]).map(([, t]) => t).join("\n"));
  if (atrasadas.length) partes.push(`⚠️ Em atraso:\n${atrasadas.sort((a, b) => b[0] - a[0]).map(([, t]) => t).join("\n")}`);
  partes.push('Quando pagar por fora do Inter, responda *paguei <nome>*.');
  return partes.join("\n\n");
}

export const textoBaixas = (baixas: Baixa[]) => baixas.length
  ? `*Baixa automática*\n${baixas.map((b) => `✅ ${b.conta.nome_conta} · ${brl(Math.abs(b.lanc.valor))} (${b.lanc.quando.slice(8, 10)}/${b.lanc.quando.slice(5, 7)} · ${b.lanc.estabelecimento ?? "banco"})`).join("\n")}\nSe alguma estiver errada, desfaça na tela Contas a pagar.`
  : "";

/** "paguei claro" / "paguei escola 2799,90". `null` = não é pagamento de conta (segue como gasto). */
export async function pagarPeloGrupo(cfg: Config, linha: string, valor: number | null): Promise<string | null> {
  const m = linha.match(/^\s*paguei\s+(.+)$/i);
  if (!m) return null;
  const contas = await carregarContas(cfg.login);
  const conta = contaPorTexto(contas, m[1]);
  if (!conta) return null;

  const hoje = hojeBR();
  // Mês da conta: o atual; se ele já está pago e o próximo vence em até 10 dias, adianta.
  const opcoes = [mesRelativo(hoje, 0), mesRelativo(hoje, 1)];
  const jaPagas = await pagas([conta], opcoes);
  const [ano, mes] = opcoes.find(([a, mm], i) =>
    !jaPagas.has(`${conta.id}:${a}-${mm}`) && (i === 0 || diasEntre(hoje, vencimento(conta.dia_vencimento, a, mm)) <= 10)) ?? [];
  if (!ano) return `☑️ ${conta.nome_conta} já estava paga este mês.`;

  const { error } = await supabase.from("contas_pagamentos").insert({
    conta_id: conta.id, login: cfg.login, ano, mes, pago_em: hoje, valor, origem: "grupo",
  });
  if (error && error.code !== "23505") throw new Error(`paguei ${conta.nome_conta}: ${error.message}`);
  return `✅ ${conta.nome_conta} paga (${String(mes).padStart(2, "0")}/${ano})${valor ? ` · ${brl(valor)}` : ""}`;
}

export const avisarNoGrupo = (cfg: Config, texto: string) => (texto && cfg.grupo_jid ? enviar(cfg, texto) : Promise.resolve());
