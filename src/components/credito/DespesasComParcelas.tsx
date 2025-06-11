
import { useState } from 'react';
import { DespesaCartao } from '@/types/cartaoTypes';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Edit, Trash2, Check, X, CreditCard } from 'lucide-react';
import { formatCurrency } from '@/utils/formatters';

interface DespesasComParcelasProps {
  despesas: DespesaCartao[];
  onEditDespesa: (despesa: DespesaCartao) => void;
  onDeleteDespesa: (id: string) => void;
  onToggleConciliacao: (id: string, status: 'pendente' | 'conciliado' | 'divergente') => void;
}

export function DespesasComParcelas({ 
  despesas, 
  onEditDespesa, 
  onDeleteDespesa, 
  onToggleConciliacao 
}: DespesasComParcelasProps) {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      pendente: 'bg-yellow-100 text-yellow-800',
      conciliado: 'bg-green-100 text-green-800',
      divergente: 'bg-red-100 text-red-800'
    };
    
    return (
      <Badge className={variants[status as keyof typeof variants] || variants.pendente}>
        {status}
      </Badge>
    );
  };

  // Agrupar despesas por despesa pai (para parcelas)
  const despesasAgrupadas = despesas.reduce((acc, despesa) => {
    const chave = despesa.despesa_pai_id || despesa.id;
    if (!acc[chave]) {
      acc[chave] = [];
    }
    acc[chave].push(despesa);
    return acc;
  }, {} as Record<string, DespesaCartao[]>);

  return (
    <div className="space-y-4">
      {Object.entries(despesasAgrupadas).map(([chaveGrupo, grupoDesp]) => {
        const despesaPrincipal = grupoDesp.find(d => !d.despesa_pai_id) || grupoDesp[0];
        const parcelas = grupoDesp.filter(d => d.despesa_pai_id);
        const temParcelas = parcelas.length > 0 || (despesaPrincipal.total_parcelas && despesaPrincipal.total_parcelas > 1);
        const isExpanded = expandedItems.has(chaveGrupo);

        return (
          <Card key={chaveGrupo} className="w-full">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <CreditCard className="h-5 w-5 text-blue-600" />
                  <div>
                    <CardTitle className="text-lg">{despesaPrincipal.descricao}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {new Date(despesaPrincipal.data_despesa).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {getStatusBadge(despesaPrincipal.status_conciliacao || 'pendente')}
                  
                  <div className="text-right">
                    <p className="text-lg font-semibold">
                      {formatCurrency(despesaPrincipal.valor)}
                    </p>
                    {temParcelas && (
                      <p className="text-sm text-muted-foreground">
                        {despesaPrincipal.parcela_atual}/{despesaPrincipal.total_parcelas} parcelas
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between mt-3">
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEditDespesa(despesaPrincipal)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDeleteDespesa(despesaPrincipal.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onToggleConciliacao(
                      despesaPrincipal.id, 
                      despesaPrincipal.status_conciliacao === 'conciliado' ? 'pendente' : 'conciliado'
                    )}
                  >
                    {despesaPrincipal.status_conciliacao === 'conciliado' ? (
                      <X className="h-4 w-4" />
                    ) : (
                      <Check className="h-4 w-4" />
                    )}
                  </Button>
                </div>

                {temParcelas && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleExpanded(chaveGrupo)}
                  >
                    {isExpanded ? 'Ocultar' : 'Ver'} Parcelas
                  </Button>
                )}
              </div>
            </CardHeader>

            {isExpanded && temParcelas && (
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Parcela</TableHead>
                      <TableHead>Valor</TableHead>
                      <TableHead>Fatura</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[despesaPrincipal, ...parcelas].map((parcela, index) => (
                      <TableRow key={parcela.id}>
                        <TableCell>
                          {parcela.parcela_atual || index + 1}/{parcela.total_parcelas}
                        </TableCell>
                        <TableCell>{formatCurrency(parcela.valor)}</TableCell>
                        <TableCell>
                          {parcela.mes_fatura && parcela.ano_fatura 
                            ? `${parcela.mes_fatura.toString().padStart(2, '0')}/${parcela.ano_fatura}`
                            : 'N/A'
                          }
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(parcela.status_conciliacao || 'pendente')}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            )}
          </Card>
        );
      })}

      {despesas.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          Nenhuma despesa encontrada para esta fatura.
        </div>
      )}
    </div>
  );
}
