
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
        console.log('Email do usuário não fornecido');
        setCheckingInstance(false);
        return;
      }
      
      setCheckingInstance(true);
      try {
        console.log('=== VERIFICAÇÃO DE INSTÂNCIA ===');
        console.log('Verificando instância para o usuário:', userEmail);
        
        const instanceData = await getUserWhatsAppInstance(userEmail);
        console.log('=== DADOS DA INSTÂNCIA RETORNADOS ===');
        console.log('Dados completos:', JSON.stringify(instanceData, null, 2));
        
        if (instanceData) {
          console.log('=== VERIFICAÇÃO DETALHADA ===');
          console.log('instancia_zap existe?', !!instanceData.instancia_zap);
          console.log('instancia_zap valor:', instanceData.instancia_zap);
          console.log('instancia_zap não é vazio?', instanceData.instancia_zap?.trim() !== '');
          console.log('status_instancia valor:', instanceData.status_instancia);
          console.log('status_instancia é "conectado"?', instanceData.status_instancia === 'conectado');
        }
        
        // LÓGICA CORRETA: Verificar se tem instância E se está conectada
        const hasValidInstance = !!(
          instanceData && 
          instanceData.instancia_zap && 
          instanceData.instancia_zap.trim() !== '' &&
          instanceData.status_instancia === 'conectado' // DEVE ESTAR CONECTADO
        );
        
        console.log('=== RESULTADO DA VALIDAÇÃO ===');
        console.log('hasValidInstance:', hasValidInstance);
        
        if (hasValidInstance) {
          setHasWhatsAppInstance(true);
          setUserInstance(instanceData);
          console.log('✅ Usuário tem instância WhatsApp conectada - liberando cadastro de grupo');
        } else {
          setHasWhatsAppInstance(false);
          setUserInstance(instanceData);
          console.log('❌ Usuário não tem instância conectada:', {
            instancia_zap: instanceData?.instancia_zap,
            status_instancia: instanceData?.status_instancia
          });
        }
      } catch (error) {
        console.error('Erro ao verificar instância do usuário:', error);
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

      // 2. Criar grupo no WhatsApp via API
      try {
        const groupResponse = await createWhatsAppGroup(
          userInstance.instancia_zap,
          userEmail,
          userInstance.whatsapp || ''
        );
        
        console.log('Resposta da criação do grupo:', groupResponse);
        
        // 3. Atualizar remote_jid no banco de dados
        if (groupResponse.id) {
          await updateGroupRemoteJid(grupo.id, groupResponse.id);
          
          toast({
            title: 'Sucesso!',
            description: `Grupo "${groupResponse.subject}" criado com sucesso no seu WhatsApp!`,
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
              Para criar um grupo é necessário ter sua instância do WhatsApp conectada. 
              Acesse o menu "Conectar WhatsApp" e realize a conexão primeiro.
            </AlertDescription>
          </Alert>
          
          {/* Informações de debug DETALHADAS */}
          <div className="mt-4 p-4 bg-gray-100 rounded text-sm">
            <p><strong>📊 STATUS DETALHADO DA INSTÂNCIA:</strong></p>
            <div className="mt-2 space-y-1">
              <p><strong>Email consultado:</strong> {userEmail || 'Não definido'}</p>
              <p><strong>instancia_zap:</strong> 
                <span className={instanceData?.instancia_zap ? 'text-green-600' : 'text-red-600'}>
                  {instanceData?.instancia_zap || 'NULL/Vazio'}
                </span>
              </p>
              <p><strong>status_instancia:</strong> 
                <span className={instanceData?.status_instancia === 'conectado' ? 'text-green-600' : 'text-red-600'}>
                  {instanceData?.status_instancia || 'NULL/Vazio'}
                </span>
              </p>
              <p><strong>whatsapp:</strong> {instanceData?.whatsapp || 'NULL/Vazio'}</p>
              
              <div className="mt-3 p-2 bg-yellow-100 rounded">
                <p><strong>🔍 VALIDAÇÕES:</strong></p>
                <p>✓ Instância existe? {instanceData ? '✅ SIM' : '❌ NÃO'}</p>
                <p>✓ instancia_zap preenchida? {(instanceData?.instancia_zap && instanceData.instancia_zap.trim() !== '') ? '✅ SIM' : '❌ NÃO'}</p>
                <p>✓ Status é "conectado"? {instanceData?.status_instancia === 'conectado' ? '✅ SIM' : '❌ NÃO'}</p>
              </div>
              
              {instanceData?.instancia_zap && instanceData?.status_instancia !== 'conectado' && (
                <p className="text-red-600 font-medium mt-2">
                  ⚠️ Instância encontrada, mas não está conectada. Status atual: "{instanceData.status_instancia}"
                </p>
              )}
            </div>
          </div>
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
            <li>O grupo terá o nome: FinDash - {userEmail.split('@')[0]}</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default CreateGroupForm;
