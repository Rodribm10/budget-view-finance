
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { formatarWhatsapp } from '@/utils/whatsappFormatter';
import { validateRegisterForm } from '@/utils/registerValidation';
import RegisterFormFields from './RegisterFormFields';
import { supabase } from '@/integrations/supabase/client';
import { toast } from "sonner";
import { sendNewUserWebhook } from '@/services/newUserWebhookService';

interface RegisterFormProps {
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
}

const RegisterForm = ({ isLoading, setIsLoading }: RegisterFormProps) => {
  const navigate = useNavigate();
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
          
          // Send webhook to n8n workflow manager in background
          console.log('📡 Enviando webhook para gerenciador n8n...');
          console.log('📋 Email do usuário:', email);
          console.log('📋 ID do usuário:', data.user.id);
          console.log('📋 WhatsApp do usuário:', whatsapp);
          
          // Send webhook in background (don't wait for it)
          sendNewUserWebhook(email, data.user.id, whatsapp.replace(/\D/g, ''))
            .then((success) => {
              if (success) {
                console.log('✅ Webhook enviado com sucesso para n8n');
              } else {
                console.error('❌ Falha no envio do webhook para n8n');
              }
            })
            .catch((error) => {
              console.error('❌ Erro crítico no webhook para n8n:', error);
            });
          
          // Redirect to login page with success message
          navigate('/auth', { 
            state: { 
              showSuccessMessage: true,
              message: "✅ Cadastro realizado com sucesso! Agora, faça o login com o e-mail e a senha que você acabou de criar." 
            } 
          });
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
