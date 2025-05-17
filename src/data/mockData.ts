
import { Transaction, CategorySummary, MonthlyData } from "@/types/financialTypes";

// Mock transaction data
export const mockTransactions: Transaction[] = [
  {
    id: "1",
    user: "user123",
    created_at: "2023-05-15T10:30:00Z",
    valor: 1500.00,
    quando: "2023-05-15",
    detalhes: "Salário mensal",
    estabelecimento: "Empresa XYZ",
    tipo: "entrada",
    categoria: "Salário"
  },
  {
    id: "2",
    user: "user123",
    created_at: "2023-05-16T14:20:00Z",
    valor: 120.50,
    quando: "2023-05-16",
    detalhes: "Compras semanais",
    estabelecimento: "Supermercado Bom Preço",
    tipo: "saida",
    categoria: "Alimentação"
  },
  {
    id: "3",
    user: "user123",
    created_at: "2023-05-17T09:15:00Z",
    valor: 75.00,
    quando: "2023-05-17",
    detalhes: "Combustível",
    estabelecimento: "Posto Shell",
    tipo: "saida",
    categoria: "Transporte"
  },
  {
    id: "4",
    user: "user123",
    created_at: "2023-05-18T18:45:00Z",
    valor: 200.00,
    quando: "2023-05-18",
    detalhes: "Jantar com amigos",
    estabelecimento: "Restaurante Sabor & Arte",
    tipo: "saida",
    categoria: "Lazer"
  },
  {
    id: "5",
    user: "user123",
    created_at: "2023-05-20T11:30:00Z",
    valor: 450.00,
    quando: "2023-05-20",
    detalhes: "Aluguel",
    estabelecimento: "Imobiliária Central",
    tipo: "saida",
    categoria: "Moradia"
  },
  {
    id: "6",
    user: "user123",
    created_at: "2023-05-22T15:10:00Z",
    valor: 89.90,
    quando: "2023-05-22",
    detalhes: "Internet",
    estabelecimento: "Telecomunicações Brasil",
    tipo: "saida",
    categoria: "Serviços"
  },
  {
    id: "7",
    user: "user123",
    created_at: "2023-05-25T08:20:00Z",
    valor: 300.00,
    quando: "2023-05-25",
    detalhes: "Freelance design",
    estabelecimento: "Cliente Particular",
    tipo: "entrada",
    categoria: "Freelance"
  },
  {
    id: "8",
    user: "user123",
    created_at: "2023-05-27T14:00:00Z",
    valor: 65.00,
    quando: "2023-05-27",
    detalhes: "Farmácia",
    estabelecimento: "Drogaria Saúde",
    tipo: "saida",
    categoria: "Saúde"
  }
];

// Mock category data
export const mockCategories: CategorySummary[] = [
  { categoria: "Alimentação", valor: 250.50, percentage: 0.25, color: "#F59E0B" },
  { categoria: "Transporte", valor: 150.00, percentage: 0.15, color: "#60A5FA" },
  { categoria: "Lazer", valor: 200.00, percentage: 0.2, color: "#8B5CF6" },
  { categoria: "Moradia", valor: 450.00, percentage: 0.45, color: "#EF4444" },
  { categoria: "Serviços", valor: 89.90, percentage: 0.09, color: "#10B981" }
];

// Mock monthly data
export const mockMonthlyData: MonthlyData[] = [
  { month: "Jan", receitas: 2000, despesas: 1500 },
  { month: "Fev", receitas: 2200, despesas: 1800 },
  { month: "Mar", receitas: 1900, despesas: 1700 },
  { month: "Abr", receitas: 2400, despesas: 1600 },
  { month: "Mai", receitas: 1800, despesas: 1900 },
  { month: "Jun", receitas: 2100, despesas: 1750 }
];

// Mock total values
export const mockTotals = {
  receitas: 1800,
  despesas: 1000,
  saldo: 800
};
