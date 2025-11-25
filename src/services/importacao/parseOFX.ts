import { TransacaoImportada } from '@/types/importacaoTypes';
import { gerarHashTransacao } from '@/utils/hashGenerator';
import { limparDescricao } from '@/utils/categorizacaoAutomatica';

/**
 * Parse de arquivos OFX (Open Financial Exchange)
 */
export async function parseOFX(file: File, contaBancariaId?: string): Promise<TransacaoImportada[]> {
  const texto = await file.text();
  const transacoes: TransacaoImportada[] = [];

  try {
    // Regex para extrair transações do OFX
    const transacoesRegex = /<STMTTRN>([\s\S]*?)<\/STMTTRN>/g;
    let match;

    while ((match = transacoesRegex.exec(texto)) !== null) {
      const transacaoXml = match[1];
      
      // Extrair campos
      const dataMatch = transacaoXml.match(/<DTPOSTED>(\d{8})/);
      const valorMatch = transacaoXml.match(/<TRNAMT>([-\d.]+)/);
      const descricaoMatch = transacaoXml.match(/<MEMO>(.*?)</) || transacaoXml.match(/<NAME>(.*?)</);
      const tipoMatch = transacaoXml.match(/<TRNTYPE>(\w+)/);

      if (dataMatch && valorMatch && descricaoMatch) {
        const data = dataMatch[1];
        const dataFormatada = `${data.substring(0, 4)}-${data.substring(4, 6)}-${data.substring(6, 8)}`;
        const valor = parseFloat(valorMatch[1]);
        const descricao = limparDescricao(descricaoMatch[1]);
        const tipo: 'entrada' | 'saida' = valor >= 0 ? 'entrada' : 'saida';

        transacoes.push({
          data: dataFormatada,
          descricao,
          valor: Math.abs(valor),
          tipo,
          hash_unico: gerarHashTransacao(dataFormatada, descricao, valor, contaBancariaId)
        });
      }
    }

    return transacoes;
  } catch (error) {
    console.error('Erro ao fazer parse do OFX:', error);
    throw new Error('Erro ao processar arquivo OFX. Verifique se o formato está correto.');
  }
}
