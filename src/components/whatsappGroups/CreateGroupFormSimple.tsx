
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
import { activateUserWorkflow } from '@/services/whatsAppInstance/workflowOperations';

interface CreateGroupFormProps {
  userEmail: string;
  onSuccess: () => void;
}

const CreateGroupFormSimple = ({ userEmail, onSuccess }: CreateGroupFormProps) => {
  const { toast } = useToast();
  const [nomeGrupo, setNomeGrupo] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [mensagemStatus, setMensagemStatus] = useState<{
    tipo: 'info' | 'success' | 'error';
    texto: string;
  } | null>(null);

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

    try {
      // Verificar se o usuário tem instância WhatsApp
      setMensagemStatus({ tipo: 'info', texto: 'Verificando sua instância do WhatsApp...' });
      
      const instanciaInfo = await verificarInstanciaWhatsApp();
      
      if (!instanciaInfo.hasInstance) {
        setMensagemStatus({ 
          tipo: 'error', 
          texto: 'Você precisa ter uma instância do WhatsApp conectada. Acesse o menu "Conectar WhatsApp" primeiro.' 
        });
        return;
      }

      // Criar ou encontrar grupo
      setMensagemStatus({ tipo: 'info', texto: 'Cadastrando grupo...' });
      
      const grupo = await findOrCreateWhatsAppGroup(nomeGrupo.trim());
      if (!grupo) {
        throw new Error('Falha ao criar o grupo');
      }

      // Criar workflow no n8n
      setMensagemStatus({ tipo: 'info', texto: 'Configurando automação...' });
      
      await createWorkflowInN8n(userEmail);

      // Enviar webhook para ativar workflow
      setMensagemStatus({ tipo: 'info', texto: 'Ativando automação...' });
      
      try {
        console.log(`🔔 Enviando webhook para ativar workflow para o usuário: ${userEmail}`);
        await activateUserWorkflow(userEmail);
        console.log('✅ Webhook de ativação de workflow enviado com sucesso');
      } catch (webhookError) {
        console.error('❌ Erro ao enviar webhook de ativação:', webhookError);
        // Continua mesmo se o webhook falhar
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
      console.error('Erro ao cadastrar grupo:', error);
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
