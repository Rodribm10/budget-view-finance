// Peças comuns da automação de finanças pessoais (pessoal-sync-banco e pessoal-grupo-gastos).
// Os segredos (BANCO_MCP_API_KEY, GOWA_*, HERMES_PROXY_*) já existem no projeto: são os do Finance Hub.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

export const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

export const CATEGORIAS = [
  "Alimentação", "Supermercado", "Transporte", "Saúde", "Cuidados Pessoais", "Educação", "Lazer",
  "Moradia", "Vestuário", "Serviços", "Pet", "Impostos", "Investimentos", "Receita Fixa",
  "Transferência", "Outros",
];

// Prefixo de toda mensagem que a automação manda. O grupo é do próprio chip do Rodrigo,
// então as mensagens dele e as do robô chegam como is_from_me: é o prefixo que separa.
export const ROBO = "🤖";

export interface Config {
  login: string;
  conta_banco_id: string;
  pluggy_account_id: string;
  conta_dinheiro_id: string;
  grupo_nome: string;
  grupo_jid: string | null;
  gowa_device: string;
  lido_ate: string;
  resumo: Record<string, number>;
}

export async function carregarConfig(): Promise<Config> {
  const { data, error } = await supabase.from("automacao_financas").select("*").limit(1).single();
  if (error || !data) throw new Error(`automacao_financas sem configuração: ${error?.message}`);
  return data as Config;
}

export const salvarConfig = (login: string, campos: Partial<Config>) =>
  supabase.from("automacao_financas").update({ ...campos, atualizado_em: new Date().toISOString() }).eq("login", login);

// ---------- datas: a coluna transacoes.quando é timestamp sem fuso, gravada no horário de Brasília ----------
export function horaBrasilia(iso: string): string {
  const d = new Date(new Date(iso).getTime() - 3 * 3600_000);
  return d.toISOString().slice(0, 19).replace("T", " ");
}

export const brl = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

// ---------- GOWA ----------
const GOWA_URL = (Deno.env.get("GOWA_URL") ?? "https://gowa-app.innova1001.com.br").replace(/\/$/, "");

async function gowa(device: string, path: string, init: RequestInit = {}) {
  const r = await fetch(`${GOWA_URL}${path}`, {
    ...init,
    headers: {
      Authorization: `Basic ${Deno.env.get("GOWA_BASIC_AUTH")}`,
      "X-Device-Id": device,
      ...(init.headers ?? {}),
    },
    signal: AbortSignal.timeout(30_000),
  });
  const body = await r.json().catch(() => ({}));
  if (!r.ok || body.code !== "SUCCESS") throw new Error(`GOWA ${path} HTTP ${r.status}: ${body.message ?? "sem detalhe"}`);
  return body.results;
}

export function enviar(cfg: Config, texto: string) {
  return gowa(cfg.gowa_device, "/send/message", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phone: cfg.grupo_jid, message: `${ROBO} ${texto}` }),
  });
}

/** Acha o JID do grupo pelo nome (o grupo é criado à mão no celular). */
export async function acharGrupo(cfg: Config): Promise<string | null> {
  if (cfg.grupo_jid) return cfg.grupo_jid;
  const alvo = cfg.grupo_nome.trim().toLowerCase();
  for (let offset = 0; offset < 1000; offset += 100) {
    const r = await gowa(cfg.gowa_device, `/chats?limit=100&offset=${offset}`);
    const chats = (r?.data ?? []) as Array<{ jid: string; name?: string }>;
    const g = chats.find((c) => c.jid.endsWith("@g.us") && (c.name ?? "").trim().toLowerCase() === alvo);
    if (g) {
      await salvarConfig(cfg.login, { grupo_jid: g.jid });
      return g.jid;
    }
    if (chats.length < 100) break;
  }
  return null;
}

export interface MensagemWa {
  id: string;
  content: string;
  timestamp: string;
  is_from_me: boolean;
  media_type?: string;
}

