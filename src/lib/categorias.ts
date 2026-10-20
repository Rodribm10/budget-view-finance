import {
  ArrowLeftRight, BookOpen, Car, CircleDollarSign, Dog, Gamepad2, HeartPulse, Home, Landmark, PiggyBank,
  Scissors, Shirt, ShoppingCart, Utensils, Wrench, type LucideIcon,
} from "lucide-react";

// Cor e ícone fixos por categoria: a mesma cor em lista, gráfico e filtro, pra reconhecer sem ler.
// Matizes espaçados no círculo, mesma luminosidade (OKLCH), pra nenhuma gritar mais que a outra.
const MAPA: Record<string, { cor: string; icone: LucideIcon }> = {
  "alimentação": { cor: "oklch(0.66 0.15 50)", icone: Utensils },
  "supermercado": { cor: "oklch(0.62 0.14 140)", icone: ShoppingCart },
  "transporte": { cor: "oklch(0.6 0.13 230)", icone: Car },
  "saúde": { cor: "oklch(0.6 0.15 10)", icone: HeartPulse },
  "cuidados pessoais": { cor: "oklch(0.62 0.14 340)", icone: Scissors },
  "educação": { cor: "oklch(0.55 0.14 280)", icone: BookOpen },
  "lazer": { cor: "oklch(0.64 0.15 310)", icone: Gamepad2 },
  "moradia": { cor: "oklch(0.55 0.08 60)", icone: Home },
  "vestuário": { cor: "oklch(0.6 0.12 200)", icone: Shirt },
  "serviços": { cor: "oklch(0.55 0.05 250)", icone: Wrench },
  "pet": { cor: "oklch(0.66 0.13 85)", icone: Dog },
  "impostos": { cor: "oklch(0.5 0.09 30)", icone: Landmark },
  "investimentos": { cor: "oklch(0.55 0.12 175)", icone: PiggyBank },
  "receita fixa": { cor: "oklch(0.55 0.13 155)", icone: CircleDollarSign },
  "transferência": { cor: "oklch(0.6 0.02 260)", icone: ArrowLeftRight },
};

const PADRAO = { cor: "oklch(0.6 0.02 260)", icone: CircleDollarSign };

export function categoria(nome?: string | null) {
  const chave = (nome ?? "").trim().toLowerCase();
  return MAPA[chave] ?? (chave.startsWith("receita") || chave === "salário" ? MAPA["receita fixa"] : PADRAO);
}
