import * as XLSX from 'xlsx';
import { TransacaoImportada } from '@/types/importacaoTypes';
import { gerarHashTransacao } from '@/utils/hashGenerator';
import { limparDescricao } from '@/utils/categorizacaoAutomatica';

/**
 * Parse de arquivos Excel (XLSX/XLS)
 */
export async function parseXLSX(file: File, contaBancariaId?: string): Promise<TransacaoImportada[]> {
  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: 'array' });
  
  // Pega a primeira planilha
  const primeiraAba = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[primeiraAba];
  
  // Converte para JSON
  const data: any[] = XLSX.utils.sheet_to_json(worksheet);
  
  if (data.length === 0) {
    throw new Error('Planilha vazia');
  }

  const transacoes: TransacaoImportada[] = [];
  const colunas = Object.keys(data[0]);

  // Detectar colunas
  const colunaData = detectarColuna(colunas, ['data', 'date', 'quando', 'dt']);
  const colunaDescricao = detectarColuna(colunas, ['descricao', 'description', 'historico', 'memo', 'estabelecimento']);
  const colunaValor = detectarColuna(colunas, ['valor', 'value', 'amount', 'quantia']);
  const colunaTipo = detectarColuna(colunas, ['tipo', 'type', 'natureza', 'credito', 'debito']);

  if (!colunaData || !colunaDescricao || !colunaValor) {
    throw new Error('Não foi possível identificar as colunas necessárias (Data, Descrição, Valor)');
  }

  for (const linha of data) {
    const dataStr = linha[colunaData];
    const descricao = limparDescricao(String(linha[colunaDescricao] || ''));
    const valorStr = linha[colunaValor];

    // Parse de data
    const data = parseData(dataStr);
    if (!data) continue;

    // Parse de valor
    const valor = typeof valorStr === 'number' ? valorStr : parseValor(String(valorStr));
    if (isNaN(valor)) continue;

    // Determinar tipo
    let tipo: 'entrada' | 'saida';
    if (colunaTipo) {
      const tipoStr = String(linha[colunaTipo]).toLowerCase();
      tipo = tipoStr.includes('credit') || tipoStr.includes('entrada') || tipoStr.includes('receita') ? 'entrada' : 'saida';
    } else {
      tipo = valor >= 0 ? 'entrada' : 'saida';
    }

    transacoes.push({
      data,
      descricao,
      valor: Math.abs(valor),
      tipo,
      hash_unico: gerarHashTransacao(data, descricao, valor, contaBancariaId)
    });
  }

  return transacoes;
}

function detectarColuna(colunas: string[], possibilidades: string[]): string | null {
  for (const coluna of colunas) {
    const colunaLower = coluna.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    for (const possibilidade of possibilidades) {
      if (colunaLower.includes(possibilidade)) {
        return coluna;
      }
    }
  }
  return null;
}

function parseData(dataStr: any): string | null {
  if (!dataStr) return null;

  // Se for número (formato Excel de data serial)
  if (typeof dataStr === 'number') {
    const date = XLSX.SSF.parse_date_code(dataStr);
    return `${date.y}-${String(date.m).padStart(2, '0')}-${String(date.d).padStart(2, '0')}`;
  }

  const str = String(dataStr);

  // Formato ISO (YYYY-MM-DD)
  if (/^\d{4}-\d{2}-\d{2}/.test(str)) {
    return str.substring(0, 10);
  }

  // Formato BR (DD/MM/YYYY)
  const matchBR = str.match(/^(\d{2})\/(\d{2})\/(\d{4})/);
  if (matchBR) {
    return `${matchBR[3]}-${matchBR[2]}-${matchBR[1]}`;
  }

  return null;
}

function parseValor(valorStr: string): number {
  const valorLimpo = valorStr
    .replace(/[R$\s€£¥]/g, '')
    .replace(/\./g, '')
    .replace(',', '.');
  
  return parseFloat(valorLimpo);
}
