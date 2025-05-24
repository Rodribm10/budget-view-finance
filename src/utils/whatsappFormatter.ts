
export const formatarWhatsapp = (valor: string): string => {
  // Remove todos os caracteres não numéricos
  let nums = valor.replace(/\D/g, '');
  
  // Garante que sempre começa com 55 (código do Brasil)
  if (!nums.startsWith('55')) {
    nums = '55' + nums;
  }
  
  // Formata com parênteses para o DDD
  if (nums.length > 4) {
    const codigo = nums.slice(0, 2); // 55
    const ddd = nums.slice(2, 4); // DDD
    const numero = nums.slice(4); // Resto do número
    
    if (nums.length > 6) {
      return `${codigo}(${ddd})${numero}`;
    } else {
      return `${codigo}(${ddd}${numero.length > 0 ? ')' + numero : ''}`;
    }
  }
  
  return nums.length >= 2 ? `${nums.slice(0, 2)}(${nums.slice(2)}` : nums;
};
