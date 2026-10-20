const fmt = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

/** "R$ 1.234,56" sempre positivo; o sinal vem de quem chama. */
export const reais = (v: number) => fmt.format(Math.abs(v));

/** "+ R$ 10,00" / "− R$ 10,00" com o sinal de menos tipográfico. */
export const reaisComSinal = (v: number) => `${v < 0 ? '−' : '+'} ${reais(v)}`;
