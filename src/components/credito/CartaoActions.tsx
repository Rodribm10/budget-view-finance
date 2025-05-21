
import { Button } from "@/components/ui/button";
import { PlusCircle, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { CartaoCredito } from "@/types/cartaoTypes";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CartaoCreditoForm } from "@/components/credito/CartaoCreditoForm";
import { DespesaCartaoForm } from "@/components/credito/DespesaCartaoForm";

interface CartaoActionsProps {
  isDetalhes: boolean;
  cartaoSelecionado: CartaoCredito | null;
  onVoltarParaLista: () => void;
  onCartaoSuccess: () => void;
  onDespesaSuccess: () => void;
}

export function CartaoActions({ 
  isDetalhes, 
  cartaoSelecionado, 
  onVoltarParaLista,
  onCartaoSuccess,
  onDespesaSuccess
}: CartaoActionsProps) {
  const [isDialogNovoCartaoOpen, setIsDialogNovoCartaoOpen] = useState(false);
  const [isDialogNovaDespesaOpen, setIsDialogNovaDespesaOpen] = useState(false);
  
  return (
    <>
      <div className="flex justify-between items-center">
        {isDetalhes ? (
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="icon"
              onClick={onVoltarParaLista}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-2xl font-bold tracking-tight">
              {cartaoSelecionado?.nome}
            </h1>
          </div>
        ) : (
          <h1 className="text-2xl font-bold tracking-tight">Cartões de Crédito</h1>
        )}

        <Button 
          className="flex items-center gap-2"
          onClick={() => isDetalhes 
            ? setIsDialogNovaDespesaOpen(true) 
            : setIsDialogNovoCartaoOpen(true)}
        >
          <PlusCircle className="h-4 w-4" />
          {isDetalhes ? 'Nova Despesa' : 'Novo Cartão'}
        </Button>
      </div>

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
            onSuccess={() => {
              setIsDialogNovoCartaoOpen(false);
              onCartaoSuccess();
            }}
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
              onSuccess={() => {
                setIsDialogNovaDespesaOpen(false);
                onDespesaSuccess();
              }}
              onCancel={() => setIsDialogNovaDespesaOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
