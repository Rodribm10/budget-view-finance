
/**
 * Re-export all functions from the refactored services for backward compatibility
 */

// Re-export all functions from cartoesService
export {
  getCartoes,
  verificarCartaoExistente,
  criarCartao,
  getCartao
} from './cartao/cartoesService';

// Re-export all functions from despesasService
export {
  getDespesasCartao,
  criarDespesa,
  getTotalDespesasCartao
} from './cartao/despesasService';

// Re-export from utilities
export { gerarCartaoCodigo } from './cartao/cartaoCodigoUtils';
