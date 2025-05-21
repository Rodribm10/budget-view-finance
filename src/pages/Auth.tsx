
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

// URL do webhook para notificação de novo cadastro
const WEBHOOK_URL = "https://hook.us1.make.com/spgyc1wpkqmep46qzo1h1v1m246luw13";

const Auth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  // Estado do formulário de login
  const [loginEmail, setLoginEmail] = useState('');
  const [loginSenha, setLoginSenha] = useState('');
  
  // Estado do formulário de cadastro
  const [nome, setNome] = useState('');
  const [empresa, setEmpresa] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmaSenha, setConfirmaSenha] = useState('');

  // Função para enviar dados do usuário para o webhook
  const enviarDadosParaWebhook = async (dadosUsuario) => {
    try {
      console.log("Enviando dados do usuário para webhook:", dadosUsuario);
      
      await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'no-cors', // Necessário para webhooks externos
        body: JSON.stringify(dadosUsuario),
      });
      
      console.log("Dados enviados com sucesso para o webhook");
    } catch (error) {
      console.error("Erro ao enviar dados para o webhook:", error);
    }
  };

  // Função para fazer login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Tenta autenticar o usuário através da função RPC do Supabase
      const { data, error } = await supabase.rpc('autenticar_usuario', {
        email_login: loginEmail,
        senha_login: loginSenha
      });
      
      if (error || !data) {
        throw new Error(error?.message || "Falha ao autenticar. Verifique seu email e senha.");
      }

      // Se encontrou um usuário válido
      if (data) {
        // Armazenar informações de sessão
        localStorage.setItem('autenticado', 'true');
        localStorage.setItem('userId', data);
        localStorage.setItem('userEmail', loginEmail);
        
        toast({
          title: "Login realizado com sucesso",
          description: "Bem-vindo de volta!"
        });
        
        // Redirecionamento para o dashboard após login bem-sucedido
        navigate('/dashboard');
      } else {
        toast({
          title: "Falha no login",
          description: "Email ou senha incorretos",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      toast({
        title: "Erro ao fazer login",
        description: "Verifique suas credenciais e tente novamente",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Função para cadastrar usuário
  const handleCadastro = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validações básicas
    if (!nome || !email || !senha) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor preencha todos os campos obrigatórios",
        variant: "destructive"
      });
      return;
    }
    
    if (senha !== confirmaSenha) {
      toast({
        title: "Senhas não conferem",
        description: "A senha e a confirmação de senha devem ser iguais",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Registrar o usuário usando a função RPC do Supabase
      const { data, error } = await supabase.rpc('registrar_usuario', {
        nome,
        empresa,
        email,
        senha
      });
      
      if (error) throw error;
      
      if (data) {
        // Preparar os dados do usuário para enviar ao webhook
        const dadosUsuario = {
          nome,
          empresa,
          email,
          data_cadastro: new Date().toISOString(),
          origem: window.location.origin,
        };
        
        // Enviar dados do usuário para o webhook
        await enviarDadosParaWebhook(dadosUsuario);
        
        toast({
          title: "Cadastro realizado",
          description: "Sua conta foi criada com sucesso!"
        });
        
        // Fazer login automaticamente após o cadastro
        const { data: loginData, error: loginError } = await supabase.rpc('autenticar_usuario', {
          email_login: email,
          senha_login: senha
        });
        
        if (loginError) throw loginError;
        
        if (loginData) {
          localStorage.setItem('autenticado', 'true');
          localStorage.setItem('userId', loginData);
          localStorage.setItem('userEmail', email);
          localStorage.setItem('userName', nome);
          
          // Redirecionamento para o dashboard após cadastro bem-sucedido
          navigate('/dashboard');
        }
      }
    } catch (error: any) {
      console.error("Erro ao cadastrar:", error);
      toast({
        title: "Erro no cadastro",
        description: error.message || "Não foi possível completar o cadastro",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">Finanças Pessoais</CardTitle>
          <CardDescription>Gerencie suas finanças de forma simples e eficiente</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="cadastro">Cadastro</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Input
                    id="login-email"
                    placeholder="Email"
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    disabled={isLoading}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Input
                    id="login-senha"
                    placeholder="Senha"
                    type="password"
                    value={loginSenha}
                    onChange={(e) => setLoginSenha(e.target.value)}
                    disabled={isLoading}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Entrando..." : "Entrar"}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="cadastro">
              <form onSubmit={handleCadastro} className="space-y-4">
                <div className="space-y-2">
                  <Input
                    id="nome"
                    placeholder="Nome completo"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    disabled={isLoading}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Input
                    id="empresa"
                    placeholder="Empresa (opcional)"
                    value={empresa}
                    onChange={(e) => setEmpresa(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Input
                    id="email"
                    placeholder="Email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Input
                    id="senha"
                    placeholder="Senha"
                    type="password"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    disabled={isLoading}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Input
                    id="confirma-senha"
                    placeholder="Confirme a senha"
                    type="password"
                    value={confirmaSenha}
                    onChange={(e) => setConfirmaSenha(e.target.value)}
                    disabled={isLoading}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Cadastrando..." : "Cadastrar"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <p className="text-sm text-center text-muted-foreground">
            Ao continuar, você concorda com nossos termos de serviço e políticas de privacidade.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Auth;
