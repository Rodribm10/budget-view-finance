
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface StatusPagamento {
  status: string | null;
  valor_pago: number | null;
  data_pagamento: string | null;
}

interface AvisoEnviado {
  data_aviso: string;
}

interface StatusTagsProps {
  statusPagamento: StatusPagamento | null;
  avisoEnviado: AvisoEnviado | null;
}

const StatusTags = ({ statusPagamento, avisoEnviado }: StatusTagsProps) => {
  const formatCurrency = (value: number | null) => {
    if (value === null) return 'R$ 0,00';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'dd/MM/yyyy', { locale: ptBR });
  };

  return (
    <div className="space-y-2">
      {/* Tag de Status de Pagamento */}
      {statusPagamento?.status === 'Pago' ? (
        <Badge variant="success" className="text-xs">
          Pago: {formatCurrency(statusPagamento.valor_pago)} em{' '}
          {statusPagamento.data_pagamento ? formatDate(statusPagamento.data_pagamento) : 'Data não informada'}
        </Badge>
      ) : (
        <Badge variant="secondary" className="text-xs">
          Pendente no mês selecionado
        </Badge>
      )}

      {/* Tag de Aviso Enviado */}
      {avisoEnviado && (
        <Badge variant="outline" className="text-xs">
          Aviso enviado em {formatDate(avisoEnviado.data_aviso)}
        </Badge>
      )}
    </div>
  );
};

export default StatusTags;
