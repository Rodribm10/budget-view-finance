
import { FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { TransactionFormValues } from "@/hooks/useTransactionForm";

interface TransactionDateFieldProps {
  form: UseFormReturn<TransactionFormValues>;
}

export function TransactionDateField({ form }: TransactionDateFieldProps) {
  return (
    <FormItem>
      <FormLabel>Data</FormLabel>
      <FormControl>
        <Input 
          type="date" 
          {...form.register("quando")} 
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  );
}
