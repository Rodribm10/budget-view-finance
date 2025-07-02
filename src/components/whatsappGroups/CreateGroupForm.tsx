
import { useEffect, useState } from 'react';
import { useExistingInstanceCheck } from '@/hooks/whatsapp/useExistingInstanceCheck';
import { useGroupCreation } from '@/hooks/whatsappGroups/useGroupCreation';
import { listarGruposWhatsApp } from '@/services/gruposWhatsAppService';
import LoadingState from './LoadingState';
import NoInstanceState from './NoInstanceState';
import GroupCreationForm from './GroupCreationForm';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Info, Loader2 } from 'lucide-react';

interface CreateGroupFormProps {
  userEmail: string;
  onSuccess: () => void;
}

const CreateGroupForm = ({ userEmail, onSuccess }: CreateGroupFormProps) => {
  const [verificandoGrupos, setVerificandoGrupos] = useState(true);
  const [jaTemGrupo, setJaTemGrupo] = useState(false);
  const [grupoExistente, setGrupoExistente] = useState<any>(null);
  
  const { 
    hasExistingInstance, 
    checkingExistingInstance, 
    existingInstanceData,
    recheckInstance 
  } = useExistingInstanceCheck(userEmail);
  
  const { cadastrando, handleCadastrarGrupo } = useGroupCreation(userEmail, onSuccess);

  // Verificar se o usuário já tem grupos cadastrados
  const verificarGruposExistentes = async () => {
    if (!userEmail) return;
    
    setVerificandoGrupos(true);
    try {
      console.log('🔍 Verificando grupos existentes para:', userEmail);
      const grupos = await listarGruposWhatsApp();
      
      if (grupos && grupos.length > 0) {
        console.log('✅ Usuário já possui grupos:', grupos);
        setJaTemGrupo(true);
        setGrupoExistente(grupos[0]); // Pegar o primeiro grupo
      } else {
        console.log('📝 Usuário não possui grupos, pode cadastrar');
        setJaTemGrupo(false);
        setGrupoExistente(null);
      }
    } catch (error) {
      console.error('❌ Erro ao verificar grupos existentes:', error);
      setJaTemGrupo(false);
    } finally {
      setVerificandoGrupos(false);
    }
  };

  useEffect(() => {
    recheckInstance();
    verificarGruposExistentes();
  }, [userEmail]);

  if (checkingExistingInstance || verificandoGrupos) {
    return <LoadingState message="Verificando instância WhatsApp e grupos existentes..." />;
  }

  // Se já tem grupo, mostrar informação
  if (jaTemGrupo && grupoExistente) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Cadastrar novo grupo</CardTitle>
          <CardDescription>
            Você já possui um grupo cadastrado
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              <strong>Grupo já cadastrado:</strong> {grupoExistente.nome_grupo || 'Grupo sem nome'}
              <br />
              <span className="text-sm text-muted-foreground">
                Status: {grupoExistente.status || 'pendente'} 
                {grupoExistente.remote_jid && grupoExistente.remote_jid !== '' && (
                  <span> • ID: {grupoExistente.remote_jid}</span>
                )}
              </span>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  // Se não tem instância conectada, mostrar estado de sem instância
  if (!hasExistingInstance) {
    return <NoInstanceState userInstance={existingInstanceData} />;
  }

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
