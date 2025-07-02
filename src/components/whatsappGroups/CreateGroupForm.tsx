
import { useExistingInstanceCheck } from '@/hooks/whatsapp/useExistingInstanceCheck'; // <--- Hook UNIFICADO!
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
  // Use o hook UNIFICADO E CORRETO
  const { 
    hasExistingInstance, 
    checkingExistingInstance, 
    existingInstanceData,
    recheckInstance 
  } = useExistingInstanceCheck(userEmail);
  
  const { cadastrando, handleCadastrarGrupo } = useGroupCreation(userEmail, onSuccess);

  useEffect(() => {
    recheckInstance();
  }, [userEmail]); // Re-verifica quando o email muda

  if (checkingExistingInstance) {
    return <LoadingState message="Verificando instância WhatsApp..." />;
  }

  // A lógica agora é a mesma da outra página: `hasExistingInstance`
  //if (!hasExistingInstance) {
  //  return <NoInstanceState userInstance={existingInstanceData} />;
  //}

  const handleSubmit = (nomeGrupo: string) => {
    handleCadastrarGrupo(nomeGrupo, existingInstanceData);
  };

  return (
    <GroupCreationForm
      userInstance={existingInstanceData!}
      userEmail={userEmail}
      cadastrando={cadastrando}
      onSubmit={handleSubmit}
    />
  );
};

export default CreateGroupForm;
