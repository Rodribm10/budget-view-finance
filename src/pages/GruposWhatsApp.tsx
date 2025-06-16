
import { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { listarGruposWhatsApp } from '@/services/gruposWhatsAppService';
import { deleteWhatsAppGroup } from '@/services/whatsAppGroupsService';
import { WhatsAppGroup } from '@/types/financialTypes';
import { useToast } from '@/hooks/use-toast';
import CreateGroupForm from '@/components/whatsappGroups/CreateGroupForm';
import GroupsList from '@/components/whatsappGroups/GroupsList';

const GruposWhatsApp = () => {
  const { toast } = useToast();
  const [grupos, setGrupos] = useState<WhatsAppGroup[]>([]);
  const [carregando, setCarregando] = useState<boolean>(true);
  const [userEmail, setUserEmail] = useState<string>('');

  // Buscar os grupos do usuário ao carregar a página
  const buscarGrupos = async () => {
    setCarregando(true);
    try {
      const gruposData = await listarGruposWhatsApp();
      setGrupos(gruposData);
    } catch (error) {
      console.error('Erro ao buscar grupos:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar seus grupos do WhatsApp',
        variant: 'destructive',
      });
    } finally {
      setCarregando(false);
    }
  };

  // Deletar grupo
  const handleDeleteGroup = async (groupId: number) => {
    try {
      await deleteWhatsAppGroup(groupId);
      toast({
        title: 'Sucesso',
        description: 'Grupo deletado com sucesso',
      });
      // Atualizar a lista após deletar
      buscarGrupos();
    } catch (error) {
      console.error('Erro ao deletar grupo:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível deletar o grupo',
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    // Obter o email do usuário do localStorage
    const email = localStorage.getItem('userEmail');
    if (email) {
      setUserEmail(email.trim().toLowerCase());
    }
    
    buscarGrupos();
  }, []);

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-tight">Grupos do WhatsApp</h1>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={buscarGrupos} 
              disabled={carregando}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${carregando ? 'animate-spin' : ''}`} />
              {carregando ? 'Atualizando...' : 'Atualizar'}
            </Button>
          </div>
        </div>

        <CreateGroupForm userEmail={userEmail} onSuccess={buscarGrupos} />
        <GroupsList 
          grupos={grupos} 
          carregando={carregando} 
          onDeleteGroup={handleDeleteGroup}
        />
      </div>
    </Layout>
  );
};

export default GruposWhatsApp;
