
import { CartaoCredito, DespesaCartao } from "@/types/cartaoTypes";
import { CartaoSummaryCard } from "./CartaoSummaryCard";
import { DespesasList } from "./DespesasList";

interface CartaoDetalhesProps {
  cartao: CartaoCredito;
  despesas: DespesaCartao[];
  isLoading: boolean;
}

export function CartaoDetalhes({ cartao, despesas, isLoading }: CartaoDetalhesProps) {
  return (
    <div className="space-y-6">
      <CartaoSummaryCard totalDespesas={cartao.total_despesas} />
      
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Despesas do Cartão</h2>
        <DespesasList despesas={despesas} isLoading={isLoading} />
      </div>
    </div>
  );
}
