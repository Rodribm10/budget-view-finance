
import { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getCategorySummary } from '@/services/transacaoService';
import { CategorySummary } from '@/types/financialTypes';
import { useToast } from "@/components/ui/use-toast";
import { Progress } from "@/components/ui/progress";

const CategoriasPage = () => {
  const [categories, setCategories] = useState<CategorySummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    async function loadCategories() {
      try {
        setIsLoading(true);
        console.log("Carregando dados de categorias...");
        const data = await getCategorySummary();
        console.log(`${data.length} categorias carregadas com sucesso`);
        setCategories(data);
      } catch (error) {
        console.error("Erro ao carregar categorias:", error);
        toast({
          title: "Erro ao carregar categorias",
          description: "Não foi possível obter os dados do Supabase",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    }
    
    loadCategories();
  }, [toast]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-tight">Categorias de Despesas</h1>
        </div>

        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader className="pb-2">
                  <div className="h-5 bg-muted rounded w-1/2"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-4 bg-muted rounded w-1/4 mb-3"></div>
                  <div className="h-2 bg-muted rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : categories.length === 0 ? (
          <Card>
            <CardContent className="py-10 text-center">
              <p className="text-muted-foreground">Nenhuma categoria encontrada</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => (
              <Card key={category.categoria}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center">
                    <span
                      className="w-3 h-3 rounded-full mr-2"
                      style={{ backgroundColor: category.color }}
                    />
                    {category.categoria}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold mb-2">
                    {formatCurrency(category.valor)}
                  </div>
                  <div className="space-y-2">
                    <Progress 
                      value={category.percentage * 100} 
                      className="h-2"
                      indicatorColor={category.color}
                    />
                    <div className="text-xs text-muted-foreground">
                      {(category.percentage * 100).toFixed(1)}% do total de despesas
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default CategoriasPage;
