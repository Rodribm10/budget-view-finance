// Re-export all transaction service functions
export { getTransacoes } from './transacaoFetchService';
export { 
  getTransactionSummary, 
  getResumoFinanceiro, 
  getCategorySummary,
  getMonthlyData 
} from './summaryService';
export { 
  deleteTransacao, 
  updateTransacao 
} from './transacaoCrudService';
export { formatCurrency } from './baseService';
