import { supabase } from '@/integrations/supabase/client';
import { TransacaoImportada, LogImportacao } from '@/types/importacaoTypes';
import { sugerirCategoria } from '@/utils/categorizacaoAutomatica';

/**
 * Verifica duplicatas comparando hashes
 */
export async function verificarDuplicatas(transacoes: TransacaoImportada[]): Promise<TransacaoImportada[]> {
  const hashes = transacoes.map(t => t.hash_unico);
  
  const { data, error } = await supabase
    .from('transacoes')
    .select('hash_unico')
    .in('hash_unico', hashes);

  if (error) {
    console.error('Erro ao verificar duplicatas:', error);
    return transacoes;
  }

  const hashesExistentes = new Set(data?.map(t => t.hash_unico) || []);
  
  return transacoes.map(t => ({
    ...t,
    isDuplicada: hashesExistentes.has(t.hash_unico),
    categoria: t.categoria || sugerirCategoria(t.descricao)
  }));
}

/**
 * Importa transações para o banco de dados
 */
export async function importarTransacoes(
  transacoes: TransacaoImportada[],
  contaBancariaId: string,
  nomeArquivo: string,
  tipoArquivo: string
): Promise<LogImportacao> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Usuário não autenticado');

  const userEmail = user.email?.toLowerCase();

  // Filtra apenas transações não duplicadas
  const transacoesParaImportar = transacoes.filter(t => !t.isDuplicada);
  
  let importadas = 0;
  let erros = 0;
  const valorTotal = transacoesParaImportar.reduce((sum, t) => sum + t.valor, 0);

  // Importa transações em batch
  for (const transacao of transacoesParaImportar) {
    try {
      const { error } = await supabase
        .from('transacoes')
        .insert({
          user_id: user.id,
          login: userEmail,
          user: user.email,
          quando: transacao.data,
          descricao: transacao.descricao,
          estabelecimento: transacao.descricao,
          detalhes: `Importado de ${nomeArquivo}`,
          valor: transacao.tipo === 'entrada' ? transacao.valor : -transacao.valor,
          tipo: transacao.tipo === 'entrada' ? 'receita' : 'despesa',
          categoria: transacao.categoria || 'Outros',
          origem: 'importado',
          hash_unico: transacao.hash_unico,
          conta_bancaria_id: contaBancariaId
        });

      if (error) {
        console.error('Erro ao importar transação:', error);
        erros++;
      } else {
        importadas++;
      }
    } catch (error) {
      console.error('Erro ao importar transação:', error);
      erros++;
    }
  }

  // Criar log de importação
  const log: LogImportacao = {
    user_id: user.id,
    login: userEmail,
    conta_bancaria_id: contaBancariaId,
    nome_arquivo: nomeArquivo,
    tipo_arquivo: tipoArquivo,
    status: erros === 0 ? 'sucesso' : (importadas > 0 ? 'parcial' : 'erro'),
    total_registros: transacoes.length,
    importados: importadas,
    duplicados: transacoes.filter(t => t.isDuplicada).length,
    erros,
    valor_total: valorTotal
  };

  const { data: logData, error: logError } = await supabase
    .from('logs_importacao')
    .insert(log)
    .select()
    .single();

  if (logError) {
    console.error('Erro ao criar log de importação:', logError);
  }

  return (logData as LogImportacao) || log;
}

/**
 * Busca histórico de importações
 */
export async function getHistoricoImportacoes(): Promise<LogImportacao[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Usuário não autenticado');

  const { data, error } = await supabase
    .from('logs_importacao')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(20);

  if (error) {
    console.error('Erro ao buscar histórico:', error);
    throw error;
  }

  return (data as LogImportacao[]) || [];
}
