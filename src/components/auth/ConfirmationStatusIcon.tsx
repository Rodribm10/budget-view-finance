
import { CheckCircle, XCircle, Loader2, AlertTriangle } from 'lucide-react';
import { ConfirmationStatus } from '@/hooks/useEmailConfirmation';

interface ConfirmationStatusIconProps {
  status: ConfirmationStatus;
}

const ConfirmationStatusIcon = ({ status }: ConfirmationStatusIconProps) => {
  switch (status) {
    case 'loading':
      return <Loader2 className="h-12 w-12 text-blue-600 animate-spin" />;
    case 'success':
      return <CheckCircle className="h-12 w-12 text-green-600" />;
    case 'expired':
      return <AlertTriangle className="h-12 w-12 text-orange-600" />;
    case 'error':
    default:
      return <XCircle className="h-12 w-12 text-red-600" />;
  }
};

export default ConfirmationStatusIcon;
