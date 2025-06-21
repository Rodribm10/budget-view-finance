
import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react';
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

const AdminFAQ = () => {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [editingFaq, setEditingFaq] = useState<FAQ | null>(null);
  const [formData, setFormData] = useState({
    pergunta: '',
    resposta: '',
    imagem_url: '',
    ativo: true
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadFAQs();
  }, []);

  const loadFAQs = async () => {
    try {
      const { data, error } = await supabase
        .from('faqs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setFaqs(data || []);
    } catch (error) {
      console.error('Erro ao carregar FAQs:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os FAQs.",
        variant: "destructive"
      });
    }
  };

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
      setEditingFaq(null);
      loadFAQs();
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

  const handleEdit = (faq: FAQ) => {
    setEditingFaq(faq);
    setFormData({
      pergunta: faq.pergunta,
      resposta: faq.resposta,
      imagem_url: faq.imagem_url || '',
      ativo: faq.ativo
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este FAQ?')) return;

    try {
      const { error } = await supabase
        .from('faqs')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast({ title: "FAQ excluído com sucesso!" });
      loadFAQs();
    } catch (error) {
      console.error('Erro ao excluir FAQ:', error);
      toast({
        title: "Erro",
        description: "Não foi possível excluir o FAQ.",
        variant: "destructive"
      });
    }
  };

  const toggleStatus = async (faq: FAQ) => {
    try {
      const { error } = await supabase
        .from('faqs')
        .update({ ativo: !faq.ativo })
        .eq('id', faq.id);

      if (error) throw error;
      toast({ title: `FAQ ${!faq.ativo ? 'ativado' : 'desativado'} com sucesso!` });
      loadFAQs();
    } catch (error) {
      console.error('Erro ao alterar status:', error);
      toast({
        title: "Erro",
        description: "Não foi possível alterar o status do FAQ.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">Gerenciar FAQs</h1>

      {/* Formulário */}
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
                  onClick={() => {
                    setEditingFaq(null);
                    setFormData({ pergunta: '', resposta: '', imagem_url: '', ativo: true });
                  }}
                >
                  Cancelar
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Lista de FAQs */}
      <Card>
        <CardHeader>
          <CardTitle>FAQs Cadastrados</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {faqs.map((faq) => (
              <div key={faq.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="font-medium mb-2">{faq.pergunta}</h3>
                    <div 
                      className="text-sm text-gray-600 mb-2"
                      dangerouslySetInnerHTML={{ __html: faq.resposta.substring(0, 200) + '...' }}
                    />
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span>Status: {faq.ativo ? 'Ativo' : 'Inativo'}</span>
                      <span>•</span>
                      <span>{new Date(faq.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleStatus(faq)}
                    >
                      {faq.ativo ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(faq)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(faq.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminFAQ;
