
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from '@/hooks/use-toast';
import { CartaoCredito } from '@/types/cartaoTypes';
import { criarDespesa } from '@/services/cartao/despesas';
import { buscarCartaoPorReferencia, gerarCodigoCartao } from '@/services/cartao/cartaoCodigoUtils';
import { format } from 'date-fns';

const despesaCartaoSchema = z.object({
  cartao_id: z.string().min(1, { message: 'Selecione um cartão' }),
  valor: z.number().positive({ message: 'O valor deve ser maior que zero' }),
  data_despesa: z.date({
    required_error: "Selecione uma data",
  }),
  descricao: z.string().min(1, { message: 'Descrição é obrigatória' }),
});

export type DespesaCartaoFormValues = z.infer<typeof despesaCartaoSchema>;

interface UseDespesaCartaoFormProps {
  cartoes: CartaoCredito[];
  onSuccess: () => void;
  onCancel: () => void;
}

export function useDespesaCartaoForm({ cartoes, onSuccess, onCancel }: UseDespesaCartaoFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const [selectedCartao, setSelectedCartao] = useState<CartaoCredito | null>(null);

  const form = useForm<DespesaCartaoFormValues>({
    resolver: zodResolver(despesaCartaoSchema),
    defaultValues: {
      valor: undefined,
      data_despesa: new Date(),
      descricao: '',
    }
  });

  const handleCartaoChange = (cartaoId: string) => {
    const cartao = cartoes.find(c => c.id === cartaoId);
    setSelectedCartao(cartao || null);
    console.log('🔄 Cartão selecionado:', cartao?.nome);
  };

  const formatCartaoLabel = (cartao: CartaoCredito) => {
    let label = cartao.nome;
    if (cartao.banco) label += ` - ${cartao.banco}`;
    if (cartao.bandeira) label += ` (${cartao.bandeira})`;
    return label;
  };

  async function onSubmit(data: DespesaCartaoFormValues) {
    if (!selectedCartao) {
      toast({
        title: "Erro",
        description: "Selecione um cartão primeiro",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const formattedDate = format(data.data_despesa, 'yyyy-MM-dd');
      
      // Usar busca inteligente para encontrar cartão por referência
      let cartaoEncontrado = buscarCartaoPorReferencia(cartoes, selectedCartao.nome);
      
      if (!cartaoEncontrado) {
        cartaoEncontrado = selectedCartao;
        console.log('⚠️ Usando cartão selecionado diretamente:', selectedCartao.nome);
      } else {
        console.log('✅ Cartão encontrado via busca inteligente:', cartaoEncontrado.nome);
      }
      
      // Garantir que temos um cartao_codigo, gerando se necessário
      let cartaoCodigo = cartaoEncontrado.cartao_codigo;
      if (!cartaoCodigo) {
        cartaoCodigo = gerarCodigoCartao(cartaoEncontrado.nome, cartaoEncontrado.banco);
        console.log('🔧 Código gerado para o cartão:', cartaoCodigo);
      }
      
      console.log('📝 Enviando dados para criar despesa:', {
        cartao_id: cartaoEncontrado.id,
        cartao_nome: cartaoEncontrado.nome,
        cartao_codigo: cartaoCodigo,
        valor: data.valor,
        data_despesa: formattedDate,
        descricao: data.descricao
      });
      
      const resultado = await criarDespesa(
        cartaoEncontrado.id,
        cartaoCodigo,
        data.valor,
        formattedDate, 
        data.descricao
      );
      
      if (resultado) {
        toast({
          title: "Despesa adicionada",
          description: "Despesa do cartão registrada com sucesso",
        });
        onSuccess();
      } else {
        toast({
          title: "Erro ao salvar",
          description: "Não foi possível salvar a despesa do cartão",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('❌ Erro ao processar formulário:', error);
      toast({
        title: "Erro inesperado",
        description: "Ocorreu um erro ao processar sua solicitação",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return {
    form,
    isSubmitting,
    selectedCartao,
    handleCartaoChange,
    formatCartaoLabel,
    onSubmit
  };
}
