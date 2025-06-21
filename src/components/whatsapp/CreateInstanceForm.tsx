
import { WhatsAppInstance } from '@/types/whatsAppTypes';
import { Card, CardContent } from '@/components/ui/card';
import { useExistingInstanceCheck } from '@/hooks/whatsapp/useExistingInstanceCheck';
import { useInstanceCreation } from '@/hooks/whatsapp/useInstanceCreation';
import ExistingInstanceDisplay from './ExistingInstanceDisplay';
import InstanceCreationForm from './InstanceCreationForm';

interface CreateInstanceFormProps {
  onInstanceCreated: (instance: WhatsAppInstance) => void;
  initialInstanceName?: string;
}

const CreateInstanceForm = ({ 
  onInstanceCreated, 
  initialInstanceName = '' 
}: CreateInstanceFormProps) => {
  const currentUserId = localStorage.getItem('userId') || '';
  const userEmail = (localStorage.getItem('userEmail') || '').toLowerCase();
  const instanceName = userEmail;

  const {
    hasExistingInstance,
    checkingExistingInstance,
    existingInstanceData,
    setHasExistingInstance,
    setExistingInstanceData
  } = useExistingInstanceCheck(userEmail);

  const { loading, createInstance } = useInstanceCreation(
    userEmail,
    currentUserId,
    onInstanceCreated,
    setHasExistingInstance,
    setExistingInstanceData
  );

  if (checkingExistingInstance) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p>Verificando instâncias existentes...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (hasExistingInstance && existingInstanceData) {
    return <ExistingInstanceDisplay existingInstanceData={existingInstanceData} />;
  }

  return (
    <InstanceCreationForm
      instanceName={instanceName}
      onCreateInstance={createInstance}
      loading={loading}
      userEmail={userEmail}
    />
  );
};

export default CreateInstanceForm;
