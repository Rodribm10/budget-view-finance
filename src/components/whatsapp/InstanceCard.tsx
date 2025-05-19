
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { QrCode, Smartphone } from 'lucide-react';
import { WhatsAppInstance } from '@/types/whatsAppTypes';

interface InstanceCardProps {
  instance: WhatsAppInstance;
  onViewQrCode: (instance: WhatsAppInstance) => void;
  onDelete: (instanceId: string) => void;
}

const InstanceCard = ({ instance, onViewQrCode, onDelete }: InstanceCardProps) => {
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{instance.instanceName}</CardTitle>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="space-y-2">
          <div className="flex items-center text-sm">
            <Smartphone className="h-4 w-4 mr-2 text-gray-500" />
            <span>{instance.phoneNumber}</span>
          </div>
          <div className="flex items-center text-sm">
            {instance.connectionState === 'open' ? (
              <Badge variant="success" className="flex items-center gap-1">
                <span className="inline-block w-2 h-2 rounded-full bg-green-500"></span>
                Status: Conectado
              </Badge>
            ) : (
              <Badge variant="outline" className="flex items-center gap-1 text-red-500 border-red-300">
                <span className="inline-block w-2 h-2 rounded-full bg-red-500"></span>
                Status: Desconectado
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => onViewQrCode(instance)}
          className="flex items-center"
        >
          <QrCode className="h-4 w-4 mr-2" />
          Ver QR Code
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-red-500 hover:text-red-700 hover:bg-red-50"
          onClick={() => onDelete(instance.instanceId)}
        >
          Remover
        </Button>
      </CardFooter>
    </Card>
  );
};

export default InstanceCard;
