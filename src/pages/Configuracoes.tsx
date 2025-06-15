
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import MeuCadastroForm from "@/components/settings/MeuCadastroForm";
import { useState } from "react";

const Configuracoes = () => {
  // Por padrão "visao-geral"
  const [tab, setTab] = useState("visao-geral");

  return (
    <div className="flex min-h-screen w-full bg-background">
      <main className="flex-1 p-4 md:p-8">
        <h1 className="text-2xl font-bold mb-6">Configurações</h1>
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="visao-geral" className="min-w-[120px]">
              Visão Geral
            </TabsTrigger>
            <TabsTrigger value="meu-cadastro" className="min-w-[120px]">
              Meu cadastro
            </TabsTrigger>
            <TabsTrigger value="assinatura" className="min-w-[120px]">
              Assinatura
            </TabsTrigger>
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
      </main>
    </div>
  );
};

export default Configuracoes;
