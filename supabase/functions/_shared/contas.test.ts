// deno test --allow-env --allow-net _shared/contas.test.ts
Deno.env.set("SUPABASE_URL", "http://localhost");
Deno.env.set("SUPABASE_SERVICE_ROLE_KEY", "x");
const { casar, contaPorTexto, palavras, vencimento, mesRelativo } = await import("./contas.ts");

const eq = (a: unknown, b: unknown) => { if (JSON.stringify(a) !== JSON.stringify(b)) throw new Error(`${JSON.stringify(a)} != ${JSON.stringify(b)}`); };
const conta = (id: string, nome_conta: string, valor: number, dia: number) => ({ id, nome_conta, valor, dia_vencimento: dia, dias_antecedencia: 1 });
const lanc = (id: number, quando: string, valor: number, estabelecimento: string) => ({ id, quando: `${quando} 10:00:00`, valor, estabelecimento, detalhes: "" });

Deno.test("vencimento não estoura o mês", () => {
  eq(vencimento(30, 2027, 2), "2027-02-28");
  eq(vencimento(31, 2028, 2), "2028-02-29");
  eq(vencimento(10, 2026, 10), "2026-10-10");
  eq(mesRelativo("2026-01-15", -1), [2025, 12]);
  eq(mesRelativo("2026-12-15", 1), [2027, 1]);
});

Deno.test("palavras ignoram termos genéricos", () => {
  eq(palavras("Cartão Santander Rejane"), ["santander", "rejane"]);
  eq(palavras("Telefonia Claro Familia"), ["telefonia", "claro"]);
});

Deno.test("casa por nome (fatura varia) e por valor", () => {
  const contas = [conta("claro", "Telefonia Claro Familia", 450, 15), conta("sant", "Cartão Santander Rejane", 4500, 30), conta("piscina", "Piscineiro", 180, 2)];
  const meses: Array<[number, number]> = [[2026, 10]];
  const abertas = new Set(["claro:2026-10", "sant:2026-10", "piscina:2026-10"]);
  const lancs = [
    lanc(1, "2026-10-14", -472.3, "Claro S.A."),            // nome + valor perto
    lanc(2, "2026-10-28", -2890, "SANTANDER ELITE VISA"),   // nome, valor 36% abaixo → vale
    lanc(3, "2026-10-02", -180, "Pix enviado - João"),      // só valor exato → NÃO baixa
    lanc(4, "2026-10-20", -450, "Restaurante"),             // fora da janela da Claro (5 dias depois do dia 15)
  ];
  const r = casar(contas, meses, abertas, lancs).map((b) => [b.conta.id, b.lanc.id]).sort();
  eq(r, [["claro", 1], ["sant", 2]]);
});

Deno.test("apelido do extrato casa conta de nome genérico", () => {
  const contas = [{ ...conta("esc", "Escola Filhos", 2799.9, 10), apelido_extrato: "adventista" }, { ...conta("cond", "condominio casa", 500, 10), apelido_extrato: "lima dos campos" }];
  const lancs = [lanc(1, "2026-10-11", -1473.54, "INSTITUICAO ADVENTISTA CENTRAL"), lanc(2, "2026-10-13", -500, "ASSOCIACAO RESIDENCIAL LIMA DOS CAMPOS"), lanc(3, "2026-10-08", -2770, "Rosana Martins")];
  const r = casar(contas, [[2026, 10]], new Set(["esc:2026-10", "cond:2026-10"]), lancs).map((b) => [b.conta.id, b.lanc.id]).sort();
  eq(r, [["cond", 2], ["esc", 1]]); // Rosana (valor quase igual à escola) não entra
});

Deno.test("conta já paga e gasto já usado não casam de novo", () => {
  const contas = [{ ...conta("a", "Energia casa", 500, 13), apelido_extrato: "neoenergia" }, { ...conta("b", "Energia usina", 500, 10), apelido_extrato: "neoenergia" }];
  const lancs = [lanc(9, "2026-10-11", -500, "NEOENERGIA DF")];
  const r = casar(contas, [[2026, 10]], new Set(["a:2026-10", "b:2026-10"]), lancs);
  eq(r.length, 1); // um gasto paga uma conta só
  eq(casar(contas, [[2026, 10]], new Set(), lancs).length, 0);
});

Deno.test("paguei acha a conta pelo nome e recusa empate", () => {
  const contas = [conta("1", "Telefonia Claro Familia", 450, 15), conta("2", "Cartão Inter - Rosa", 500, 23), conta("3", "Cartão Inter Rodrigo", 10000, 28)];
  eq(contaPorTexto(contas, "claro 452,10")?.id, "1");
  eq(contaPorTexto(contas, "cartão inter rodrigo")?.id, "3");
  eq(contaPorTexto(contas, "inter"), null); // empate entre os dois cartões Inter
  eq(contaPorTexto(contas, "padaria 12"), null);
});
