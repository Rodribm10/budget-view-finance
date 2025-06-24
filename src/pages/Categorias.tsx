
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { SimpleCard } from "@/components/ui/simple-card";

interface Categoria {
  id: string;
  nome: string;
  tipo: 'receita' | 'despesa';
  cor: string;
  total?: number;
}

const Categorias = () => {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Mock data - replace with actual API calls
  useEffect(() => {
    const mockCategorias: Categoria[] = [
      { id: '1', nome: 'Alimentação', tipo: 'despesa', cor: '#ef4444', total: 850.50 },
      { id: '2', nome: 'Transporte', tipo: 'despesa', cor: '#f97316', total: 420.30 },
      { id: '3', nome: 'Lazer', tipo: 'despesa', cor: '#eab308', total: 300.00 },
      { id: '4', nome: 'Salário', tipo: 'receita', cor: '#22c55e', total: 5000.00 },
      { id: '5', nome: 'Freelance', tipo: 'receita', cor: '#10b981', total: 1200.00 },
      { id: '6', nome: 'Educação', tipo: 'despesa', cor: '#3b82f6', total: 450.00 },
    ];
    
    setTimeout(() => {
      setCategorias(mockCategorias);
      setIsLoading(false);
    }, 1000);
  }, []);

  const filteredCategorias = categorias.filter(categoria =>
    categoria.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const receitas = filteredCategorias.filter(cat => cat.tipo === 'receita');
  const despesas = filteredCategorias.filter(cat => cat.tipo === 'despesa');

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const handleEdit = (categoria: Categoria) => {
    toast({
      title: "Editar categoria",
      description: `Função de edição para ${categoria.nome} será implementada`,
    });
  };

  const handleDelete = (categoria: Categoria) => {
    toast({
      title: "Excluir categoria",
      description: `Função de exclusão para ${categoria.nome} será implementada`,
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Categorias</h1>
          <Button disabled>
            <Plus className="h-4 w-4 mr-2" />
            Nova Categoria
          </Button>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-muted rounded w-3/4"></div>
              </CardHeader>
              <CardContent>
                <div className="h-6 bg-muted rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-muted rounded w-full"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Categorias</h1>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Nova Categoria
        </Button>
      </div>

      <SimpleCard className="border-gray-200">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar categorias..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </SimpleCard>

      <div className="grid gap-6 md:grid-cols-2">
        <SimpleCard title="Receitas" className="border-green-200">
          <div className="space-y-3">
            {receitas.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                Nenhuma categoria de receita encontrada
              </p>
            ) : (
              receitas.map((categoria) => (
                <div
                  key={categoria.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: categoria.cor }}
                    />
                    <div>
                      <p className="font-medium">{categoria.nome}</p>
                      <p className="text-sm text-muted-foreground">
                        {categoria.total ? formatCurrency(categoria.total) : 'R$ 0,00'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      {categoria.tipo}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(categoria)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(categoria)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </SimpleCard>

        <SimpleCard title="Despesas" className="border-red-200">
          <div className="space-y-3">
            {despesas.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                Nenhuma categoria de despesa encontrada
              </p>
            ) : (
              despesas.map((categoria) => (
                <div
                  key={categoria.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: categoria.cor }}
                    />
                    <div>
                      <p className="font-medium">{categoria.nome}</p>
                      <p className="text-sm text-muted-foreground">
                        {categoria.total ? formatCurrency(categoria.total) : 'R$ 0,00'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary" className="bg-red-100 text-red-800">
                      {categoria.tipo}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(categoria)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(categoria)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </SimpleCard>
      </div>
    </div>
  );
};

export default Categorias;
