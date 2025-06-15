
import { SidebarProvider } from "@/components/ui/sidebar";
import SettingsSidebar from "@/components/settings/SettingsSidebar";

const Configuracoes = () => {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <SettingsSidebar />
        <main className="flex-1 p-6">
          <h1 className="text-2xl font-bold mb-4">Configurações</h1>
          {/* Aqui virá o conteúdo das configurações que você solicitar */}
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Configuracoes;
