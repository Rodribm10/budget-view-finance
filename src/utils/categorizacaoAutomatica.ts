// Sistema de categorização automática baseado em palavras-chave

interface RegraCategorizacao {
  categoria: string;
  keywords: string[];
}

const regras: RegraCategorizacao[] = [
  // Transporte
  {
    categoria: 'Transporte',
    keywords: ['uber', '99', 'taxi', 'cabify', 'transporte', 'onibus', 'metro', 'combustivel', 'gasolina', 'etanol', 'posto', 'ipva', 'estacionamento', 'pedágio']
  },
  // Alimentação
  {
    categoria: 'Alimentação',
    keywords: ['ifood', 'rappi', 'ubereats', 'restaurante', 'lanchonete', 'padaria', 'pizzaria', 'burger', 'sushi', 'comida', 'mcdonalds', 'burguer king', 'subway', 'cafe']
  },
  // Supermercado
  {
    categoria: 'Supermercado',
    keywords: ['mercado', 'supermercado', 'hortifruti', 'açougue', 'pao de acucar', 'carrefour', 'extra', 'dia%', 'atacadao', 'assai']
  },
  // Saúde
  {
    categoria: 'Saúde',
    keywords: ['farmacia', 'drogaria', 'droga', 'hospital', 'clinica', 'laboratorio', 'medico', 'dentista', 'plano de saude', 'unimed', 'amil', 'sulamerica']
  },
  // Educação
  {
    categoria: 'Educação',
    keywords: ['escola', 'faculdade', 'universidade', 'curso', 'livro', 'livraria', 'material escolar', 'mensalidade']
  },
  // Lazer
  {
    categoria: 'Lazer',
    keywords: ['cinema', 'teatro', 'show', 'netflix', 'spotify', 'amazon prime', 'disney', 'ingresso', 'parque', 'clube', 'academia', 'gym']
  },
  // Moradia
  {
    categoria: 'Moradia',
    keywords: ['aluguel', 'condominio', 'iptu', 'luz', 'agua', 'gas', 'internet', 'telefone', 'celular', 'energia', 'enel', 'sabesp', 'claro', 'vivo', 'tim', 'oi']
  },
  // Vestuário
  {
    categoria: 'Vestuário',
    keywords: ['roupa', 'calçado', 'sapato', 'tenis', 'camisa', 'calca', 'vestido', 'loja', 'renner', 'c&a', 'riachuelo', 'zara', 'nike', 'adidas']
  },
  // Receitas
  {
    categoria: 'Receita Fixa',
    keywords: ['salario', 'credito salarial', 'pagamento', 'rendimento', 'pix recebido', 'transferencia recebida', 'ted recebida']
  },
  // Investimentos
  {
    categoria: 'Investimentos',
    keywords: ['aplicacao', 'resgate', 'investimento', 'poupanca', 'cdb', 'tesouro', 'acao', 'fundo', 'b3']
  },
  // Impostos
  {
    categoria: 'Impostos',
    keywords: ['imposto', 'taxa', 'tributo', 'darf', 'multa', 'juros']
  }
];

/**
 * Sugere uma categoria baseada na descrição da transação
 */
export function sugerirCategoria(descricao: string): string {
  const descricaoLower = descricao.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  
  for (const regra of regras) {
    for (const keyword of regra.keywords) {
      const keywordNormalized = keyword.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      if (descricaoLower.includes(keywordNormalized)) {
        return regra.categoria;
      }
    }
  }
  
  return 'Outros';
}

/**
 * Limpa a descrição removendo textos desnecessários dos bancos
 */
export function limparDescricao(descricao: string): string {
  let limpa = descricao.trim();
  
  // Remove padrões comuns de bancos
  limpa = limpa.replace(/^(PIX|TED|DOC|TRANSF|PAGTO)\s*/i, '');
  limpa = limpa.replace(/\s*-\s*\d+\/\d+\/\d+/g, ''); // Remove datas no formato - DD/MM/YYYY
  limpa = limpa.replace(/\s+/g, ' '); // Remove espaços múltiplos
  limpa = limpa.replace(/^\s*[-:]\s*/, ''); // Remove traços/dois pontos iniciais
  
  return limpa.trim();
}
