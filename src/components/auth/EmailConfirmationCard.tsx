
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ConfirmationStatus } from '@/hooks/useEmailConfirmation';
import ConfirmationStatusIcon from './ConfirmationStatusIcon';
import ConfirmationActions from './ConfirmationActions';

interface EmailConfirmationCardProps {
  status: ConfirmationStatus;
  message: string;
}

const EmailConfirmationCard = ({ status, message }: EmailConfirmationCardProps) => {
  const getStatusMessage = () => {
    switch (status) {
      case 'loading':
        return "Processando confirmação do seu email...";
      case 'success':
        return "Email confirmado com sucesso!";
      case 'expired':
        return "Link de confirmação expirado";
      case 'error':
      default:
        return "Problema na confirmação";
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1 text-center">
        <div className="flex items-center justify-center space-x-2 mb-4">
          <img 
            src="/lovable-uploads/7149adf3-440a-491e-83c2-d964a3348cc9.png" 
            alt="Finance Home Logo" 
            className="h-8 w-8"
          />
          <CardTitle className="text-xl font-bold text-blue-700">Finance Home</CardTitle>
        </div>
        <CardDescription>
          {getStatusMessage()}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col items-center space-y-4">
          <ConfirmationStatusIcon status={status} />
          <ConfirmationActions status={status} message={message} />
        </div>
      </CardContent>
    </Card>
  );
};

export default EmailConfirmationCard;
