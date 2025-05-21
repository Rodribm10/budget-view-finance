
import { CartaoCredito } from "@/types/cartaoTypes";
import { CartaoCreditoList } from "./CartaoCreditoList";

interface CartaoListViewProps {
  cartoes: CartaoCredito[];
  isLoading: boolean;
  onCartaoClick: (cartao: CartaoCredito) => void;
}

export function CartaoListView({ cartoes, isLoading, onCartaoClick }: CartaoListViewProps) {
  return (
    <CartaoCreditoList 
      cartoes={cartoes} 
      isLoading={isLoading}
      onCartaoClick={onCartaoClick} 
    />
  );
}
