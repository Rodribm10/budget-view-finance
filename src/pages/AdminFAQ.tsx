
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import AdminFAQForm from '@/components/admin/AdminFAQForm';
import AdminFAQList from '@/components/admin/AdminFAQList';

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

  const handleFormSuccess = () => {
    setEditingFaq(null);
    loadFAQs();
  };

  const handleCancelEdit = () => {
    setEditingFaq(null);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">Gerenciar FAQs</h1>

      <AdminFAQForm 
        editingFaq={editingFaq}
        onSuccess={handleFormSuccess}
        onCancel={handleCancelEdit}
      />

      <AdminFAQList 
        faqs={faqs}
        onEdit={setEditingFaq}
        onUpdate={loadFAQs}
      />
    </div>
  );
};

export default AdminFAQ;
