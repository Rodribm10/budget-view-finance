
import { useState, useEffect } from 'react';
import { getUserWhatsAppInstance } from '@/services/whatsAppInstanceService';

export const useExistingInstanceCheck = (userEmail: string) => {
  const [hasExistingInstance, setHasExistingInstance] = useState(false);
  const [checkingExistingInstance, setCheckingExistingInstance] = useState(true);
  const [existingInstanceData, setExistingInstanceData] = useState<any>(null);

  useEffect(() => {
    const checkExistingInstance = async () => {
      if (!userEmail) {
        console.log('❌ Email do usuário não encontrado');
        setCheckingExistingInstance(false);
        return;
      }

      try {
        console.log('🔍 Verificando se usuário já tem instância:', userEmail);
        const existingInstance = await getUserWhatsAppInstance(userEmail);
        
        console.log('📋 Dados da instância encontrados:', existingInstance);
        
        // Verificação correta: deve ter instancia_zap igual ao email E status_instancia = 'conectado'
        const hasValidConnectedInstance = !!(
          existingInstance && 
          existingInstance.instancia_zap && 
          existingInstance.instancia_zap.trim() !== '' &&
          existingInstance.instancia_zap !== 'null' &&
          existingInstance.instancia_zap !== null &&
          existingInstance.instancia_zap.toLowerCase() === userEmail.toLowerCase() &&
          existingInstance.status_instancia === 'conectado'
        );
        
        console.log('✅ Usuário possui instância conectada:', hasValidConnectedInstance, {
          instancia_zap: existingInstance?.instancia_zap,
          status_instancia: existingInstance?.status_instancia,
          userEmail: userEmail,
          instanceMatchesEmail: existingInstance?.instancia_zap?.toLowerCase() === userEmail.toLowerCase(),
          isConnected: existingInstance?.status_instancia === 'conectado'
        });
        
        setHasExistingInstance(hasValidConnectedInstance);
        setExistingInstanceData(existingInstance);
        
      } catch (error) {
        console.error('❌ Erro ao verificar instância existente:', error);
        setHasExistingInstance(false);
        setExistingInstanceData(null);
      } finally {
        setCheckingExistingInstance(false);
      }
    };

    checkExistingInstance();
  }, [userEmail]);

  return {
    hasExistingInstance,
    checkingExistingInstance,
    existingInstanceData,
    setHasExistingInstance,
    setExistingInstanceData
  };
};
