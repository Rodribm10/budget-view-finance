
import { WhatsAppInstance } from '@/types/whatsAppTypes';
import InstanceCard from './InstanceCard';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

interface InstanceListProps {
  instances: WhatsAppInstance[];
  onViewQrCode: (instance: WhatsAppInstance) => void;
  onDelete: (instanceId: string) => void;
  onRestart: (instance: WhatsAppInstance) => Promise<void>;
  onLogout: (instance: WhatsAppInstance) => Promise<void>;
  onDisconnect?: (instance: WhatsAppInstance) => Promise<void>;
  onSetPresence: (instance: WhatsAppInstance, presence: 'online' | 'offline') => Promise<void>;
  onRefreshInstances: () => void;
  isRefreshing: boolean;
}

const InstanceList = ({ 
  instances,
  onViewQrCode,
  onDelete,
  onRestart,
  onLogout,
  onDisconnect,
  onSetPresence,
  onRefreshInstances,
  isRefreshing
}: InstanceListProps) => {
  
  if (isRefreshing && instances.length === 0) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin mr-2" />
          <span>Carregando instâncias...</span>
        </CardContent>
      </Card>
    );
  }

  if (instances.length === 0) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="text-center text-muted-foreground">
            <p className="text-lg mb-2">Nenhuma instância encontrada</p>
            <p className="text-sm">Crie uma nova instância para começar</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Suas Instâncias do WhatsApp</h2>
        <span className="text-sm text-muted-foreground">
          {instances.length} instância{instances.length !== 1 ? 's' : ''} encontrada{instances.length !== 1 ? 's' : ''}
        </span>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {instances.map((instance) => (
          <InstanceCard
            key={instance.instanceId}
            instance={instance}
            onViewQrCode={onViewQrCode}
            onDelete={onDelete}
            onRestart={onRestart}
            onLogout={onLogout}
            onDisconnect={onDisconnect}
            onSetPresence={onSetPresence}
          />
        ))}
      </div>
    </div>
  );
};

export default InstanceList;
