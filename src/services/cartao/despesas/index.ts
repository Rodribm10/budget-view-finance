
/**
 * Exports all despesas-related functions from separate modules.
 * This maintains the existing API surface for backward compatibility.
 */

export { getDespesasCartao, getTotalDespesasCartao } from './despesasFetchService';
export { criarDespesa } from './despesasCreateService';
