
import { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, ThumbsUp, ThumbsDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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

const FAQList = () => {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadFAQs();
  }, []);

  const loadFAQs = async () => {
    try {
      const { data, error } = await supabase
        .from('faqs')
        .select('*')
        .eq('ativo', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setFaqs(data || []);
    } catch (error) {
      console.error('Erro ao carregar FAQs:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as perguntas frequentes.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  const handleFeedback = async (faqId: string, helpful: boolean) => {
    try {
      const { error } = await supabase
        .from('faq_feedback')
        .insert({
          faq_id: faqId,
          helpful: helpful,
          user_id: (await supabase.auth.getUser()).data.user?.id
        });

      if (error) throw error;

      toast({
        title: "Obrigado!",
        description: "Seu feedback foi registrado com sucesso.",
      });
    } catch (error) {
      console.error('Erro ao enviar feedback:', error);
      toast({
        title: "Erro",
        description: "Não foi possível registrar seu feedback.",
        variant: "destructive"
      });
    }
  };

  const filteredFAQs = faqs.filter(faq =>
    faq.pergunta.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.resposta.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="text-center py-8">Carregando perguntas frequentes...</div>;
  }

  return (
    <div className="space-y-4">
      <Input
        placeholder="Buscar assunto..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full"
      />

      <div className="space-y-3">
        {filteredFAQs.map((faq) => (
          <div key={faq.id} className="border rounded-lg overflow-hidden">
            <button
              onClick={() => toggleExpanded(faq.id)}
              className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center justify-between"
            >
              <span className="font-medium">{faq.pergunta}</span>
              {expandedItems.has(faq.id) ? (
                <ChevronUp className="h-5 w-5" />
              ) : (
                <ChevronDown className="h-5 w-5" />
              )}
            </button>
            
            {expandedItems.has(faq.id) && (
              <div className="px-4 py-3 border-t bg-gray-50">
                <div className="space-y-3">
                  <div dangerouslySetInnerHTML={{ __html: faq.resposta }} />
                  
                  {faq.imagem_url && (
                    <img 
                      src={faq.imagem_url} 
                      alt="Imagem de apoio"
                      className="max-w-full h-auto rounded-lg"
                    />
                  )}
                  
                  <div className="flex items-center gap-2 pt-3 border-t">
                    <span className="text-sm text-gray-600">Esta resposta foi útil?</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleFeedback(faq.id, true)}
                      className="flex items-center gap-1"
                    >
                      <ThumbsUp className="h-4 w-4" />
                      Sim
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleFeedback(faq.id, false)}
                      className="flex items-center gap-1"
                    >
                      <ThumbsDown className="h-4 w-4" />
                      Não
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredFAQs.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          {searchTerm ? 'Nenhuma pergunta encontrada para sua busca.' : 'Nenhuma pergunta disponível no momento.'}
        </div>
      )}
    </div>
  );
};

export default FAQList;
