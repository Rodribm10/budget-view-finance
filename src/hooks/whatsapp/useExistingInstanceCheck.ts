
import { useState, useEffect, useCallback } from 'react';
import { getUserWhatsAppInstance } from '@/services/whatsAppInstanceService';

export const useExistingInstanceCheck = (userEmail: string) => {
  const [hasExistingInstance, setHasExistingInstance] = useState(false);
  const [checkingExistingInstance, setCheckingExistingInstance] = useState(true);
  const [existingInstanceData, setExistingInstanceData] = useState<any>(null);

  const checkExistingInstance = useCallback(async () => {
    if (!userEmail) {
      setCheckingExistingInstance(false);
      setHasExistingInstance(false);
      setExistingInstanceData(null);
      return;
    }

    setCheckingExistingInstance(true);
    
    try {
      console.log('🔍 [HOOK] Verificando instância para:', userEmail);
      const data = await getUserWhatsAppInstance(userEmail);
      
      const hasValidInstance = !!(data && data.instancia_zap && data.status_instancia === 'conectado');
      
      console.log('✅ [HOOK] Resultado da verificação:', { hasValidInstance, data });
      
      setHasExistingInstance(hasValidInstance);
      setExistingInstanceData(data); // Armazena os dados, independentemente do status
    } catch (error) {
      console.error('❌ [HOOK] Erro ao verificar instância:', error);
      setHasExistingInstance(false);
      setExistingInstanceData(null);
    } finally {
      setCheckingExistingInstance(false);
    }
  }, [userEmail]); // useCallback para evitar re-criações desnecessárias

  useEffect(() => {
    checkExistingInstance();
  }, [checkExistingInstance]); // O useEffect agora depende da função memoizada

  // Retornamos a função de verificação para que possa ser chamada manualmente
  return { 
    hasExistingInstance, 
    checkingExistingInstance, 
    existingInstanceData, 
    recheckInstance: checkExistingInstance,
    setHasExistingInstance,
    setExistingInstanceData
  };
};
