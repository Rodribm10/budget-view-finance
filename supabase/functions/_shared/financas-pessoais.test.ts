// deno test --allow-env --allow-net _shared/financas-pessoais.test.ts
Deno.env.set("SUPABASE_URL", "http://localhost");
Deno.env.set("SUPABASE_SERVICE_ROLE_KEY", "x");
const { lerValor, interpretarSemIa, lerCorrecao } = await import("./financas-pessoais.ts");

const eq = (a: unknown, b: unknown) => { if (JSON.stringify(a) !== JSON.stringify(b)) throw new Error(`${JSON.stringify(a)} != ${JSON.stringify(b)}`); };

Deno.test("valor em reais", () => {
  eq(lerValor("cabeleireiro 30"), 30);
  eq(lerValor("padaria 12,50"), 12.5);
  eq(lerValor("mercado R$ 1.234,56"), 1234.56);
  eq(lerValor("uber 23.90"), 23.9);
  eq(lerValor("aluguel 2.000"), 2000);
  eq(lerValor("sem valor"), null);
});

Deno.test("plano B sem IA", () => {
  // 19/10 15h UTC = 12h Brasília
  eq(interpretarSemIa("Gastei no cabeleireiro 30 reais", "2026-10-19T15:00:00Z"),
    { valor: 30, tipo: "despesa", descricao: "Cabeleireiro", categoria: "Outros", data: "2026-10-19" });
  eq(interpretarSemIa("recebi 200 do aluguel ontem", "2026-10-19T15:00:00Z")?.tipo, "receita");
  eq(interpretarSemIa("recebi 200 do aluguel ontem", "2026-10-19T15:00:00Z")?.data, "2026-10-18");
  // 01h UTC do dia 20 ainda é dia 19 em Brasília
  eq(interpretarSemIa("pão 5", "2026-10-20T01:00:00Z")?.data, "2026-10-19");
});

Deno.test("correção do resumo", () => {
  const r = { "1": 10, "2": 20 };
  eq(lerCorrecao("1 - almoço com cliente", r), ["1", "almoço com cliente"]);
  eq(lerCorrecao("2: farmácia", r), ["2", "farmácia"]);
  eq(lerCorrecao("1 almoço", r), ["1", "almoço"]);
  eq(lerCorrecao("3 - nada", r), null);        // item não pendente
  eq(lerCorrecao("1 pão 5", r), null);          // tem outro número sem separador → é gasto
  eq(lerCorrecao("cabeleireiro 30", r), null);
});
