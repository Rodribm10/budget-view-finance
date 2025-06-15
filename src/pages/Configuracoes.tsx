
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import MeuCadastroForm from "@/components/settings/MeuCadastroForm";
import { useState } from "react";

const Configuracoes = () => {
  const [tab, setTab] = useState("visao-geral");

  return (
    <div>
      <h1 className="text-2xl font-bold">Configurações</h1>
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="mt-4 mb-6">
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
          <div className="p-6 bg-muted rounded-lg border text-muted-foreground text-center">
            <div className="text-lg font-semibold mb-2">Em breve!</div>
            <div>Funcionalidades de assinatura serão lançadas em breve.</div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Configuracoes;
