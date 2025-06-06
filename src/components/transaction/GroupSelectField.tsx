
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UseFormReturn } from 'react-hook-form';
import { TransactionFormValues } from '@/hooks/useTransactionForm';

interface GroupSelectFieldProps {
  form: UseFormReturn<TransactionFormValues>;
  grupos: {remote_jid: string, nome_grupo: string | null}[];
}

export function GroupSelectField({ form, grupos }: GroupSelectFieldProps) {
  console.log('🏷️ GroupSelectField - grupos recebidos:', grupos);
  
  // Filtrar grupos válidos (com remote_jid não vazio)
  const gruposValidos = grupos.filter(grupo => 
    grupo.remote_jid && 
    grupo.remote_jid.trim() !== '' && 
    grupo.remote_jid !== null
  );
  
  console.log('✅ Grupos válidos para o select:', gruposValidos);

  return (
    <FormField
      control={form.control}
      name="grupo_id"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Grupo (Opcional)</FormLabel>
          <Select 
            onValueChange={(value) => field.onChange(value === "none" ? null : value)} 
            value={field.value || "none"}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um grupo (opcional)" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem value="none">Nenhum grupo</SelectItem>
              {gruposValidos.map((grupo) => (
                <SelectItem 
                  key={grupo.remote_jid} 
                  value={grupo.remote_jid}
                >
                  {grupo.nome_grupo || 'Grupo sem nome'}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
