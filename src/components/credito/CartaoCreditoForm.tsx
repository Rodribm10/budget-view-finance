
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

// Opções para as listas suspensas
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
    }
  });

  // Função para gerar um código único para o cartão
  const gerarCartaoCodigo = (nome: string, banco: string) => {
    const randomStr = Math.random().toString(36).substring(2, 8);
    return `${banco.toLowerCase()}_${nome.toLowerCase().replace(/\s/g, '')}_${randomStr}`;
  };

  async function onSubmit(data: CartaoFormValues) {
    setIsSubmitting(true);
    
    try {
      // Gerar código único para o cartão
      const cartao_codigo = gerarCartaoCodigo(data.nome, data.banco);
      
      const resultado = await criarCartao(
        data.nome, 
        data.bandeira, 
        data.banco, 
        cartao_codigo
      );
      
      if (resultado) {
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
