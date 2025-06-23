
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ConfirmationStatus } from '@/hooks/useEmailConfirmation';

interface ConfirmationActionsProps {
  status: ConfirmationStatus;
  message: string;
}

const ConfirmationActions = ({ status, message }: ConfirmationActionsProps) => {
  const navigate = useNavigate();

  const handleBackToLogin = () => {
    navigate('/auth');
  };

  const handleGoToDashboard = () => {
    navigate('/dashboard');
  };

  const handleResendEmail = () => {
    navigate('/auth', { 
      state: { 
        showSuccessMessage: true, 
        message: "Faça login novamente para receber um novo email de confirmação." 
      } 
    });
  };

  if (status === 'loading') {
    return (
      <p className="text-center text-muted-foreground">
        Aguarde enquanto confirmamos seu email...
      </p>
    );
  }

  if (status === 'success') {
    return (
      <>
        <p className="text-center text-green-700 font-medium">
          {message}
        </p>
        <div className="flex flex-col gap-2 w-full">
          <Button onClick={handleGoToDashboard} className="w-full bg-blue-600 hover:bg-blue-700">
            Ir para Dashboard
          </Button>
          <Button onClick={handleBackToLogin} variant="outline" className="w-full">
            Fazer Login
          </Button>
        </div>
      </>
    );
  }

  if (status === 'expired') {
    return (
      <>
        <p className="text-center text-orange-700 font-medium">
          {message}
        </p>
        <div className="flex flex-col gap-2 w-full">
          <Button onClick={handleResendEmail} className="w-full bg-orange-600 hover:bg-orange-700">
            Solicitar Novo Email
          </Button>
          <Button onClick={handleBackToLogin} variant="outline" className="w-full">
            Voltar para Login
          </Button>
        </div>
      </>
    );
  }

  // Error state
  return (
    <>
      <p className="text-center text-red-700 font-medium">
        {message}
      </p>
      <div className="flex flex-col gap-2 w-full">
        <Button onClick={handleResendEmail} className="w-full bg-blue-600 hover:bg-blue-700">
          Solicitar Novo Email
        </Button>
        <Button onClick={handleBackToLogin} variant="outline" className="w-full">
          Voltar para Login
        </Button>
      </div>
    </>
  );
};

export default ConfirmationActions;
