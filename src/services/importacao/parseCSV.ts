import Papa from 'papaparse';
import { TransacaoImportada } from '@/types/importacaoTypes';
import { gerarHashTransacao } from '@/utils/hashGenerator';
import { limparDescricao } from '@/utils/categorizacaoAutomatica';

/**
 * Parse de arquivos CSV
 * Tenta detectar automaticamente as colunas
 */
export async function parseCSV(file: File, contaBancariaId?: string): Promise<TransacaoImportada[]> {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: false, // tratamos manualmente o cabeçalho
      skipEmptyLines: true,
      delimiter: ';', // Suporta CSV com ponto e vírgula
      complete: (results) => {
        try {
          const transacoes: TransacaoImportada[] = [];
          const linhas = results.data as any[][]; // matriz de linhas

          if (!linhas || linhas.length === 0) {
            throw new Error('Arquivo CSV vazio');
          }

          // Encontrar linha de cabeçalho real (que contém "Data" e "Valor" etc.)
          let headerIndex = -1;
          for (let i = 0; i < linhas.length; i++) {
            const row = linhas[i];
            if (!row || row.length === 0) continue;

            const primeiraColuna = String(row[0] ?? '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
            const segundaColuna = String(row[1] ?? '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

            // Ex: "Data Lançamento" | "Histórico" | "Descrição" | "Valor" | "Saldo"
            if (primeiraColuna.includes('data') && (segundaColuna.includes('historico') || segundaColuna.includes('descricao'))) {
              headerIndex = i;
              break;
            }
          }

          if (headerIndex === -1) {
            throw new Error('Não foi possível identificar o cabeçalho do arquivo (linha com Data/Histórico/Valor)');
          }

          const headerRow = linhas[headerIndex];
          const colunas = headerRow.map((c) => String(c ?? ''));

          // Encontrar colunas relevantes (suporta nomes com acentos e espaços)
          const colunaData = detectarColuna(colunas, ['data', 'date', 'quando', 'dt', 'lancamento']);
          const colunaDescricao = detectarColuna(colunas, ['descricao', 'description', 'historico', 'memo', 'estabelecimento']);
          const colunaValor = detectarColuna(colunas, ['valor', 'value', 'amount', 'quantia']);
          const colunaTipo = detectarColuna(colunas, ['tipo', 'type', 'natureza', 'credito', 'debito']);

          if (!colunaData || !colunaDescricao || !colunaValor) {
            throw new Error('Não foi possível identificar as colunas necessárias (Data, Descrição, Valor)');
          }

          // Processar linhas de dados após o cabeçalho
          for (let i = headerIndex + 1; i < linhas.length; i++) {
            const linha = linhas[i];
            if (!linha || linha.length === 0) continue;

            const rowObj: Record<string, any> = {};
            colunas.forEach((col, idx) => {
              rowObj[col] = linha[idx];
            });

            const dataStr = rowObj[colunaData];
            const descricao = limparDescricao(String(rowObj[colunaDescricao] || ''));
            const valorStr = String(rowObj[colunaValor] || '0');

            // Parse de data (tenta vários formatos)
            const data = parseData(dataStr);
            if (!data) continue;

            // Parse de valor (remove símbolos de moeda e converte)
            const valor = parseValor(valorStr);
            if (isNaN(valor)) continue;

            // Determinar tipo
            let tipo: 'entrada' | 'saida';
            if (colunaTipo && rowObj[colunaTipo] !== undefined && rowObj[colunaTipo] !== null) {
              const tipoStr = String(rowObj[colunaTipo]).toLowerCase();
              tipo = tipoStr.includes('credit') || tipoStr.includes('entrada') || tipoStr.includes('recebido') || tipoStr.includes('receita')
                ? 'entrada'
                : 'saida';
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

          resolve(transacoes);
        } catch (error) {
          reject(error);
        }
      },
      error: (error) => {
        reject(new Error(`Erro ao processar CSV: ${error.message}`));
      }
    });
  });
}

function detectarColuna(colunas: string[], possibilidades: string[]): string | null {
  // Percorre primeiro as possibilidades (mais específicas), depois as colunas
  for (const possibilidade of possibilidades) {
    for (const coluna of colunas) {
      const colunaLower = coluna.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      if (colunaLower.includes(possibilidade)) {
        return coluna;
      }
    }
  }
  return null;
}

function parseData(dataStr: string): string | null {
  if (!dataStr) return null;

  // Formato ISO (YYYY-MM-DD)
  if (/^\d{4}-\d{2}-\d{2}/.test(dataStr)) {
    return dataStr.substring(0, 10);
  }

  // Formato BR (DD/MM/YYYY)
  const matchBR = dataStr.match(/^(\d{2})\/(\d{2})\/(\d{4})/);
  if (matchBR) {
    return `${matchBR[3]}-${matchBR[2]}-${matchBR[1]}`;
  }

  // Formato US (MM/DD/YYYY)
  const matchUS = dataStr.match(/^(\d{2})\/(\d{2})\/(\d{4})/);
  if (matchUS) {
    return `${matchUS[3]}-${matchUS[1]}-${matchUS[2]}`;
  }

  return null;
}

function parseValor(valorStr: string): number {
  // Remove símbolos de moeda e espaços
  let valorLimpo = valorStr.replace(/[R$\s€£¥]/g, '').trim();
  
  // Detecta formato brasileiro (usa vírgula como decimal)
  // Ex: 1.234,56 ou -2.390,22
  if (valorLimpo.includes(',')) {
    valorLimpo = valorLimpo.replace(/\./g, '').replace(',', '.');
  }
  // Senão, assume formato americano (ponto como decimal)
  // Ex: 1234.56 ou 1,234.56
  else if (valorLimpo.includes('.')) {
    // Remove vírgulas de milhares se existirem
    valorLimpo = valorLimpo.replace(/,/g, '');
  }
  
  return parseFloat(valorLimpo);
}
