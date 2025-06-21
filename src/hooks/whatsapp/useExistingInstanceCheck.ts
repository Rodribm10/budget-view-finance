
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
        
        // Verificação rigorosa - deve ter instancia_zap válida
        const hasValidInstance = !!(
          existingInstance && 
          existingInstance.instancia_zap && 
          existingInstance.instancia_zap.trim() !== '' &&
          existingInstance.instancia_zap !== 'null' &&
          existingInstance.instancia_zap !== null
        );
        
        console.log('✅ Usuário possui instância válida:', hasValidInstance, {
          instancia_zap: existingInstance?.instancia_zap,
          status_instancia: existingInstance?.status_instancia
        });
        
        setHasExistingInstance(hasValidInstance);
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
