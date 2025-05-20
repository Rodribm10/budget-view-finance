
import { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Loader2, Plus, RefreshCw, MessageSquare } from 'lucide-react';
import { cadastrarGrupoWhatsApp, listarGruposWhatsApp } from '@/services/gruposWhatsAppService';
import { WhatsAppGroup } from '@/types/financialTypes';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const GruposWhatsApp = () => {
  const { toast } = useToast();
  const [grupos, setGrupos] = useState<WhatsAppGroup[]>([]);
  const [carregando, setCarregando] = useState<boolean>(true);
  const [cadastrando, setCadastrando] = useState<boolean>(false);
  const [userEmail, setUserEmail] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string | null>(null);

  // Buscar os grupos do usuário ao carregar a página
  const buscarGrupos = async () => {
    setCarregando(true);
    setErrorMessage(null);
    setDebugInfo(null);
    try {
      const gruposData = await listarGruposWhatsApp();
      setGrupos(gruposData);
    } catch (error) {
      console.error('Erro ao buscar grupos:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar seus grupos do WhatsApp',
        variant: 'destructive',
      });
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    // Obter o email do usuário do localStorage
    const email = localStorage.getItem('userEmail');
    if (email) {
      setUserEmail(email.trim().toLowerCase());
    }
    
    buscarGrupos();
  }, []);

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

    setCadastrando(true);
    try {
      console.log("Iniciando processo de cadastro de grupo...");
      const grupo = await cadastrarGrupoWhatsApp();
      
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
        
        // Atualizar a lista de grupos
        buscarGrupos();
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
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-tight">Grupos do WhatsApp</h1>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={buscarGrupos} 
              disabled={carregando}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${carregando ? 'animate-spin' : ''}`} />
              {carregando ? 'Atualizando...' : 'Atualizar'}
            </Button>
            <Button 
              onClick={handleCadastrarGrupo} 
              disabled={cadastrando || !userEmail}
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
          </div>
        </div>

        {errorMessage && (
          <Alert variant="destructive">
            <AlertTitle>Erro ao cadastrar grupo</AlertTitle>
            <AlertDescription>
              {errorMessage}
            </AlertDescription>
          </Alert>
        )}

        {debugInfo && (
          <Alert variant="default" className="bg-amber-50 border-amber-200">
            <AlertTitle>Informações de depuração</AlertTitle>
            <AlertDescription className="text-amber-800">
              {debugInfo}
            </AlertDescription>
          </Alert>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Como cadastrar um grupo</CardTitle>
            <CardDescription>
              Siga os passos abaixo para vincular um grupo do WhatsApp à sua conta
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ol className="list-decimal list-inside space-y-2">
              <li>Clique no botão "Cadastrar Grupo" acima</li>
              <li>Adicione o número (61)99244-4275 ao grupo do WhatsApp que deseja automatizar</li>
              <li>Envie uma mensagem neste grupo com o seguinte texto:</li>
            </ol>
            
            <div className="bg-muted p-3 rounded-md font-mono">
              {userEmail}
            </div>
            
            <p className="text-sm text-muted-foreground">
              Copie e cole o email exatamente como aparece acima
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Seus grupos cadastrados</CardTitle>
            <CardDescription>
              Lista de grupos do WhatsApp que você cadastrou
            </CardDescription>
          </CardHeader>
          <CardContent>
            {carregando ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : grupos.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Nome do grupo</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Workflow</TableHead>
                    <TableHead>Cadastro</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {grupos.map((grupo) => (
                    <TableRow key={grupo.id}>
                      <TableCell className="font-medium">{grupo.id}</TableCell>
                      <TableCell>
                        {grupo.nome_grupo || (
                          <span className="text-muted-foreground italic">
                            {grupo.remote_jid ? 'Sem nome definido' : 'Aguardando vínculo...'}
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant={grupo.remote_jid ? "success" : "outline"}>
                          {grupo.remote_jid ? 'Ativo' : 'Pendente'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {grupo.workflow_id ? (
                          <Badge variant="secondary" className="bg-green-100 text-green-800">
                            Configurado
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-gray-500">
                            Não configurado
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>{new Date(grupo.created_at).toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-8">
                <MessageSquare className="h-12 w-12 text-muted-foreground opacity-20 mx-auto mb-4" />
                <p className="text-muted-foreground">Você ainda não cadastrou nenhum grupo</p>
                <Button 
                  variant="outline" 
                  className="mt-4" 
                  onClick={handleCadastrarGrupo}
                  disabled={cadastrando || !userEmail}
                >
                  <Plus className="h-4 w-4 mr-2" /> 
                  Cadastrar seu primeiro grupo
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default GruposWhatsApp;
