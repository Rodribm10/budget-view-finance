
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { enviarDadosParaWebhook } from '@/utils/webhookService';

interface RegisterFormProps {
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
}

const RegisterForm = ({ isLoading, setIsLoading }: RegisterFormProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Estado do formulário de cadastro
  const [nome, setNome] = useState('');
  const [empresa, setEmpresa] = useState('');
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmaSenha, setConfirmaSenha] = useState('');

  // Função para cadastrar usuário
  const handleCadastro = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validações básicas
    if (!nome || !email || !senha || !whatsapp) {
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
        senha,
        whatsapp
      });
      
      if (error) throw error;
      
      if (data) {
        // Preparar os dados do usuário para enviar ao webhook
        const dadosUsuario = {
          nome,
          empresa,
          email,
          whatsapp,
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
          localStorage.setItem('userWhatsapp', whatsapp);
          
          // Redirecionamento para a página principal após cadastro bem-sucedido
          navigate('/');
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
          id="whatsapp"
          placeholder="WhatsApp (com DDD)"
          type="tel"
          value={whatsapp}
          onChange={(e) => setWhatsapp(e.target.value)}
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
  );
};

export default RegisterForm;
