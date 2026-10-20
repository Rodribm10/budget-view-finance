// Cliente Supabase falso, só para desenvolvimento visual: `VITE_MOCK=1 npm run dev`.
// O vite.config troca o client.ts por este arquivo; o build de produção nunca o inclui.
// Responde qualquer consulta com dados de exemplo e uma sessão fictícia, sem tocar no banco real.
// Ignora filtros (eq, gte…): devolve todas as linhas da tabela. Basta para enxergar as telas.

const hoje = new Date();
const mes = (d: number, h = 12) => {
  const x = new Date(hoje.getFullYear(), hoje.getMonth(), Math.min(d, 28), h);
  return x.toISOString().slice(0, 19);
};
const EMAIL = "exemplo@financehome.app";

let seq = 1;
const tx = (dia: number, valor: number, estabelecimento: string, categoria: string, extra: Record<string, unknown> = {}) => ({
  id: seq++, created_at: mes(dia), user: EMAIL, login: EMAIL, quando: mes(dia), estabelecimento, valor,
  tipo: valor > 0 ? "receita" : "despesa", categoria, detalhes: "", grupo_id: null, origem: "manual", revisar: false, ...extra,
});

const transacoes = [
  tx(1, 12500, "Pró-labore", "Receita Fixa"),
  tx(5, 2200, "Aluguel sala comercial", "Receita Fixa"),
  tx(2, -4200, "Aluguel apartamento", "Moradia"),
  tx(3, -687.4, "Supermercado Pão de Açúcar", "Supermercado"),
  tx(4, -42.9, "Padaria Pão Dourado", "Alimentação"),
  tx(6, -1473.54, "Colégio Adventista", "Educação"),
  tx(7, -189.9, "Posto Shell", "Transporte"),
  tx(8, -400, "Policlínica Mônica", "Saúde"),
  tx(9, -30, "Cabeleireiro", "Cuidados Pessoais", { origem: "whatsapp" }),
  tx(10, -236.5, "Restaurante Coco Bambu", "Alimentação"),
  tx(11, -89.9, "Netflix + Spotify", "Lazer"),
  tx(12, -312.8, "Supermercado Big Box", "Supermercado"),
  tx(13, -58.4, "Uber", "Transporte"),
  tx(14, -144.28, "Cartório Registro Civil", "Serviços"),
  tx(15, -300, "Vitor Hugo Apolinário", "Outros", { origem: "banco", revisar: true }),
  tx(16, -36.23, "Edilson Lopes Santana", "Outros", { origem: "banco", revisar: true }),
  tx(17, -458.5, "Instituição Adventista", "Educação", { origem: "banco", revisar: true }),
  tx(18, -64, "Farmácia Drogasil", "Saúde"),
  tx(18, -25, "Pastel da feira", "Alimentação", { origem: "whatsapp" }),
  tx(19, -1286.12, "Município de Buritis", "Impostos", { origem: "banco", revisar: true }),
];

const TABELAS: Record<string, unknown[]> = {
  transacoes,
  usuarios: [{ id: 1, email: EMAIL, nome: "Rodrigo", whatsapp: "61999990000", status_assinatura: "ativa", liberado_permanente: true, created_at: mes(1) }],
  contas_bancarias: [
    { id: "c1", nome: "Inter PJ Hotel Rio's", banco: "Inter", tipo: "corrente", saldo_inicial: 22048.86, ativo: true, login: EMAIL },
    { id: "c2", nome: "Dinheiro", banco: "Espécie", tipo: "dinheiro", saldo_inicial: 350, ativo: true, login: EMAIL },
  ],
  cartoes_credito: [
    { id: "k1", nome: "Inter Mastercard", bandeira: "Mastercard", banco: "Inter", limite: 15000, dia_fechamento: 3, dia_vencimento: 10, cor: "#ff7a00", login: EMAIL, created_at: mes(1) },
    { id: "k2", nome: "XP Visa Infinite", bandeira: "Visa", banco: "XP", limite: 40000, dia_fechamento: 20, dia_vencimento: 28, cor: "#111827", login: EMAIL, created_at: mes(1) },
  ],
  despesas_cartao: [
    { id: "d1", cartao_id: "k1", descricao: "Amazon", valor: 249.9, data_despesa: mes(5).slice(0, 10), login: EMAIL, mes_fatura: hoje.getMonth() + 1, ano_fatura: hoje.getFullYear(), created_at: mes(5) },
    { id: "d2", cartao_id: "k2", descricao: "Passagem aérea", valor: 1890, data_despesa: mes(9).slice(0, 10), login: EMAIL, mes_fatura: hoje.getMonth() + 1, ano_fatura: hoje.getFullYear(), created_at: mes(9) },
  ],
  metas: [
    { id: 1, login: EMAIL, categoria: "Alimentação", valor_meta: 1200, mes: hoje.getMonth() + 1, ano: hoje.getFullYear(), created_at: mes(1) },
    { id: 2, login: EMAIL, categoria: "Supermercado", valor_meta: 1500, mes: hoje.getMonth() + 1, ano: hoje.getFullYear(), created_at: mes(1) },
  ],
  contas_recorrentes: [
    { id: 1, login: EMAIL, nome: "Condomínio", valor: 980, dia_vencimento: 25, ativo: true, created_at: mes(1) },
    { id: 2, login: EMAIL, nome: "Internet", valor: 129.9, dia_vencimento: 22, ativo: true, created_at: mes(1) },
  ],
};

type Resultado = { data: unknown; error: null; count?: number };

function consulta(tabela: string) {
  const linhas = TABELAS[tabela] ?? [];
  let unico = false;
  const resolver = (): Resultado => ({ data: unico ? linhas[0] ?? null : linhas, error: null, count: linhas.length });
  const cadeia: Record<string | symbol, unknown> = new Proxy({}, {
    get(_, prop) {
      if (prop === "then") return (ok: (r: Resultado) => unknown, erro?: (e: unknown) => unknown) => Promise.resolve(resolver()).then(ok, erro);
      if (prop === "single" || prop === "maybeSingle") return () => { unico = true; return cadeia; };
      return () => cadeia; // select, eq, order, insert, update… todos encadeiam
    },
  });
  return cadeia;
}

const usuario = { id: "00000000-0000-0000-0000-000000000001", email: EMAIL, user_metadata: { name: "Rodrigo" } };
const sessao = { user: usuario, access_token: "mock", refresh_token: "mock", expires_at: 9999999999, token_type: "bearer" };

export const supabase = {
  from: consulta,
  rpc: () => Promise.resolve({ data: null, error: null }),
  functions: { invoke: () => Promise.resolve({ data: null, error: null }) },
  channel: () => ({ on() { return this; }, subscribe() { return this; }, unsubscribe() {} }),
  removeChannel: () => {},
  auth: {
    getSession: () => Promise.resolve({ data: { session: sessao }, error: null }),
    getUser: () => Promise.resolve({ data: { user: usuario }, error: null }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe() {} } } }),
    signOut: () => Promise.resolve({ error: null }),
  },
};
