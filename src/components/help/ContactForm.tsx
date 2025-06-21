
import { useState } from 'react';
import { ArrowLeft, Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

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

  const motivosContato = [
    'Dúvida sobre funcionalidade',
    'Problema técnico',
    'Sugestão de melhoria',
    'Reclamação',
    'Elogio',
    'Outros'
  ];

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validar tamanho (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Arquivo muito grande",
          description: "O arquivo deve ter no máximo 5MB.",
          variant: "destructive"
        });
        return;
      }
      setFormData({ ...formData, anexo: file });
    }
  };

  const removeFile = () => {
    setFormData({ ...formData, anexo: null });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <p className="text-sm text-muted-foreground">
            Você vai receber a resposta no e-mail que cadastrou aqui
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="assunto">Assunto *</Label>
          <Input
            id="assunto"
            placeholder="Digite o assunto da mensagem"
            value={formData.assunto}
            onChange={(e) => setFormData({ ...formData, assunto: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="motivo">Motivo do contato *</Label>
          <Select value={formData.motivo} onValueChange={(value) => setFormData({ ...formData, motivo: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Escolha o motivo do contato" />
            </SelectTrigger>
            <SelectContent>
              {motivosContato.map((motivo) => (
                <SelectItem key={motivo} value={motivo}>
                  {motivo}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="mensagem">Mensagem *</Label>
          <Textarea
            id="mensagem"
            placeholder="Digite sua mensagem"
            value={formData.mensagem}
            onChange={(e) => setFormData({ ...formData, mensagem: e.target.value })}
            rows={5}
            required
          />
        </div>

        <div className="space-y-2">
          <Label>Anexo (opcional)</Label>
          {formData.anexo ? (
            <div className="flex items-center gap-2 p-3 border rounded-lg bg-gray-50">
              <span className="flex-1 text-sm">{formData.anexo.name}</span>
              <Button type="button" variant="ghost" size="sm" onClick={removeFile}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Input
                type="file"
                onChange={handleFileChange}
                accept="image/*,.pdf,.doc,.docx"
                className="hidden"
                id="file-upload"
              />
              <Label
                htmlFor="file-upload"
                className="flex items-center gap-2 px-4 py-2 border rounded-md cursor-pointer hover:bg-gray-50"
              >
                <Upload className="h-4 w-4" />
                Envie uma imagem
              </Label>
            </div>
          )}
          <p className="text-xs text-muted-foreground">
            Formatos aceitos: imagens, PDF, DOC, DOCX (máx. 5MB)
          </p>
        </div>

        <Button 
          type="submit" 
          disabled={loading}
          className="w-full bg-green-600 hover:bg-green-700"
        >
          {loading ? 'Enviando...' : 'Enviar mensagem'}
        </Button>
      </form>
    </div>
  );
};

export default ContactForm;
