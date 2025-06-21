
import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, EyeOff, BarChart3 } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingFaq, setEditingFaq] = useState<FAQ | null>(null);
  const [showStats, setShowStats] = useState(false);
  const [stats, setStats] = useState<any>({});
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    pergunta: '',
    resposta: '',
    imagem_url: '',
    ativo: true
  });

  useEffect(() => {
    loadFAQs();
    loadStats();
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
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const { data, error } = await supabase
        .from('faq_feedback')
        .select(`
          faq_id,
          helpful,
          faqs (pergunta)
        `);

      if (error) throw error;

      const statsData = data?.reduce((acc: any, feedback: any) => {
        const faqId = feedback.faq_id;
        if (!acc[faqId]) {
          acc[faqId] = {
            pergunta: feedback.faqs?.pergunta || 'FAQ não encontrado',
            helpful: 0,
            notHelpful: 0,
            total: 0
          };
        }
        
        if (feedback.helpful) {
          acc[faqId].helpful++;
        } else {
          acc[faqId].notHelpful++;
        }
        acc[faqId].total++;
        return acc;
      }, {});

      setStats(statsData || {});
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.pergunta || !formData.resposta) {
      toast({
        title: "Erro",
        description: "Pergunta e resposta são obrigatórias.",
        variant: "destructive"
      });
      return;
    }

    try {
      if (editingFaq) {
        const { error } = await supabase
          .from('faqs')
          .update(formData)
          .eq('id', editingFaq.id);

        if (error) throw error;
        toast({ title: "FAQ atualizado com sucesso!" });
      } else {
        const { error } = await supabase
          .from('faqs')
          .insert(formData);

        if (error) throw error;
        toast({ title: "FAQ criado com sucesso!" });
      }

      resetForm();
      loadFAQs();
    } catch (error) {
      console.error('Erro ao salvar FAQ:', error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar o FAQ.",
        variant: "destructive"
      });
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
    setShowForm(true);
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

  const handleToggleActive = async (id: string, ativo: boolean) => {
    try {
      const { error } = await supabase
        .from('faqs')
        .update({ ativo: !ativo })
        .eq('id', id);

      if (error) throw error;
      toast({ title: `FAQ ${!ativo ? 'ativado' : 'desativado'} com sucesso!` });
      loadFAQs();
    } catch (error) {
      console.error('Erro ao alterar status:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      pergunta: '',
      resposta: '',
      imagem_url: '',
      ativo: true
    });
    setEditingFaq(null);
    setShowForm(false);
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Gerenciar FAQs</h1>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setShowStats(true)}
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Estatísticas
            </Button>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Novo FAQ
            </Button>
          </div>
        </div>

        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Pergunta</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {faqs.map((faq) => (
                <TableRow key={faq.id}>
                  <TableCell className="max-w-md">
                    <div className="truncate">{faq.pergunta}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={faq.ativo ? "success" : "secondary"}>
                      {faq.ativo ? 'Ativo' : 'Inativo'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(faq.created_at).toLocaleDateString('pt-BR')}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(faq)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleToggleActive(faq.id, faq.ativo)}
                      >
                        {faq.ativo ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(faq.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Form Dialog */}
        <Dialog open={showForm} onOpenChange={setShowForm}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingFaq ? 'Editar FAQ' : 'Novo FAQ'}
              </DialogTitle>
            </DialogHeader>
            
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
                  type="url"
                  value={formData.imagem_url}
                  onChange={(e) => setFormData({ ...formData, imagem_url: e.target.value })}
                  placeholder="https://exemplo.com/imagem.jpg"
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="ativo"
                  checked={formData.ativo}
                  onChange={(e) => setFormData({ ...formData, ativo: e.target.checked })}
                />
                <Label htmlFor="ativo">FAQ ativo</Label>
              </div>

              <div className="flex gap-2">
                <Button type="submit">
                  {editingFaq ? 'Atualizar' : 'Criar'}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancelar
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* Stats Dialog */}
        <Dialog open={showStats} onOpenChange={setShowStats}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Estatísticas dos FAQs</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              {Object.entries(stats).map(([faqId, data]: [string, any]) => (
                <div key={faqId} className="border rounded-lg p-4">
                  <h3 className="font-medium mb-2">{data.pergunta}</h3>
                  <div className="flex gap-4 text-sm">
                    <span className="text-green-600">
                      👍 Útil: {data.helpful} ({Math.round((data.helpful / data.total) * 100)}%)
                    </span>
                    <span className="text-red-600">
                      👎 Não útil: {data.notHelpful} ({Math.round((data.notHelpful / data.total) * 100)}%)
                    </span>
                    <span className="text-gray-600">Total: {data.total}</span>
                  </div>
                </div>
              ))}
              
              {Object.keys(stats).length === 0 && (
                <p className="text-center text-gray-500 py-8">
                  Nenhum feedback registrado ainda.
                </p>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default AdminFAQ;
