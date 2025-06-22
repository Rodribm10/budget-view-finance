
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import MeuCadastroForm from "@/components/settings/MeuCadastroForm";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const Configuracoes = () => {
  const [tab, setTab] = useState("visao-geral");

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
        </TabsList>
        <TabsContent value="visao-geral">
          <div className="p-6 bg-muted rounded-lg border text-muted-foreground text-center">
            <div className="text-lg font-semibold mb-2">Bem-vindo à página de Configurações!</div>
            <div>Aqui você pode gerenciar suas informações pessoais e configurações da conta.</div>
          </div>
        </TabsContent>
        <TabsContent value="meu-cadastro">
          <MeuCadastroForm />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Configuracoes;
