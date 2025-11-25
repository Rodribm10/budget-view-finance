/**
 * Gera um hash único para uma transação baseado em seus dados
 * Isso permite identificar duplicatas durante a importação
 */
export function gerarHashTransacao(
  data: string,
  descricao: string,
  valor: number,
  contaBancariaId?: string
): string {
  const dataFormatada = new Date(data).toISOString().split('T')[0];
  const valorFormatado = Math.abs(valor).toFixed(2);
  const descricaoLimpa = descricao.toLowerCase().trim().substring(0, 50);
  
  const stringParaHash = `${dataFormatada}_${descricaoLimpa}_${valorFormatado}_${contaBancariaId || ''}`;
  
  // Implementação simples de hash (para produção, considere usar crypto-js ou similar)
  let hash = 0;
  for (let i = 0; i < stringParaHash.length; i++) {
    const char = stringParaHash.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  
  return Math.abs(hash).toString(36);
}
