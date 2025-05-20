
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface DebugInfoProps {
  errorMessage: string | null;
  debugInfo: string | null;
}

const DebugInfo = ({ errorMessage, debugInfo }: DebugInfoProps) => {
  if (!errorMessage && !debugInfo) return null;
  
  return (
    <>
      {errorMessage && (
        <Alert variant="destructive">
          <AlertTitle>Erro ao cadastrar grupo</AlertTitle>
          <AlertDescription>
            {errorMessage}
          </AlertDescription>
        </Alert>
      )}

      {debugInfo && (
        <Alert variant="default" className="bg-amber-50 border-amber-200">
          <AlertTitle>Informações de depuração</AlertTitle>
          <AlertDescription className="text-amber-800">
            {debugInfo}
          </AlertDescription>
        </Alert>
      )}
    </>
  );
};

export default DebugInfo;
