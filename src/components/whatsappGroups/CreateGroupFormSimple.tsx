
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { verificarInstanciaWhatsApp } from '@/services/gruposWhatsAppService';
import { findOrCreateWhatsAppGroup } from '@/services/whatsAppGroupsService';
import { createWorkflowInN8n } from '@/services/n8nWorkflowService';
import { createEvolutionWebhook } from '@/services/whatsApp/webhookService';
import { activateUserWorkflow } from '@/services/whatsAppInstance/workflowOperations';

interface CreateGroupFormProps {
  userEmail: string;
  onSuccess: () => void;
}

const CreateGroupFormSimple = ({ userEmail, onSuccess }: CreateGroupFormProps) => {
  const { toast } = useToast();
  const [nomeGrupo, setNomeGrupo] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [webhookEnviado, setWebhookEnviado] = useState(false);
  const [workflowAtivado, setWorkflowAtivado] = useState(false);
  const [mensagemStatus, setMensagemStatus] = useState<{
    tipo: 'info' | 'success' | 'error';
    texto: string;
  } | null>(null);

  const enviarWebhookAtivarWorkflow = async (email: string) => {
    try {
      console.log(`🔔 [WEBHOOK] Enviando webhook ativarworkflow para: ${email}`);
      
      const webhookUrl = 'https://webhookn8n.innova1001.com.br/webhook/ativarworkflow';
      
      const webhookBody = {
        email: email,
        timestamp: new Date().toISOString(),
        action: 'activate_workflow',
        source: 'group_creation'
      };
      
      console.log('📦 [WEBHOOK] Dados do webhook ativarworkflow:', JSON.stringify(webhookBody, null, 2));
      
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(webhookBody)
      });
      
      console.log(`📡 [WEBHOOK] Status da resposta ativarworkflow: ${response.status}`);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`❌ [WEBHOOK] Erro ativarworkflow: ${response.status} - ${errorText}`);
        throw new Error(`Erro webhook ativarworkflow: ${response.status}`);
      }
      
      const responseData = await response.text();
      console.log('✅ [WEBHOOK] Webhook ativarworkflow enviado com sucesso:', responseData);
      setWorkflowAtivado(true);
      
    } catch (error) {
      console.error('💥 [WEBHOOK] Erro crítico webhook ativarworkflow:', error);
      throw error;
    }
  };

  const enviarWebhookHook = async (email: string) => {
    try {
      console.log(`🔔 [WEBHOOK] Enviando webhook hook para: ${email}`);
      
      const webhookUrl = 'https://webhookn8n.innova1001.com.br/webhook/hook';
      
      const webhookBody = {
        email: email,
        timestamp: new Date().toISOString(),
        source: 'group_creation'
      };
      
      console.log('📦 [WEBHOOK] Dados do webhook hook:', JSON.stringify(webhookBody, null, 2));
      
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(webhookBody)
      });
      
      console.log(`📡 [WEBHOOK] Status da resposta hook: ${response.status}`);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`❌ [WEBHOOK] Erro hook: ${response.status} - ${errorText}`);
        throw new Error(`Erro webhook hook: ${response.status}`);
      }
      
      const responseData = await response.text();
      console.log('✅ [WEBHOOK] Webhook hook enviado com sucesso:', responseData);
      setWebhookEnviado(true);
      
    } catch (error) {
      console.error('💥 [WEBHOOK] Erro crítico webhook hook:', error);
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!nomeGrupo.trim()) {
      toast({
        title: 'Erro',
        description: 'Por favor, informe o nome do grupo',
        variant: 'destructive',
      });
      return;
    }

    setCarregando(true);
    setMensagemStatus(null);
    setWebhookEnviado(false);
    setWorkflowAtivado(false);

    try {
      // 1. Verificar se o usuário tem instância WhatsApp
      setMensagemStatus({ tipo: 'info', texto: 'Verificando sua instância do WhatsApp...' });
      
      const instanciaInfo = await verificarInstanciaWhatsApp();
      
      if (!instanciaInfo.hasInstance) {
        setMensagemStatus({ 
          tipo: 'error', 
          texto: 'Você precisa ter uma instância do WhatsApp conectada. Acesse o menu "Conectar WhatsApp" primeiro.' 
        });
        return;
      }

      // 2. Criar ou encontrar grupo
      setMensagemStatus({ tipo: 'info', texto: 'Cadastrando grupo...' });
      
      const grupo = await findOrCreateWhatsAppGroup(nomeGrupo.trim());
      if (!grupo) {
        throw new Error('Falha ao criar o grupo');
      }

      // 3. Criar workflow no n8n
      setMensagemStatus({ tipo: 'info', texto: 'Configurando automação...' });
      
      await createWorkflowInN8n(userEmail);

      // 4. ENVIAR WEBHOOK ATIVARWORKFLOW
      console.log('🚀 [GRUPO] Enviando webhook ativarworkflow no cadastro do grupo');
      setMensagemStatus({ tipo: 'info', texto: 'Ativando workflow...' });
      
      try {
        await enviarWebhookAtivarWorkflow(userEmail);
        console.log('✅ [GRUPO] Webhook ativarworkflow enviado com sucesso');
      } catch (workflowError) {
        console.error('❌ [GRUPO] Erro ao enviar webhook ativarworkflow:', workflowError);
        // Continua mesmo se o webhook falhar
        toast({
          title: 'Aviso',
          description: 'Grupo criado, mas houve erro ao ativar workflow',
          variant: 'destructive',
        });
      }

      // 5. ENVIAR WEBHOOK HOOK
      console.log('🚀 [GRUPO] Enviando webhook hook no cadastro do grupo');
      setMensagemStatus({ tipo: 'info', texto: 'Configurando webhook...' });
      
      try {
        await enviarWebhookHook(userEmail);
        console.log('✅ [GRUPO] Webhook hook enviado com sucesso');
      } catch (webhookError) {
        console.error('❌ [GRUPO] Erro ao enviar webhook hook:', webhookError);
        // Continua mesmo se o webhook falhar
        toast({
          title: 'Aviso',
          description: 'Grupo criado, mas houve erro na configuração do webhook',
          variant: 'destructive',
        });
      }

      setMensagemStatus({ 
        tipo: 'success', 
        texto: 'Grupo cadastrado com sucesso! Agora você pode usar este grupo em suas transações.' 
      });

      toast({
        title: 'Sucesso',
        description: 'Grupo cadastrado e configurado com sucesso!',
      });

      // Limpar formulário
      setNomeGrupo('');
      
      // Atualizar lista de grupos
      onSuccess();

    } catch (error) {
      console.error('❌ [GRUPO] Erro ao cadastrar grupo:', error);
      setMensagemStatus({ 
        tipo: 'error', 
        texto: 'Erro ao cadastrar grupo. Tente novamente.' 
      });
      
      toast({
        title: 'Erro',
        description: 'Não foi possível cadastrar o grupo do WhatsApp',
        variant: 'destructive',
      });
    } finally {
      setCarregando(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cadastrar novo grupo</CardTitle>
        <CardDescription>
          Cadastre um grupo do WhatsApp para receber notificações de suas transações
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nomeGrupo">Nome do grupo</Label>
            <Input
              id="nomeGrupo"
              type="text"
              placeholder="Digite o nome do grupo do WhatsApp"
              value={nomeGrupo}
              onChange={(e) => setNomeGrupo(e.target.value)}
              disabled={carregando}
            />
          </div>

          {mensagemStatus && (
            <Alert variant={mensagemStatus.tipo === 'error' ? 'destructive' : 'default'}>
              {mensagemStatus.tipo === 'error' && <AlertCircle className="h-4 w-4" />}
              {mensagemStatus.tipo === 'success' && <CheckCircle2 className="h-4 w-4" />}
              {mensagemStatus.tipo === 'info' && <Loader2 className="h-4 w-4 animate-spin" />}
              <AlertDescription>{mensagemStatus.texto}</AlertDescription>
            </Alert>
          )}

          {/* Status dos webhooks */}
          {(workflowAtivado || webhookEnviado) && (
            <div className="space-y-2">
              {workflowAtivado && (
                <div className="flex items-center text-sm text-green-600">
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Webhook ativarworkflow enviado
                </div>
              )}
              {webhookEnviado && (
                <div className="flex items-center text-sm text-green-600">
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Webhook hook enviado
                </div>
              )}
            </div>
          )}

          <Button type="submit" disabled={carregando || !nomeGrupo.trim()}>
            {carregando ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Cadastrando...
              </>
            ) : (
              'Cadastrar grupo'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default CreateGroupFormSimple;
