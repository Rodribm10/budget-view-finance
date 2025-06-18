
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { formatarWhatsapp } from '@/utils/whatsappFormatter';
import { validateRegisterForm } from '@/utils/registerValidation';
import RegisterFormFields from './RegisterFormFields';
import { supabase } from '@/integrations/supabase/client';
import { toast } from "sonner";
import { createN8nWorkflowForUser } from '@/services/n8nWorkflowCreationService';
import { N8N_WORKFLOW_TEMPLATE } from '@/constants/n8nWorkflowTemplate';

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
    
    try {
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

      if (error) {
        toast.error("Erro no cadastro", {
          description: error.message || "Não foi possível completar o cadastro. Por favor, tente novamente.",
        });
      } else if (data.user) {
        // This condition (empty identities) indicates that the user already exists in Supabase Auth.
        // In this case, `signUp` resends the confirmation/invitation email.
        if (data.user.identities && data.user.identities.length === 0) {
          toast.info("E-mail já cadastrado. Verifique sua caixa de entrada!", {
            description: "Enviamos um novo link para você definir sua senha e acessar sua conta. Não se esqueça de checar a pasta de spam.",
            duration: 10000,
          });
        } else {
          toast.success("Cadastro realizado com sucesso!", {
            description: "Enviamos um link de confirmação para o seu e-mail. Por favor, verifique sua caixa de entrada e spam para ativar sua conta.",
            duration: 10000,
          });
          
          // Create n8n workflow for the new user
          console.log('User registered successfully, creating n8n workflow...');
          
          try {
            const workflowResult = await createN8nWorkflowForUser(email, N8N_WORKFLOW_TEMPLATE);
            if (workflowResult) {
              console.log('N8n workflow created successfully:', workflowResult);
            } else {
              console.error('Failed to create n8n workflow');
            }
          } catch (workflowError) {
            console.error('Error creating n8n workflow:', workflowError);
            // Don't show error to user as the main registration was successful
          }
        }
      }
    } catch (error) {
      console.error('Error during registration:', error);
      toast.error("Erro no cadastro", {
        description: "Ocorreu um erro inesperado. Tente novamente.",
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
