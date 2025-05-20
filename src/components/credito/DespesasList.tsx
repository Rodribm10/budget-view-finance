
import { useState } from 'react';
import { DespesaCartao } from '@/types/cartaoTypes';
import { useToast } from "@/components/ui/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface DespesasListProps {
  despesas: DespesaCartao[];
  isLoading: boolean;
}

export function DespesasList({ despesas, isLoading }: DespesasListProps) {
  const { toast } = useToast();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString('pt-BR', options);
  };

  if (isLoading) {
    return <div className="animate-pulse space-y-4">
      <div className="h-4 bg-gray-200 rounded w-1/4"></div>
      <div className="h-10 bg-gray-200 rounded"></div>
      <div className="h-10 bg-gray-200 rounded"></div>
      <div className="h-10 bg-gray-200 rounded"></div>
    </div>;
  }

  if (despesas.length === 0) {
    return <div className="text-center py-10 text-muted-foreground">
      Este cartão ainda não possui despesas registradas.
    </div>;
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Data</TableHead>
            <TableHead>Descrição</TableHead>
            <TableHead className="text-right">Valor</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {despesas.map((despesa) => (
            <TableRow key={despesa.id}>
              <TableCell className="font-medium">
                {formatDate(despesa.data_despesa)}
              </TableCell>
              <TableCell>{despesa.descricao}</TableCell>
              <TableCell className="text-right">
                {formatCurrency(despesa.valor)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
