
import { Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
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

interface AdminFAQListProps {
  faqs: FAQ[];
  onEdit: (faq: FAQ) => void;
  onUpdate: () => void;
}

const AdminFAQList = ({ faqs, onEdit, onUpdate }: AdminFAQListProps) => {
  const { toast } = useToast();

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este FAQ?')) return;

    try {
      const { error } = await supabase
        .from('faqs')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast({ title: "FAQ excluído com sucesso!" });
      onUpdate();
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
      onUpdate();
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
                    onClick={() => onEdit(faq)}
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
  );
};

export default AdminFAQList;
