
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getUserDebugInfo } from '@/services/whatsAppInstanceService';

interface DebugInfoProps {
  errorMessage: string | null;
  debugInfo: string | null;
}

const DebugInfo = ({ errorMessage, debugInfo }: DebugInfoProps) => {
  const [userDebugData, setUserDebugData] = useState<any>(null);
  const [debugLoading, setDebugLoading] = useState(false);
  const userEmail = localStorage.getItem('userEmail') || '';

  // Buscar dados completos do usuário para debug
  useEffect(() => {
    const fetchUserDebugData = async () => {
      if (!userEmail) return;
      
      setDebugLoading(true);
      try {
        const data = await getUserDebugInfo(userEmail);
        setUserDebugData(data);
      } catch (error) {
        console.error('Erro ao buscar dados de debug:', error);
      } finally {
        setDebugLoading(false);
      }
    };

    fetchUserDebugData();
  }, [userEmail]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Debug Info</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <strong>Email:</strong> {userEmail || 'Não fornecido'}
        </div>
        
        {debugLoading ? (
          <div>Carregando dados do banco...</div>
        ) : userDebugData ? (
          <div className="space-y-2">
            <div>
              <strong>Dados completos do banco:</strong>
            </div>
            <div className="bg-gray-100 p-3 rounded text-sm">
              <div><strong>ID:</strong> {userDebugData.id}</div>
              <div><strong>Nome:</strong> {userDebugData.nome}</div>
              <div><strong>Email:</strong> {userDebugData.email}</div>
              <div><strong>WhatsApp:</strong> {userDebugData.whatsapp || 'Não definido'}</div>
              <div><strong>Instância Zap:</strong> {userDebugData.instancia_zap || 'NULL'}</div>
              <div><strong>Status Instância:</strong> {userDebugData.status_instancia || 'NULL'}</div>
              <div><strong>Remote JID:</strong> {userDebugData.remote_jid || 'NULL'}</div>
              <div><strong>Criado em:</strong> {userDebugData.created_at}</div>
            </div>
          </div>
        ) : (
          <div>Nenhum dado encontrado no banco para este usuário</div>
        )}

        {errorMessage && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}

        {debugInfo && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{debugInfo}</AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default DebugInfo;
