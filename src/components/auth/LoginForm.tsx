
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface LoginFormProps {
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
}

const LoginForm = ({ isLoading, setIsLoading }: LoginFormProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // State for login form
  const [loginEmail, setLoginEmail] = useState('');
  const [loginSenha, setLoginSenha] = useState('');
  
  // Function for handling login
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
        // Fetch user details to get the WhatsApp number
        const { data: userData, error: userError } = await supabase
          .from('usuarios')
          .select('nome, email, whatsapp')
          .eq('id', data)
          .single();
          
        if (userError) {
          console.error("Erro ao buscar dados do usuário:", userError);
        }
          
        // Armazenar informações de sessão
        localStorage.setItem('autenticado', 'true');
        localStorage.setItem('userId', data);
        localStorage.setItem('userEmail', loginEmail);
        
        if (userData) {
          localStorage.setItem('userName', userData.nome);
          localStorage.setItem('userWhatsapp', userData.whatsapp);
        }
        
        toast({
          title: "Login realizado com sucesso",
          description: "Bem-vindo de volta!"
        });
        
        // Corrigir o redirecionamento para a rota principal "/"
        navigate('/');
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

  return (
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
  );
};

export default LoginForm;
