
import { useState, useEffect } from 'react';
import { getUserWhatsAppInstance } from '@/services/whatsAppInstanceService';

export const useExistingInstanceCheck = (userEmail: string) => {
  const [hasExistingInstance, setHasExistingInstance] = useState(false);
  const [checkingExistingInstance, setCheckingExistingInstance] = useState(true);
  const [existingInstanceData, setExistingInstanceData] = useState<any>(null);

  const checkExistingInstance = async () => {
    if (!userEmail) {
      console.log('❌ [EXISTING_INSTANCE] Email do usuário não encontrado');
      setCheckingExistingInstance(false);
      setHasExistingInstance(false);
      setExistingInstanceData(null);
      return;
    }

    setCheckingExistingInstance(true);

    try {
      console.log('🔍 [EXISTING_INSTANCE] Verificando instância para:', userEmail);
      const existingInstance = await getUserWhatsAppInstance(userEmail);
      
      console.log('📋 [EXISTING_INSTANCE] Dados retornados:', existingInstance);
      
      // Verificação DIRETA: se existe instancia_zap E status é 'conectado'
      const hasValidInstance = !!(
        existingInstance && 
        existingInstance.instancia_zap && 
        existingInstance.status_instancia === 'conectado'
      );
      
      console.log('✅ [EXISTING_INSTANCE] Resultado:', {
        hasValidInstance,
        instancia_zap: existingInstance?.instancia_zap,
        status_instancia: existingInstance?.status_instancia
      });
      
      setHasExistingInstance(hasValidInstance);
      setExistingInstanceData(hasValidInstance ? existingInstance : null);
      
    } catch (error) {
      console.error('❌ [EXISTING_INSTANCE] Erro:', error);
      setHasExistingInstance(false);
      setExistingInstanceData(null);
    } finally {
      setCheckingExistingInstance(false);
    }
  };

  useEffect(() => {
    checkExistingInstance();
  }, [userEmail]);

  const recheckInstance = () => {
    console.log('🔄 [EXISTING_INSTANCE] Re-verificação manual');
    checkExistingInstance();
  };

  return {
    hasExistingInstance,
    checkingExistingInstance,
    existingInstanceData,
    setHasExistingInstance,
    setExistingInstanceData,
    recheckInstance
  };
};
