
import { FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { TransactionFormValues } from "@/hooks/useTransactionForm";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface TransactionDateFieldProps {
  form: UseFormReturn<TransactionFormValues>;
}

export function TransactionDateField({ form }: TransactionDateFieldProps) {
  const date = form.watch("quando");
  
  return (
    <FormItem className="flex flex-col">
      <FormLabel>Data</FormLabel>
      <Popover>
        <PopoverTrigger asChild>
          <FormControl>
            <Button
              variant={"outline"}
              className={cn(
                "w-full pl-3 text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              {date ? (
                format(new Date(date), "dd/MM/yyyy", { locale: ptBR })
              ) : (
                <span>Selecione uma data</span>
              )}
              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
            </Button>
          </FormControl>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={date ? new Date(date) : undefined}
            onSelect={(date) => {
              if (date) {
                form.setValue("quando", date.toISOString());
              }
            }}
            initialFocus
            locale={ptBR}
          />
        </PopoverContent>
      </Popover>
      <FormMessage />
    </FormItem>
  );
}
