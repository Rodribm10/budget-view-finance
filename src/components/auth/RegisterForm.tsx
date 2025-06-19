
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
      console.log(`🔐 Iniciando cadastro para: ${email}`);
      
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
        console.error('❌ Erro no cadastro Supabase:', error);
        toast.error("Erro no cadastro", {
          description: error.message || "Não foi possível completar o cadastro. Por favor, tente novamente.",
        });
      } else if (data.user) {
        // This condition (empty identities) indicates that the user already exists in Supabase Auth.
        // In this case, `signUp` resends the confirmation/invitation email.
        if (data.user.identities && data.user.identities.length === 0) {
          console.log('👤 Usuário já existe, reenviando confirmação');
          toast.info("E-mail já cadastrado. Verifique sua caixa de entrada!", {
            description: "Enviamos um novo link para você definir sua senha e acessar sua conta. Não se esqueça de checar a pasta de spam.",
            duration: 10000,
          });
        } else {
          console.log('✅ Novo usuário cadastrado com sucesso');
          toast.success("Cadastro realizado com sucesso!", {
            description: "Enviamos um link de confirmação para o seu e-mail. Por favor, verifique sua caixa de entrada e spam para ativar sua conta.",
            duration: 10000,
          });
          
          // Create n8n workflow for the new user - CRITICAL STEP
          console.log('🔄 Iniciando criação de workflow n8n...');
          
          try {
            const workflowResult = await createN8nWorkflowForUser(email, N8N_WORKFLOW_TEMPLATE);
            if (workflowResult) {
              console.log('✅ Workflow n8n criado com sucesso:', workflowResult);
              toast.success("Workflow configurado!", {
                description: "Seu workflow financeiro foi configurado automaticamente.",
                duration: 5000,
              });
            } else {
              console.error('❌ Falha na criação do workflow n8n');
              toast.error("Aviso: Workflow", {
                description: "Cadastro realizado, mas houve falha na configuração do workflow financeiro.",
                duration: 8000,
              });
            }
          } catch (workflowError) {
            console.error('❌ Erro na criação do workflow n8n:', workflowError);
            toast.error("Aviso: Workflow", {
              description: "Cadastro realizado, mas houve falha na configuração do workflow financeiro.",
              duration: 8000,
            });
          }
        }
      }
    } catch (error) {
      console.error('❌ Erro geral durante cadastro:', error);
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
