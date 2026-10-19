// A cada 15 min (pg_cron): lê o grupo "Finance - Dinheiro" no WhatsApp (GOWA, chip do Rodrigo).
//  * "cabeleireiro 30" / "recebi 200 do aluguel ontem" → lança na conta Dinheiro, já categorizado;
//  * "1 - almoço com cliente" → corrige a descrição do item 1 do último resumo do banco.
// Uma linha = um lançamento. Responde no grupo com o que entendeu.
import {
  acharGrupo, brl, carregarConfig, categorizar, enviar, horaBrasilia, interpretar, lerCorrecao, mensagensDesde, ROBO, salvarConfig,
  supabase,
} from "../_shared/financas-pessoais.ts";

Deno.serve(async (req) => {
  try {
    // Diagnóstico: {"testar": "cabeleireiro 30"} só interpreta, não grava nem lê o grupo.
    const { testar } = await req.json().catch(() => ({}));
    if (testar) return Response.json({ ok: true, lancamento: await interpretar(testar, new Date().toISOString()) });

    const cfg = await carregarConfig();
    cfg.grupo_jid = await acharGrupo(cfg);
    if (!cfg.grupo_jid) return Response.json({ ok: true, aviso: `grupo "${cfg.grupo_nome}" ainda não existe no WhatsApp` });

    const msgs = await mensagensDesde(cfg, cfg.lido_ate);
    if (!msgs.length) return Response.json({ ok: true, novas: 0 });

    const resumo = { ...cfg.resumo };
    const respostas: string[] = [];

    for (const m of msgs) {
      const texto = (m.content ?? "").trim();
      if (texto.startsWith(ROBO)) continue;
      if (!texto) {
        if (m.media_type) respostas.push(`⚠️ Por enquanto só leio texto (chegou ${m.media_type}).`);
        continue;
      }

      const linhas = texto.split("\n").map((l) => l.trim()).filter(Boolean);
      for (const [i, linha] of linhas.entries()) {
        const correcao = lerCorrecao(linha, resumo);
        if (correcao) {
          const [n, descricao] = correcao;
          const categoria = await categorizar(descricao);
          const { error } = await supabase.from("transacoes")
            .update({ estabelecimento: descricao, revisar: false, ...(categoria ? { categoria } : {}) })
            .eq("id", resumo[n]).eq("login", cfg.login);
          if (error) throw new Error(`update transacao ${resumo[n]}: ${error.message}`);
          delete resumo[n];
          respostas.push(`✏️ ${n} → ${descricao}${categoria ? ` · ${categoria}` : ""}`);
          continue;
        }

        const l = await interpretar(linha, m.timestamp);
        if (!l) {
          respostas.push(`❓ Não achei valor em: "${linha}"`);
          continue;
        }
        const hojeMsg = horaBrasilia(m.timestamp);
        const { error } = await supabase.from("transacoes").insert({
          login: cfg.login, user: cfg.login, grupo_id: cfg.grupo_jid, origem: "whatsapp",
          hash_unico: `wa:${m.id}${linhas.length > 1 ? `:${i}` : ""}`,
          conta_bancaria_id: cfg.conta_dinheiro_id,
          quando: l.data === hojeMsg.slice(0, 10) ? hojeMsg : `${l.data} 12:00:00`,
          valor: l.tipo === "receita" ? l.valor : -l.valor,
          tipo: l.tipo, categoria: l.categoria, estabelecimento: l.descricao,
          detalhes: `WhatsApp: ${linha}`,
        });
        // 23505 = já lançado numa rodada anterior (rodada que caiu antes de gravar lido_ate).
        if (error && error.code !== "23505") throw new Error(`insert transacao: ${error.message}`);
        if (!error) {
          const d = l.data.slice(5).split("-").reverse().join("/");
          respostas.push(`✅ ${l.tipo === "receita" ? "+" : "−"}${brl(l.valor)} · ${l.descricao} · ${l.categoria} · ${d}`);
        }
      }
    }

    if (respostas.length) await enviar(cfg, respostas.join("\n"));
    await salvarConfig(cfg.login, { lido_ate: msgs[msgs.length - 1].timestamp, resumo });
    return Response.json({ ok: true, novas: msgs.length, respostas });
  } catch (e) {
    console.error(e);
    return Response.json({ ok: false, erro: (e as Error).message }, { status: 500 });
  }
});
