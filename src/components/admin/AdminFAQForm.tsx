
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface FAQ {
  id: string;
  pergunta: string;
  resposta: string;
  imagem_url?: string;
  ativo: boolean;
  created_at: string;
}

interface AdminFAQFormProps {
  editingFaq: FAQ | null;
  onSuccess: () => void;
  onCancel: () => void;
}

const AdminFAQForm = ({ editingFaq, onSuccess, onCancel }: AdminFAQFormProps) => {
  const [formData, setFormData] = useState({
    pergunta: editingFaq?.pergunta || '',
    resposta: editingFaq?.resposta || '',
    imagem_url: editingFaq?.imagem_url || '',
    ativo: editingFaq?.ativo ?? true
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingFaq) {
        // Atualizar FAQ existente
        const { error } = await supabase
          .from('faqs')
          .update(formData)
          .eq('id', editingFaq.id);

        if (error) throw error;
        toast({ title: "FAQ atualizado com sucesso!" });
      } else {
        // Criar novo FAQ
        const { error } = await supabase
          .from('faqs')
          .insert(formData);

        if (error) throw error;
        toast({ title: "FAQ criado com sucesso!" });
      }

      // Reset form
      setFormData({ pergunta: '', resposta: '', imagem_url: '', ativo: true });
      onSuccess();
    } catch (error) {
      console.error('Erro ao salvar FAQ:', error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar o FAQ.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{editingFaq ? 'Editar FAQ' : 'Criar Novo FAQ'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="pergunta">Pergunta *</Label>
            <Input
              id="pergunta"
              value={formData.pergunta}
              onChange={(e) => setFormData({ ...formData, pergunta: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="resposta">Resposta *</Label>
            <Textarea
              id="resposta"
              value={formData.resposta}
              onChange={(e) => setFormData({ ...formData, resposta: e.target.value })}
              rows={6}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="imagem_url">URL da Imagem (opcional)</Label>
            <Input
              id="imagem_url"
              value={formData.imagem_url}
              onChange={(e) => setFormData({ ...formData, imagem_url: e.target.value })}
              placeholder="https://exemplo.com/imagem.jpg"
            />
          </div>

          <div className="flex items-center gap-4">
            <Button type="submit" disabled={loading}>
              {loading ? 'Salvando...' : editingFaq ? 'Atualizar' : 'Criar'}
            </Button>
            {editingFaq && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
              >
                Cancelar
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default AdminFAQForm;
