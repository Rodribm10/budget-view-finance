import { useState } from 'react';
import { TransacaoImportada, TipoArquivo } from '@/types/importacaoTypes';
import { parseExtrato, detectarTipoArquivo, validarTamanhoArquivo } from '@/services/importacao';
import { verificarDuplicatas, importarTransacoes } from '@/services/importacaoService';
import { useToast } from '@/hooks/use-toast';

export const useImportacaoExtrato = () => {
  const [transacoes, setTransacoes] = useState<TransacaoImportada[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const { toast } = useToast();

  const processarArquivo = async (file: File, contaBancariaId?: string) => {
    try {
      setIsProcessing(true);

      // Validar tamanho
      if (!validarTamanhoArquivo(file)) {
        toast({
          title: 'Arquivo muito grande',
          description: 'O arquivo deve ter no máximo 10MB',
          variant: 'destructive'
        });
        return;
      }

      // Detectar tipo
      const tipoArquivo = detectarTipoArquivo(file.name);
      if (!tipoArquivo) {
        toast({
          title: 'Tipo de arquivo não suportado',
          description: 'Formatos aceitos: OFX, CSV, XLSX, XLS',
          variant: 'destructive'
        });
        return;
      }

      // Fazer parse
      const transacoesParseadas = await parseExtrato(file, tipoArquivo, contaBancariaId);

      if (transacoesParseadas.length === 0) {
        toast({
          title: 'Nenhuma transação encontrada',
          description: 'O arquivo não contém transações válidas',
          variant: 'destructive'
        });
        return;
      }

      // Verificar duplicatas
      const transacoesComDuplicatas = await verificarDuplicatas(transacoesParseadas);
      setTransacoes(transacoesComDuplicatas);

      const duplicadas = transacoesComDuplicatas.filter(t => t.isDuplicada).length;
      const novas = transacoesComDuplicatas.length - duplicadas;

      toast({
        title: 'Arquivo processado',
        description: `${novas} transações novas, ${duplicadas} duplicadas encontradas`
      });

    } catch (error) {
      console.error('Erro ao processar arquivo:', error);
      toast({
        title: 'Erro ao processar arquivo',
        description: error instanceof Error ? error.message : 'Erro desconhecido',
        variant: 'destructive'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const importar = async (
    transacoesParaImportar: TransacaoImportada[],
    contaBancariaId: string,
    nomeArquivo: string,
    tipoArquivo: string
  ) => {
    try {
      setIsImporting(true);

      const log = await importarTransacoes(
        transacoesParaImportar,
        contaBancariaId,
        nomeArquivo,
        tipoArquivo
      );

      toast({
        title: 'Importação concluída',
        description: `${log.importados} transações importadas com sucesso`
      });

      return log;

    } catch (error) {
      console.error('Erro ao importar transações:', error);
      toast({
        title: 'Erro ao importar',
        description: 'Não foi possível importar as transações',
        variant: 'destructive'
      });
      throw error;
    } finally {
      setIsImporting(false);
    }
  };

  const limpar = () => {
    setTransacoes([]);
  };

  const atualizarCategoria = (hash: string, categoria: string) => {
    setTransacoes(transacoes.map(t => 
      t.hash_unico === hash ? { ...t, categoria } : t
    ));
  };

  return {
    transacoes,
    isProcessing,
    isImporting,
    processarArquivo,
    importar,
    limpar,
    atualizarCategoria
  };
};
