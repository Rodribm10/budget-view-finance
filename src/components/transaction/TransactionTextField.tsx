
import { FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { TransactionFormValues } from "@/hooks/useTransactionForm";

interface TransactionTextFieldProps {
  form: UseFormReturn<TransactionFormValues>;
  name: keyof TransactionFormValues;
  label: string;
  placeholder: string;
  type?: string;
  inputMode?: "text" | "numeric" | "decimal" | "tel" | "search" | "email" | "url" | undefined;
}

export function TransactionTextField({ 
  form, 
  name, 
  label, 
  placeholder, 
  type = "text",
  inputMode
}: TransactionTextFieldProps) {
  return (
    <FormItem>
      <FormLabel>{label}</FormLabel>
      <FormControl>
        <Input 
          placeholder={placeholder} 
          {...form.register(name)} 
          type={type}
          inputMode={inputMode}
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  );
}
