
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

interface WhatsAppHeaderProps {
  userEmail: string;
  onRefresh: () => void;
  isRefreshing: boolean;
}

const WhatsAppHeader = ({ userEmail, onRefresh, isRefreshing }: WhatsAppHeaderProps) => {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Conectar WhatsApp</h1>
        {userEmail && (
          <p className="text-sm text-muted-foreground mt-1">
            Mostrando instâncias para: <strong>{userEmail}</strong>
          </p>
        )}
      </div>
      
      <Button 
        variant="outline" 
        onClick={onRefresh}
        disabled={isRefreshing}
        className="flex items-center gap-2"
      >
        <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
        Atualizar
      </Button>
    </div>
  );
};

export default WhatsAppHeader;
