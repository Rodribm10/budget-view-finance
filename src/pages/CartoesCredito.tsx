
import { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { CartaoCredito, DespesaCartao } from '@/types/cartaoTypes';
import { getCartoes, getDespesasCartao } from '@/services/cartaoCreditoService';
import { useToast } from "@/components/ui/use-toast";
import { CartaoActions } from '@/components/credito/CartaoActions';
import { CartaoDetalhes } from '@/components/credito/CartaoDetalhes';
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
      setCartoes(data);
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

  useEffect(() => {
    loadCartoes();
  }, []);

  const loadDespesasCartao = async (cartaoId: string) => {
    try {
      setIsLoading(true);
      // This function now uses login+nome matching internally instead of cartao_id
      const data = await getDespesasCartao(cartaoId);
      setDespesas(data);
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
    // Recarregar detalhes do cartão após adicionar despesa
    if (cartaoSelecionado) {
      loadDespesasCartao(cartaoSelecionado.id);
      // Recarregar também a lista de cartões para atualizar os totais
      loadCartoes();
    }
    toast({
      title: "Despesa adicionada",
      description: "Despesa do cartão registrada com sucesso",
    });
  };

  const handleCartaoClick = (cartao: CartaoCredito) => {
    setCartaoSelecionado(cartao);
    loadDespesasCartao(cartao.id);
    setDetalheCartaoAberto(true);
  };

  const handleVoltarParaLista = () => {
    setDetalheCartaoAberto(false);
    setCartaoSelecionado(null);
    setDespesas([]);
  };

  return (
    <Layout>
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
          <CartaoDetalhes
            cartao={cartaoSelecionado}
            despesas={despesas}
            isLoading={isLoading}
          />
        )}
      </div>
    </Layout>
  );
};

export default CartoesCreditoPage;
