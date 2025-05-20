
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Plus } from 'lucide-react';
import { cadastrarGrupoWhatsApp } from '@/services/gruposWhatsAppService';
import { useToast } from '@/hooks/use-toast';

interface CreateGroupFormProps {
  userEmail: string;
  onSuccess: () => void;
}

const CreateGroupForm = ({ userEmail, onSuccess }: CreateGroupFormProps) => {
  const { toast } = useToast();
  const [cadastrando, setCadastrando] = useState<boolean>(false);
  const [nomeGrupo, setNomeGrupo] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string | null>(null);

  // Cadastrar novo grupo ou atualizar workflow se necessário
  const handleCadastrarGrupo = async () => {
    setErrorMessage(null);
    setDebugInfo(null);
    
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

    setCadastrando(true);
    try {
      console.log("Iniciando processo de cadastro de grupo...");
      const grupo = await cadastrarGrupoWhatsApp(nomeGrupo.trim());
      
      if (grupo) {
        let successMessage = 'Grupo registrado com sucesso';
        let variant: 'default' | 'destructive' = 'default';
        
        if (grupo.workflow_id) {
          successMessage = 'Grupo cadastrado e workflow criado com sucesso!';
        } else {
          successMessage = 'Grupo cadastrado, mas falha ao criar workflow de automação.';
          setDebugInfo('O grupo foi criado no Supabase, mas houve um problema ao criar o workflow no n8n. Verifique os logs do console para mais detalhes.');
          variant = 'destructive';
        }
        
        toast({
          title: grupo.workflow_id ? 'Sucesso' : 'Atenção',
          description: successMessage,
          variant: variant,
        });
        
        // Resetar o campo de nome
        setNomeGrupo('');
        
        // Atualizar a lista de grupos
        onSuccess();
      } else {
        setErrorMessage('Não foi possível registrar o grupo. Verifique a conexão com o Supabase.');
        toast({
          title: 'Erro',
          description: 'Não foi possível registrar o grupo',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Erro ao cadastrar grupo:', error);
      let errorMsg = 'Erro desconhecido';
      if (error instanceof Error) {
        errorMsg = error.message;
        
        // Tentar extrair detalhes específicos do erro se existirem
        if (errorMsg.includes('Status')) {
          const statusMatch = errorMsg.match(/Status (\d+)/);
          if (statusMatch && statusMatch[1]) {
            setDebugInfo(`Código de status HTTP da API: ${statusMatch[1]}`);
          }
        }
      }
      
      setErrorMessage('Erro ao cadastrar grupo: ' + errorMsg);
      toast({
        title: 'Erro',
        description: 'Não foi possível registrar o grupo',
        variant: 'destructive',
      });
    } finally {
      setCadastrando(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cadastrar novo grupo</CardTitle>
        <CardDescription>
          Preencha as informações abaixo para cadastrar um novo grupo do WhatsApp
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
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
          disabled={cadastrando || !userEmail || !nomeGrupo.trim()}
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
          <h3 className="font-medium mb-2">Após cadastrar:</h3>
          <ol className="list-decimal list-inside space-y-2">
            <li>Adicione o número (61)99244-4275 ao grupo do WhatsApp que deseja automatizar</li>
            <li>Envie uma mensagem neste grupo com o seguinte texto:</li>
          </ol>
          
          <div className="bg-muted p-3 rounded-md font-mono mt-2">
            {userEmail}
          </div>
          
          <p className="text-sm text-muted-foreground mt-2">
            Copie e cole o email exatamente como aparece acima
          </p>
        </div>

        {errorMessage && <p className="text-destructive text-sm mt-4">{errorMessage}</p>}
        {debugInfo && <p className="text-amber-800 text-sm mt-2 bg-amber-50 p-3 rounded-md">{debugInfo}</p>}
      </CardContent>
    </Card>
  );
};

export default CreateGroupForm;
