
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { formatarWhatsapp } from '@/utils/whatsappFormatter';
import { validateRegisterForm } from '@/utils/registerValidation';
import RegisterFormFields from './RegisterFormFields';
import { supabase } from '@/integrations/supabase/client';
import { toast } from "sonner";

interface RegisterFormProps {
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
}

const RegisterForm = ({ isLoading, setIsLoading }: RegisterFormProps) => {
  const [nome, setNome] = useState('');
  const [empresa, setEmpresa] = useState('');
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('55');
  const [senha, setSenha] = useState('');
  const [confirmaSenha, setConfirmaSenha] = useState('');

  const handleCadastro = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationError = validateRegisterForm({
      nome,
      empresa,
      email,
      whatsapp,
      senha,
      confirmaSenha
    });
    
    if (validationError) {
      toast.error("Campos obrigatórios", { description: validationError });
      return;
    }
    
    setIsLoading(true);
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password: senha,
      options: {
        emailRedirectTo: `${window.location.origin}/`,
        data: {
          nome,
          empresa: empresa || null,
          whatsapp: whatsapp.replace(/\D/g, ''),
        }
      }
    });

    setIsLoading(false);

    if (error) {
       toast.error("Erro no cadastro", {
        description: error.message || "Não foi possível completar o cadastro. O e-mail já pode estar em uso.",
      });
    } else if (data.user) {
        if (data.user.identities && data.user.identities.length === 0) {
             toast.error("Erro no cadastro", {
                description: "Este e-mail já está em uso. Tente fazer login.",
            });
        } else {
            toast.success("Cadastro realizado com sucesso!", {
                description: "Enviamos um link de confirmação para o seu e-mail. Por favor, verifique sua caixa de entrada e spam.",
                duration: 10000,
            });
        }
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
