
import { FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CartaoCredito } from "@/types/cartaoTypes";

interface CartaoSelectFieldProps {
  cartoes: CartaoCredito[];
  value: string;
  onChange: (value: string) => void;
  formatCartaoLabel: (cartao: CartaoCredito) => string;
}

export function CartaoSelectField({ cartoes, value, onChange, formatCartaoLabel }: CartaoSelectFieldProps) {
  return (
    <FormItem>
      <FormLabel>Cartão de Crédito</FormLabel>
      <Select 
        onValueChange={onChange}
        defaultValue={value}
      >
        <FormControl>
          <SelectTrigger>
            <SelectValue placeholder="Selecione um cartão" />
          </SelectTrigger>
        </FormControl>
        <SelectContent>
          {cartoes.map((cartao) => (
            <SelectItem key={cartao.id} value={cartao.id}>
              {formatCartaoLabel(cartao)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <FormMessage />
    </FormItem>
  );
}
