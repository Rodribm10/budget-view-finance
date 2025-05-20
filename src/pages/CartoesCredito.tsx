
import { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { CartaoCreditoForm } from '@/components/credito/CartaoCreditoForm';
import { DespesaCartaoForm } from '@/components/credito/DespesaCartaoForm';
import { CartaoCreditoList } from '@/components/credito/CartaoCreditoList';
import { DespesasList } from '@/components/credito/DespesasList';
import { CartaoCredito, DespesaCartao } from '@/types/cartaoTypes';
import { getCartoes, getDespesasCartao } from '@/services/cartaoCreditoService';
import { Button } from '@/components/ui/button';
import { useToast } from "@/components/ui/use-toast";
import { PlusCircle, ArrowLeft } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const CartoesCreditoPage = () => {
  const [cartoes, setCartoes] = useState<CartaoCredito[]>([]);
  const [cartaoSelecionado, setCartaoSelecionado] = useState<CartaoCredito | null>(null);
  const [despesas, setDespesas] = useState<DespesaCartao[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogNovoCartaoOpen, setIsDialogNovoCartaoOpen] = useState(false);
  const [isDialogNovaDespesaOpen, setIsDialogNovaDespesaOpen] = useState(false);
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
    setIsDialogNovoCartaoOpen(false);
    loadCartoes();
    toast({
      title: "Cartão adicionado",
      description: "Cartão de crédito cadastrado com sucesso",
    });
  };

  const handleDespesaSuccess = () => {
    setIsDialogNovaDespesaOpen(false);
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

  const formatCurrency = (value: number = 0) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  return (
    <Layout>
      <div className="space-y-6">
        {!detalheCartaoAberto ? (
          // Tela de listagem de cartões
          <>
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold tracking-tight">Cartões de Crédito</h1>
              <Button 
                className="flex items-center gap-2"
                onClick={() => setIsDialogNovoCartaoOpen(true)}
              >
                <PlusCircle className="h-4 w-4" />
                Novo Cartão
              </Button>
            </div>

            <CartaoCreditoList 
              cartoes={cartoes} 
              isLoading={isLoading}
              onCartaoClick={handleCartaoClick} 
            />
          </>
        ) : (
          // Tela de detalhes de um cartão específico
          <>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={handleVoltarParaLista}
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <h1 className="text-2xl font-bold tracking-tight">
                  {cartaoSelecionado?.nome}
                </h1>
              </div>
              <Button 
                className="flex items-center gap-2"
                onClick={() => setIsDialogNovaDespesaOpen(true)}
              >
                <PlusCircle className="h-4 w-4" />
                Nova Despesa
              </Button>
            </div>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Resumo</CardTitle>
                <CardDescription>Total de despesas do cartão</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">
                  {formatCurrency(cartaoSelecionado?.total_despesas)}
                </p>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Despesas do Cartão</h2>
              <DespesasList despesas={despesas} isLoading={isLoading} />
            </div>
          </>
        )}

        {/* Dialog para adicionar novo cartão */}
        <Dialog open={isDialogNovoCartaoOpen} onOpenChange={setIsDialogNovoCartaoOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Novo Cartão de Crédito</DialogTitle>
              <DialogDescription>
                Preencha as informações para cadastrar um novo cartão de crédito.
              </DialogDescription>
            </DialogHeader>
            <CartaoCreditoForm 
              onSuccess={handleCartaoSuccess}
              onCancel={() => setIsDialogNovoCartaoOpen(false)}
            />
          </DialogContent>
        </Dialog>

        {/* Dialog para adicionar nova despesa */}
        <Dialog open={isDialogNovaDespesaOpen} onOpenChange={setIsDialogNovaDespesaOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Nova Despesa do Cartão</DialogTitle>
              <DialogDescription>
                Preencha as informações para registrar uma nova despesa.
              </DialogDescription>
            </DialogHeader>
            {cartaoSelecionado && (
              <DespesaCartaoForm 
                cartao={cartaoSelecionado}
                onSuccess={handleDespesaSuccess}
                onCancel={() => setIsDialogNovaDespesaOpen(false)}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default CartoesCreditoPage;
