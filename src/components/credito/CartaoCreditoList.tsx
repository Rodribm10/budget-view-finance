
import { useState } from 'react';
import { CartaoCredito } from '@/types/cartaoTypes';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from '@/components/ui/use-toast';
import { CreditCard } from 'lucide-react';

interface CartaoCreditoListProps {
  cartoes: CartaoCredito[];
  isLoading: boolean;
  onCartaoClick: (cartao: CartaoCredito) => void;
}

export function CartaoCreditoList({ cartoes, isLoading, onCartaoClick }: CartaoCreditoListProps) {
  const { toast } = useToast();

  const formatCurrency = (value: number = 0) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <div className="animate-pulse flex space-x-4">
          <div className="h-10 w-10 rounded-full bg-gray-200"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 rounded bg-gray-200"></div>
            <div className="h-4 rounded bg-gray-200 w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (cartoes.length === 0) {
    return (
      <div className="text-center p-8">
        <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium">Nenhum cartão de crédito cadastrado</h3>
        <p className="text-muted-foreground">
          Adicione seu primeiro cartão para começar a registrar despesas.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {cartoes.map((cartao) => {
        console.log(`Cartão na lista: ${cartao.nome}, total: ${cartao.total_despesas}`);
        return (
          <Card 
            key={cartao.id} 
            className="hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => onCartaoClick(cartao)}
          >
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-lg">
                <CreditCard className="w-5 h-5 mr-2" />
                {cartao.nome}
              </CardTitle>
              <div className="text-sm text-muted-foreground space-y-1">
                {cartao.banco && <div>{cartao.banco}</div>}
                {cartao.bandeira && <div>{cartao.bandeira}</div>}
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold">
                {formatCurrency(cartao.total_despesas)}
              </p>
              <p className="text-xs text-muted-foreground">
                Total em despesas
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
