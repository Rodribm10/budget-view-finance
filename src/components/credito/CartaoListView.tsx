
import { CartaoCreditoList } from './CartaoCreditoList';
import { CartaoCredito } from '@/types/cartaoTypes';

interface CartaoListViewProps {
  cartoes: CartaoCredito[];
  isLoading: boolean;
  onCartaoClick: (cartao: CartaoCredito) => void;
  onCartaoDeleted?: () => void;
}

export function CartaoListView({ cartoes, isLoading, onCartaoClick, onCartaoDeleted }: CartaoListViewProps) {
  return (
    <CartaoCreditoList 
      cartoes={cartoes}
      isLoading={isLoading}
      onCartaoClick={onCartaoClick}
      onCartaoDeleted={onCartaoDeleted}
    />
  );
}
