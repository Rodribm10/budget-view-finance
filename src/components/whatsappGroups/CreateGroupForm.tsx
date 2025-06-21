
import { useWhatsAppInstanceVerification } from '@/hooks/whatsappGroups/useWhatsAppInstanceVerification';
import { useGroupCreation } from '@/hooks/whatsappGroups/useGroupCreation';
import LoadingState from './LoadingState';
import NoInstanceState from './NoInstanceState';
import GroupCreationForm from './GroupCreationForm';

interface CreateGroupFormProps {
  userEmail: string;
  onSuccess: () => void;
}

const CreateGroupForm = ({ userEmail, onSuccess }: CreateGroupFormProps) => {
  const { hasWhatsAppInstance, checkingInstance, userInstance } = useWhatsAppInstanceVerification(userEmail);
  const { cadastrando, handleCadastrarGrupo } = useGroupCreation(userEmail, onSuccess);

  if (checkingInstance) {
    return <LoadingState message="Verificando instância WhatsApp..." />;
  }

  if (!hasWhatsAppInstance) {
    return <NoInstanceState userInstance={userInstance} />;
  }

  const handleSubmit = (nomeGrupo: string) => {
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
