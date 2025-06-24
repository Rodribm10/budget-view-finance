
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { MetaFinanceira } from '@/types/financialTypes';
import { getMetas } from '@/services/metasService';
import { useToast } from '@/hooks/use-toast';
import MetaForm from '@/components/metas/MetaForm';
import MetaCard from '@/components/metas/MetaCard';

const MetasPage = () => {
  const [metas, setMetas] = useState<MetaFinanceira[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingMeta, setEditingMeta] = useState<MetaFinanceira | null>(null);
  const { toast } = useToast();

  const loadMetas = async () => {
    try {
      setIsLoading(true);
      const data = await getMetas();
      setMetas(data);
    } catch (error) {
      console.error('Erro ao carregar metas:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar suas metas',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadMetas();
  }, []);

  const handleMetaSuccess = () => {
    loadMetas();
    setShowForm(false);
    setEditingMeta(null);
    toast({
      title: 'Sucesso',
      description: editingMeta ? 'Meta atualizada com sucesso' : 'Meta criada com sucesso',
    });
  };

  const handleEditMeta = (meta: MetaFinanceira) => {
    setEditingMeta(meta);
    setShowForm(true);
  };

  const handleDeleteSuccess = () => {
    loadMetas();
    toast({
      title: 'Sucesso',
      description: 'Meta excluída com sucesso',
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Metas Financeiras</h1>
          <p className="text-gray-600 mt-2">Defina e acompanhe seus objetivos financeiros</p>
        </div>
        <Button 
          onClick={() => setShowForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nova Meta
        </Button>
      </div>

      {showForm && (
        <MetaForm 
          meta={editingMeta}
          onSuccess={handleMetaSuccess}
          onCancel={() => {
            setShowForm(false);
            setEditingMeta(null);
          }}
        />
      )}

      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="h-3 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : metas.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center">
            <div className="text-gray-400 mb-4">
              <Plus className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma meta cadastrada</h3>
            <p className="text-gray-600 mb-4">Comece criando sua primeira meta financeira</p>
            <Button 
              onClick={() => setShowForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Criar primeira meta
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {metas.map((meta) => (
            <MetaCard
              key={meta.id}
              meta={meta}
              onEdit={handleEditMeta}
              onDeleteSuccess={handleDeleteSuccess}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MetasPage;
