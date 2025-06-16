
import React from "react";
import { Button } from "@/components/ui/button";
import { 
  QrCode, 
  RefreshCw, 
  PowerOff,
  CircleDot,
  CircleOff,
  X,
  Unplug 
} from "lucide-react";
import { WhatsAppInstance } from "@/types/whatsAppTypes";

interface InstanceActionsProps {
  instance: WhatsAppInstance;
  loading: string | null;
  onViewQrCode: (instance: WhatsAppInstance) => void;
  onRestart: () => void;
  onLogout: () => void;
  onDisconnect?: () => void;
  onDelete: () => void;
  onSetOnline: () => void;
  onSetOffline: () => void;
}

const InstanceActions = ({
  instance,
  loading,
  onViewQrCode,
  onRestart,
  onLogout,
  onDisconnect,
  onDelete,
  onSetOnline,
  onSetOffline,
}: InstanceActionsProps) => {
  const isConnected = instance.connectionState === 'open' || instance.status === 'connected';

  return (
    <>
      <div className="flex justify-between w-full">
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
          onClick={onDelete}
          disabled={loading !== null}
        >
          <X className="h-4 w-4 mr-2" />
          Excluir
        </Button>
      </div>
      
      <div className="grid grid-cols-2 gap-2 w-full">
        <Button 
          variant="outline" 
          size="sm"
          onClick={onRestart}
          disabled={loading !== null}
        >
          <RefreshCw className="h-4 w-4 mr-1" />
          Reiniciar
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          onClick={onLogout}
          disabled={loading !== null}
        >
          <PowerOff className="h-4 w-4 mr-1" />
          Desconectar
        </Button>
      </div>

      {/* Botão de desconectar instância - apenas quando conectada */}
      {isConnected && onDisconnect && (
        <Button 
          variant="outline" 
          size="sm"
          onClick={onDisconnect}
          disabled={loading !== null}
          className="w-full bg-orange-50 hover:bg-orange-100 text-orange-700 border-orange-200"
        >
          <Unplug className="h-4 w-4 mr-1" />
          Desconectar Instância
        </Button>
      )}
      
      <div className="grid grid-cols-2 gap-2 w-full">
        <Button 
          variant="outline" 
          size="sm"
          onClick={onSetOnline}
          disabled={loading !== null}
          className="bg-green-50 hover:bg-green-100 text-green-700"
        >
          <CircleDot className="h-4 w-4 mr-1" />
          Definir Online
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          onClick={onSetOffline}
          disabled={loading !== null}
          className="bg-red-50 hover:bg-red-100 text-red-700"
        >
          <CircleOff className="h-4 w-4 mr-1" />
          Definir Offline
        </Button>
      </div>
    </>
  );
};

export default InstanceActions;
