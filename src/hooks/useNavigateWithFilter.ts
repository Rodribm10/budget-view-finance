
import { useNavigate } from 'react-router-dom';

export const useNavigateWithFilter = () => {
  const navigate = useNavigate();

  const navigateToTransactions = (tipo?: 'receita' | 'despesa') => {
    if (tipo) {
      navigate('/transacoes', { 
        state: { 
          filter: tipo,
          filterValue: tipo === 'receita' ? 'receita' : 'despesa'
        } 
      });
    } else {
      navigate('/transacoes');
    }
  };

  return { navigateToTransactions };
};
