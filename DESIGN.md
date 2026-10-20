# Design

Referência: Mobills / Organizze. Tema claro. Cena: o Rodrigo confere o mês no celular ou no computador, de dia, em segundos.

## Cor (OKLCH, tokens em `src/index.css`)
- **Estratégia: contida.** Papel levemente quente (`--background 0.985 0.004 85`), tinta azulada (`--foreground 0.22 0.012 260`), um azul de ação (`--primary 0.52 0.17 262`) só para botão principal, item ativo e foco.
- **Semântica de dinheiro:** `--income` (verde 155) só para entrada, `--expense` (vermelho 27) só para saída, `--warning` (âmbar 70) só para "a revisar". Saída na lista fica na cor do texto, com o sinal −; o vermelho fica para totais.
- **Categorias:** cor e ícone fixos em `src/lib/categorias.ts`, mesma luminosidade e matizes espaçados. Fundo do ícone = cor a 14% (`color-mix`).
- Tailwind: `bg-income/15`, `text-expense`, `bg-warning/10` etc. (`oklch(var(--x) / <alpha-value>)`).

## Tipografia
Inter, uma família. Valores com `tabular-nums`. Título de página 20–24px semibold; título de seção 14px semibold; corpo 14px; rótulos 12px.

## Componentes
- **Superfície:** `rounded-2xl border bg-card`, sem sombra. Nada de card dentro de card.
- **Resumo do mês** (`painel/ResumoMes`): saldo grande, barra saídas/entradas, entradas e saídas clicáveis.
- **Lista de lançamentos** (`painel/ListaTransacoes`): agrupada por dia com total do dia; linha = ícone da categoria, nome, "categoria · origem", valor; toque edita.
- **Seletor de mês** (`filters/MonthFilter`): ‹ Mês ›.
- **Filtros:** controle segmentado (`bg-secondary`, opção ativa `bg-card`).
- **Navegação:** menu lateral no computador; barra de 5 abas embaixo no celular.

## Movimento
150–300 ms, ease-out. Sem animação de entrada em gráfico.

## Desenvolvimento visual
`VITE_MOCK=1 npx vite` sobe o app com dados de exemplo e sessão falsa (`src/integrations/supabase/mock.ts`). O build de produção não inclui o mock.
