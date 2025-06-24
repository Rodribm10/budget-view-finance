
import { useState, useEffect } from 'react';
import { CartaoCredito, DespesaCartao } from '@/types/cartaoTypes';
import { getCartoes, getDespesasCartao, getTotalDespesasCartao } from '@/services/cartaoCreditoService';
import { useToast } from "@/components/ui/use-toast";
import { CartaoActions } from '@/components/credito/CartaoActions';
import { CartaoDetalhesAvancado } from '@/components/credito/CartaoDetalhesAvancado';
import { CartaoListView } from '@/components/credito/CartaoListView';

const CartoesCreditoPage = () => {
  const [cartoes, setCartoes] = useState<CartaoCredito[]>([]);
  const [cartaoSelecionado, setCartaoSelecionado] = useState<CartaoCredito | null>(null);
  const [despesas, setDespesas] = useState<DespesaCartao[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [detalheCartaoAberto, setDetalheCartaoAberto] = useState(false);
  const { toast } = useToast();

  const loadCartoes = async () => {
    try {
      setIsLoading(true);
      const data = await getCartoes();
      
      const cartoesWithTotals = await Promise.all(
        data.map(async (cartao) => {
          const total_despesas = await getTotalDespesasCartao(cartao.id);
          console.log(`Cartão ${cartao.nome} (${cartao.id}) - total: ${total_despesas}`);
          return { ...cartao, total_despesas };
        })
      );
      
      setCartoes(cartoesWithTotals);
    } catch (error) {
      console.error("Erro ao carregar cartões:", error);
      toast({
        title: "Erro ao carregar cartões",
        description: "Não foi possível obter os dados dos cartões",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadDespesasCartao = async (cartaoId: string) => {
    try {
      setIsLoading(true);
      const despesasData = await getDespesasCartao(cartaoId);
      setDespesas(despesasData);
      
      if (cartaoSelecionado) {
        const totalDespesas = await getTotalDespesasCartao(cartaoId);
        console.log(`Total atualizado para cartão ${cartaoSelecionado.nome}: ${totalDespesas}`);
        setCartaoSelecionado({
          ...cartaoSelecionado,
          total_despesas: totalDespesas
        });
      }
    } catch (error) {
      console.error("Erro ao carregar despesas:", error);
      toast({
        title: "Erro ao carregar despesas",
        description: "Não foi possível obter as despesas do cartão",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCartaoSuccess = () => {
    loadCartoes();
    toast({
      title: "Cartão adicionado",
      description: "Cartão de crédito cadastrado com sucesso",
    });
  };

  const handleDespesaSuccess = () => {
    if (cartaoSelecionado) {
      loadDespesasCartao(cartaoSelecionado.id);
      loadCartoes();
    }
    toast({
      title: "Despesa adicionada",
      description: "Despesa do cartão registrada com sucesso",
    });
  };

  const handleCartaoClick = async (cartao: CartaoCredito) => {
    const totalDespesas = await getTotalDespesasCartao(cartao.id);
    const updatedCartao = { ...cartao, total_despesas: totalDespesas };
    
    setCartaoSelecionado(updatedCartao);
    loadDespesasCartao(cartao.id);
    setDetalheCartaoAberto(true);
  };

  const handleVoltarParaLista = () => {
    setDetalheCartaoAberto(false);
    setCartaoSelecionado(null);
    setDespesas([]);
  };

  useEffect(() => {
    loadCartoes();
  }, []);

  return (
    <div className="space-y-6">
      <CartaoActions 
        isDetalhes={detalheCartaoAberto}
        cartaoSelecionado={cartaoSelecionado}
        onVoltarParaLista={handleVoltarParaLista}
        onCartaoSuccess={handleCartaoSuccess}
        onDespesaSuccess={handleDespesaSuccess}
      />

      {!detalheCartaoAberto ? (
        <CartaoListView
          cartoes={cartoes}
          isLoading={isLoading}
          onCartaoClick={handleCartaoClick}
        />
      ) : cartaoSelecionado && (
        <CartaoDetalhesAvancado
          cartao={cartaoSelecionado}
          despesas={despesas}
          isLoading={isLoading}
          onDespesaSuccess={handleDespesaSuccess}
        />
      )}
    </div>
  );
};

export default CartoesCreditoPage;
