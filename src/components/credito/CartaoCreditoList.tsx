
import { useState } from 'react';
import { CartaoCredito } from '@/types/cartaoTypes';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from '@/components/ui/use-toast';
import { CreditCard, Trash2 } from 'lucide-react';
import { excluirCartao } from '@/services/cartaoCreditoService';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface CartaoCreditoListProps {
  cartoes: CartaoCredito[];
  isLoading: boolean;
  onCartaoClick: (cartao: CartaoCredito) => void;
  onCartaoDeleted?: () => void;
}

export function CartaoCreditoList({ cartoes, isLoading, onCartaoClick, onCartaoDeleted }: CartaoCreditoListProps) {
  const { toast } = useToast();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [cartaoToDelete, setCartaoToDelete] = useState<CartaoCredito | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const formatCurrency = (value: number = 0) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const getCurrentMonthYear = () => {
    const now = new Date();
    const month = now.toLocaleDateString('pt-BR', { month: 'long' });
    const year = now.getFullYear();
    return `${month.charAt(0).toUpperCase() + month.slice(1)} ${year}`;
  };

  const handleDeleteClick = (e: React.MouseEvent, cartao: CartaoCredito) => {
    e.stopPropagation();
    setCartaoToDelete(cartao);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!cartaoToDelete) return;
    
    setIsDeleting(true);
    try {
      const success = await excluirCartao(cartaoToDelete.id);
      
      if (success) {
        toast({
          title: "Cartão excluído",
          description: "O cartão e todas as suas despesas foram removidos com sucesso.",
        });
        onCartaoDeleted?.();
      } else {
        toast({
          title: "Erro ao excluir cartão",
          description: "Não foi possível excluir o cartão. Tente novamente.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Erro ao excluir cartão:', error);
      toast({
        title: "Erro ao excluir cartão",
        description: "Ocorreu um erro inesperado. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
      setCartaoToDelete(null);
    }
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
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {cartoes.map((cartao) => {
          console.log(`Cartão na lista: ${cartao.nome}, total: ${cartao.total_despesas}`);
          return (
            <Card 
              key={cartao.id} 
              className="hover:shadow-md transition-shadow cursor-pointer relative group"
              onClick={() => onCartaoClick(cartao)}
            >
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center text-lg">
                    <CreditCard className="w-5 h-5 mr-2" />
                    {cartao.nome}
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-700 hover:bg-red-50"
                    onClick={(e) => handleDeleteClick(e, cartao)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
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
                  Fatura de {getCurrentMonthYear()}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o cartão "{cartaoToDelete?.nome}"? 
              Esta ação removerá permanentemente o cartão e todas as suas despesas associadas.
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirmDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? 'Excluindo...' : 'Excluir'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
