
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from "sonner";

const EmailConfirmation = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const handleEmailConfirmation = async () => {
      try {
        // Pegar os tokens da URL
        const token_hash = searchParams.get('token_hash');
        const type = searchParams.get('type');
        
        if (token_hash && type) {
          console.log('🔐 Processando confirmação de email...');
          
          const { data, error } = await supabase.auth.verifyOtp({
            token_hash,
            type: type as any,
          });

          if (error) {
            console.error('❌ Erro na confirmação:', error);
            setStatus('error');
            setMessage('Erro ao confirmar email. O link pode ter expirado.');
            toast.error("Erro na confirmação", {
              description: "O link de confirmação pode ter expirado. Tente fazer login novamente.",
            });
          } else {
            console.log('✅ Email confirmado com sucesso:', data);
            setStatus('success');
            setMessage('Email confirmado com sucesso! Você já pode fazer login.');
            toast.success("Email confirmado!", {
              description: "Sua conta foi ativada com sucesso. Redirecionando...",
            });
            
            // Redirecionar para login após 3 segundos
            setTimeout(() => {
              navigate('/auth', { 
                state: { 
                  showSuccessMessage: true,
                  message: "✅ Email confirmado! Agora você pode fazer login com suas credenciais." 
                } 
              });
            }, 3000);
          }
        } else {
          setStatus('error');
          setMessage('Link de confirmação inválido.');
        }
      } catch (error) {
        console.error('❌ Erro geral na confirmação:', error);
        setStatus('error');
        setMessage('Ocorreu um erro inesperado.');
      }
    };

    handleEmailConfirmation();
  }, [searchParams, navigate]);

  const handleBackToLogin = () => {
    navigate('/auth');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">Confirmação de Email</CardTitle>
          <CardDescription>
            {status === 'loading' && "Processando confirmação do seu email..."}
            {status === 'success' && "Email confirmado com sucesso!"}
            {status === 'error' && "Problema na confirmação"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col items-center space-y-4">
            {status === 'loading' && (
              <>
                <Loader2 className="h-12 w-12 text-blue-600 animate-spin" />
                <p className="text-center text-muted-foreground">
                  Aguarde enquanto confirmamos seu email...
                </p>
              </>
            )}
            
            {status === 'success' && (
              <>
                <CheckCircle className="h-12 w-12 text-green-600" />
                <p className="text-center text-green-700 font-medium">
                  {message}
                </p>
                <p className="text-center text-sm text-muted-foreground">
                  Você será redirecionado automaticamente em alguns segundos...
                </p>
              </>
            )}
            
            {status === 'error' && (
              <>
                <XCircle className="h-12 w-12 text-red-600" />
                <p className="text-center text-red-700 font-medium">
                  {message}
                </p>
                <Button onClick={handleBackToLogin} className="w-full">
                  Voltar para Login
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmailConfirmation;
