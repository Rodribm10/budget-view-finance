
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { enviarDadosParaWebhook } from '@/utils/webhookService';
import { Label } from '@/components/ui/label';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

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
  const [whatsapp, setWhatsapp] = useState('55');
  const [senha, setSenha] = useState('');
  const [confirmaSenha, setConfirmaSenha] = useState('');

  // Função para formatar o WhatsApp
  const formatarWhatsapp = (valor: string) => {
    // Remove todos os caracteres não numéricos
    let nums = valor.replace(/\D/g, '');
    
    // Garante que sempre começa com 55 (código do Brasil)
    if (!nums.startsWith('55')) {
      nums = '55' + nums;
    }
    
    // Formata com parênteses para o DDD
    if (nums.length > 7) {
      return `${nums.slice(0, 2)}(${nums.slice(2, 4)})${nums.slice(4)}`;
    } else if (nums.length > 4) {
      return `${nums.slice(0, 2)}(${nums.slice(2)}`;
    }
    
    return nums;
  };

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
      // Removemos formatação antes de enviar para o banco
      const whatsappLimpo = whatsapp.replace(/\D/g, '');
      
      const { data, error } = await supabase.rpc('registrar_usuario', {
        nome,
        empresa,
        email,
        senha,
        whatsapp: whatsappLimpo
      });
      
      if (error) throw error;
      
      if (data) {
        // Preparar os dados do usuário para enviar ao webhook
        const dadosUsuario = {
          nome,
          empresa,
          email,
          whatsapp: whatsappLimpo,
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
          localStorage.setItem('userWhatsapp', whatsappLimpo);
          
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
        <Label htmlFor="nome">Nome completo</Label>
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
        <Label htmlFor="empresa">Empresa (opcional)</Label>
        <Input
          id="empresa"
          placeholder="Empresa (opcional)"
          value={empresa}
          onChange={(e) => setEmpresa(e.target.value)}
          disabled={isLoading}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
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
        <Label htmlFor="whatsapp">WhatsApp (com DDD)</Label>
        <Input
          id="whatsapp"
          placeholder="55(11)999999999"
          type="tel"
          value={whatsapp}
          onChange={(e) => setWhatsapp(formatarWhatsapp(e.target.value))}
          disabled={isLoading}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="senha">Senha</Label>
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
        <Label htmlFor="confirma-senha">Confirme a senha</Label>
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
