import { TipoArquivo, TransacaoImportada } from '@/types/importacaoTypes';
import { parseOFX } from './parseOFX';
import { parseCSV } from './parseCSV';
import { parseXLSX } from './parseXLSX';

/**
 * Função principal para fazer parse de extratos bancários
 */
export async function parseExtrato(
  file: File,
  tipoArquivo: TipoArquivo,
  contaBancariaId?: string
): Promise<TransacaoImportada[]> {
  console.log(`Iniciando parse de arquivo ${file.name} (${tipoArquivo})`);

  try {
    switch (tipoArquivo) {
      case 'ofx':
        return await parseOFX(file, contaBancariaId);
      
      case 'csv':
        return await parseCSV(file, contaBancariaId);
      
      case 'xlsx':
      case 'xls':
        return await parseXLSX(file, contaBancariaId);
      
      default:
        throw new Error(`Tipo de arquivo não suportado: ${tipoArquivo}`);
    }
  } catch (error) {
    console.error('Erro ao fazer parse do extrato:', error);
    throw error;
  }
}

/**
 * Detecta o tipo de arquivo pela extensão
 */
export function detectarTipoArquivo(nomeArquivo: string): TipoArquivo | null {
  const extensao = nomeArquivo.split('.').pop()?.toLowerCase();
  
  switch (extensao) {
    case 'ofx':
      return 'ofx';
    case 'csv':
      return 'csv';
    case 'xlsx':
      return 'xlsx';
    case 'xls':
      return 'xls';
    default:
      return null;
  }
}

/**
 * Valida o tamanho do arquivo (máximo 10MB)
 */
export function validarTamanhoArquivo(file: File): boolean {
  const MAX_SIZE = 10 * 1024 * 1024; // 10MB
  return file.size <= MAX_SIZE;
}
