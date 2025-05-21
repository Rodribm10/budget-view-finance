
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface CartaoSummaryCardProps {
  totalDespesas: number;
}

export function CartaoSummaryCard({ totalDespesas }: CartaoSummaryCardProps) {
  const formatCurrency = (value: number = 0) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Resumo</CardTitle>
        <CardDescription>Total de despesas do cartão</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-bold">
          {formatCurrency(totalDespesas)}
        </p>
      </CardContent>
    </Card>
  );
}
