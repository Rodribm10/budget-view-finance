// Contas a pagar (pg_cron):
//  * 9h  → baixa automática + aviso no grupo do que vence logo / atrasou;
//  * 20h10 {"so_baixa": true} → depois do sync do banco, só a baixa (e conta no grupo o que baixou).
// {"simular": true} devolve o que casaria, sem gravar nem mandar mensagem.
import { acharGrupo, carregarConfig } from "../_shared/financas-pessoais.ts";
import { avisarNoGrupo, baixaAutomatica, textoAvisos, textoBaixas } from "../_shared/contas.ts";

Deno.serve(async (req) => {
  try {
    const { so_baixa, simular } = await req.json().catch(() => ({}));
    const cfg = await carregarConfig();

    const baixas = await baixaAutomatica(cfg.login, !!simular);
    const resumo = baixas.map((b) => ({ conta: b.conta.nome_conta, mes: `${b.mes}/${b.ano}`, valor: b.lanc.valor, quando: b.lanc.quando, lancamento: b.lanc.estabelecimento }));
    const avisos = so_baixa ? "" : await textoAvisos(cfg.login);
    if (simular) return Response.json({ ok: true, simular: true, baixas: resumo, avisos });

    cfg.grupo_jid = await acharGrupo(cfg);
    await avisarNoGrupo(cfg, [textoBaixas(baixas), avisos].filter(Boolean).join("\n\n"));
    return Response.json({ ok: true, baixas: resumo, avisou: !!avisos });
  } catch (e) {
    console.error(e);
    return Response.json({ ok: false, erro: (e as Error).message }, { status: 500 });
  }
});
