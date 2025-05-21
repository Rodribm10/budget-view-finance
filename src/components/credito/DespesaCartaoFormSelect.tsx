
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { CartaoCredito } from '@/types/cartaoTypes';
import { DespesaCartaoFormValues, useDespesaCartaoForm } from '@/hooks/useDespesaCartaoForm';
import { CartaoSelectField } from './CartaoSelectField';
import { DatePickerField } from './DatePickerField';

interface DespesaCartaoFormSelectProps {
  cartoes: CartaoCredito[];
  onSuccess: () => void;
  onCancel: () => void;
}

export function DespesaCartaoFormSelect({ cartoes, onSuccess, onCancel }: DespesaCartaoFormSelectProps) {
  const {
    form,
    isSubmitting,
    handleCartaoChange,
    formatCartaoLabel,
    onSubmit
  } = useDespesaCartaoForm({ cartoes, onSuccess, onCancel });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="cartao_id"
          render={({ field }) => (
            <CartaoSelectField 
              cartoes={cartoes}
              value={field.value}
              onChange={(value) => {
                field.onChange(value);
                handleCartaoChange(value);
              }}
              formatCartaoLabel={formatCartaoLabel}
            />
          )}
        />
        
        <FormField
          control={form.control}
          name="valor"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Valor</FormLabel>
              <FormControl>
                <Input 
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  {...field}
                  onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="data_despesa"
          render={({ field }) => (
            <DatePickerField
              value={field.value}
              onChange={field.onChange}
              label="Data da Despesa"
            />
          )}
        />
        
        <FormField
          control={form.control}
          name="descricao"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Compras de supermercado, Restaurante..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-end space-x-2 pt-2">
          <Button variant="outline" type="button" onClick={onCancel} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Salvando..." : "Salvar"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
