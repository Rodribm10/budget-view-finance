
/**
 * Re-export all functions from the refactored services for backward compatibility
 */

// Re-export all functions from cartoesService
export {
  getCartoes,
  criarCartao,
  getCartao
} from './cartao/cartoesService';

// Re-export all functions from despesas services
export {
  getDespesasCartao,
  criarDespesa,
  getTotalDespesasCartao
} from './cartao/despesas';

// Re-export from utilities
export { gerarCartaoCodigo } from './cartao/cartaoCodigoUtils';
