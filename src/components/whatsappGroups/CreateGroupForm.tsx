
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Plus, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { findOrCreateWhatsAppGroup } from '@/services/whatsAppGroupsService';
import { getUserWhatsAppInstance } from '@/services/whatsAppInstanceService';
import { createWhatsAppGroup, updateGroupRemoteJid } from '@/services/whatsAppGroupCreationService';
import { useToast } from '@/hooks/use-toast';

interface CreateGroupFormProps {
  userEmail: string;
  onSuccess: () => void;
}

const CreateGroupForm = ({ userEmail, onSuccess }: CreateGroupFormProps) => {
  const { toast } = useToast();
  const [cadastrando, setCadastrando] = useState<boolean>(false);
  const [nomeGrupo, setNomeGrupo] = useState<string>('');
  const [hasWhatsAppInstance, setHasWhatsAppInstance] = useState<boolean>(false);
  const [checkingInstance, setCheckingInstance] = useState<boolean>(true);
  const [userInstance, setUserInstance] = useState<{
    instancia_zap: string | null;
    status_instancia: string | null;
    whatsapp: string | null;
  } | null>(null);

  // Verificar se o usuário tem instância WhatsApp CONECTADA
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
          // Verificação rigorosa: deve ter instancia_zap válida E status conectado
          const hasValidInstance = !!(
            instanceData && 
            instanceData.instancia_zap && 
            instanceData.instancia_zap.trim() !== '' &&
            instanceData.instancia_zap !== 'null' &&
            instanceData.instancia_zap !== null &&
            instanceData.status_instancia === 'conectado'
          );
          
          console.log('✅ Instância válida para criar grupos:', hasValidInstance, {
            instancia_zap: instanceData.instancia_zap,
            status_instancia: instanceData.status_instancia,
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

  // Cadastrar novo grupo
  const handleCadastrarGrupo = async () => {
    if (!userEmail) {
      toast({
        title: 'Erro',
        description: 'Você precisa estar logado para cadastrar um grupo',
        variant: 'destructive',
      });
      return;
    }

    if (!nomeGrupo.trim()) {
      toast({
        title: 'Atenção',
        description: 'Digite um nome para o grupo',
        variant: 'destructive',
      });
      return;
    }

    if (!userInstance || !userInstance.instancia_zap || userInstance.status_instancia !== 'conectado') {
      toast({
        title: 'Erro',
        description: 'Instância WhatsApp não está conectada',
        variant: 'destructive',
      });
      return;
    }

    setCadastrando(true);
    try {
      console.log("Iniciando processo de cadastro de grupo...");
      
      // 1. Cadastrar grupo no banco de dados local
      const grupo = await findOrCreateWhatsAppGroup(nomeGrupo.trim());
      
      if (!grupo) {
        throw new Error('Não foi possível cadastrar o grupo no banco de dados');
      }

      // 2. Criar grupo no WhatsApp via API com o nome escolhido pelo usuário
      try {
        const groupResponse = await createWhatsAppGroup(userEmail, nomeGrupo.trim());
        
        console.log('Resposta da criação do grupo:', groupResponse);
        
        // 3. Atualizar remote_jid no banco de dados
        if (groupResponse.id) {
          await updateGroupRemoteJid(grupo.id, groupResponse.id);
          
          toast({
            title: 'Sucesso!',
            description: `Grupo "${nomeGrupo}" criado com sucesso no seu WhatsApp!`,
            variant: 'default',
          });
        } else {
          toast({
            title: 'Atenção',
            description: 'Grupo cadastrado no sistema, mas não foi possível criar no WhatsApp',
            variant: 'destructive',
          });
        }
        
      } catch (apiError) {
        console.error('Erro ao criar grupo via API:', apiError);
        toast({
          title: 'Atenção',
          description: 'Grupo cadastrado no sistema, mas houve erro ao criar no WhatsApp. Verifique sua conexão.',
          variant: 'destructive',
        });
      }
      
      // Resetar o campo de nome
      setNomeGrupo('');
      
      // Atualizar a lista de grupos
      onSuccess();
      
    } catch (error) {
      console.error('Erro ao cadastrar grupo:', error);
      let errorMsg = 'Erro desconhecido';
      if (error instanceof Error) {
        errorMsg = error.message;
      }
      
      toast({
        title: 'Erro',
        description: `Não foi possível registrar o grupo: ${errorMsg}`,
        variant: 'destructive',
      });
    } finally {
      setCadastrando(false);
    }
  };

  if (checkingInstance) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin mr-2" />
          <span>Verificando instância WhatsApp...</span>
        </CardContent>
      </Card>
    );
  }

  if (!hasWhatsAppInstance) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Cadastrar novo grupo</CardTitle>
          <CardDescription>
            Para criar um grupo é necessário ter uma instância do WhatsApp conectada
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {userInstance && userInstance.instancia_zap && userInstance.status_instancia !== 'conectado' ? (
                <>
                  Sua instância WhatsApp <strong>{userInstance.instancia_zap}</strong> está <strong>desconectada</strong>. 
                  Acesse o menu "Conectar WhatsApp" e escaneie o QR Code para conectar sua instância.
                  <br />
                  <span className="text-sm text-gray-600 mt-2 block">
                    Status atual: {userInstance.status_instancia}
                  </span>
                </>
              ) : (
                <>
                  Para criar um grupo é necessário ter sua instância do WhatsApp conectada. 
                  Acesse o menu "Conectar WhatsApp" e realize a conexão primeiro.
                </>
              )}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cadastrar novo grupo</CardTitle>
        <CardDescription>
          Preencha as informações abaixo para cadastrar um novo grupo do WhatsApp
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Mostrar informações da instância conectada */}
        <div className="bg-green-50 border border-green-200 rounded p-3 text-sm">
          <p className="text-green-800">
            <strong>✓ Instância conectada:</strong> {userInstance?.instancia_zap}
          </p>
          <p className="text-green-700">
            Status: {userInstance?.status_instancia}
          </p>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="nomeGrupo">Nome do grupo</Label>
          <Input 
            id="nomeGrupo" 
            placeholder="Ex: Controle de Gastos da Família" 
            value={nomeGrupo} 
            onChange={(e) => setNomeGrupo(e.target.value)}
          />
          <p className="text-sm text-muted-foreground">
            Digite um nome descritivo para o grupo que você irá criar
          </p>
        </div>
        
        <Button 
          onClick={handleCadastrarGrupo} 
          disabled={cadastrando || !userEmail || !nomeGrupo.trim() || !hasWhatsAppInstance}
          className="w-full"
        >
          {cadastrando ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" /> 
              Cadastrando...
            </>
          ) : (
            <>
              <Plus className="h-4 w-4 mr-2" /> 
              Cadastrar Grupo
            </>
          )}
        </Button>
        
        <div className="mt-4 border-t pt-4">
          <h3 className="font-medium mb-2">Informações importantes:</h3>
          <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
            <li>O grupo será criado automaticamente no seu WhatsApp</li>
            <li>Você será adicionado como participante do grupo</li>
            <li>O grupo terá o nome que você escolheu: {nomeGrupo || 'Digite um nome acima'}</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default CreateGroupForm;
