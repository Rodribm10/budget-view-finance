import { useState, useEffect } from 'react';
import { ContaBancaria } from '@/types/importacaoTypes';
import { getContasBancarias, criarContaBancaria, atualizarContaBancaria, deletarContaBancaria } from '@/services/contasBancariasService';
import { useToast } from '@/hooks/use-toast';

export const useContasBancarias = () => {
  const [contas, setContas] = useState<ContaBancaria[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const loadContas = async () => {
    try {
      setIsLoading(true);
      const data = await getContasBancarias();
      setContas(data);
    } catch (error) {
      console.error('Erro ao carregar contas:', error);
      toast({
        title: 'Erro ao carregar contas',
        description: 'Não foi possível carregar suas contas bancárias',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadContas();
  }, []);

  const criar = async (conta: Partial<ContaBancaria>) => {
    try {
      const novaConta = await criarContaBancaria(conta);
      setContas([novaConta, ...contas]);
      toast({
        title: 'Conta criada',
        description: 'Conta bancária criada com sucesso'
      });
      return novaConta;
    } catch (error) {
      console.error('Erro ao criar conta:', error);
      toast({
        title: 'Erro ao criar conta',
        description: 'Não foi possível criar a conta bancária',
        variant: 'destructive'
      });
      throw error;
    }
  };

  const atualizar = async (id: string, conta: Partial<ContaBancaria>) => {
    try {
      const contaAtualizada = await atualizarContaBancaria(id, conta);
      setContas(contas.map(c => c.id === id ? contaAtualizada : c));
      toast({
        title: 'Conta atualizada',
        description: 'Conta bancária atualizada com sucesso'
      });
      return contaAtualizada;
    } catch (error) {
      console.error('Erro ao atualizar conta:', error);
      toast({
        title: 'Erro ao atualizar conta',
        description: 'Não foi possível atualizar a conta bancária',
        variant: 'destructive'
      });
      throw error;
    }
  };

  const deletar = async (id: string) => {
    try {
      await deletarContaBancaria(id);
      setContas(contas.filter(c => c.id !== id));
      toast({
        title: 'Conta removida',
        description: 'Conta bancária removida com sucesso'
      });
    } catch (error) {
      console.error('Erro ao deletar conta:', error);
      toast({
        title: 'Erro ao remover conta',
        description: 'Não foi possível remover a conta bancária',
        variant: 'destructive'
      });
      throw error;
    }
  };

  return {
    contas,
    isLoading,
    criar,
    atualizar,
    deletar,
    recarregar: loadContas
  };
};
