
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import InstanceCard from './InstanceCard';
import { WhatsAppInstance } from '@/types/whatsAppTypes';
import { RefreshCw } from 'lucide-react';

interface InstanceListProps {
  instances: WhatsAppInstance[];
  onViewQrCode: (instance: WhatsAppInstance) => void;
  onDelete: (instanceId: string) => void;
  onRestart: (instance: WhatsAppInstance) => Promise<void>;
  onLogout: (instance: WhatsAppInstance) => Promise<void>;
  onSetPresence: (instance: WhatsAppInstance, presence: 'online' | 'offline') => Promise<void>;
  onRefreshInstances: () => Promise<void>;
  isRefreshing: boolean;
}

const InstanceList = ({ 
  instances, 
  onViewQrCode, 
  onDelete,
  onRestart,
  onLogout,
  onSetPresence,
  onRefreshInstances,
  isRefreshing
}: InstanceListProps) => {
  // Safely check if instances is an array and has elements
  const hasInstances = Array.isArray(instances) && instances.length > 0;

  if (!hasInstances) {
    return (
      <Card>
        <CardContent className="py-6">
          <div className="text-center text-muted-foreground">
            <p>Nenhuma instância criada ainda.</p>
            <p className="mt-1">Clique em 'Atualizar Lista' para buscar novamente.</p>
            <Button 
              variant="outline" 
              size="sm"
              onClick={onRefreshInstances}
              disabled={isRefreshing}
              className="mt-4"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              {isRefreshing ? 'Atualizando...' : 'Atualizar Lista'}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Instâncias Criadas</h2>
        <Button 
          variant="outline" 
          size="sm"
          onClick={onRefreshInstances}
          disabled={isRefreshing}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
          {isRefreshing ? 'Atualizando...' : 'Atualizar Lista'}
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {instances.map((instance) => (
          <InstanceCard 
            key={instance.instanceId} 
            instance={instance} 
            onViewQrCode={onViewQrCode} 
            onDelete={onDelete}
            onRestart={onRestart}
            onLogout={onLogout}
            onSetPresence={onSetPresence}
          />
        ))}
      </div>
    </div>
  );
};

export default InstanceList;
