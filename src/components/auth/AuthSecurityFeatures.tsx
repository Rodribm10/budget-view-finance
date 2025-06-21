
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield, Mail, Lock } from 'lucide-react';

const AuthSecurityFeatures = () => {
  return (
    <div className="space-y-3 mt-4">
      <Alert>
        <Shield className="h-4 w-4" />
        <AlertDescription className="text-sm">
          <strong>Segurança reforçada:</strong> Sua conta está protegida contra tentativas de acesso não autorizado.
        </AlertDescription>
      </Alert>
      
      <Alert>
        <Mail className="h-4 w-4" />
        <AlertDescription className="text-sm">
          <strong>Confirmação por email:</strong> Você receberá um link de confirmação para ativar sua conta.
        </AlertDescription>
      </Alert>
      
      <Alert>
        <Lock className="h-4 w-4" />
        <AlertDescription className="text-sm">
          <strong>Proteção contra força bruta:</strong> Sistema automaticamente bloqueia tentativas suspeitas.
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default AuthSecurityFeatures;
