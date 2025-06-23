
import { useEmailConfirmation } from '@/hooks/useEmailConfirmation';
import EmailConfirmationCard from '@/components/auth/EmailConfirmationCard';

const EmailConfirmation = () => {
  const { status, message } = useEmailConfirmation();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <EmailConfirmationCard status={status} message={message} />
    </div>
  );
};

export default EmailConfirmation;
