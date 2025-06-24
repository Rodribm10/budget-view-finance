
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { getCategorySummary } from '@/services/transacao';
import { CategorySummary } from '@/types/financialTypes';
import { useToast } from "@/components/ui/use-toast";
import { Progress } from "@/components/ui/progress";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const CategoriasPage = () => {
  const [categories, setCategories] = useState<CategorySummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [tipoFiltro, setTipoFiltro] = useState<string>('despesa');
  const { toast } = useToast();

  // Atualizar o userId no localStorage para garantir consistência
  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    const finDashUser = localStorage.getItem('finDashUser');
    
    if (!storedUserId && finDashUser) {
      localStorage.setItem('userId', finDashUser);
    } else if (!storedUserId && !finDashUser) {
      const defaultId = '9f267008-9128-4a2f-b730-de0a0b5602a9';
      localStorage.setItem('userId', defaultId);
    }
  }, []);

  const loadCategories = async (tipo: string) => {
    try {
      setIsLoading(true);
      console.log(`Carregando dados de categorias para ${tipo}...`);
      const data = await getCategorySummary(tipo);
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
  };

  useEffect(() => {
    loadCategories(tipoFiltro);
  }, [tipoFiltro, toast]);

  const handleTipoChange = (value: string) => {
    setTipoFiltro(value);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };
  
  const totalGastos = categories.reduce((total, category) => total + category.valor, 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Categorias</h1>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Filtrar por:</span>
          <Select value={tipoFiltro} onValueChange={handleTipoChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Tipo de transação" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="despesa">Despesas</SelectItem>
              <SelectItem value="receita">Receitas</SelectItem>
              <SelectItem value="all">Todos</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="pb-2">
                  <div className="h-5 bg-muted rounded w-1/2"></div>
                </div>
                <div>
                  <div className="h-4 bg-muted rounded w-1/4 mb-3"></div>
                  <div className="h-2 bg-muted rounded"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : categories.length === 0 ? (
        <Card>
          <CardContent className="p-6">
            <div className="py-10 text-center">
              <p className="text-muted-foreground">Nenhuma categoria encontrada</p>
              <p className="mt-2 text-sm">
                {tipoFiltro === 'despesa' 
                  ? 'Verifique se existem transações do tipo "despesa" cadastradas'
                  : tipoFiltro === 'receita' 
                    ? 'Verifique se existem transações do tipo "receita" cadastradas'
                    : 'Verifique se existem transações cadastradas'}
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => (
              <Card key={category.categoria}>
                <CardContent className="p-6">
                  <div className="pb-2">
                    <div className="text-base flex items-center font-semibold">
                      <span
                        className="w-3 h-3 rounded-full mr-2"
                        style={{ backgroundColor: category.color }}
                      />
                      {category.categoria}
                    </div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold mb-2">
                      {formatCurrency(category.valor)}
                    </div>
                    <div className="space-y-2">
                      <Progress 
                        value={category.percentage * 100} 
                        className="h-2"
                        style={{ 
                          backgroundColor: 'rgba(0,0,0,0.1)',  
                          '--progress-background': category.color 
                        } as React.CSSProperties}
                      />
                      <div className="text-xs text-muted-foreground">
                        {(category.percentage * 100).toFixed(1)}% do total
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <Card className="mt-6">
            <CardContent className="p-6">
              <div>
                <h3 className="text-xl font-bold mb-4">Resumo de Categorias {tipoFiltro !== 'all' ? (tipoFiltro === 'despesa' ? '(Despesas)' : '(Receitas)') : ''}</h3>
              </div>
              <div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Categoria</TableHead>
                      <TableHead>Valor</TableHead>
                      <TableHead>Percentual</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {categories.map((category) => (
                      <TableRow key={category.categoria}>
                        <TableCell className="font-medium flex items-center">
                          <span
                            className="w-3 h-3 rounded-full mr-2" 
                            style={{ backgroundColor: category.color }}
                          />
                          {category.categoria}
                        </TableCell>
                        <TableCell>{formatCurrency(category.valor)}</TableCell>
                        <TableCell>{(category.percentage * 100).toFixed(1)}%</TableCell>
                      </TableRow>
                    ))}
                    <TableRow className="bg-muted/50">
                      <TableCell className="font-bold">Total</TableCell>
                      <TableCell className="font-bold">{formatCurrency(totalGastos)}</TableCell>
                      <TableCell>100%</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default CategoriasPage;
