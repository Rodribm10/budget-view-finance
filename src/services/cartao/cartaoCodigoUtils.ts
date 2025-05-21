
/**
 * Utility functions for generating and handling credit card codes
 */

/**
 * Generates a unique code for a credit card
 * @param nome Card name
 * @param banco Bank name
 * @returns Unique card code
 */
export function gerarCartaoCodigo(nome: string, banco: string): string {
  const timestamp = new Date().getTime();
  const randomStr = Math.random().toString(36).substring(2, 7);
  // Remove spaces and special characters
  const nomeSanitizado = nome.replace(/[^a-zA-Z0-9]/g, '').substring(0, 8);
  const bancoSanitizado = banco.replace(/[^a-zA-Z0-9]/g, '').substring(0, 5);
  
  return `${nomeSanitizado}_${bancoSanitizado}_${randomStr}`;
}
