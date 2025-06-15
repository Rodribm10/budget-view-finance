
import SettingsSidebar from "@/components/settings/SettingsSidebar";

const Configuracoes = () => {
  return (
    <div className="flex min-h-screen bg-background">
      <div className="hidden md:block w-64 flex-shrink-0 border-r">
        <SettingsSidebar />
      </div>
      <main className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-4">Configurações</h1>
        {/* Aqui virá o conteúdo das configurações que você solicitar */}
      </main>
    </div>
  );
};

export default Configuracoes;