/** Mensagens do grupo depois de `desde`, da mais antiga para a mais nova. limit tem teto 100 no GOWA. */
export async function mensagensDesde(cfg: Config, desde: string): Promise<MensagemWa[]> {
  const out: MensagemWa[] = [];
  const t0 = Date.parse(desde); // formatos diferentes (Z vs +00:00): comparar como data, não string
  for (let offset = 0; offset < 500; offset += 100) {
    const r = await gowa(cfg.gowa_device, `/chat/${cfg.grupo_jid}/messages?limit=100&offset=${offset}`);
    const pagina = (r?.data ?? []) as MensagemWa[];
    const novas = pagina.filter((m) => Date.parse(m.timestamp) > t0);
    out.push(...novas);
    if (pagina.length < 100 || novas.length < pagina.length) break;
  }
  return out.sort((a, b) => a.timestamp.localeCompare(b.timestamp));
}

// ---------- Banco MCP (mesmo endpoint call-installed que o Finance Hub usa) ----------
export interface TxBanco {
  id: string;
  date: string;
  description?: string;
  amount: string | number;
  type: "DEBIT" | "CREDIT";
  status: string;
  category?: string;
  operationType?: string;
  paymentData?: { receiver?: string | { name?: string }; payer?: string | { name?: string } };
}

export async function transacoesBanco(pluggyAccountId: string, de: string, ate: string): Promise<TxBanco[]> {
  // A URL call-installed é por workspace; qualquer integração banco_mcp do projeto serve.
  const { data: integ } = await supabase.from("bank_integrations")
    .select("encrypted_credentials").eq("bank_type", "banco_mcp").limit(1).single();
  const url = (integ?.encrypted_credentials as { banco_mcp_url?: string })?.banco_mcp_url;
  if (!url) throw new Error("Nenhuma bank_integrations banco_mcp com banco_mcp_url.");

  const r = await fetch(url, {
    method: "POST",
    headers: { Authorization: `Bearer ${Deno.env.get("BANCO_MCP_API_KEY")}`, "Content-Type": "application/json" },
    body: JSON.stringify({ tool_id: "openfinance_list_transactions", args: { account_id: pluggyAccountId, from: de, to: ate } }),
    signal: AbortSignal.timeout(60_000),
  });
  const payload = await r.json().catch(() => ({}));
  if (!r.ok || payload?.ok === false || payload?.error) {
    throw new Error(`Banco MCP HTTP ${r.status}: ${JSON.stringify(payload?.error ?? payload).slice(0, 300)}`);
  }
  const res = payload?.result ?? payload;
  return (Array.isArray(res) ? res : res?.results ?? []) as TxBanco[];
}

// ---------- interpretação de texto livre ("cabeleireiro 30", "recebi 200 do aluguel ontem") ----------
export interface Lancamento {
  valor: number; // sempre positivo
  tipo: "despesa" | "receita";
  descricao: string;
  categoria: string;
  data: string; // YYYY-MM-DD
}

const hojeBrasilia = (iso: string) => horaBrasilia(iso).slice(0, 10);
const menosUmDia = (ymd: string) => new Date(Date.parse(ymd) - 86400_000).toISOString().slice(0, 10);

/** Valor em reais escrito à brasileira: "30", "30,50", "1.234,56", "R$ 45". */
export function lerValor(texto: string): number | null {
  const m = texto.match(/\d{1,3}(?:\.\d{3})+(?:,\d{1,2})?|\d+(?:[.,]\d{1,2})?/);
  if (!m) return null;
  let s = m[0];
  if (s.includes(",")) s = s.replace(/\./g, "").replace(",", ".");
  else if (/^\d{1,3}(\.\d{3})+$/.test(s)) s = s.replace(/\./g, "");
  const v = Number(s);
  return v > 0 ? v : null;
}

/** Plano B sem IA: número = valor, resto = descrição. Nunca perde um gasto por o proxy estar fora. */
export function interpretarSemIa(texto: string, quandoIso: string): Lancamento | null {
  const valor = lerValor(texto);
  if (valor === null) return null;
  const baixo = texto.toLowerCase();
  const descricao = texto.replace(/r\$\s*/gi, "").replace(/\d[\d.,]*/, "").replace(/\breais\b/gi, "")
    .replace(/\b(gastei|paguei|no|na|com|de|em|ontem|hoje)\b/gi, " ").replace(/\s+/g, " ").trim();
  const hoje = hojeBrasilia(quandoIso);
  return {
    valor,
    tipo: /\b(recebi|entrou|ganhei|vendi)\b/.test(baixo) ? "receita" : "despesa",
    descricao: descricao ? descricao[0].toUpperCase() + descricao.slice(1) : "Gasto em dinheiro",
    categoria: "Outros",
    data: /\bontem\b/.test(baixo) ? menosUmDia(hoje) : hoje,
  };
}

