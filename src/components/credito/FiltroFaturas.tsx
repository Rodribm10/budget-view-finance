
import { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { FaturaCartao } from '@/types/cartaoTypes';

interface FiltroFaturasProps {
  faturas: FaturaCartao[];
  faturaAtual: { mes: number; ano: number } | null;
  onFaturaChange: (mes: number, ano: number) => void;
  onCriarFatura: (mes: number, ano: number) => void;
}

const meses = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

export function FiltroFaturas({ faturas, faturaAtual, onFaturaChange, onCriarFatura }: FiltroFaturasProps) {
  const [mesSelecionado, setMesSelecionado] = useState<number>(faturaAtual?.mes || new Date().getMonth() + 1);
  const [anoSelecionado, setAnoSelecionado] = useState<number>(faturaAtual?.ano || new Date().getFullYear());

  const faturaExiste = faturas.some(f => f.mes === mesSelecionado && f.ano === anoSelecionado);

  const navegarMes = (direcao: 'anterior' | 'proximo') => {
    if (direcao === 'anterior') {
      if (mesSelecionado === 1) {
        setMesSelecionado(12);
        setAnoSelecionado(anoSelecionado - 1);
      } else {
        setMesSelecionado(mesSelecionado - 1);
      }
    } else {
      if (mesSelecionado === 12) {
        setMesSelecionado(1);
        setAnoSelecionado(anoSelecionado + 1);
      } else {
        setMesSelecionado(mesSelecionado + 1);
      }
    }
  };

  useEffect(() => {
    onFaturaChange(mesSelecionado, anoSelecionado);
  }, [mesSelecionado, anoSelecionado, onFaturaChange]);

  const gerarAnos = () => {
    const anoAtual = new Date().getFullYear();
    const anos = [];
    for (let ano = anoAtual - 2; ano <= anoAtual + 2; ano++) {
      anos.push(ano);
    }
    return anos;
  };

  return (
    <div className="flex items-center justify-between bg-card p-4 rounded-lg border">
      <div className="flex items-center space-x-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => navegarMes('anterior')}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <div className="flex items-center space-x-2">
          <Select value={mesSelecionado.toString()} onValueChange={(value) => setMesSelecionado(parseInt(value))}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {meses.map((mes, index) => (
                <SelectItem key={index + 1} value={(index + 1).toString()}>
                  {mes}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={anoSelecionado.toString()} onValueChange={(value) => setAnoSelecionado(parseInt(value))}>
            <SelectTrigger className="w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {gerarAnos().map((ano) => (
                <SelectItem key={ano} value={ano.toString()}>
                  {ano}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button
          variant="outline"
          size="icon"
          onClick={() => navegarMes('proximo')}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        {!faturaExiste && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onCriarFatura(mesSelecionado, anoSelecionado)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Criar Fatura
          </Button>
        )}

        <div className={`px-2 py-1 rounded text-sm ${
          faturaExiste ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
        }`}>
          {faturaExiste ? 'Fatura Existente' : 'Fatura Não Criada'}
        </div>
      </div>
    </div>
  );
}
