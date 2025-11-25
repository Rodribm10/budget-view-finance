import { TransacaoImportada } from '@/types/importacaoTypes';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { AlertCircle, TrendingUp, TrendingDown, Copy } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface PreviewTransacoesProps {
  transacoes: TransacaoImportada[];
  onCategoriaChange: (hash: string, categoria: string) => void;
  onSelectionChange: (hash: string, selected: boolean) => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
}

const categorias = [
  'Transporte',
  'Alimentação',
  'Supermercado',
  'Saúde',
  'Educação',
  'Lazer',
  'Moradia',
  'Vestuário',
  'Receita Fixa',
  'Investimentos',
  'Impostos',
  'Outros'
];

export const PreviewTransacoes = ({ 
  transacoes, 
  onCategoriaChange, 
  onSelectionChange,
  onSelectAll,
  onDeselectAll
}: PreviewTransacoesProps) => {
  const novas = transacoes.filter(t => !t.isDuplicada);
  const duplicadas = transacoes.filter(t => t.isDuplicada);
  const selecionadas = novas.filter(t => t.selecionada);
  const totalEntradas = selecionadas.filter(t => t.tipo === 'entrada').reduce((sum, t) => sum + t.valor, 0);
  const totalSaidas = selecionadas.filter(t => t.tipo === 'saida').reduce((sum, t) => sum + t.valor, 0);
  const todasSelecionadas = novas.length > 0 && novas.every(t => t.selecionada);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('pt-BR');
  };

  return (
    <div className="space-y-6">
      {/* Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total de Transações</p>
              <p className="text-2xl font-bold">{transacoes.length}</p>
            </div>
            <Copy className="w-8 h-8 text-muted-foreground" />
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            {novas.length} novas | {duplicadas.length} duplicadas
          </p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Entradas</p>
              <p className="text-2xl font-bold text-green-600">{formatCurrency(totalEntradas)}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-600" />
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            {novas.filter(t => t.tipo === 'entrada').length} transações
          </p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Saídas</p>
              <p className="text-2xl font-bold text-red-600">{formatCurrency(totalSaidas)}</p>
            </div>
            <TrendingDown className="w-8 h-8 text-red-600" />
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            {novas.filter(t => t.tipo === 'saida').length} transações
          </p>
        </Card>
      </div>

      {/* Alerta de duplicatas */}
      {duplicadas.length > 0 && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {duplicadas.length} transações duplicadas foram encontradas e serão ignoradas na importação.
          </AlertDescription>
        </Alert>
      )}

      {/* Tabela de transações */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Transações para Importar</h3>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={onSelectAll}
            >
              Selecionar Todas
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={onDeselectAll}
            >
              Desmarcar Todas
            </Button>
          </div>
        </div>
        <div className="max-h-96 overflow-y-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox 
                    checked={todasSelecionadas}
                    onCheckedChange={(checked) => {
                      if (checked) onSelectAll();
                      else onDeselectAll();
                    }}
                  />
                </TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead className="text-right">Valor</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transacoes.map((transacao) => (
                <TableRow 
                  key={transacao.hash_unico}
                  className={transacao.isDuplicada ? 'opacity-50' : ''}
                >
                  <TableCell>
                    <Checkbox
                      checked={transacao.selecionada ?? false}
                      disabled={transacao.isDuplicada}
                      onCheckedChange={(checked) => 
                        onSelectionChange(transacao.hash_unico, checked as boolean)
                      }
                    />
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    {formatDate(transacao.data)}
                  </TableCell>
                  <TableCell className="max-w-xs truncate">
                    {transacao.descricao}
                  </TableCell>
                  <TableCell>
                    {transacao.isDuplicada ? (
                      <span className="text-sm text-muted-foreground">
                        {transacao.categoria}
                      </span>
                    ) : (
                      <Select
                        value={transacao.categoria}
                        onValueChange={(value) => onCategoriaChange(transacao.hash_unico, value)}
                      >
                        <SelectTrigger className="w-40">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {categorias.map((cat) => (
                            <SelectItem key={cat} value={cat}>
                              {cat}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant={transacao.tipo === 'entrada' ? 'default' : 'destructive'}>
                      {transacao.tipo === 'entrada' ? 'Entrada' : 'Saída'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    <span className={transacao.tipo === 'entrada' ? 'text-green-600' : 'text-red-600'}>
                      {formatCurrency(transacao.valor)}
                    </span>
                  </TableCell>
                  <TableCell>
                    {transacao.isDuplicada ? (
                      <Badge variant="secondary">Duplicada</Badge>
                    ) : (
                      <Badge variant="outline">Nova</Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
};
