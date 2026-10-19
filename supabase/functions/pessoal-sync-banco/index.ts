// Todo dia 20h (pg_cron): puxa os últimos dias da conta Inter do Hotel Rio's no Banco MCP,
// lança em `transacoes` como "a revisar" e manda no grupo um resumo numerado para o Rodrigo
// corrigir a descrição respondendo "1 - almoço com cliente".
// Body opcional: { "dias": 3, "dry": true, "sem_resumo": true }
import {
  brl, carregarConfig, acharGrupo, enviar, horaBrasilia, salvarConfig, supabase, transacoesBanco, type TxBanco,
} from "../_shared/financas-pessoais.ts";

// Categorias do Pluggy (inglês) → categorias do app. O que não casar fica "Outros" e vai pra revisão.
const MAPA: Array<[RegExp, string]> = [
  [/restaurant|food|eating|delivery|bakery/i, "Alimentação"],
  [/groceries|supermarket/i, "Supermercado"],
  [/gas station|fuel|taxi|ride|transport|parking|toll|vehicle/i, "Transporte"],
  [/pharmac|health|hospital|clinic|dentist|doctor/i, "Saúde"],
  [/school|education|university|course|book/i, "Educação"],
  [/leisure|entertainment|travel|streaming|games|culture/i, "Lazer"],
  [/rent|housing|electricity|water|utilities|telecom|internet/i, "Moradia"],
  [/clothing|shopping/i, "Vestuário"],
  [/tax/i, "Impostos"],
  [/invest/i, "Investimentos"],
  [/pet/i, "Pet"],
  [/services/i, "Serviços"],
];

const nome = (p?: string | { name?: string }) => (typeof p === "string" ? p : p?.name) ?? "";

// Saque e Pix para o próprio Rodrigo não são gasto: o dinheiro só muda de conta. Lançar como
// despesa contaria duas vezes quando ele registrar no WhatsApp o que gastou com esse dinheiro.
const ehSaque = (t: TxBanco) => /saque/i.test(`${t.description} ${t.operationType} ${t.category}`);
const ehProprio = (t: TxBanco) => /rodrigo\s+borba\s+machado/i.test(`${nome(t.paymentData?.receiver)} ${nome(t.paymentData?.payer)} ${t.description}`);

Deno.serve(async (req) => {
  try {
    const body = await req.json().catch(() => ({}));
    const dias = Number(body.dias ?? 3);
    const cfg = await carregarConfig();

    const hoje = horaBrasilia(new Date().toISOString()).slice(0, 10);
    const de = new Date(Date.parse(hoje) - dias * 86400_000).toISOString().slice(0, 10);
    const txs = (await transacoesBanco(cfg.pluggy_account_id, de, hoje)).filter((t) => t.status === "POSTED");

    const hashes = txs.map((t) => `pluggy:${t.id}`);
    const { data: existentes } = await supabase.from("transacoes").select("hash_unico").in("hash_unico", hashes.length ? hashes : ["-"]);
    const ja = new Set((existentes ?? []).map((e) => e.hash_unico));

    const linhas: Record<string, unknown>[] = [];
    for (const t of txs) {
      if (ja.has(`pluggy:${t.id}`)) continue;
      const valor = Number(t.amount);
      const transferencia = ehSaque(t) || ehProprio(t);
      const contraparte = nome(valor < 0 ? t.paymentData?.receiver : t.paymentData?.payer);
      const base = {
        login: cfg.login, user: cfg.login, quando: horaBrasilia(t.date), valor, origem: "banco",
        conta_bancaria_id: cfg.conta_banco_id,
        estabelecimento: (contraparte || (t.description ?? "").replace(/^pix (enviado|recebido)\s*-\s*/i, "")).slice(0, 250),
        detalhes: `Banco: ${t.description ?? ""} [${t.category ?? "sem categoria"}]`,
      };
      if (transferencia) {
        linhas.push({ ...base, hash_unico: `pluggy:${t.id}`, tipo: "transferencia", categoria: "Transferência", revisar: false });
        if (ehSaque(t) && valor < 0) {
          // Contrapartida: o saque entra na conta Dinheiro.
          linhas.push({ ...base, hash_unico: `pluggy:${t.id}:dinheiro`, valor: -valor, conta_bancaria_id: cfg.conta_dinheiro_id,
            tipo: "transferencia", categoria: "Transferência", estabelecimento: "Saque do Inter", revisar: false });
        }
        continue;
      }
      const categoria = valor > 0 ? "Outros" : MAPA.find(([re]) => re.test(t.category ?? ""))?.[1] ?? "Outros";
      linhas.push({ ...base, hash_unico: `pluggy:${t.id}`, tipo: valor > 0 ? "receita" : "despesa", categoria, revisar: true });
    }

    if (body.dry) return Response.json({ ok: true, dry: true, banco: txs.length, novos: linhas });

    if (linhas.length) {
      const { error } = await supabase.from("transacoes").insert(linhas);
      if (error) throw new Error(`insert transacoes: ${error.message}`);
    }

    let resumoEnviado = 0;
    const jid = body.sem_resumo ? null : await acharGrupo(cfg);
    if (jid) {
      cfg.grupo_jid = jid;
      const { data: pendentes } = await supabase.from("transacoes")
        .select("id, quando, valor, estabelecimento, categoria")
        .eq("login", cfg.login).eq("origem", "banco").eq("revisar", true)
        .order("quando").limit(40);
      if (pendentes?.length) {
        const resumo: Record<string, number> = {};
        const itens = pendentes.map((p, i) => {
          resumo[String(i + 1)] = p.id;
          const d = String(p.quando).slice(5, 10).split("-").reverse().join("/");
          return `${i + 1}. ${d} ${p.valor < 0 ? "−" : "+"}${brl(Math.abs(p.valor))} · ${p.estabelecimento} · ${p.categoria}`;
        });
        await enviar(cfg, `*Banco Inter (Hotel Rio's)* — ${pendentes.length} a revisar:\n\n${itens.join("\n")}\n\n` +
          `Pra dar a descrição certa, responda com o número: *1 - almoço com cliente* (uma por linha).`);
        await salvarConfig(cfg.login, { resumo });
        resumoEnviado = pendentes.length;
      }
    }

    return Response.json({ ok: true, banco: txs.length, lancados: linhas.length, resumo: resumoEnviado });
  } catch (e) {
    console.error(e);
    return Response.json({ ok: false, erro: (e as Error).message }, { status: 500 });
  }
});
