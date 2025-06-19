
import { useInstanceState } from './whatsApp/useInstanceState';
import { useInstanceOperations } from './whatsApp/useInstanceOperations';
import { useInstanceStatusCheck } from './whatsApp/useInstanceStatusCheck';
import { useInstanceRefresh } from './whatsApp/useInstanceRefresh';
import { WhatsAppInstance } from '@/types/whatsAppTypes';
import { useMemo } from 'react';

export const useWhatsAppInstances = () => {
  const {
    instances,
    setInstances,
    currentUserId,
    isRefreshing,
    setIsRefreshing,
    isCheckingStatus,
    setIsCheckingStatus
  } = useInstanceState();

  const { addInstance, removeInstance, updateInstance } = useInstanceOperations(
    instances,
    setInstances
  );

  const { checkAllInstancesStatus } = useInstanceStatusCheck(
    instances,
    setInstances,
    isCheckingStatus,
    setIsCheckingStatus
  );

  const { refreshInstances } = useInstanceRefresh(
    instances,
    setInstances,
    currentUserId,
    setIsRefreshing
  );

  // Filtrar instâncias para mostrar apenas as do usuário logado
  const filteredInstances = useMemo(() => {
    const userEmail = localStorage.getItem('userEmail');
    if (!userEmail) {
      console.log('❌ Email do usuário não encontrado, retornando lista vazia');
      return [];
    }

    const filtered = instances.filter((instance: WhatsAppInstance) => {
      // Comparar o instanceName com o email do usuário
      // Como o instanceName é o email do usuário, podemos fazer a comparação direta
      const isUserInstance = instance.instanceName === userEmail;
      console.log(`🔍 Verificando instância ${instance.instanceName} para usuário ${userEmail}: ${isUserInstance ? 'INCLUIR' : 'EXCLUIR'}`);
      return isUserInstance;
    });

    console.log(`📋 Total de instâncias: ${instances.length}, Filtradas para usuário ${userEmail}: ${filtered.length}`);
    return filtered;
  }, [instances]);

  return {
    instances: filteredInstances, // Retornar instâncias filtradas
    isRefreshing,
    currentUserId,
    addInstance,
    removeInstance,
    updateInstance,
    refreshInstances,
    checkAllInstancesStatus
  };
};
