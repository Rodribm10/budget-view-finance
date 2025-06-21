
import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
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
          user_id: (await supabase.auth.getUser()).data.user?.id,
          status: 'pendente'
        });

      if (error) throw error;

      toast({
        title: "Mensagem enviada!",
        description: "Você vai receber a resposta no e-mail que cadastrou aqui. Obrigado!",
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
