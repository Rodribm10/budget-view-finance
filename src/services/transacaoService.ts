
// This file is now just a facade that re-exports from the modular services
export { 
  getTransacoes,
  getTransactionSummary,
  getCategorySummary,
  getMonthlyData,
  deleteTransacao,
  updateTransacao,
  formatCurrency,
  getResumoFinanceiro
} from './transacao';
