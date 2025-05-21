
import { FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { TransactionFormValues } from "@/hooks/useTransactionForm";

interface GroupSelectFieldProps {
  form: UseFormReturn<TransactionFormValues>;
  grupos: {remote_jid: string, nome_grupo: string | null}[];
}

export function GroupSelectField({ form, grupos }: GroupSelectFieldProps) {
  if (grupos.length === 0) return null;
  
  return (
    <FormItem>
      <FormLabel>Grupo WhatsApp (opcional)</FormLabel>
      <Select 
        onValueChange={(value) => form.setValue("grupo_id", value === "none" ? null : value)}
        value={form.getValues("grupo_id") || undefined}
      >
        <FormControl>
          <SelectTrigger>
            <SelectValue placeholder="Selecione um grupo (opcional)" />
          </SelectTrigger>
        </FormControl>
        <SelectContent>
          <SelectItem value="none">Nenhum grupo</SelectItem>
          {grupos.map((grupo) => (
            <SelectItem key={grupo.remote_jid} value={grupo.remote_jid}>
              {grupo.nome_grupo || grupo.remote_jid}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <FormMessage />
    </FormItem>
  );
}
