
import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import Layout from '@/components/layout/Layout';
import { MetasForm } from '@/components/dashboard/MetasForm';
import { MetaProgressCard } from '@/components/dashboard/MetaProgressCard';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ResultadoMeta } from '@/types/financialTypes';
import { useToast } from '@/components/ui/use-toast';
import { calcularResultadosMetas, getMeta } from '@/services/metasService';
import { PlusCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const MetasPage = () => {
  const { toast } = useToast();
  const [userId, setUserId] = useState<string>('');
  const [resultados, setResultados] = useState<ResultadoMeta[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [metaParaEditar, setMetaParaEditar] = useState<{ mes: number, ano: number } | null>(null);
  const [valorMetaAtual, setValorMetaAtual] = useState(0);

  useEffect(() => {
    // Obter userId armazenado no localStorage
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      setUserId(storedUserId);
      loadData(storedUserId);
    } else {
      // Tentar usar finDashUser como fallback
      const finDashUser = localStorage.getItem('finDashUser');
      if (finDashUser) {
        setUserId(finDashUser);
        loadData(finDashUser);
      } else {
        // Caso não encontre nenhum ID de usuário, usar um ID padrão temporário
        const defaultId = '9f267008-9128-4a2f-b730-de0a0b5602a9';
        localStorage.setItem('userId', defaultId);
        setUserId(defaultId);
        loadData(defaultId);
      }
    }
  }, []);

  const loadData = async (user: string) => {
    try {
      setIsLoading(true);
      const resultado = await calcularResultadosMetas(user);
      setResultados(resultado);
    } catch (error) {
      console.error('Erro ao carregar metas:', error);
      toast({
        title: 'Erro ao carregar metas',
        description: 'Não foi possível obter os dados de metas',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditarMeta = async (mes: number, ano: number) => {
    try {
      const meta = await getMeta(userId, mes, ano);
      if (meta) {
        setValorMetaAtual(meta.valor_meta);
        setMetaParaEditar({ mes, ano });
        setIsDialogOpen(true);
      }
    } catch (error) {
      console.error('Erro ao buscar meta para edição:', error);
    }
  };

  const handleNovaMeta = () => {
    setMetaParaEditar(null);
    setValorMetaAtual(0);
    setIsDialogOpen(true);
  };

  const handleSuccess = () => {
    setIsDialogOpen(false);
    loadData(userId);
  };

  const getMesAtual = () => {
    const now = new Date();
    return {
      mes: now.getMonth() + 1,
      ano: now.getFullYear(),
      nome: format(now, 'MMMM', { locale: ptBR }),
    };
  };

  const mesAtual = getMesAtual();

  // Agrupar por ano (objeto com chave = ano e valor = array de metas daquele ano)
  const resultadosPorAno = resultados.reduce((acc, meta) => {
    if (!acc[meta.ano]) {
      acc[meta.ano] = [];
    }
    acc[meta.ano].push(meta);
    return acc;
  }, {} as Record<number, ResultadoMeta[]>);

  // Ordenar os anos de forma decrescente
  const anosOrdenados = Object.keys(resultadosPorAno)
    .map(Number)
    .sort((a, b) => b - a);

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-tight">Metas de Economia</h1>
          <Button
            className="flex items-center gap-2 bg-finance-blue hover:bg-finance-blue/90"
            onClick={handleNovaMeta}
          >
            <PlusCircle className="h-4 w-4" />
            Nova Meta
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-10">
            <div className="text-center">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
              <p className="mt-4 text-muted-foreground">Carregando suas metas...</p>
            </div>
          </div>
        ) : resultados.length === 0 ? (
          <Card className="flex flex-col items-center justify-center py-10 px-4 text-center">
            <h3 className="text-xl font-semibold mb-2">Nenhuma meta definida</h3>
            <p className="text-muted-foreground mb-6">
              Defina sua primeira meta de economia para {mesAtual.nome} {mesAtual.ano}
            </p>
            <Button onClick={handleNovaMeta}>
              <PlusCircle className="h-4 w-4 mr-2" />
              Definir Meta
            </Button>
          </Card>
        ) : (
          <>
            {anosOrdenados.map(ano => (
              <div key={ano} className="space-y-3">
                <h2 className="text-xl font-semibold">{ano}</h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {resultadosPorAno[ano]
                    .sort((a, b) => b.mes - a.mes)
                    .map(meta => (
                      <MetaProgressCard
                        key={`${meta.ano}-${meta.mes}`}
                        meta={meta}
                        onEditClick={() => handleEditarMeta(meta.mes, meta.ano)}
                      />
                    ))}
                </div>
              </div>
            ))}
          </>
        )}

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>
                {metaParaEditar ? 'Editar Meta' : 'Nova Meta'}
              </DialogTitle>
              <DialogDescription>
                {metaParaEditar
                  ? 'Atualize os valores da sua meta de economia.'
                  : 'Defina uma nova meta de economia mensal.'}
              </DialogDescription>
            </DialogHeader>
            <MetasForm
              onSuccess={handleSuccess}
              onCancel={() => setIsDialogOpen(false)}
              userId={userId}
              valorInicial={metaParaEditar ? valorMetaAtual : 0}
              mesInicial={metaParaEditar?.mes}
              anoInicial={metaParaEditar?.ano}
            />
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default MetasPage;
