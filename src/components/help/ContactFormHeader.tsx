
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ContactFormHeaderProps {
  onBack: () => void;
}

const ContactFormHeader = ({ onBack }: ContactFormHeaderProps) => {
  return (
    <div className="flex items-center gap-2">
      <Button variant="ghost" size="sm" onClick={onBack}>
        <ArrowLeft className="h-4 w-4" />
      </Button>
      <div>
        <p className="text-sm text-muted-foreground">
          Você vai receber a resposta no e-mail que cadastrou aqui
        </p>
      </div>
    </div>
  );
};

export default ContactFormHeader;
