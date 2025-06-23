
import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { enviarFaleConoscoParaWebhook } from '@/services/webhookService';
import ContactFormFields from './ContactFormFields';
import ContactFormHeader from './ContactFormHeader';

interface ContactFormProps {
  onBack: () => void;
}

const ContactForm = ({ onBack }: ContactFormProps) => {
  const [formData, setFormData] = useState({
    assunto: '',
    motivo: '',
    mensagem: '',
    anexo: null as File | null
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.assunto || !formData.motivo || !formData.mensagem) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      let anexoUrl = null;
      let userId = null;
      let userEmail = null;

      // Obter dados do usuário
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        userId = user.id;
        userEmail = user.email;
      }

      // Upload do anexo se existe
      if (formData.anexo) {
        const fileExt = formData.anexo.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('anexos-contato')
          .upload(fileName, formData.anexo);

        if (uploadError) throw uploadError;
        
        const { data: { publicUrl } } = supabase.storage
          .from('anexos-contato')
          .getPublicUrl(fileName);
        
        anexoUrl = publicUrl;
      }

      // Salvar contato no banco
      const { error } = await supabase
        .from('contatos')
        .insert({
          assunto: formData.assunto,
          motivo: formData.motivo,
          mensagem: formData.mensagem,
          anexo_url: anexoUrl,
          user_id: userId,
          status: 'pendente'
        });

      if (error) throw error;

      // Enviar dados para o webhook do N8N
      const webhookData = {
        assunto: formData.assunto,
        motivo: formData.motivo,
        mensagem: formData.mensagem,
        anexo_url: anexoUrl,
        user_id: userId,
        user_email: userEmail,
        data_envio: new Date().toISOString()
      };

      try {
        await enviarFaleConoscoParaWebhook(webhookData);
        console.log("Dados enviados para webhook N8N com sucesso");
      } catch (webhookError) {
        console.error("Erro ao enviar para webhook N8N:", webhookError);
        // Não interrompe o fluxo se o webhook falhar
      }

      toast({
        title: "Mensagem enviada com sucesso!",
        description: "Sua mensagem foi enviada com sucesso. Você receberá uma resposta no e-mail cadastrado. Aguarde nosso retorno!",
      });

      // Reset form
      setFormData({
        assunto: '',
        motivo: '',
        mensagem: '',
        anexo: null
      });

      onBack();

    } catch (error) {
      console.error('Erro ao enviar contato:', error);
      toast({
        title: "Erro",
        description: "Não foi possível enviar sua mensagem. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <ContactFormHeader onBack={onBack} />
      <ContactFormFields 
        formData={formData}
        setFormData={setFormData}
        loading={loading}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default ContactForm;
