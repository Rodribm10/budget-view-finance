import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Check } from "lucide-react";
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const Assinatura = () => {
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [subscription] = useState({
    active: true,
    planName: "Plano Mensal Finance Home",
    expires_at: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 15),
  });

  const handleSubscribe = async () => {
    setIsSubscribing(true);
    try {
      console.log('🔄 [ASSINATURA] Iniciando processo de assinatura...');
      
      // Verificar sessão do usuário
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError) {
        console.error('❌ [ASSINATURA] Erro de autenticação:', userError);
        toast.error("Erro de autenticação. Faça login novamente.");
        return;
      }

      if (!user || !user.id || !user.email) {
        console.error('❌ [ASSINATURA] Usuário não autenticado');
        toast.error("Sessão inválida. Por favor, faça login novamente.");
        return;
      }

      console.log('✅ [ASSINATURA] Usuário autenticado:', { id: user.id, email: user.email });

      // Chamar a função do MercadoPago
      console.log('📞 [ASSINATURA] Chamando função mercado-pago-subscribe...');
      const { data, error } = await supabase.functions.invoke('mercado-pago-subscribe', {
        body: { 
          email: user.email, 
          userId: user.id 
        },
      });

      if (error) {
        console.error('❌ [ASSINATURA] Erro na função:', error);
        
        // Tratar diferentes tipos de erro
        if (error.message?.includes('FunctionsHttpError')) {
          toast.error("Erro de comunicação. Verifique sua conexão e tente novamente.");
        } else if (error.message?.includes('FunctionsRelayError')) {
          toast.error("Serviço temporariamente indisponível. Tente novamente em alguns instantes.");
        } else if (error.message?.includes('fetch')) {
          toast.error("Erro de conexão. Verifique sua internet e tente novamente.");
        } else if (error.message?.includes('401')) {
          toast.error("Sessão expirada. Faça login novamente.");
        } else {
          toast.error(`Erro: ${error.message || 'Erro desconhecido'}`);
        }
        return;
      }
      
      if (data?.error) {
        console.error('❌ [ASSINATURA] Erro nos dados:', data.error);
        
        // Tratar erros específicos do MercadoPago
        if (data.error.includes('temporariamente indisponível')) {
          toast.error("Serviço temporariamente indisponível para sua região. Entre em contato conosco.");
        } else if (data.error.includes('Token') || data.error.includes('configuração')) {
          toast.error("Erro de configuração. Entre em contato com o suporte.");
        } else {
          toast.error(data.error);
        }
        return;
      }
      
      if (data?.init_point) {
        console.log('✅ [ASSINATURA] URL de checkout recebida:', data.init_point);
        toast.success("Redirecionando para o pagamento...");
        
        // Redirecionar para o MercadoPago
        setTimeout(() => {
          window.location.href = data.init_point;
        }, 1000);
      } else {
        console.error('❌ [ASSINATURA] URL de checkout não encontrada nos dados:', data);
        toast.error("Não foi possível gerar o link de pagamento. Tente novamente.");
      }

    } catch (error: any) {
      console.error('💥 [ASSINATURA] Erro geral:', error);
      
      // Mensagens de erro mais específicas
      if (error.name === 'NetworkError' || error.message?.includes('fetch')) {
        toast.error("Erro de conexão. Verifique sua internet e tente novamente.");
      } else if (error.message?.includes('JSON')) {
        toast.error("Erro de comunicação. Tente novamente.");
      } else {
        toast.error("Erro inesperado. Tente novamente mais tarde.");
      }
    } finally {
      setIsSubscribing(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center gap-4 mb-4">
        <Button asChild variant="outline" size="icon">
          <Link to="/">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Voltar</span>
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">Assinatura</h1>
      </div>

      <div className="w-full max-w-md mx-auto space-y-6 mt-8">
        <Card className="shadow-lg animate-fade-in">
          <CardHeader className="items-center text-center p-6">
            <CardTitle className="text-2xl">
              Plano Mensal Finance Home
            </CardTitle>
            <CardDescription className="text-5xl font-extrabold pt-4">
              R$14,99
              <span className="text-lg font-medium text-muted-foreground">
                /mês
              </span>
            </CardDescription>
          </CardHeader>
          <CardContent className="px-6 pb-6">
            <ul className="space-y-4">
              <li className="flex items-center gap-3">
                <Check className="h-5 w-5 text-primary" />
                <span className="text-muted-foreground">
                  Acesso total ao Finance Home
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="h-5 w-5 text-primary" />
                <span className="text-muted-foreground">
                  Relatórios ilimitados
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="h-5 w-5 text-primary" />
                <span className="text-muted-foreground">
                  Integração com WhatsApp
                </span>
              </li>
            </ul>
          </CardContent>
          <CardFooter className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 p-6 bg-muted/50 rounded-b-lg">
            <Button variant="outline" className="w-full sm:w-auto">
              Ver Detalhes
            </Button>
            <Button 
              className="w-full sm:w-auto" 
              onClick={handleSubscribe} 
              disabled={isSubscribing}
            >
              {isSubscribing ? 'Processando...' : 'Assinar Agora'}
            </Button>
          </CardFooter>
        </Card>

        {subscription.active && (
          <Card>
            <CardHeader>
              <CardTitle>Sua Assinatura Atual</CardTitle>
              <CardDescription>
                Obrigado por ser um assinante!
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="font-medium">
                Plano:{" "}
                <span className="font-normal text-muted-foreground">
                  {subscription.planName}
                </span>
              </p>
              <p className="font-medium">
                Vence em:{" "}
                <span className="font-normal text-muted-foreground">
                  {format(subscription.expires_at, "dd 'de' MMMM 'de' yyyy", {
                    locale: ptBR,
                  })}
                </span>
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="outline">Gerenciar Assinatura</Button>
            </CardFooter>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Assinatura;
