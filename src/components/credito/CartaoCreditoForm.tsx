
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from '@/components/ui/use-toast';
import { criarCartao } from '@/services/cartaoCreditoService';
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const bandeirasCartao = [
  'Visa', 'Mastercard', 'Elo', 'American Express', 'Hipercard', 
  'Diners Club', 'Credicard', 'Sorocred', 'Cabal', 'Banescard', 
  'Sicoobcard', 'Sicredi', 'Alelo', 'Ticket', 'VR', 'ValeCard', 'Havan'
];

const bancos = [
  'Itaú', 'Bradesco', 'Santander', 'Banco do Brasil', 'Caixa', 'Nubank', 
  'Inter', 'C6 Bank', 'Next', 'Original', 'Pan', 'Banco Bari', 
  'Sicoob', 'Sicredi', 'Neon', 'BTG Pactual', 'PagBank', 'Will Bank', 'XP'
];

const cartaoSchema = z.object({
  nome: z.string().min(1, { message: 'Nome do cartão é obrigatório' }),
  bandeira: z.string({ required_error: 'Selecione uma bandeira' }),
  banco: z.string({ required_error: 'Selecione um banco' }),
  limite_total: z.string().optional(),
  dia_vencimento: z.string().optional(),
  melhor_dia_compra: z.string().optional(),
});

type CartaoFormValues = z.infer<typeof cartaoSchema>;

interface CartaoCreditoFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export function CartaoCreditoForm({ onSuccess, onCancel }: CartaoCreditoFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<CartaoFormValues>({
    resolver: zodResolver(cartaoSchema),
    defaultValues: {
      nome: '',
      bandeira: '',
      banco: '',
      limite_total: '',
      dia_vencimento: '10',
      melhor_dia_compra: '5',
    }
  });

  async function onSubmit(data: CartaoFormValues) {
    setIsSubmitting(true);
    
    try {
      const resultado = await criarCartao(
        data.nome, 
        data.bandeira, 
        data.banco
      );
      
      if (resultado) {
        // Atualizar campos adicionais se fornecidos
        if (data.limite_total || data.dia_vencimento || data.melhor_dia_compra) {
          const { supabase } = await import('@/integrations/supabase/client');
          const userEmail = localStorage.getItem('userEmail');
          
          const updateData: any = {};
          if (data.limite_total) updateData.limite_total = parseFloat(data.limite_total);
          if (data.dia_vencimento) updateData.dia_vencimento = parseInt(data.dia_vencimento);
          if (data.melhor_dia_compra) updateData.melhor_dia_compra = parseInt(data.melhor_dia_compra);
          
          await supabase
            .from('cartoes_credito')
            .update(updateData)
            .eq('id', resultado.id)
            .eq('login', userEmail?.trim().toLowerCase());
        }
        
        toast({
          title: "Cartão adicionado",
          description: "Cartão de crédito cadastrado com sucesso",
        });
        onSuccess();
      } else {
        toast({
          title: "Erro ao salvar",
          description: "Não foi possível salvar o cartão de crédito",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Erro ao processar formulário:', error);
      toast({
        title: "Erro inesperado",
        description: "Ocorreu um erro ao processar sua solicitação",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="nome"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome do Cartão</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Gold, Platinum, Internacional..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="bandeira"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bandeira</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma bandeira" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {bandeirasCartao.map((bandeira) => (
                    <SelectItem key={bandeira} value={bandeira}>
                      {bandeira}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="banco"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Banco Emissor</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um banco" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {bancos.map((banco) => (
                    <SelectItem key={banco} value={banco}>
                      {banco}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="limite_total"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Limite Total (Opcional)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    step="0.01"
                    placeholder="0,00" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="dia_vencimento"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Dia do Vencimento</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    min="1" 
                    max="31"
                    placeholder="10" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="melhor_dia_compra"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Melhor Dia de Compra</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    min="1" 
                    max="31"
                    placeholder="5" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
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
