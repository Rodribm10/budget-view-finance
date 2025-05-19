
import { Card, CardContent } from '@/components/ui/card';
import InstanceCard from './InstanceCard';
import { WhatsAppInstance } from '@/types/whatsAppTypes';

interface InstanceListProps {
  instances: WhatsAppInstance[];
  onViewQrCode: (instance: WhatsAppInstance) => void;
  onDelete: (instanceId: string) => void;
}

const InstanceList = ({ instances, onViewQrCode, onDelete }: InstanceListProps) => {
  if (instances.length === 0) {
    return (
      <Card>
        <CardContent className="py-6">
          <div className="text-center text-muted-foreground">
            <p>Nenhuma instância criada ainda.</p>
            <p className="mt-1">Crie uma instância usando o formulário acima.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Instâncias Criadas</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {instances.map((instance) => (
          <InstanceCard 
            key={instance.instanceId} 
            instance={instance} 
            onViewQrCode={onViewQrCode} 
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
};

export default InstanceList;
