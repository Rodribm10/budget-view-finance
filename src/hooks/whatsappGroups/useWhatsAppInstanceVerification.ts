
import { useState, useEffect } from 'react';
import { getUserWhatsAppInstance } from '@/services/whatsAppInstanceService';

interface WhatsAppInstanceData {
  instancia_zap: string | null;
  status_instancia: string | null;
  whatsapp: string | null;
}

export const useWhatsAppInstanceVerification = (userEmail: string) => {
  const [hasWhatsAppInstance, setHasWhatsAppInstance] = useState<boolean>(false);
  const [checkingInstance, setCheckingInstance] = useState<boolean>(true);
  const [userInstance, setUserInstance] = useState<WhatsAppInstanceData | null>(null);

  useEffect(() => {
    const checkUserInstance = async () => {
      if (!userEmail) {
        console.log('❌ Email do usuário não fornecido');
        setCheckingInstance(false);
        return;
      }
      
      setCheckingInstance(true);
      try {
        console.log('🔍 Verificando instância para criação de grupo:', userEmail);
        
        const instanceData = await getUserWhatsAppInstance(userEmail);
        console.log('📋 Dados da instância encontrados:', instanceData);
        
        if (instanceData) {
          // Verificação correta: deve ter instancia_zap igual ao email E status conectado
          const hasValidInstance = !!(
            instanceData && 
            instanceData.instancia_zap && 
            instanceData.instancia_zap.trim() !== '' &&
            instanceData.instancia_zap !== 'null' &&
            instanceData.instancia_zap !== null &&
            instanceData.instancia_zap.toLowerCase() === userEmail.toLowerCase() &&
            instanceData.status_instancia === 'conectado'
          );
          
          console.log('✅ Instância válida para criar grupos:', hasValidInstance, {
            instancia_zap: instanceData.instancia_zap,
            status_instancia: instanceData.status_instancia,
            userEmail: userEmail,
            instanceMatchesEmail: instanceData.instancia_zap?.toLowerCase() === userEmail.toLowerCase(),
            isConnected: instanceData.status_instancia === 'conectado',
            hasValidInstance
          });
          
          setHasWhatsAppInstance(hasValidInstance);
          setUserInstance(instanceData);
        } else {
          console.log('❌ Nenhuma instância encontrada');
          setHasWhatsAppInstance(false);
          setUserInstance(null);
        }
      } catch (error) {
        console.error('❌ Erro ao verificar instância do usuário:', error);
        setHasWhatsAppInstance(false);
        setUserInstance(null);
      } finally {
        setCheckingInstance(false);
      }
    };

    checkUserInstance();
  }, [userEmail]);

  return {
    hasWhatsAppInstance,
    checkingInstance,
    userInstance
  };
};
