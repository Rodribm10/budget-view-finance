
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
import ContactFormFileUpload from './ContactFormFileUpload';

interface FormData {
  assunto: string;
  motivo: string;
  mensagem: string;
  anexo: File | null;
}

interface ContactFormFieldsProps {
  formData: FormData;
  setFormData: (data: FormData) => void;
  loading: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

const ContactFormFields = ({ formData, setFormData, loading, onSubmit }: ContactFormFieldsProps) => {
  const { toast } = useToast();

  const motivosContato = [
    'Dúvida sobre funcionalidade',
    'Problema técnico',
    'Sugestão de melhoria',
    'Reclamação',
    'Elogio',
    'Outros'
  ];

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
    <form onSubmit={onSubmit} className="space-y-4">
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

      <ContactFormFileUpload 
        anexo={formData.anexo}
        onFileChange={handleFileChange}
        onRemoveFile={removeFile}
      />

      <Button 
        type="submit" 
        disabled={loading}
        className="w-full bg-green-600 hover:bg-green-700"
      >
        {loading ? 'Enviando...' : 'Enviar mensagem'}
      </Button>
    </form>
  );
};

export default ContactFormFields;
