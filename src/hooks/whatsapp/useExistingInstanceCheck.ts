
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
      console.log('🔍 [EXISTING_INSTANCE] Verificando se usuário já tem instância CONECTADA:', userEmail);
      const existingInstance = await getUserWhatsAppInstance(userEmail);
      
      console.log('📋 [EXISTING_INSTANCE] Dados da instância encontrados:', existingInstance);
      
      // Verificação CORRETA: instancia_zap deve ser igual ao email E status_instancia = 'conectado'
      const hasValidConnectedInstance = !!(
        existingInstance && 
        existingInstance.instancia_zap && 
        existingInstance.instancia_zap.trim() !== '' &&
        existingInstance.instancia_zap !== 'null' &&
        existingInstance.instancia_zap !== null &&
        existingInstance.instancia_zap.toLowerCase() === userEmail.toLowerCase() &&
        existingInstance.status_instancia === 'conectado'
      );
      
      console.log('✅ [EXISTING_INSTANCE] Resultado da verificação:', {
        instancia_zap: existingInstance?.instancia_zap,
        status_instancia: existingInstance?.status_instancia,
        userEmail: userEmail,
        instanceMatchesEmail: existingInstance?.instancia_zap?.toLowerCase() === userEmail.toLowerCase(),
        isConnected: existingInstance?.status_instancia === 'conectado',
        hasValidConnectedInstance
      });
      
      setHasExistingInstance(hasValidConnectedInstance);
      setExistingInstanceData(hasValidConnectedInstance ? existingInstance : null);
      
    } catch (error) {
      console.error('❌ [EXISTING_INSTANCE] Erro ao verificar instância existente:', error);
      setHasExistingInstance(false);
      setExistingInstanceData(null);
    } finally {
      setCheckingExistingInstance(false);
    }
  };

  useEffect(() => {
    checkExistingInstance();
  }, [userEmail]);

  // Função para forçar re-verificação
  const recheckInstance = () => {
    console.log('🔄 [EXISTING_INSTANCE] Forçando re-verificação da instância');
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
