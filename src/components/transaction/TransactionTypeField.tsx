
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

interface TransactionTypeFieldProps {
  form: UseFormReturn<TransactionFormValues>;
}

export function TransactionTypeField({ form }: TransactionTypeFieldProps) {
  return (
    <FormItem>
      <FormLabel>Tipo</FormLabel>
      <Select 
        onValueChange={(value) => form.setValue("tipo", value)}
        defaultValue={form.getValues("tipo")}
      >
        <FormControl>
          <SelectTrigger>
            <SelectValue placeholder="Selecione o tipo" />
          </SelectTrigger>
        </FormControl>
        <SelectContent>
          <SelectItem value="despesa">Despesa</SelectItem>
          <SelectItem value="receita">Receita</SelectItem>
        </SelectContent>
      </Select>
      <FormMessage />
    </FormItem>
  );
}
