import { ContaBancaria } from '@/types/importacaoTypes';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Plus, Building2 } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface ContaBancariaSelectProps {
  contas: ContaBancaria[];
  value?: string;
  onChange: (value: string) => void;
  onNovaConta: () => void;
  isLoading?: boolean;
}

export const ContaBancariaSelect = ({
  contas,
  value,
  onChange,
  onNovaConta,
  isLoading
}: ContaBancariaSelectProps) => {
  return (
    <Card className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Building2 className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold">Selecione a Conta Bancária</h3>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={onNovaConta}
          disabled={isLoading}
        >
          <Plus className="w-4 h-4 mr-2" />
          Nova Conta
        </Button>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Conta</label>
        <Select value={value} onValueChange={onChange} disabled={isLoading || contas.length === 0}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione uma conta bancária" />
          </SelectTrigger>
          <SelectContent>
            {contas.map((conta) => (
              <SelectItem key={conta.id} value={conta.id}>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{conta.nome}</span>
                  {conta.banco && (
                    <span className="text-muted-foreground text-sm">
                      ({conta.banco})
                    </span>
                  )}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {contas.length === 0 && (
          <p className="text-sm text-muted-foreground">
            Você ainda não tem contas cadastradas. Clique em "Nova Conta" para adicionar.
          </p>
        )}
      </div>
    </Card>
  );
};
