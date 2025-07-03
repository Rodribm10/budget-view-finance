
import { CartaoCredito } from '@/types/cartaoTypes';

/**
 * Busca um cartão por código ou nome, usando correspondência flexível
 */
export const buscarCartaoPorReferencia = (cartoes: CartaoCredito[], referencia: string): CartaoCredito | null => {
  if (!referencia || cartoes.length === 0) {
    return null;
  }

  const referenciaLimpa = referencia.toLowerCase().trim();
  
  // 1. Busca exata por nome
  let cartaoEncontrado = cartoes.find(cartao => 
    cartao.nome.toLowerCase().trim() === referenciaLimpa
  );
  
  if (cartaoEncontrado) {
    console.log('🎯 Cartão encontrado por nome exato:', cartaoEncontrado.nome);
    return cartaoEncontrado;
  }

  // 2. Busca por palavras-chave no nome (correspondência parcial)
  const palavrasReferencia = referenciaLimpa.split(' ').filter(p => p.length > 1);
  
  if (palavrasReferencia.length > 0) {
    cartaoEncontrado = cartoes.find(cartao => {
      const nomeCartao = cartao.nome.toLowerCase();
      return palavrasReferencia.some(palavra => nomeCartao.includes(palavra));
    });
    
    if (cartaoEncontrado) {
      console.log('🎯 Cartão encontrado por palavra-chave:', cartaoEncontrado.nome);
      return cartaoEncontrado;
    }
  }

  // 3. Busca por banco ou bandeira
  cartaoEncontrado = cartoes.find(cartao => {
    const banco = cartao.banco?.toLowerCase() || '';
    const bandeira = cartao.bandeira?.toLowerCase() || '';
    return banco.includes(referenciaLimpa) || bandeira.includes(referenciaLimpa);
  });
  
  if (cartaoEncontrado) {
    console.log('🎯 Cartão encontrado por banco/bandeira:', cartaoEncontrado.nome);
    return cartaoEncontrado;
  }

  // 4. Busca difusa (proximidade de caracteres)
  cartaoEncontrado = cartoes.find(cartao => {
    const similarity = calcularSimilaridade(referenciaLimpa, cartao.nome.toLowerCase());
    return similarity > 0.6; // 60% de similaridade
  });
  
  if (cartaoEncontrado) {
    console.log('🎯 Cartão encontrado por similaridade:', cartaoEncontrado.nome);
    return cartaoEncontrado;
  }

  console.log('❌ Nenhum cartão encontrado para referência:', referencia);
  return null;
};

/**
 * Calcula a similaridade entre duas strings usando Levenshtein Distance
 */
function calcularSimilaridade(str1: string, str2: string): number {
  const len1 = str1.length;
  const len2 = str2.length;
  
  if (len1 === 0) return len2 === 0 ? 1 : 0;
  if (len2 === 0) return 0;
  
  const matrix = Array(len1 + 1).fill(null).map(() => Array(len2 + 1).fill(null));
  
  for (let i = 0; i <= len1; i++) matrix[i][0] = i;
  for (let j = 0; j <= len2; j++) matrix[0][j] = j;
  
  for (let i = 1; i <= len1; i++) {
    for (let j = 1; j <= len2; j++) {
      const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      );
    }
  }
  
  const maxLen = Math.max(len1, len2);
  return 1 - matrix[len1][len2] / maxLen;
}

/**
 * Gera um código de cartão baseado no nome
 */
export const gerarCartaoCodigo = (nome: string, banco?: string): string => {
  const nomeSimplificado = nome
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '_')
    .substring(0, 20);
  
  const bancoSimplificado = banco 
    ? banco.toLowerCase().replace(/[^a-z0-9]/g, '').substring(0, 10)
    : '';
  
  return bancoSimplificado 
    ? `${bancoSimplificado}_${nomeSimplificado}`
    : nomeSimplificado;
};
