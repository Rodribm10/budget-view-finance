
import { WhatsAppInstance } from '@/types/whatsAppTypes';

interface InstanceStatsProps {
  instances: WhatsAppInstance[];
}

const InstanceStats = ({ instances }: InstanceStatsProps) => {
  const totalInstances = instances.length;
  const connectedInstances = instances.filter(i => i.connectionState === 'open').length;
  const disconnectedInstances = instances.filter(i => i.connectionState === 'closed').length;
  const connectingInstances = instances.filter(i => i.connectionState === 'connecting').length;

  if (totalInstances === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-4">
      <div className="bg-card border rounded-lg shadow-sm p-4 text-center">
        <p className="text-sm text-muted-foreground">Total de instâncias</p>
        <p className="text-2xl font-bold">{totalInstances}</p>
      </div>
      <div className="bg-card border rounded-lg shadow-sm p-4 text-center">
        <p className="text-sm text-muted-foreground">Conectadas</p>
        <p className="text-2xl font-bold text-green-600">{connectedInstances}</p>
      </div>
      <div className="bg-card border rounded-lg shadow-sm p-4 text-center">
        <p className="text-sm text-muted-foreground">Desconectadas</p>
        <p className="text-2xl font-bold text-red-600">{disconnectedInstances}</p>
      </div>
      <div className="bg-card border rounded-lg shadow-sm p-4 text-center">
        <p className="text-sm text-muted-foreground">Conectando</p>
        <p className="text-2xl font-bold text-orange-600">{connectingInstances}</p>
      </div>
    </div>
  );
};

export default InstanceStats;
