
import { useWhatsAppInstanceVerification } from '@/hooks/whatsappGroups/useWhatsAppInstanceVerification';
import { useGroupCreation } from '@/hooks/whatsappGroups/useGroupCreation';
import LoadingState from './LoadingState';
import NoInstanceState from './NoInstanceState';
import GroupCreationForm from './GroupCreationForm';
import { useEffect } from 'react';

interface CreateGroupFormProps {
  userEmail: string;
  onSuccess: () => void;
}

const CreateGroupForm = ({ userEmail, onSuccess }: CreateGroupFormProps) => {
  const { 
    hasWhatsAppInstance, 
    checkingInstance, 
    userInstance, 
    recheckInstance 
  } = useWhatsAppInstanceVerification(userEmail);
  
  const { cadastrando, handleCadastrarGrupo } = useGroupCreation(userEmail, onSuccess);

  // Re-verificar a instância quando o componente for montado ou quando houver mudanças
  useEffect(() => {
    console.log('🔄 [GRUPO] CreateGroupForm montado, verificando instância');
    recheckInstance();
  }, [userEmail]);

  // Log detalhado do estado atual
  useEffect(() => {
    console.log('📊 [GRUPO] Estado atual do CreateGroupForm:', {
      userEmail,
      hasWhatsAppInstance,
      checkingInstance,
      userInstance,
      instanceStatus: userInstance?.status_instancia,
      instanceName: userInstance?.instancia_zap
    });
  }, [userEmail, hasWhatsAppInstance, checkingInstance, userInstance]);

  if (checkingInstance) {
    console.log('⏳ [GRUPO] Verificando instância WhatsApp...');
    return <LoadingState message="Verificando instância WhatsApp..." />;
  }

  if (!hasWhatsAppInstance) {
    console.log('❌ [GRUPO] Instância WhatsApp não encontrada ou não conectada');
    return <NoInstanceState userInstance={userInstance} />;
  }

  console.log('✅ [GRUPO] Instância válida encontrada, mostrando formulário de criação');

  const handleSubmit = (nomeGrupo: string) => {
    console.log('🚀 [GRUPO] Iniciando criação de grupo:', nomeGrupo);
    handleCadastrarGrupo(nomeGrupo, userInstance);
  };

  return (
    <GroupCreationForm
      userInstance={userInstance!}
      userEmail={userEmail}
      cadastrando={cadastrando}
      onSubmit={handleSubmit}
    />
  );
};

export default CreateGroupForm;