// Gemini direto (endpoint compatível com OpenAI). Os proxies Hermes da Léo deram 500 em 19/10/2026.
async function perguntarIa(sistema: string, usuario: string): Promise<string> {
  const key = Deno.env.get("GEMINI_API_KEY");
  if (!key) throw new Error("GEMINI_API_KEY ausente");
  const r = await fetch("https://generativelanguage.googleapis.com/v1beta/openai/chat/completions", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "gemini-2.5-flash",
      messages: [{ role: "system", content: sistema }, { role: "user", content: usuario }],
    }),
    signal: AbortSignal.timeout(60_000),
  });
  const data = await r.json().catch(() => ({}));
  if (!r.ok || data.error) throw new Error(`IA HTTP ${r.status}: ${JSON.stringify(data.error ?? data).slice(0, 200)}`);
  return data.choices?.[0]?.message?.content ?? "";
}

function jsonDaResposta(txt: string): unknown {
  const m = txt.match(/[[{][\s\S]*[\]}]/);
  return m ? JSON.parse(m[0]) : null;
}

/** IA primeiro; se falhar ou devolver lixo, plano B. `null` = não há valor na mensagem. */
export async function interpretar(texto: string, quandoIso: string): Promise<Lancamento | null> {
  const hoje = hojeBrasilia(quandoIso);
  try {
    const resp = await perguntarIa(
      `Você lança gastos pessoais. Hoje é ${hoje} (Brasília). Responda SÓ um JSON:
{"valor": número positivo em reais ou null se não houver valor, "tipo": "despesa"|"receita",
 "descricao": "curta, em português, com inicial maiúscula", "categoria": uma de ${JSON.stringify(CATEGORIAS)},
 "data": "YYYY-MM-DD" (resolva "ontem", "sexta" etc.; sem menção = hoje)}`,
      texto,
    );
    const j = jsonDaResposta(resp) as Partial<Lancamento> | null;
    if (j && (j.valor === null || j.valor === undefined)) return null;
    if (j && Number(j.valor) > 0 && j.descricao && /^\d{4}-\d{2}-\d{2}$/.test(j.data ?? "")) {
      return {
        valor: Number(j.valor),
        tipo: j.tipo === "receita" ? "receita" : "despesa",
        descricao: j.descricao,
        categoria: CATEGORIAS.includes(j.categoria ?? "") ? j.categoria! : "Outros",
        data: j.data!,
      };
    }
  } catch (e) {
    console.warn("IA indisponível, usando plano B:", (e as Error).message);
  }
  return interpretarSemIa(texto, quandoIso);
}

/** Só a categoria de uma descrição corrigida pelo Rodrigo ("1 almoço com fornecedor"). */
export async function categorizar(descricao: string): Promise<string | null> {
  try {
    const resp = await perguntarIa(`Escolha a categoria desta despesa pessoal. Responda só o nome, uma de ${JSON.stringify(CATEGORIAS)}.`, descricao);
    const c = CATEGORIAS.find((x) => resp.trim().toLowerCase().includes(x.toLowerCase()));
    return c ?? null;
  } catch {
    return null;
  }
}

// Correção = número + separador + texto ("1 - almoço", "2: farmácia"), ou número + texto sem
// outro número quando esse item está pendente ("1 almoço"). "5 pão" com o item 5 pendente vira
// correção — a resposta no grupo mostra o que foi feito, então o erro fica visível.
export function lerCorrecao(linha: string, resumo: Record<string, number>): [string, string] | null {
  const m = linha.match(/^\s*(\d{1,2})\s*[-–=:.)]\s*(.+)$/) ?? linha.match(/^\s*(\d{1,2})\s+([^\d]+)$/);
  return m && resumo[m[1]] ? [m[1], m[2].trim()] : null;
}
