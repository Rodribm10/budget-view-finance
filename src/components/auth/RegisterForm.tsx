
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { formatarWhatsapp } from '@/utils/whatsappFormatter';
import { validateRegisterForm } from '@/utils/registerValidation';
import { registerUser, loginAfterRegister } from '@/services/registerService';
import RegisterFormFields from './RegisterFormFields';

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
  const [whatsapp, setWhatsapp] = useState('55()');
  const [senha, setSenha] = useState('');
  const [confirmaSenha, setConfirmaSenha] = useState('');

  // Função para cadastrar usuário
  const handleCadastro = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validações básicas
    const validationError = validateRegisterForm({
      nome,
      empresa,
      email,
      whatsapp,
      senha,
      confirmaSenha
    });
    
    if (validationError) {
      toast({
        title: "Campos obrigatórios",
        description: validationError,
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const { userId, whatsappLimpo } = await registerUser({
        nome,
        empresa,
        email,
        whatsapp,
        senha
      });
      
      toast({
        title: "Cadastro realizado",
        description: "Sua conta foi criada com sucesso!"
      });
      
      // Fazer login automaticamente após o cadastro
      const loginData = await loginAfterRegister(email, senha);
      
      if (loginData) {
        localStorage.setItem('autenticado', 'true');
        localStorage.setItem('userId', loginData);
        localStorage.setItem('userEmail', email);
        localStorage.setItem('userName', nome);
        localStorage.setItem('userWhatsapp', whatsappLimpo);
        
        // Redirecionamento para a página principal após cadastro bem-sucedido
        navigate('/');
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

  const handleWhatsappChange = (value: string) => {
    setWhatsapp(formatarWhatsapp(value));
  };

  return (
    <form onSubmit={handleCadastro} className="space-y-4">
      <RegisterFormFields
        nome={nome}
        setNome={setNome}
        empresa={empresa}
        setEmpresa={setEmpresa}
        email={email}
        setEmail={setEmail}
        whatsapp={whatsapp}
        setWhatsapp={handleWhatsappChange}
        senha={senha}
        setSenha={setSenha}
        confirmaSenha={confirmaSenha}
        setConfirmaSenha={setConfirmaSenha}
        isLoading={isLoading}
      />
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Cadastrando..." : "Cadastrar"}
      </Button>
    </form>
  );
};

export default RegisterForm;
