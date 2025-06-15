
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import MeuCadastroForm from "@/components/settings/MeuCadastroForm";
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

const Configuracoes = () => {
  const [tab, setTab] = useState("visao-geral");
  const [subscription] = useState({
    active: true,
    planName: "Plano Mensal Finance Home",
    expires_at: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 15),
  });

  return (
    <div className="p-6">
      <div className="flex items-center gap-4 mb-4">
        <Button asChild variant="outline" size="icon">
          <Link to="/">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Voltar</span>
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">Configurações</h1>
      </div>

      <Tabs value={tab} onValueChange={setTab} className="mt-4">
        <TabsList className="mb-6">
          <TabsTrigger value="visao-geral">Visão Geral</TabsTrigger>
          <TabsTrigger value="meu-cadastro">Meu cadastro</TabsTrigger>
          <TabsTrigger value="assinatura">Assinatura</TabsTrigger>
        </TabsList>
        <TabsContent value="visao-geral">
          <div className="p-6 bg-muted rounded-lg border text-muted-foreground text-center">
            <div className="text-lg font-semibold mb-2">Bem-vindo à página de Configurações!</div>
            <div>Aqui você pode gerenciar suas informações, assinatura e muito mais.</div>
          </div>
        </TabsContent>
        <TabsContent value="meu-cadastro">
          <MeuCadastroForm />
        </TabsContent>
        <TabsContent value="assinatura">
          <div className="w-full max-w-md mx-auto space-y-6">
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
                <Button className="w-full sm:w-auto">Assinar Agora</Button>
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
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Configuracoes;
